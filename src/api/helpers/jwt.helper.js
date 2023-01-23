const jwt = require('jsonwebtoken')

const verifyToken = (token, privateKey) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, privateKey, (error, decoded)=>{
            if (error) {
                return reject({
                    status : 401,
                    message : 'Unauthorized',
                    error
                })
            }
            return resolve({
                response : {
                    status : 200,
                    message : 'OK'  
                },
                decoded
            })
        })
    })
}

const generateToken = (user, secretSignature, tokenLife) =>{
    // Data
    const userData = {
        id : user.id,
        user_name : user.user_name,
        display_name : user.display_name,
    }
    return new Promise((resolve, reject)=>{
        jwt.sign(
            {data: userData},
            secretSignature,
            {
                algorithm: "HS256",
                expiresIn: tokenLife,
            }, 
            (error, encoded)=>{
                if (error){
                    console.log(error);
                    return reject({
                        status : 403,
                        message : "Forbidden"
                    })
                }
                resolve(
                    {
                        response : {
                            status : 201,
                            message : "Created"
                        },
                        encoded
                    }
                )
            }
        );
    })
}

module.exports = {
    verifyToken,
    generateToken
}