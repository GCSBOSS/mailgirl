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
        shared.mailer = nodemailer.createTransport(conf.smtp);
    };

    app.expose(shared);
    app.api(api);

    return app;
}
