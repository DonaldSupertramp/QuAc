function UserService(){

    var self = this;

    /** Called on successful login */
    this.set = function(data){

        for(var prop in data){
            this[prop] = data[prop];
        }

        localStorage.name= this.name;
        localStorage.token = this.token;
    };

    this.restoreSession = function(){

        if(localStorage.name && localStorage.token){
            this.name = localStorage.name;
            this.token = localStorage.token;
        }

    };

}

