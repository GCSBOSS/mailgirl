const Template = require('./template');
const Mail = require('./mail');

module.exports = function({ post }){
    this.accept('json');
    post('/mail/*', Template.run, Mail.send);
    post('/preview/*', Template.run, Template.dump);
}
