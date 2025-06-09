const express = require('express');
const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/users');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getUsers);
router.get('/:id', protect, getUser);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);

module.exports = router;
