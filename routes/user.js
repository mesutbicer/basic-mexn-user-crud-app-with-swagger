const express = require('express');
const {getUsers, getUserById, updateUserById, deleteUserById, logoutUserById} = require("../controllers/user.js");
const authRequired = require("../middleware/auth");

const router = express.Router();

//HTTP REQUESTs (PRE AUTHENTICATED MUST)
router.get('/', authRequired, getUsers);
router.get('/:id', authRequired, getUserById);
router.put('/update/:id', authRequired, updateUserById);
router.delete('/delete/:id', authRequired, deleteUserById);
router.get('/logout/:id', authRequired, logoutUserById);

module.exports = router;

