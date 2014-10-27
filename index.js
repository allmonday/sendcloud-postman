var request = require('request');
var util = require('util');

// config
var MAILADDR = 'https://sendcloud.sohu.com/webapi/mail.send.xml'

// table of all usages
var SUBMAILS = {
    'forgetPassword': {
        subject: 'Qisense 密码找回',
        submail: 'postmaster@subTrigger01.sendcloud.org',
        template: forgetPasswordFn
    },
    'newRegister': {
        subject: '欢迎使用Qisense系统',
        submail: 'postmaster@subTrigger01.sendcloud.org',
        template: newUserRegisterFn
    }
}

// core
function Postman (msgtype, apikey) {
    // api key is secret, you need to pass it in with argument
    this.apikey = apikey;
    // job of postman
    this.mailset = SUBMAILS[msgtype];
};

Postman.prototype.send = function (mailInfo, 
                                   username, 
                                   sessionKey, 
                                   localhost, 
                                   cb) {
    /*
    @mailInfo:
        to
        from
        fromname
    */
    // append info
    mailInfo.api_key = this.apikey;
    mailInfo.api_user = this.mailset.submail;
    mailInfo.subject = this.mailset.subject;

    // set html content
    mailInfo.html = this.mailset.template(localhost , username, sessionKey );
    console.log(mailInfo.html)

    // send mail post
    request.post(
        MAILADDR,
        {
            form: mailInfo
        },
        function (err, res, body) {
            if (!err && res.statusCode === 200) {
                console.log("posting to sendcloud success");
                cb(null, 'success');
            } else {
                cb(err);
            }
        }
    )
}

// format date in chinese
var Now = function () {
    var formatter = "%d年%d月%d日-%d时%d分",
        t = new Date();

    return util.format(formatter,
           t.getFullYear(),
           t.getMonth() + 1,
           t.getDate(),
           t.getHours(),
           t.getMinutes()
        )
}

// templates
function forgetPasswordFn(site, username, sessionKey) {
    return '<p>尊敬的客户：</p>' +
    ' <p>您好！</p> <p>您在&nbsp;' +
    Now() +
    '申请重置密码，</p>' +
    '<p><span style="font-size: 12.7272720336914px; line-height: 20.8000011444092px;">请点击下面的链接修改用户'+
    username +
    '</span></p>'+
    '<p>http://'+
    site +
    '/#/reset_password?token='+
    sessionKey +
    ';</p>'+
    '<p><span style="font-size: 13px; line-height: 1.6em;">为了保证您帐号的安全性，该链接有效期为30分钟，并且点击一次后将失效!</span></p> <p>Qisense 运营团队</p> <p>&nbsp;</p> <p>系统发信， 请勿回复</p> <p>Qisense官方网站: Qisense.com</p> <p>&nbsp;</p>'
}

function newUserRegisterFn(site, username, password) {
    return '<p>尊敬的客户：</p>' +
    ' <p>您好！</p> '+
    ' <p>感谢您注册使用Qisense智能系统， 以下是您的账号信息：</p>' +
    '<p>账号名: ' +
    username +
    '</p>'+
    '<p>初始密码: '+
    password +
    '</p>'+
    '<p>请于登录后修改您的密码，谢谢！</p>' + 
    '<p>登录点击：' +
    site +
    '</p>' + 
    '<p>&nbsp;</p>' +
    '<p>Qisense 运营团队</p>' +
    '<p>系统发信， 请勿回复</p>' +
    '<p>Qisense官方网站: Qisense.com</p>'
}

module.exports = Postman;
