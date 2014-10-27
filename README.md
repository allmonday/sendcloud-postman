# README

sendcloud-postman is mostly for private use (* _ *!)

## example
two kinds of type is offerd:
- forgetPassword
- newRegister

usage

```javascript
var Postman = require("sendcloud-postman");

type = 'forgetPassword'
apikey = 'xxxyyyxxxyyy'
sessionkey = 'xxyyxxyyxxyyxxyyxxyy'

postman = new Postman(type, apikey); // type and apikey

var mailObj = {
  to:'to@email.com',
  from: 'from@email.com',
  fromname: 'name',
  };
  
postman.send(mailObj, 'admin', sessionKey , 'http://localhost:8000', function (err) {
    if (err) {
        throw err;
    } else {
        console.log('finished');
    }
})

```