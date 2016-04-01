var element = (function(){

    var self = this;

    var component;

    function open(){

        var backdrop = document.createElement('div');

        var body = document.querySelector('body');

        backdrop.classList.add('backdrop');

        body.appendChild(backdrop);

        // Make sure the initial state is applied.
        window.getComputedStyle(backdrop).opacity;

        backdrop.classList.add('shown');

        component.$.container.focus();

    }

    function close(){

        var body = document.querySelector('body');
        var backdrop = document.querySelector('.backdrop');

        body.removeChild(backdrop);
    }

    function alterRows(num){

        var count,
            i;

        if(num > component.data.rows.length){

            count = num - component.data.rows.length;

            for(i = 0; i < count; i++){
                component.data.rows.push({
                    cells:[
                        {
                            content: ''
                        }
                    ]
                })
            }

            component.data.rows.forEach(function(row) {

                for(var id = 1,l=component.data.spans.length; id < l; id++){
                    row.cells[id] = {
                        content: ''
                    };
                }

            });

        }

        else{

            count = component.data.rows.length - num;

            for(i = 0; i < count; i++){
                component.data.rows.splice(-1,1);
            }

        }

    }

    function alterSpans(num){

        var count,
            i;

        if(num > component.data.spans.length){

            count = num - component.data.spans.length;

            for(i = 0; i < count; i++){

                component.data.spans.push({
                    heading: ''
                });

                component.data.rows.forEach(function(row){
                   row.cells.push({
                       content: ''
                   });
                });

            }

        }

        else{

            count = component.data.spans.length - num;

            for(i = 0; i < count; i++){

                component.data.spans.splice(-1,1);

                component.data.rows.forEach(function(row){
                    row.cells.splice(-1,1);
                });
            }

        }

    }

    /**
     * Will create a GHFMD compatible string and dispatch it via a
     * customEvent to the editor
     *
     * @event table::created
     */
    function printTable(){

        var pipe = '|',
            seperator = '-',
            table = pipe;

        component.data.spans.forEach(function(span){
            table += span.heading + pipe;
        });

        table += '\n';

        for(var i = 0, l = component.data.spans.length; i < l; i++){
            table += pipe + seperator;
        }

        table += pipe;

        component.data.rows.forEach(function(row){

            table += '\n';

            row.cells.forEach(function(cell) {
               table += pipe + cell.content;
            });

            table += pipe;
        });

        var message = new CustomEvent('table::created',{detail: table});
        component.dispatchEvent(message);
    }

    function resetTableData(){
        component.data = {

            spans:[
                {
                    heading: ''
                }
            ],

            rows: [
                {
                    cells:[
                        {
                            content: ''
                        }
                    ]
                }
            ]

        };
    }

    function bindListeners(){
        component.addEventListener('keydown',function(e){

            if(e.ctrlKey){

                switch(e.keyCode){

                    case 38:
                        alterRows(component.data.rows.length - 1);
                        break;

                    case 40:
                        alterRows(component.data.rows.length + 1);
                        break;

                    case 37:
                        alterSpans(component.data.spans.length - 1);
                        break;

                    case 39:
                        alterSpans(component.data.spans.length + 1);
                        break;
                }
            }

        });
    }

    return{

        is: 'table-modal',

       ready: function(){

           var self = this;
           component = this;

           this.state = {
               open: false
           };

           /**
           * Represents the table rows & spans
           *
           * This object will be modified when spans or rows are added / removed
           */

           this.data = {};

           bindListeners();

           resetTableData();

       },

        toggleVisibility: function(){

            this.state.open = !this.state.open;

            if(this.state.open){
                open();
            }
            else{
                close();
            }
        },

        printTable: function(){
            printTable();
        },

        clear: function(){
            resetTableData();
        }
    }

})();

Polymer(element);
