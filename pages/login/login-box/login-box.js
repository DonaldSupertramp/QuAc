var component = {

    ready: function() {

        var self = this;

        self.$.name.addEventListener('keypress',function(e){self.login.call(self,e)});
        self.$.password.addEventListener('keypress',function(e){self.login.call(self,e)});

    },

    login: function(e){

        var self = this;

        if(e.keyCode == 13){

            if(!self.$.name.value){
                App.purr.info('Missing email');
                return;
            }

            if(!self.$.password.value){
                App.purr.info('Missing password');
                return;
            }

            var creds = {
                "name": self.$.name.value,
                "password": self.$.password.value,
                isLogin: true
            };

            App.resource.login.post(creds)
                .then(function(res){

                    App.user.set({
                        name: self.$.name.value,
                        token: res.token
                    });

                    App.router.go('/home');
                })

                .catch(function(reason){
                    App.purr.error(reason);
                });

        }

    }

  };

Polymer(component);
