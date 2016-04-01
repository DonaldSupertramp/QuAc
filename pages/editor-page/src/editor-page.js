var component = (function(){

    /**
     *  used to determine if a new document should be created or an existing one is being edited
     *
     *  possible values:
     *      - 'edit'
     *      - undefined, '', 'add'
     */
    var mode;

    var doc = {};

    var categories = [];

    var categoryContainer = null;

    function validate(){
        return new Promise(function(resolve,reject){

            if(!doc.title) reject('Missing title');
            if(!doc.content) reject('Missing content');

            resolve();

        })
    }

    function writeToDb(){

        if(mode == 'edit'){
            return App.resource.documents.put(doc);
        }
        else{
            return App.resource.documents.post(doc);
        }

    }

    function toggleCategory(cat){

        // Just disable the chosen category if it was already enabled
        if(cat.className == 'active'){
            cat.className = 'inactive';
            doc.category = '';
            return;
        }

        for(var i = 0, l = categoryContainer.children.length; i < l; i++){
            categoryContainer.children[i].className = 'inactive';
        }

        cat.className = 'active';
        doc.category = cat.innerHTML;
    }

    function appendCategory(name){

        var el = document.createElement('span');

        el.innerHTML = name;
        el.dataset.catName = name;

        el.addEventListener('click',function(e){
           toggleCategory(this);
        });

        categories.push(el);

        categoryContainer.appendChild(el);

        return el;

    }

    var self = this;

    return{

        id: 'editor-page',

       publish:{
         title: '',
         mode: ''
       },

       ready: function(){

           mode = this.mode;

           categoryContainer = this.$.categories;

           if(mode != 'edit') App.document.reset();

           doc = App.document.copy();
/**
           App.resource.categories.get()
           .then(function(res){
                   res.forEach(function(item){
                       var el = appendCategory(item.name);
                       if(doc.category == item.name) toggleCategory(el);
                   })
               });

           this.$.editor.document = doc;

           this.isPublic = doc.isPublic;
 **/
       },


        saveDocument: function(){

            validate()
            .then(writeToDb)
            .then(function(res){
                    App.purr.success('Document saved');
                    mode = 'edit';
                    doc._id = res._id;
                })
            .catch(function(reason){
                    App.purr.error(reason);
                });

        },

        handleCategories: function(e){

            var self = this;

            if(e.keyCode == 13){

                var exists = categories.some(function(item){
                    return item.dataset.catName == self.$.categoryInput.value;
                });

                if(!exists){
                    App.resource.categories.post({name: this.$.categoryInput.value})
                        .then(function(){
                            appendCategory(self.$.categoryInput.value);
                        });
                }

                self.$.categoryInput.value = '';

            }
        },

        togglePublic: function(){
            doc.isPublic = this.isPublic = !doc.isPublic;
        }

    }

})();

Polymer(component);
