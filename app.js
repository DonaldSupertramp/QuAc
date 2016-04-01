
var App = {

    user: new UserService(),
    document: new DocumentService(),
    category: new CategoryService(),
    socket: io.connect('http://localhost'),

    toolkit: Toolkit(),

    init: function(){

        this.user.restoreSession();

    }

};



