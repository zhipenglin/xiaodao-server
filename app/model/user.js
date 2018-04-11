const getModel = ({STRING, INTEGER, DATE}) => ({
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: STRING(30),
    key: STRING(255),
    avatar: STRING(255)
});
module.exports = ({model, Sequelize}) => {
    const User = model.define('user', getModel(Sequelize));
    User.login = async ({key, name, avatar}) => {
        const results = await User.findOne({
            attributes: ['id', 'key', 'name', 'avatar'],
            where: {
                key, name
            }
        });
        if (results) {
            await User.update({
                updated_at:new Date()
            },{
                where:{id:results.id}
            });
            return results;
        }
        return await User.create({
            key, name, avatar
        });
    };
    return User;
};
module.exports.getModel = getModel;
