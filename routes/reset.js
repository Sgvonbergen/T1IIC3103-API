import express from 'express'
import { resetDB } from '../database.js'
const router = express.Router();

/* Reset Data. */
router.post('/', function(req, res, next) {
    const deleted = resetDB(req.db);
    res.status(200).json({});
});

export default router;
