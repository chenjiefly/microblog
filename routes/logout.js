var express = require('express');
var router = express.Router();
var Check = require('../models/check.js');

router.get('/', Check.checkLogin);

router.get('/', function(req, res) {
    req.session.user = null;
    req.flash('success', '登出成功!');
    res.redirect('/'); //登出成功后跳转到主页
});

module.exports = router;