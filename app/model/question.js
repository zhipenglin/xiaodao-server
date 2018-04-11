const {shuffle}=require('lodash');
const getModel=({INTEGER,STRING,BOOLEAN})=>({
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: STRING(255),
    options: STRING(255),
    status:{
        type:INTEGER(4),
        defaultValue:0
    },
    answer: INTEGER(2)
});

const answerMap={
    'A':0,
    'a':0,
    'B':1,
    'b':1,
    'C':2,
    'c':2,
    'D':3,
    'd':3
};

module.exports=({model,Sequelize})=>{
    const Question=model.define('question',getModel(Sequelize));
    Question.add=async ({title,options,answer})=>{
        const question=await Question.create({title,options,answer});
        return question;
    };
    Question.upload=async ([data])=>{
        try{
            data.forEach((item)=>{
                if(!Array.isArray(item)||item.length!==6)
                    throw new Error('题目格式不正确');
            });
            await Question.destroy({
                where:{}
            });
            const questions=await Promise.all(data.map(async (item)=>{
                return await Question.add({
                    title:item[0],
                    options:`${item[1]},${item[2]},${item[3]},${item[4]}`,
                    answer:answerMap[item[5]]
                });
            }));
            return questions;
        }catch(e){
            return {
                err_no:500,
                err_msg:e.message
            };
        }
    };
    Question.getKey=async ()=>{
        const end=await Question.findOne({
            attributes:['id'],
            order:[
                ['id', 'DESC']
            ]
        }),start=await Question.findOne({
            attributes:['id'],
            order:[
                ['id','ASC']
            ]
        });
        return Math.floor(Math.random()*end.id)+start.id;
    };
    //从id大于key的位置取size道题目
    Question.get=async ({key,current=0,size=20})=>{
        return shuffle(await Question.findAll({
            where:{
                id:{
                    [Sequelize.Op.gte]:key
                },
                status:0
            },
            offset:current*size,
            limit:size
        }));
    };
    return Question;
};

module.exports.getModel=getModel;
