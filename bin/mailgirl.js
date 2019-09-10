#!node

const { run } = require('nodecaf');
run({
    init: require('../lib/main'),
    confPath: process.env.MAILGIRL_CONF || './conf.toml'
});
