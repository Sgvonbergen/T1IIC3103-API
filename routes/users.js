import express from 'express'
import { getUsers, createUser, getPosts, getComments } from '../database.js';
import { param, validationResult } from 'express-validator';
const router = express.Router();

const validateCreateUserBody = function(req, res, next) {
    if (req.body.username === undefined) {
        let err = new Error();
        err.title = "SyntaxError";
        err.message = "Missing parameter username";
        err.statusCode = 400;
        return res.json(err);
    }
    if (req.body.avatar === undefined) {
        req.body.avatar = "default";
    }
    next()
}

/* GET users listing. */
router.get('/', async function(req, res, next) {
    const users = await getUsers(req.db, {});
    res.status(200).json(users.rows);
});

/* POST new user */
router.post('/', validateCreateUserBody, async function(req, res, next) {
    const userParams = {
        'username': req.body.username,
        'avatar': req.body.avatar
    };
    const user = await createUser(userParams, req.db);
    res.status(201).json(user.rows[0]);
});

/* GET specific User */
router.get('/:id', param('id').isNumeric(), async function(req, res, next) {
    const valResult = validationResult(req);
    if (valResult.isEmpty()) {
        const user = await getUsers(req.db, {'userId': req.params.id})
        if (user.rows.length === 0) {
            let err = new Error();
            err.message = "User not Found";
            err.statusCode = 404;
            return res.json(err);
        } else {
            res.status(200).json(user.rows[0]);
        }
    } else {
        res.send({ errors: valResult.array() });
    }
});

/* GET posts from a specific User */
router.get('/:id/posts', param('id').isNumeric(), async function(req, res, next) {
    const valResult = validationResult(req);
    if (valResult.isEmpty()) {
        const posts = await getPosts(req.db, {'userId': req.params.id})
        res.status(200).json(posts.rows);
    } else {
        res.send({ errors: valResult.array() });
    }
});

/* GET comments from a specific User */
router.get('/:id/comments', param('id').isNumeric(), async function(req, res, next) {
    const valResult = validationResult(req);
    if (valResult.isEmpty()) {
        const comments = await getComments(req.db, {'userId': req.params.id})
        res.status(200).json(comments.rows);
    } else {
        res.send({ errors: valResult.array() });
    }
    
});

export default router;
