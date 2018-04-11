'use strict';
const getUserModel=require('../app/model/user').getModel,
    getQuestionModel=require('../app/model/question').getModel,
    getRecordModel=require('../app/model/record').getModel;

const CommonColumn=(model,Sequelize)=>Object.assign({},model,{
    created_at:Sequelize.DATE,
    updated_at:Sequelize.DATE
});

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', CommonColumn(getUserModel(Sequelize),Sequelize));
        await queryInterface.createTable('questions', CommonColumn(getQuestionModel(Sequelize),Sequelize));
        await queryInterface.createTable('records', CommonColumn(getRecordModel(Sequelize),Sequelize));
    },

    async down(queryInterface, Sequelize) {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.dropTable('users');
        */
        await queryInterface.dropTable('users');
        await queryInterface.dropTable('questions');
        await queryInterface.dropTable('records');
    }
};
