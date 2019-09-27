
function getHeaderOptions(conf, headers){
    // TODO include rotations
    return {
        subject: headers['x-mg-subject'],
        from: headers['x-mg-from'] || conf.from,
        to: headers['x-mg-to']
    }
}

function getTemplateOptions(conf, lines){
    let subject = lines.shift();
    let from = lines.shift();
    let to = lines.shift();
    return { subject, from: conf.from || from, to };
}

module.exports = {

    send({ mailer, conf, flash, res, headers, log }){

        let lines = flash.output.split(/\r?\n/g);

        let options = headers['x-mg-headers']
            ? getHeaderOptions(conf, headers)
            : getTemplateOptions(conf, lines);

        options.html = lines.join('\r\n');

        mailer.sendMail(options, err => {
            if(err)
                return log.error({ err: err }, 'MAIL');
            log.info({ mail: { to, template: flash.template } }, 'SENT MAIL');
        });
        res.end();
    }

}
