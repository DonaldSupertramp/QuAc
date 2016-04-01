var component = (function(){

    var self = this;

    var comp;

    /** Wraps the textarea element */
    var textarea;

    var toolbox;

    var tokens = {

        //Wrap
        bold: '**°**',
        italics: '*°*',
        code: '\n```\n°\n```',

        //Prepend
        h1: '# °\n',
        h2: '## °\n',
        h3: '### °\n',
        h4: '#### °\n',
        h5: '##### °\n',
        blockquote: '> °',

        //Miscellaneous
        url: '[°]()',
        img: '![°](°)'

    };

    function getCaretPosition(){

        var selectionStart = textarea.selectionStart,
            selectionEnd = textarea.selectionEnd;

        return {
            start: selectionStart,
            end: selectionEnd
        };

    }

    function setCaretPosition(token,wrap){

        var pos = getCaretPosition();

        if (textarea.setSelectionRange) {

            textarea.focus();

            if(wrap){
                textarea.setSelectionRange(pos.end + token.length + 1, pos.end + token.length + 1);
            } else{
                textarea.setSelectionRange(pos.start + token.length * 2, pos.end + token.length * 2);
            }


        }

        else if (textarea.createTextRange) {

            var range = textarea.createTextRange();
            range.collapse(true);

            if(wrap){
                range.moveEnd('character', pos.end + token.length);
                range.moveStart('character', pos.start + token.length);
            } else{
                range.moveEnd('character', pos.end + token.length * 2);
                range.moveStart('character', pos.start + token.length * 2);
            }


            range.select();

        }

    }


    function parse(value,token){

        var replacement;

        if(token == 'img'){
            replacement = tokens[token].replace('°',comp.$.imgInput.files[0].name)
                                        .replace('°','http://janschreyer.net/quac2/server/uploads/' + comp.$.imgInput.files[0].name);
        }
        else{
            replacement = tokens[token].replace('°',value);
        }

        return replacement;

    }

    function getSelectedText(){

        var selectedText;

        var pos = getCaretPosition();

        selectedText = textarea.value.substring(pos.start,pos.end);

        return selectedText;

    }

    function apply(replacement){

        var pos = getCaretPosition();

        var textBefore = textarea.value.substr(0,pos.start),
            textAfter = textarea.value.substr(pos.end);

        textarea.value = comp.document.content = textBefore + replacement + textAfter;

    }

    function bindTokenSetters(){

        for(var i = 0, l = toolbox.children.length; i < l; i++){

            var el = toolbox.children[i];

            switch(el.dataset.type){

                case 'img':

                    el.addEventListener('click',function(){
                        comp.$.imgInput.click();
                    });

                    break;

                case 'table':

                    el.addEventListener('click',createTable);

                    break;

                case 'default':

                    el.addEventListener('click',function(){
                        setToken(this.dataset.token);
                    });

                    break;

                default:
                    break;
            }

        }

        comp.$.imgInput.addEventListener('change',uploadImage);
    }

    function uploadImage(){

        function updateProg(n){
            comp.progress = n;
        }

        $http.postBinary('https://quac.triangulum.uberspace.de/quac-api/api/upload',this.files[0],updateProg)
            .then(function(){
                setToken('img');
                comp.progress = 0;
            });
    }

    function setToken(token){

        var selection = getSelectedText();

        var replacement = parse(selection,token);

        apply(replacement);

        setCaretPosition(token,selection.length);
    }

    function createTable(){
        comp.$.tableModal.toggleVisibility();
    }

    return{

        is: 'md-editor',

       publish:{
           document: {},
           db: ''
       },

       ready: function(){

           comp = this;

           // used to display the progress of an image upload
           this.progress = 0;

           this.state = {
               preview: false,
               tablemodal: false
           };

           textarea = this.$.content;

           toolbox = this.$.toolbox;

           bindTokenSetters();

           this.addEventListener('table::created',function(e){
               apply(e.detail);
           });

       },

       togglePreview: function(){
          this.state.preview = !this.state.preview;
          if(this.state.preview) this.$.preview.innerHTML = marked(textarea.value);
       },

       load: function(document){
            this.document = document;
       }

    }

})();

Polymer(component);
