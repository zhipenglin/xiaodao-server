'use strict';

const Controller = require('egg').Controller;
const get=require('lodash/get');

const getQuestions=async (ctx,deepth=0)=>{
    if(deepth>10){
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
        if(!this.ctx.session.user){
            return this.ctx.body={
                err_no:500,
                err_msg:'请先登录'
            };
        }
        if(!this.ctx.session.game){
            this.ctx.session.game={
                score:0,
                blood:5,
                current:0,
                time:new Date(),
                list:[]
            };
        }else{
            const {answer}=this.ctx.request.body,game=this.ctx.session.game,answerIndex=['A','B','C','D'].indexOf(answer);
            const isRight=game.question.answer===answerIndex;

            if(isRight){
                const lostTime=Math.floor(new Date()-game.time)/1000;
                game.blood=game.blood-Math.floor(lostTime/60);
                game.score=game.score+=Math.round(100-lostTime%60*100/60);
                game.list.push(game.question.id);
            }else{
                game.blood=game.blood-1;
            }
            game.time=new Date();
            const end=game.blood<=0;
            if(end){
                await this.ctx.model.Record.add({
                    user:this.ctx.session.user,
                    score:game.score,list:game.list.join(',')
                });
                delete this.ctx.session.game;
                return this.ctx.body={
                    err_no:0,
                    results:{
                        blood:game.blood,
                        score:game.score
                    }
                };
            }
            if(!isRight&&!end){
                return this.ctx.body={
                    err_no:0,
                    results:{
                        id:game.question.id,
                        title:game.question.title,
                        answer:game.question.answer,
                        blood:game.blood,
                        score:game.score
                    }
                };
            }
        }

        const game=this.ctx.session.game;

        await getQuestions(this.ctx);
        const question=game.questions.pop();
        if(!question){
            return this.ctx.body={
                err_no:500,
                err_msg:'未获取到题目'
            };
        }
        game.question=question;
        return this.ctx.body={
            err_no:0,
            results:{
                id:question.id,
                title:question.title,
                answer:question.answer,
                blood:game.blood,
                score:game.score
            }
        };
    }

    async getQuestions(){
        const game=get(this.ctx.session,'game');
        if(!game){
            return this.ctx.body={
                err_no:500,
                err_msg:'没有登录'
            };
        }

        const getQuestions=async (deepth=0)=>{
            if(deepth>10){
                return ;
            }
            deepth++;
            if(!game.key){
                game.key=await this.ctx.model.Question.getKey();
            }
            let questions=await this.ctx.model.Question.get({key:game.key});
            if(questions.length===0){
                game.key=null;
            }else{
                return questions;
            }
            return await getQuestions(deepth);
        };

        const question=await getQuestions();
        if(!question){
            return this.ctx.body={
                err_no:500,
                err_msg:'未获取到题目'
            };
        }
        return this.ctx.body={
            err_no:0,
            results:question
        };
    }

    async record(){
        const {score,list}=this.ctx.request.body;
        await this.ctx.model.Record.add({
            user:this.ctx.session.user,
            score:score,list:(list||[]).join(',')
        });
        return this.ctx.body={
            err_no:0,
            results:null
        };
    }
}

module.exports = GameController;
