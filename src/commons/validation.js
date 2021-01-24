import { validationResult, ValidationError } from 'express-validator';
import { response } from './response';

const validatePayload = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return response(res, 400, errors.array())
    }
    next();
}

export { validatePayload }