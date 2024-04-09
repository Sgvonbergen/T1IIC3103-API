import express from 'express'
import { getPosts, createPost, getComments } from '../database.js';
import { param, validationResult } from 'express-validator';
const router = express.Router();

const validateCreatePostBody = function(req, res, next) {
    if (req.body.title === undefined) {
        let err = new Error();
        err.title = "SyntaxError";
        err.message = "Missing parameter title";
        err.statusCode = 400;
        return res.json(err);
    }
    if (req.body.content === undefined) {
        let err = new Error();
        err.title = "SyntaxError";
        err.message = "Missing parameter content";
        err.statusCode = 400;
        return res.json(err);
    }
    if (req.body.userId === undefined) {
        let err = new Error();
        err.message = "User not Found";
        err.statusCode = 404;
        return res.json(err);
    }
    if (req.body.image === undefined) {
        req.body.image = "";
    }
    next()
}

/* GET posts listing. */
router.get('/', async function(req, res, next) {
    const posts = await getPosts(req.db, {});
    req.db.end();
    res.status(200).json(posts.rows);
});

/* POST new Post */
router.post('/', validateCreatePostBody, async function(req, res, next) {
    const postParams = {
        "title": req.body.title,
        "content": req.body.content,
        "image": req.body.image,
        "userId": req.body.userId,
    };
    const post = await createPost(postParams, req.db)
    req.db.end();
    if (post.detail && post.detail.includes("users")) {
        res.status(404).json({
            title: "Not Found",
            message: "User not found",
            statusCode: 404
        });
    } else {
        res.status(201).json(post.rows[0])
    }
})

/* GET specific Post */
router.get('/:id', param('id').isNumeric(), async function(req, res, next) {
    const valResult = validationResult(req);
    if (valResult.isEmpty()) {
        const post = await getPosts(req.db, { 'postId': req.params.id });
        req.db.end();
        if (post.rows.length === 0) {
            let err = new Error();
            err.message = "Post not Found";
            err.statusCode = 404;
            return res.json(err);
        } else {
            res.status(200).json(post.rows[0]);
        }
    } else {
        req.db.end();
        res.send({ errors: valResult.array() });
    }
})

/* GET comments of a specific Post */
router.get('/:id/comments', param('id').isNumeric(), async function(req, res, next) {
    const valResult = validationResult(req);
    if (valResult.isEmpty()) {
        const comments = await getComments(req.db, { 'postId': req.params.id });
        req.db.end();
        res.status(200).json(comments.rows)
    } else {
        req.db.end();
        res.send({ errors: valResult.array() });
    }
})

export default router;
