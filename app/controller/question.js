'use strict';

const Controller = require('egg').Controller;

class QuestionController extends Controller {
    async upload(){
        const res=await this.ctx.model.Question.upload(await this.app.xlsx.analysis(this.ctx));
        this.ctx.body=res;
    }
}

module.exports = QuestionController;
