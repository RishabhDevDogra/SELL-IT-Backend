let express = require('express');
let router = express.Router();
let usersController = require('../controller/user');
let passport = require('passport');
let authController = require('../controller/auth');

/* GET users listing. */
// router.get('/', function(req, res, next) {  
//   res.render('users', { 
//     title: 'Users',
//     userName: req.user ? req.user.username : ''
//   });
// });

// router.get('/signup', usersController.renderSignup);
router.post('/signup', usersController.signup);

// router.get('/signin', usersController.renderSignin);
router.post('/signin', usersController.signin);

// router.get('/signout', usersController.signout);

router.get('/me', authController.requireAuth, usersController.myprofile);

module.exports = router;
