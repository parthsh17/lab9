const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middleware/upload');

router.post(
  '/', 
  upload.single('profilePicture'), 
  userController.createUser
);

router.get('/', userController.getAllUsers);

router.put('/:id', express.json(), userController.updateUser);

router.delete('/:id', userController.deleteUser);

module.exports = router;