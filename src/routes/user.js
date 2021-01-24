import express from 'express';
const router = express.Router();
import { check } from 'express-validator';
import { mongoose } from '../commons/mongo';
import { createPassword, matchpassword } from '../commons/password';
import { createResponse, response } from '../commons/response';
import { createToken } from '../commons/token';
import { validatePayload } from '../commons/validation';
import { User } from '../models/user';
import { ObjectId } from 'mongodb';
import { verifyUser } from '../commons/jwt_auth';


router.post('/register', [
    check('name', "Name is not valid").not().isEmpty(),
    check('email', "Email not valid").isEmail(),
    check('password', 'Password should contain minimum 8 characters, with at least a symbol, upper and lower case letters and a number').matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
    check('c_password', 'Passwords does not match !'),
    validatePayload
],async(req, res) => {
    try {
        let { name, email, password, c_password } = req.body;
        email = email.toLowerCase().replace(/\s+/g, '');
        if(password !== c_password) {
            return response(res, 400, createResponse('Passwords does not match !'))
        }
        const exist = await User.findOne({ email }).lean();
        if(exist) {
            return response(res, 400, createResponse('Email already exist !'))
        }
        const newUser = {
            email, name
        }
        const hashed = await createPassword(password);
        const { success, payload } = hashed;
        if(!success) {
            console.log(payload, 'Error in hasing password')
            return response(res, 400, createResponse('Something went wrong, please try again !'))
        }
        newUser.password = payload;
        await new User(newUser).save();
        response(res, 201, createResponse('Registered Successfully, please login to proceed !'))
    } catch (error) {
        console.log(error, 'Error in registering user');
        response(res, 500, createResponse('Something went wrong, please register again !'))
    }
});

router.post('/login', [
    check('email', 'Invalid Credentials, please try again !').isEmail(),
    check('password', 'Invalid Credentials, please try again !').not().isEmpty(),
    validatePayload
], async(req, res) => {
    try {
        let { email, password } = req.body;
        email = email.toLowerCase().replace(/\s+/g, '');
        const user = await User.findOne({ email }).lean();
        if(!user) {
            return response(res, 400, createResponse('Invalid Credentials, please try again !'))
        }
        const match = await matchpassword(password, user.password);
        if(!match) {
            return response(res, 400, createResponse('Invalid Credentials, please try again !'))   
        }
        const token = await createToken({
            _id: user._id, email: user.email
        });
        response(res, 200, createResponse(token));
    } catch (error) {
        console.log(error, 'Error in login');
        response(res, 500, createResponse('Something went wrong, please try again !'))
    }
});

router.get('/userDetails', verifyUser,async(req, res) => {
    try {
        const { _id } = req.user;
        const valid = ObjectId.isValid(_id);
        if(!valid) {
            return response(res, 400, createResponse('Please provide valid id !'))
        }
        const user = await User.findOne({ _id }).lean();
        if(!user) {
            return response(res, 400, createResponse('User not found !'))
        }
        delete user.password;
        return response(res, 200, createResponse(user));
    } catch (error) {
        console.log(error, 'Error in getting user details ');
        response(res, 500, createResponse('Something went wrong, please try again !'))
    }
})

export {
    router as userRouter
}