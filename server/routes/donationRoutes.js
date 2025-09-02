const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  listNGOs,
  submitDonation,
  userDonations,
  adminListDonations,
  adminUpdateDonation,
} = require('../controllers/donationController');

// Public: list verified NGOs
router.get('/ngos', listNGOs);

// Authed user: submit and view own donations
router.post('/', auth, submitDonation);
router.get('/mine', auth, userDonations);

// Admin: list and update any donation
router.get('/', auth, adminListDonations);
router.patch('/:id', auth, adminUpdateDonation);

module.exports = router;
