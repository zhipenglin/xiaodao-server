'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
    async login(){
        const user= await this.ctx.model.User.login(this.ctx.request.body);
        this.ctx.session.user=user;
        this.ctx.body=user;
    }
    async addRecord(){
        const results=await this.ctx.model.Record.add(Object.assign({},this.ctx.request.body,{user:this.ctx.session.user}));
        this.ctx.body=results;
    }
}

module.exports = UserController;
