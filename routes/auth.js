const express = require('express');
const {register, login, logout} = require("../controllers/auth");

const router = express.Router();

//HTTP REQUESTs (OPEN TO EVERYONE)
router.post('/register', register);
router.post('/login', login);

module.exports = router;

