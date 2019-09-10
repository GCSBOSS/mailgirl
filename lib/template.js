const { exist } = require('nodecaf').assertions;
const fs = require('fs').promises;
const ejs = require('ejs');
const path = require('path');

async function listFilesRecursively(root){
    let files = [];
    let dirs = [root];

    while(dirs.length > 0){
        let dir =  dirs.shift() + '/';
        let dirp = path.resolve(process.cwd(), dir);
        let entries = await fs.readdir(dirp, { withFileTypes: true });

        for(let de of entries)
            if(de.isFile())
                files.push(dir + de.name);
            else
                dirs.push(dir + de.name);
    }

    return files;
}

async function compile(t){
    let p = path.resolve(process.cwd(), t);
    let data = await fs.readFile(p, 'utf-8');
    return ejs.compile(data, { filename: p });
}

async function _load(dir){

    let files = await listFilesRecursively(dir);
    let templates = {};
    let promises = [];
    let keys = [];

    let pl = dir.length + 1;

    for(let p of files){
        promises.push(compile(p));
        keys.push(p.slice(pl, -4));
    }

    let compiled = await Promise.all(promises);
    for(let idx in compiled)
        templates[keys[idx]] = compiled[idx];

    return templates;
}

module.exports = {

    _load,

    run({ templates, flash, params, body, next }){
        let tp = templates[params[0]];
        exist(tp);
        flash.output = tp(body);
        next();
    },

    dump({ flash, res }){
        res.end(flash.output);
    }

}
