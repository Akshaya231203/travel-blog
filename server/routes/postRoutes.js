const router = require('express').Router();
const c = require('../controllers/postController'); const s = require('../controllers/socialController');
const { requireAuth } = require('../middleware/authMiddleware'); const upload = require('../middleware/uploadMiddleware');
router.get('/', c.list); router.get('/:id', c.get); router.post('/', requireAuth, upload.single('image'), c.create); router.put('/:id', requireAuth, upload.single('image'), c.update); router.delete('/:id', requireAuth, c.remove);
router.get('/:id/likes', s.likes); router.post('/:id/like', requireAuth, s.like); router.delete('/:id/like', requireAuth, s.unlike); router.get('/:id/comments', s.comments); router.post('/:id/comments', requireAuth, s.addComment);
module.exports = router;
