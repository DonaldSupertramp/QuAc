function Toolkit(){
    return{

        // returns both getDate() and getTime()
        getTimestamp: function(){

            var timestamp;

            timestamp = this.getDate() + ' ' + this.getTime();

            return timestamp;

        },

        /**
         * Returns the current date [YYYY-MM-DD or YYYY.MM.DD]
         *
         * @param altFormat - If true, replace '-' with '.'
         *
         * @returns {Date}
         */
        getDate: function(altFormat){
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!

            var yyyy = today.getFullYear();
            if(dd<10){dd='0'+dd;} if(mm<10){mm='0'+mm;} today = yyyy +'-'+ mm+'-'+dd;

            if(altFormat){
                today = today.replace(/-/g, '.');
            }

            return today;
        },

        //returns the current time [HH:MM]
        getTime: function(unixformat){

            var today = new Date();

            var hours = today.getHours();
            var minutes = today.getMinutes();

            if(unixformat) return Date.now();

            minutes = minutes < 10 ? '0' + minutes.toString() : minutes;
            return hours + ':' + minutes;

        },

        /**
         *  Returns a 32 character ID [ XXXXXXXX - XXXXXXXXXXXXXXXXXXXXXXXX ]
         * @returns {string}
         */

        newGUID: function(){

            var result = '';
            var hexcodes = "0123456789abcdef".split("");

            for (var index = 0; index < 32; index++) {
                var value = Math.floor(Math.random() * 16);

                switch (index) {
                    case 8:
                        result += '-';
                        break;
                    case 12:
                        value = 4;
                        break;

                }
                result += hexcodes[value];
            }
            return result;
        },

        /**
         * A function that takes an object of data and returns those that are marked as checked by the user
         *
         * @param list
         * @returns {Array}
         */
        getCheckedElements: function(list){
            var checkedElements = [];

            for (var element in list){

                if(list[element].hasOwnProperty('isChecked')){
                    if(list[element].isChecked === true){
                        checkedElements.push(list[element].ident || list[element].informations.identnumber);
                    }
                }
            }

            return checkedElements;
        }

    };
}