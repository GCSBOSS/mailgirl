
module.exports = {

    send({ mailer, conf, flash, res, headers, log }){

        let lines = flash.output.split(/\r?\n/g);
        let subject = headers['x-mg-subject'] || lines.shift();
        let from = conf.from || headers['x-mg-from'] || lines.shift();
        let to = headers['x-mg-to'] || lines.shift();
        let mailOptions = { subject, from, to, html: lines.join('\r\n') };

        mailer.sendMail(mailOptions, err => {
            if(err)
                return log.error({ err: err }, 'MAIL');
            log.info({ mail: { to, template: flash.template } }, 'SENT MAIL');
        });
        res.end();
    }

}
