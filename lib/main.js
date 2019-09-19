const { AppServer } = require('nodecaf');
const nodemailer = require('nodemailer');
const api = require('./api');
const Template = require('./template');

module.exports = function init(){

    let app = new AppServer(__dirname + '/default.toml');
    app.name = 'MailGirl';
    app.version = '0.1.0';

    let shared = {};

    app.beforeStart = async function({ conf }){
        shared.templates = await Template._load(conf.templatesDir);

        shared.mailer = nodemailer.createTransport({
            ...conf.smtp,
            pool: true, maxConnections: 32, maxMessages: 100, rateLimit: 32
        });

        if(conf.rotations){
            shared.rotation = {};
            for(let name in conf.rotations)
                shared.rotation[name] = 0;
        }
    };

    app.afterStop = function(){
        shared.mailer.close();
    };

    app.expose(shared);
    app.api(api);

    return app;
}
