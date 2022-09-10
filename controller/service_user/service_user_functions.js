const jwt = require('jsonwebtoken');
const config = require("../../utils/config");

var passwordValidator = require('password-validator');
const bcrypt = require('bcrypt');

const passValidator = (password)=>{
  // Create a schema
var schema = new passwordValidator();

// Add properties to it
schema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

const res = schema.validate(password);
if(res == true) return true;

return schema.validate(password, { list: true });
}

async function encryptPassword(_password){
  var salt = 10;
  var gen_salt = await bcrypt.genSalt(salt);
  var hash = await bcrypt.hash(_password, gen_salt);
  return hash;
}

/**
 * 
 * @param {*} _plainPassword 
 * @param {*} _hashPassword 
 * @returns {Boolean}
 */
async function comparePassword(_plainPassword, _hashPassword){
  var result = await bcrypt.compare(_plainPassword, _hashPassword);
  return result;
}

const createJwt = async(data)=>{
  const accessToken = jwt.sign({ email: data.email,  role: data.role, id:data.id }, config.accessTokenSecret);
  return accessToken;
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}


async function decryptJwt (token){
  jwt.verify(token, config.accessTokenSecret, (err, user) => {
    if (err) {
        // wrong jwt 
        return false;
    }

    return user;
});
}
module.exports = {
    makeid,
    createJwt,
    passValidator,
    encryptPassword,
    comparePassword,
    decryptJwt
}