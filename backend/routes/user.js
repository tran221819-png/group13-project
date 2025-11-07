const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); 

// Tuyến đường CRUD cơ bản cho User. 
// Base URL /users đã được thêm trong server.js, nên ở đây chỉ dùng '/'
router.get('/', userController.getUsers); // GET /users/
router.post('/', userController.createUser); // POST /users/
router.put('/:id', userController.updateUser); // PUT /users/:id
router.delete('/:id', userController.deleteUser); // DELETE /users/:id

module.exports = router;