var component = (function(){

    var self = this;

    var documentContainer;

    function fetchDocuments(categoryName){
        return App.resource.documents.get('category',categoryName)
            .then(function(res){
                return res;
            });
    }

    function appendDocuments(documents){

        documents.forEach(function(item){

            var el = document.createElement('span');

            el.innerHTML = item.title;

            el.addEventListener('click',function(){
               App.document.load(item);
                App.router.go('/document/' + App.document.title);
            });

            documentContainer.appendChild(el);
        });

    }

    return{

       publish:{
           name: ''
       },

       ready: function(){

           if(!this.name){
               this.name = App.category.name;
           }

           documentContainer = this.$.documents;

           fetchDocuments(this.name)
            .then(appendDocuments);

           this.ctrls = {
               "foo": 'bar'
           };

       }

    };

})();

Polymer(component);
