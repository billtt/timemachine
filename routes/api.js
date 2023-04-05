/**
 * API routes
 */

var User = require('../models/user');
var Slice = require('../models/slice');
var util = require('../util');
var router = require('express').Router();

const CODE_OK = 0;
const CODE_ERROR_GENERAL = 1;
const CODE_ERROR_INVALID_USER = 2;

function sendJson(res, data, code) {
    data['code'] = code;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
    return null;
}

router.get('/login', function(req, res) {
    let name = req.query.name;
    let passwd = req.query.password;
    passwd = util.encodePassword(passwd);
    User.get(name, function(err, user) {
        if (!user || user.key != passwd) {
            return sendJson(res, {}, CODE_ERROR_INVALID_USER);
        }
        if (user.token == null || user.token == '') {
            let token = util.genUserToken(name);
            user.updateToken(token, function(err) {
                if (err) {
                    console.log(err);
                    return sendJson(res, {}, CODE_ERROR_GENERAL);
                } else {
                    return sendJson(res, {token: user.token}, CODE_OK);
                }
            });
        } else {
            return sendJson(res, {token: user.token}, CODE_OK);
        }
    });
});

router.get('/list', function(req, res) {
    let token = req.query.token;
    User.getByToken(token, function(err, user) {
        if (err || user == null) {
            console.log(err);
            return sendJson(res, {}, CODE_ERROR_INVALID_USER);
        }
        let date = new Date(req.query.date);
        Slice.getDateRangeList(user.name, date, date, function(err, slices) {
            if (!slices) {
                slices = [];
            }
            return sendJson(res, {slices: slices}, CODE_OK);
        });
    });
});

router.get('/search', function(req, res) {
    let token = req.query.token;
    User.getByToken(token, function(err, user) {
        if (err || user == null) {
            console.log(err);
            return sendJson(res, {}, CODE_ERROR_INVALID_USER);
        }
        let search = req.query.search;
        Slice.search(user.name, search, function(err, slices) {
            if (!slices) {
                slices = [];
            }
            return sendJson(res, {slices: slices}, CODE_OK);
        });
    });
});

router.post('/add', function(req, res) {
    let token = req.body.token;
    User.getByToken(token, function(err, user) {
        if (err || user == null) {
            console.log(err);
            return sendJson(res, {}, CODE_ERROR_INVALID_USER);
        }
        let date = req.body.date;
        let slice = new Slice(req.body.content, 'other', user.name, date);
        slice.save((err) => {
            if (err) {
                console.log(err);
                return sendJson(res, {}, CODE_ERROR_GENERAL);
            }
            return sendJson(res, {slice: slice}, CODE_OK);
        });
    });
});

router.get('/remove', function(req, res) {
    let token = req.body.token;
    User.getByToken(token, function(err, user) {
        if (err || user == null) {
            console.log(err);
            return sendJson(res, {}, CODE_ERROR_INVALID_USER);
        }
        let id = req.query.id;
        Slice.remove(user.name, id, (err) => {
            if (err) {
                console.log(err);
                return sendJson(res, {}, CODE_ERROR_GENERAL);
            }
            return sendJson(res, {id: id}, CODE_OK);
        });
    });
});

module.exports = router;
