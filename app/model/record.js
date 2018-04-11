const User=require('./user');
const getModel=({STRING,INTEGER,DATE})=>({
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id:INTEGER,
    score: INTEGER,
    time: DATE,
    list: STRING(255)
});

module.exports=({model,Sequelize})=>{
    const Record=model.define('record',getModel(Sequelize));
    Record.add=async ({score,list,user})=>{
        const record= await Record.create({
            user_id:user.id,
            score,list
        });
        record.setDataValue('user',user);
        return record;
    };
    Record.associate = function() {
        model.Record.belongsTo(model.User, { as: 'user' });
    };
    return Record;
};
module.exports.getModel=getModel;
