import { body } from "express-validator";

export const registerValidation = [
    body('email', 'Invalid email format').isEmail(),
    body('password', 'Password must be at least six characters long').isLength({min: 6}),
    body('fullName', 'Name must contain at least three letters').isLength({min: 3})
];

export const loginValidation = [
    body('email', 'Invalid email format').isEmail(),
    body('password', 'Password must be at least six characters long').isLength({min: 6}),
];

export const postCreateValidation = [
    body('title', 'Enter article title').isLength({min: 3}).isString(),
    body('text', 'Enter the text of the article').isLength({min: 10}).isString(),
    body('tags', 'Invalid tag format (specify array)').optional().isArray(),
    body('imageUrl', 'Invalid image link').optional().isString(),
];