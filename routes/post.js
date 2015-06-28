var express = require('express');
var router = express.Router();
var Check = require('../models/check.js');
var Post = require('../models/post.js');

router.post('/', Check.checkLogin);
router.post('/', function(req, res) {
    var currentUser = req.session.user;
    var post = new Post(currentUser.name, req.body.post);
    post.save(function(err) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        req.flash('success', '发表成功');
        res.redirect('/user/' + currentUser.name);
    });
});

module.exports = router;