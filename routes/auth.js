const express = require('express');

const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');

const User = require('../models/user')

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',
            [
                check('email')
                    .isEmail()
                    .withMessage('Please enter your valid email')
                    .normalizeEmail(),     
                body('password', 'Incorrect Password')
                    .isLength({min: 6})
                    .isAlphanumeric()
                    .trim()
                    
            ]
 ,authController.postLogin);

router.post('/signup',
            [
                check('email')
                    .isEmail()
                    .withMessage('Please enter a valid email')
                    .custom((value, {req}) => {  
                        return User
                            .findOne({ email: value })
                            .then(userDoc => {
                                if (userDoc) {
                                    return Promise.reject("Email already in use");
                                }
                            })
                    })
                    .normalizeEmail(),     
                body('password', 'Your password should have a minimum length of 6 and include numbers')
                    .isLength({min: 6})
                    .isAlphanumeric()
                    .trim()
            ]
            , authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;