var component = (function(){

    var self = this;

    /**
    * Used to display documents that match the current search query
     *
    * @type HtmlElement
    */
    var docContainer;

    /**
     * Used to display categories that match the current search query
     *
     * @type HtmlElement
     */
    var catContainer;

    var searchInput;

    var inProgress;

    var results = [];

    function fetchCategories(){

        return App.resource.categories.get('name', searchInput.value)
            .then(function(res){

                res = mapResults(res,'category');
                res.forEach(function(item){
                    results.push(item);
                });

                return results;

            });

    }

    function fetchDocuments(){

        return App.resource.documents.get('title',searchInput.value)
            .then(function(res){

                res = mapResults(res,'document');
                res.forEach(function(item){
                    results.push(item);
                });

            });
    }

    function showResults(){

        if(results.length === 0) return;

        results.forEach(function(item){

            var entry = document.createElement('a');

            switch(item.type){

                case 'document':

                    entry.innerHTML = item.title;
                    entry.href = '#/document/' + item.title;

                    /** When a result is chosen, from the home page, it is reasonable
                     *  to store it in the service, so it has not be reloaded
                     * */
                    entry.addEventListener('click',function(e){
                        App.document.load(item);
                    });

                    docContainer.appendChild(entry);

                    break;

                case 'category':

                    entry.innerHTML = item.name;

                    entry.href = '#/category/' + item.name;

                    entry.addEventListener('click',function(e){
                        App.category.name = this.innerHTML;
                    });

                    catContainer.appendChild(entry);
            }

        });

        inProgress = false;

    }

    function clearResults(){

        results = [];

        while(docContainer.firstChild){
            docContainer.removeChild(docContainer.firstChild);
        }

        while(catContainer.firstChild){
            catContainer.removeChild(catContainer.firstChild);
        }
    }

    function mapResults(res,type){

        if(res.length === 0) return res;

        var mapped = [];

        /** If there is just a single result, it will be returned as an object instead of an array */
        res = res.length ? res : [res];

        mapped = res.map(function(item){

            item.type = type;
            return item;
        });

        return mapped;
    }

    return{

        is: 'home-page',

        ready: function(){

            docContainer = this.$.documents;
            catContainer = this.$.categories;
            searchInput = this.$.search;

        },

        listeners:{
            'keyup': 'lookup'
        },

        lookup: function(e){

            if(inProgress) return;

            /** Avoid too expensive data loading by limiting the trigger */
            if(this.$.search.value.length > 2){

                inProgress = true;

                clearResults();

                var timeout = window.setTimeout(function(){

                    fetchDocuments()
                        .then(fetchCategories)
                        .then(showResults);

                    inProgress = false;

                },250);

            }

            else{
                clearResults();
                inProgress = false;
            }
        }

    };

})();

Polymer(component);
