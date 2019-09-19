const { root } = require('muhb');
const assert = require('assert');
const { EOL } = require('os');

const mailgirl = require('../lib/main');

let app;
const SMTP_HOST = process.env.SMTP_HOST || 'localhost';
const SMTP_PORT = process.env.SMTP_PORT || 10000;
const SMTP_WEB_PORT = process.env.SMTP_WEB_PORT || 10001;

let base = root('http://localhost:8066/');
let baseDevMail = root('http://' + SMTP_HOST + ':' + String(SMTP_WEB_PORT) + '/');

async function start(settings){
    app = mailgirl();
    app.settings.port = 8066;
    app.settings.templatesDir = './test/res/t1';
    app.settings = { ...app.settings, ...settings };
    await app.start();
}

describe('Mailgirl', function(){

    describe('Initialization', function(){

        it('Should boot just fine', async function(){
            await start();
            let { assert } = await base.get('');
            assert.status.is(404);
            await app.stop();
        });

        it('Should load the templates in the setup dir [templatesDir]', async function(){
            await start();
            assert.strictEqual(typeof app.exposed.templates.t1, 'function');
            await app.stop();
        });

        it('Should load the templates recursivelly', async function(){
            await start({ templatesDir: './test/res/t2' });
            assert.strictEqual(typeof app.exposed.templates['foo/t2'], 'function');
            await app.stop();
        });

    });

    describe('Templating', function(){

        it('Should run the requested template', async function() {
            await start();
            let { assert } = await base.post('preview/t1');
            assert.status.is(200);
            assert.body.exactly('foo' + EOL);
            await app.stop();
        });

        it('Should allow template ot include others', async function() {
            await start();
            let { assert } = await base.post('preview/t1i');
            assert.status.is(200);
            assert.body.exactly('bar' + EOL + 'foo' + EOL);
            await app.stop();
        });

        it('Should puplate templates with request body data', async function() {
            await start();
            let { assert } = await base.post(
                'preview/t1b',
                {'Content-Type': 'application/json'},
                '{"a":"foobaz"}'
            );
            assert.status.is(200);
            assert.body.exactly('foobaz');
            await app.stop();
        });

        it('Should rotate setup arrays when requested', async function() {
            await start({ rotations: { foo: [ 'bar', 'baz' ] } });
            let { assert } = await base.post(
                'preview/rotate',
                {'Content-Type': 'application/json'},
                '{"a":"foobaz"}'
            );
            assert.status.is(200);
            assert.body.exactly('barbazbar');
            await app.stop();
        });

    });

    describe('E-mail', function(){

        it('Should always respond success to e-mail request regardless of failure', async function() {
            await start();
            let { assert } = await base.post('mail/t1');
            assert.status.is(200);
            await app.stop();
        });

        it('Should send e-mail successfully', async function() {
            await start({ smtp: { host: SMTP_HOST, port: SMTP_PORT, tls: { rejectUnauthorized: false } } });
            await base.post('mail/real');
            await new Promise( done => setTimeout(done, 1000) );
            let { assert } = await baseDevMail.get('messages');
            assert.body.contains('MailGirl');
            await app.stop();
        });

        it('Should send e-mail with global from setting [from]', async function() {
            await start({ from: 'foobar@baz.bah', smtp: { host: SMTP_HOST, port: SMTP_PORT, tls: { rejectUnauthorized: false } } });
            await base.post('mail/real');
            await new Promise( done => setTimeout(done, 1000) );
            let { assert } = await baseDevMail.get('messages');
            assert.body.contains('foobar@baz.bah');
            await app.stop();
        });

    });

});
