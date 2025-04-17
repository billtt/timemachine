/**
 * API routes
 */

const User = require('../models/user');
const Slice = require('../models/slice');
const util = require('../util');
const router = require('express').Router();

const CODE_OK = 0;
const CODE_ERROR_GENERAL = 1;
const CODE_ERROR_INVALID_USER = 2;

function sendJson(res, data, code) {
    data['code'] = code;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
    return null;
}

router.post('/login', async (req, res) => {
    try {
        const name = req.body.username;
        const passwd = util.encodePassword(req.body.password);
        const user = await User.get(name);

        if (!user || user.key !== passwd) {
            return sendJson(res, {}, CODE_ERROR_INVALID_USER);
        }

        if (!user.token) {
            const token = util.genUserToken(name);
            await user.updateToken(token);
        }

        return sendJson(res, { token: user.token }, CODE_OK);
    } catch (err) {
        console.log(err);
        return sendJson(res, {}, CODE_ERROR_GENERAL);
    }
});

router.post('/list', async (req, res) => {
    try {
        const token = req.body.token;
        const user = await User.getByToken(token);
        if (!user) {
            return sendJson(res, {}, CODE_ERROR_INVALID_USER);
        }
        const date = new Date(req.body.date);
        const slices = await Slice.getDateRangeList(user.name, date, date);
        return sendJson(res, { slices: slices || [] }, CODE_OK);
    } catch (err) {
        console.log(err);
        return sendJson(res, {}, CODE_ERROR_GENERAL);
    }
});

router.post('/search', async (req, res) => {
    try {
        const token = req.body.token;
        const user = await User.getByToken(token);
        if (!user) {
            return sendJson(res, {}, CODE_ERROR_INVALID_USER);
        }
        const search = req.body.search;
        const slices = await Slice.search(user.name, search);
        return sendJson(res, { slices: slices || [] }, CODE_OK);
    } catch (err) {
        console.log(err);
        return sendJson(res, {}, CODE_ERROR_GENERAL);
    }
});

router.post('/add', async (req, res) => {
    try {
        const token = req.body.token;
        const user = await User.getByToken(token);
        if (!user) {
            return sendJson(res, {}, CODE_ERROR_INVALID_USER);
        }
        const date = new Date(req.body.date);
        const slice = new Slice(req.body.content, 'other', user.name, date);
        await slice.save();
        return sendJson(res, {}, CODE_OK);
    } catch (err) {
        console.log(err);
        return sendJson(res, {}, CODE_ERROR_GENERAL);
    }
});

router.post('/remove', async (req, res) => {
    try {
        const token = req.body.token;
        const user = await User.getByToken(token);
        if (!user) {
            return sendJson(res, {}, CODE_ERROR_INVALID_USER);
        }
        const id = req.body.id;
        await Slice.remove(user.name, id);
        return sendJson(res, { id }, CODE_OK);
    } catch (err) {
        console.log(err);
        return sendJson(res, {}, CODE_ERROR_GENERAL);
    }
});

router.post('/update', async (req, res) => {
    try {
        const token = req.body.token;
        const user = await User.getByToken(token);
        if (!user) {
            return sendJson(res, {}, CODE_ERROR_INVALID_USER);
        }
        const id = req.body.id;
        const content = req.body.content;
        const date = new Date(req.body.date);
        await Slice.update(id, content, date);
        return sendJson(res, {}, CODE_OK);
    } catch (err) {
        console.log(err);
        return sendJson(res, {}, CODE_ERROR_GENERAL);
    }
});

module.exports = router;