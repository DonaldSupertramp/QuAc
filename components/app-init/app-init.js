var component = (function(){

    var self = this;

    return{

        is: 'app-init',

        ready: function(){

            App.socket.on('news', function (data) {
                console.log(data);
                App.socket.emit('my other event', { my: 'data22' });
            });
            App.init();
        }

    };

})();

Polymer(component);
