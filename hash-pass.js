// generate hashed password using util.encodePassword

const util = require('./util');

// get password from command line
const password = process.argv[2];
const hashedPassword = util.encodePassword(password);
console.log(hashedPassword);

