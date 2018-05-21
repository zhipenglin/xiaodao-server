'use strict';

module.exports = appInfo => {
    const config = exports = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1522573806135_2111';

    // add your config here
    config.middleware = [];

    config.sequelize = {
        dialect: 'mysql',
        database: 'xiaodao',
        host: '10.211.55.5',
        port: '3306',
        username: 'root',
        password: 'root',
        operatorsAliases: false,
        timezone: '+08:00'
    };

    config.session = {
        key: 'EGG_SESS',
        maxAge: 24 * 3600 * 1000 *365, // 1 天
        httpOnly: true,
        encrypt: true,
    }

    config.security = {
        csrf: {
            enable: false
        }
    };

    config.onerror={
        accepts(ctx){
            if (ctx.get('x-requested-with') === 'XMLHttpRequest') return 'json';
            return 'html';
        },
        json(err,ctx){
            ctx.body={
                err_no:err.code||'500',
                err_msg:err.message||'服务器发生内部错误'
            };
        }
    };

    return config;
};
