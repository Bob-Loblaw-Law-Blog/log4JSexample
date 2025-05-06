var log4js = require('log4js');
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//We won't need this.
//var logger = require('morgan');
var log = log4js.getLogger("app");

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon());

// replace this with the log4js connect-logger
// app.use(logger('dev'));
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    // Special handler for 404 errors in development
    app.use(function(err, req, res, next) {
        if (err.status === 404) {
            log.warn("404 Not Found in development environment:", err);
            res.status(404);
            res.render('error', {
                message: 'Resource not found - Development Environment',
                error: err // In development, we show the full error details
            });
        } else {
            // Pass other errors to the general handler
            next(err);
        }
    });

    // General development error handler
    app.use(function(err, req, res, next) {
        log.error("Something went wrong:", err);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// Production-specific handlers for certain status codes
// 403 Forbidden handler for production
app.use(function(err, req, res, next) {
    if (err.status === 403) {
        log.error("Access Forbidden (403):", err);
        res.status(403);
        res.render('error', {
            message: 'Access Forbidden',
            error: {} // No stacktrace leaked to user
        });
    } else {
        next(err);
    }
});

// 504 Gateway Timeout handler for production
app.use(function(err, req, res, next) {
    if (err.status === 504) {
        log.error("Gateway Timeout (504):", err);
        res.status(504);
        res.render('error', {
            message: 'Server timeout. Please try again later.',
            error: {} // No stacktrace leaked to user
        });
    } else {
        next(err);
    }
});

// General production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    log.error("Something went wrong:", err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
