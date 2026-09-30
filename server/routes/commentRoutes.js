const router = require('express').Router(); const { requireAuth }=require('../middleware/authMiddleware'); const { deleteComment }=require('../controllers/socialController');
router.delete('/:id',requireAuth,deleteComment); module.exports=router;
