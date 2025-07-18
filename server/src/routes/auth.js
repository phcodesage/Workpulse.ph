const express = require('express');
const { register, login, getMe, logout } = require('../controllers/auth');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validator');
const { registerValidation, loginValidation } = require('../validations/auth');

const router = express.Router();

router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

module.exports = router;
