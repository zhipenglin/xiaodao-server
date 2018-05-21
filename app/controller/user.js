'use strict';

const Controller = require('egg').Controller;
const md5=require('md5');

class UserController extends Controller {
    async login(){
        if(this.ctx.session.user){
            this.ctx.body={
                err_no:0,
                results:this.ctx.session.user
            };
            return;
        }
        const user= await this.ctx.model.User.login(Object.assign({key:md5(Date.now())},this.ctx.request.body));
        this.ctx.session.user=user;
        this.ctx.session.game={};
        this.ctx.body={
            err_no:0,
            results:user
        };
    }
}

module.exports = UserController;
