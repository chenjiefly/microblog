var express = require('express');
var router = express.Router();

/* GET home page. */
router.route('/')
    .get(function(req, res, next) {
        res.render('reg', {
            title: '用户注册',
            user: false,
            success: false,
            error: false
        });
    })
    .post(function(req, res, next) {
        res.render('reg', {
            title: '用户注册',
            user: false,
            success: false,
            error: false
        });
    });

module.exports = router;