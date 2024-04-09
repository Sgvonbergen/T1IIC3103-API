import express from 'express'
import { getComments, createComment } from '../database.js';
const router = express.Router();

const validateCreateCommentBody = function(req, res, next) {
    if (req.body.content === undefined) {
        let err = new Error();
        err.title = "SyntaxError";
        err.message = "Missing parameter content";
        err.statusCode = 400;
        res.status(400).json(err);
    }
    if (req.body.userId === undefined) {
        let err = new Error();
        err.title = "SyntaxError";
        err.message = "Must include userId";
        err.statusCode = 404;
        res.status(404).json(err);
    }
    if (req.body.postId === undefined) {
        let err = new Error();
        err.title = "SyntaxError";
        err.message = "Must include postId";
        err.statusCode = 404;
        res.status(404).json(err);
    }
    next();
}

/* GET comments of a Post form postId. */
router.get('/', async function(req, res, next) {
    const comments = await getComments(req.db, { 'postId': req.query.postId });
    req.db.end();
    res.status(200).json(comments.rows);
});

/* POST new comment */
router.post('/', validateCreateCommentBody, async function(req, res, next) {
    const commentParams = {
        "content": req.body.content,
        "postId": req.body.postId,
        "userId": req.body.userId,
    };
    const comment = await createComment(commentParams, req.db);
    req.db.end();
    if (comment.detail && comment.detail.includes("users")) {
        res.status(404).json({
            title: "Not Found",
            message: "User not found",
            statusCode: 404
        });
    } else if (comment.detail && comment.detail.includes("posts")) {
        res.status(404).json({
            title: "Not Found",
            message: "Post not found",
            statusCode: 404
        });
    }  else {
        res.status(201).json(comment.rows[0]);
    }
})

export default router;
