const jwt = require("jsonwebtoken");

const generateToken = async (userId) => {
    const token =  await jwt.sign({id: userId},process.env.JWT_SECRET,{
        expiresIn: "60d"
    })
    console.log(`@!@!@!@! this is token`)
    console.log(token);
    return token

}

module.exports = { generateToken };