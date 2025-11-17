const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getNewArrivals,
  getTrendingProducts,
  getBestSellers,
  addReview,
  uploadImages,
  checkPurchase,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.route('/')
  .get(getProducts)
  .post(protect, adminOnly, createProduct);

router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/trending', getTrendingProducts);
router.get('/best-sellers', getBestSellers);

router.post('/upload', protect, adminOnly, upload.array('images', 4), uploadImages);

router.route('/:id')
  .get(getProduct)
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

// Check if user purchased product (must be before /:id/reviews to avoid route conflict)
router.get('/:id/check-purchase', protect, checkPurchase);

// Add review (only for verified buyers)
router.post('/:id/reviews', protect, addReview);

module.exports = router;