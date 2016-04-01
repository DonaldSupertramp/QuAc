var component = (function(){

    var self = this;

    return{

       is: 'document-page',

       ready: function(){

           var self = this;

           setTimeout(function(){
               self.init();
           },500);
       },

       init: function(){
           var self = this;
           App.resource.documents.get('title',this.title || App.document.title)
               .then(function(res){

                   App.document.load(res);

                   self.title = App.document.title;
                   self.$.edit.href = '#/document/edit/' + self.title;

                   self.$.document.innerHTML = marked(res.content);
               });

       },
        
        remove: function(){
            App.resource.documents.delete('uid',App.document._id)
            .then(App.document.reset())
            .then(function(){
                    App.router.go('/home');
                });
        }

    };

})();

Polymer(component);
