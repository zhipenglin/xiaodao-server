const session={};

module.exports = app => {
    app.sessionStore = {
        // support promise / async
        async get(key) {
            return session[key];
        },
        async set(key, value, maxAge) {
            session[key]=value;
        },
        async destroy (key) {
            delete session[key];
        },
    };
    app.on('server', server => {

    });
};
