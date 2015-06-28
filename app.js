var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var methodOverride = require('method-override');
var settings = require('./database/settings');
var flash = require('connect-flash');

var routes = require('./routes/index');
var user = require('./routes/user');
var post = require('./routes/post');
var reg = require('./routes/reg');
var login = require('./routes/login');
var logout = require('./routes/logout');

var app = express();

// 设定port变量，意为访问端口
app.set('port', process.env.PORT || 8888);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.set('view options', {
//     layout: true
// });

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
    secret: settings.cookieSecret,
    cookie: {
        maxAge: 80000
    },
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ // 创建新的mongodb数据库
        host: settings.host, // 数据库的地址
        db: settings.db, // 数据库的名称
        port: settings.port // 数据库的端口号
    })
}));
app.use(express.static(path.join(__dirname, 'public'))); // 引入使用相对路径，CSS和JS会从该目录下取找
app.use(flash());

app.use('/', routes);
app.use('/user', user);
app.use('/post', post);
app.use('/reg', reg);
app.use('/login', login);
app.use('/logout', logout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// 创建动态视图助手,通过它才能在视图中访问会话中的用户数据。 
// 同时为了显示错误和成功的信息,也要在动态视图助手中增加响应的函数。
app.use(function(req, res, next) {
    console.log("app.usr local");
    res.locals.user = req.session.user;
    res.locals.post = req.session.post;
    var error = req.flash('error');
    res.locals.error = error.length ? error : null;

    var success = req.flash('success');
    res.locals.success = success.length ? success : null;
    next();
});

app.listen(app.get('port'));

console.log('The server is starting on port: ' + app.get('port') + '.');

module.exports = app;