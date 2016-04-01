var component = (function(){

    var self = this;

    return{

       publish:{

           author: '',
           title: ''

       },

       ready: function(){

           var self = this;

           App.resource.public.get('title',this.title || App.document.title)
               .then(function(res){

                   App.document.load(res);

                   self.title = App.document.title;

                   self.$.document.innerHTML = marked(res.content);
               });
       }

    };

})();

Polymer(component);
