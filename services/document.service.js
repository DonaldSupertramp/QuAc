function DocumentService(){
    this.title = '';
    this.content = '';
    this.author = '';
    this.isPublic = false;
    this.category = '';
    this.date = '';
    this._id = '';
}

DocumentService.prototype.reset = function(){
    for(var prop in this){

        if(this.hasOwnProperty(prop)){

            switch(typeof this[prop]){

                case 'string':
                    this[prop] = '';
                    break;
                case 'boolean':
                    this[prop] = false;
                    break;

            }


        }

        this.date = App.toolkit.getTime(true);
        this.author = App.user.name;
    }
};

DocumentService.prototype.copy = function(){

    var copy = {};

    for(var prop in this){

        if(this.hasOwnProperty(prop)){
            copy[prop] = this[prop];
        }

    }

    return copy;

};

DocumentService.prototype.load = function(data){

    for(var prop in data){

        if(data.hasOwnProperty(prop) && this.hasOwnProperty(prop)){
            this[prop] = data[prop];
        }

    }

};