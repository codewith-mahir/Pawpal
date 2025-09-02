const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAllUsers,
  getAllProducts,
  getAllComplaints,
  promoteUserToAdmin,
  setUserBlocked,
  setUserApproved,
  analytics,
  deleteUser,
  deleteProduct,
  adminAddProduct,
} = require('../controllers/adminController');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.get('/users', authMiddleware, getAllUsers);
router.get('/products', authMiddleware, getAllProducts);
router.get('/complaints', authMiddleware, getAllComplaints);
router.post('/promote/:userId', authMiddleware, promoteUserToAdmin);
router.post('/user/:userId/block', authMiddleware, setUserBlocked);
router.post('/user/:userId/approve', authMiddleware, setUserApproved);
router.get('/analytics', authMiddleware, analytics);

// New routes:
router.delete('/user/:userId', authMiddleware, deleteUser);
router.delete('/product/:productId', authMiddleware, deleteProduct);
router.post('/product', authMiddleware, upload.single('image'), adminAddProduct);

module.exports = router;
