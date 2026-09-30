const router=require('express').Router(); const c=require('../controllers/userController'); const {requireAuth}=require('../middleware/authMiddleware'); const upload=require('../middleware/uploadMiddleware');
router.get('/me',requireAuth,c.profile); router.put('/me',requireAuth,upload.single('profile_image'),c.update); router.get('/me/posts',requireAuth,c.posts); module.exports=router;
