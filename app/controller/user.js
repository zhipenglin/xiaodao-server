'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
    async login(){
        const user= await this.ctx.model.User.login(this.ctx.request.body);
        this.ctx.session.user=user;
        this.ctx.body={
            err_no:0,
            results:user
        };
    }
}

module.exports = UserController;
