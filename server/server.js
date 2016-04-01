// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var cors    = require('cors');
var url = require('url');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var credentials = require('./credentials/creds.js');
var Document = require('./models/document.js');
var Category = require('./models/category.js');
var user = require('./users/users.js');
var formidable = require('formidable');
var fs = require('fs-extra');
var util = require('util');

var app = express(); 				// define our app using express
app.use(cors());

var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(80);

mongoose.connect(credentials.data.mongourl, {
    user: credentials.data.user,
    pass: credentials.data.pass,
    auth: {
        authSource: "admin"
    }
});

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3045; 		// set our port

//SOCKET.IO
//=======================================================

io.on('connection', function (socket) {
    console.log('connected');
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

router.route('/test').get( function (req,res) {
    console.log(1);
   res.json({
       data: 'tester'
   });
});

router.post('/login', user.login);

router.route('/documents/blog')
    .get(function(req,res){

        Document.find({
            category: 'Blog'
        },function(err,data){

            var publics = [];

            data.forEach(function(entry){
                if(entry.isPublic) publics.push(entry);
            });

            res.json(publics);
        });

    });


router.get('/public/:author/:title', function(req,res){

    Document.findOne({
        "author": req.params.author,
        "title": req.params.title
    },function(err,data){
        console.dir(req.params);
        console.dir(data);
        if(data && data.isPublic) res.json(data);
    });

});

// middleware to use for all requests
router.use(function(req, res, next) {

    if(req.body.isLogin){
        next(req.url);
        return;
    }

    var credentials = {
        name:  req.query.name || req.body.name,
        token: req.query.token || req.body.token
    };

    user.authCheck(credentials)
        .done(function(result){
            next();
        },

        function(reason){
            res.status(403);
            res.send(reason);
        });
});

router.route('/upload')

.post(function(req,res){
        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {

        });

        form.on('end', function(fields, files) {

            /* Temporary location of our uploaded file */
            var temp_path = this.openedFiles[0].path;
            /* The file name of the uploaded file */
            var file_name = this.openedFiles[0].name;
            /* Location where we want to copy the uploaded file */
            var new_location = 'uploads/';

            fs.copy(temp_path, new_location + file_name, function(err) {
                if (err) {
                    console.error(err);
                } else {
                    res.status(200).send();
                }
            });
        });


    });

router.get('/', function(req,res){res.status(200).send();});

router.route('/documents')

    .post(function(req, res) {

        Document.findOne({
            $or:[{_id:req.body._id},{title:req.body.title}]
        },function(err,data){

            if(data){
                res.status(406).send('Document already existing');
            }
            else{
                var document = new Document();

                document.author = req.body.author;
                document.title = req.body.title;
                document.content = req.body.content;
                document.category = req.body.category;
                document.isPublic = req.body.isPublic;
                document.date = req.body.date;

                document.save(function(err,data) {
                    if (err)
                        res.send(err);

                    res.json(data);

                });
            }

        });

    })

    .put(function(req,res){

        Document.update({"_id": req.body._id},req.body,function(err,data){
            console.dir(err);
            res.json(req.body);
        });

    });

router.route('/documents/title/:title')
    .get(function(req,res){

        Document.findOne({
            title: req.params.title
        },function(err,doc){

            if(doc){
                res.json(doc);
            }
            else{

                var title = new RegExp(req.params.title,'i');

                Document.find({
                    title: title
                },function(err,data){

                    if(!data || err){
                        res.status(401).send();
                    }
                    else{

                        if(data.length == 1){
                            res.json(data[0]);
                        }
                        else{
                            res.json(data);
                        }

                    }

                });
            }

        });

    });

router.route('/documents/category/:category')
    .get(function(req,res){

        var name = new RegExp(req.params.category,'i');

        Document.find({
            category: name
        },function(err,data){

            if(!data || err){
                res.status(401).send();
            }
            else{
                res.json(data);
            }

        });

    });

router.route('/documents/uid/:uid')
    .delete(function(req,res){

        Document.findOne({
            _id: req.params.uid
        },function(err,data){
            Document.findByIdAndRemove(data._id,function(err,data){
                res.status(200).send('removed');
            });
        });

    });


router.route('/categories')

    .get(function(req,res){

        Category.find({},function(err,data){
            res.json(data);
        });

    })

    .post(function(req,res){

        var cat = new Category();

        cat.name = req.body.name;

        cat.save(function(){
            res.status(200).send('Added');
        });

    });

router.route('/categories/name/:name')

    .get(function(req,res){

        var name = new RegExp(req.params.name,'i');

        Category.find({name: name},function(err,data){
            res.json(data);
        });

    });

// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server listening at port ' + port);
