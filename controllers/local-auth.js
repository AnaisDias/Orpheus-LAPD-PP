var Models = require('../models');

passport.use('user-local', new LocalStrategy({
        username: 'username',
        password: 'password' // this is the virtual field on the model
    },
    function(username, password, done) {
        Models.usertests.find({
            username: username
        }, function(err, user) {
            if (err) return done(err);

            if (!user) {
                return done(null, false, {
                    message: 'This username is not registered.'
                });
            }
            if (!user.authenticate(password)) {
                return done(null, false, {
                    message: 'This password is not correct.'
                });
            }
            return done(null, user);
        });
    }
));

exports.loginUser = function (req, res, next)
{
    passport.authenticate('local-user', function(err,user, info){
        var error = err || info;
        if(error) return res.json(401, error);

        req.logIn(user, function(err) {
            if (err) return res.send(err);
            res.json(req.user.userInfo);
        });
    })(req,res,next);
};