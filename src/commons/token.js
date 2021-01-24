import { sign } from 'jsonwebtoken';

const createToken = async(payload) => {
    const { JWT_SECRET, JWT_EXPIRY } = process.env;
    const jwt_secret = JWT_SECRET, jwt_expiry = JWT_EXPIRY;
    const token = await sign(payload, jwt_secret, { expiresIn: jwt_expiry });
    return token;
}


export {
    createToken
}