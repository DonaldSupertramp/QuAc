 var crypto      = require('../crypto/crypto.js'),
     User = require('../models/user.js'),
    promise     = require('promise');

module.exports.create = function(credentials){

    if(!credentials || !credentials.password || !credentials.name || !credentials.email){
        throw new Error('Invalid credentials');
    }

    crypto.hash(credentials.password,function(err, salt, hash){

        if (err) throw err;

        var user = new User();

        user.password = hash;
        user.salt = hash;
        user.salt = salt;
        user.email = credentials.email;
        user.name = credentials.name;

        user.save();
    });
    
};
 
module.exports.authCheck = function(credentials){

    return new promise(function(resolve,reject){

                if(!credentials || !credentials.token || !credentials.name){
                    reject({
                        message: 'No credentials given',
                        code: 403
                    });
                    return;
                }

        User.findOne({
            name: credentials.name
        },function(err,data){

            if(err || !data){
                reject({message: 'No user',code:403});
                return;
            }

            if(data.token === credentials.token){
                resolve(data);
            }
            else{
                reject({
                    message: 'Invalid token',
                    code: 403
                });
            }
        });



    });

};

var auth = function(name,password){

    return new promise(function(resolve, reject){

        User.findOne({
            name: name
        }).exec(function(err,data){

            if(data){
                crypto.hash(password, data.salt, function(err, hash){
                    if (hash == data.password){
                        resolve(data);
                    } else{
                        reject('Incorrect password');
                    }

                });
            } else{
                reject('Unknown User');
            }

        });

    });

};

module.exports.login = function(req,res){
    console.log('login');
    var success = function(user){

            var userData = {
                token: crypto.newGUID(),
                keydate: Date.now()
            };

            User.findOne({name: user.name},function(err,user){
                user.token = userData.token;
                user.save();
            });

            res.json(userData);


        },
        failure = function(reason){
            res.status(401).send(reason);
        };


    auth(req.body.name,req.body.password)
        .then( success, failure );

};