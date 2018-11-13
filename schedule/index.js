require('./drama');


var { Admin  } = require('../proxy')

Admin.registerRootAdmin((result) => {
    console.log(result);
})