import { decode, verify } from 'jsonwebtoken';
import { createResponse, response } from './response';

const verifyUser = (req, res, next) => {
    const { JWT_SECRET } = process.env;
    const jwt_secret = JWT_SECRET;
    const token = req.header("access-token");
    if (!token) {
      return response(res, 401, createResponse('Invalid Access, Authorization Denied !'));
    }
  
    try {
      const decoded = verify(token, jwt_secret);
      const current = Math.floor(new Date().getTime() / 1000);
      if(decoded.exp < current) {
        return response(res, 401, createResponse('Token Expired, Please login again to continue'));
      }
      req.user = decoded;
      next();
    } catch (err) {
      return response(res, 401, createResponse('Invalid Access, Authorization Denied !'));
    }
}

export {
    verifyUser
}