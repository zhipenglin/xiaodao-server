'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const {router, controller} = app;
    router.get('/', controller.home.index);
    router.post('/login', controller.user.login);
    router.post('/record', controller.user.addRecord);
    router.post('/upload', controller.question.upload);

    router.post('/start',controller.game.start);
    router.get('/question',controller.game.getQuestion);
};
