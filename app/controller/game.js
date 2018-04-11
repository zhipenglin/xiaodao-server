'use strict';

const Controller = require('egg').Controller;

const getQuestions=async (ctx,deepth=0)=>{
    if(deepth>1){
        return ;
    }
    deepth++;
    const {game}=ctx.session;
    if(!game.key){
        game.key=await ctx.model.Question.getKey();
        game.current=0;
    }
    game.questions=await ctx.model.Question.get({key:game.key,current:game.current});
    game.current+=1;
    if(game.questions.length===0){
        game.key=null;
        return getQuestions(ctx,deepth);
    }else{
        return;
    }
};

class GameController extends Controller {
    async start(){
        this.ctx.session.game={
            score:0,
            current:0
        };
        await getQuestions(this.ctx);
        this.ctx.body=this.ctx.session.game;
    }
    async getQuestion() {
        const {game}=this.ctx.session;
        if(!game){
            return this.ctx.body={
                err_no:500,
                err_msg:'请先开始游戏'
            }
        }
        if(game.questions.length===0){
            await getQuestions(this.ctx);
        }
        this.ctx.body=game.questions.pop();
    }
}

module.exports = GameController;
