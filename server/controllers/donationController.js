const Donation = require('../models/Donation');
const NGO = require('../models/NGO');
const mongoose = require('mongoose');
const { sendEmail } = require('../utils/mailer');

exports.listNGOs = async (req, res) => {
  try {
    const ngos = await NGO.find({ isVerified: true }).sort({ name: 1 });
    res.json(ngos);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitDonation = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      donationType, 
      selectedNgo, 
      donationItems, 
      donationAmount, 
      other, 
      isWebsiteDonation 
    } = req.body;
    
    // Basic validation
    if (!firstName || !lastName || !email || !donationType) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    // Handle website donation
    if (donationType === 'website' || isWebsiteDonation) {
      const donation = new Donation({
        userId: req.user?._id || null,
        firstName,
        lastName,
        email,
        donationType: 'website',
        selectedNgo: null,
        donationItems,
        donationAmount,
        other,
        isWebsiteDonation: true,
        notes: `Website support donation. Items: ${donationItems}, Amount: ${donationAmount}, Other: ${other}`,
        status: 'approved', // Website donations are auto-approved
      });
      await donation.save();

      // Notify admin about website support
      const emailContent = `
        New Website Support Donation:
        Name: ${firstName} ${lastName}
        Email: ${email}
        Donation Type: ${donationItems}
        Amount: ${donationAmount}
        Other Details: ${other}
      `;
      
      try {
        await sendEmail(process.env.ADMIN_EMAIL, 'Website Support Donation', emailContent);
      } catch (emailError) {
        console.log('Email notification failed:', emailError);
      }

      return res.status(201).json({ message: 'Thank you for supporting our website!' });
    }

    // Handle NGO donation
    if (donationType === 'ngo') {
      if (!selectedNgo) {
        return res.status(400).json({ message: 'Please select an organization' });
      }

      if (!donationItems) {
        return res.status(400).json({ message: 'Please specify what you want to donate' });
      }

      if (donationItems === 'products' && !other) {
        return res.status(400).json({ message: 'Please specify the products you want to donate' });
      }

      if (donationItems === 'money' && !donationAmount) {
        return res.status(400).json({ message: 'Please specify the donation amount' });
      }

      if (donationItems === 'other' && !other) {
        return res.status(400).json({ message: 'Please specify what you want to donate' });
      }

      const donation = new Donation({
        userId: req.user?._id || null,
        firstName,
        lastName,
        email,
        donationType: 'ngo',
        selectedNgo,
        donationItems,
        donationAmount,
        other,
        isWebsiteDonation: false,
        notes: `NGO donation to ${selectedNgo}. Items: ${donationItems}, Amount: ${donationAmount}, Details: ${other}`,
        status: 'pending', // NGO donations need approval
      });
      await donation.save();

      // Notify admin about NGO donation
      const emailContent = `
        New NGO Donation Request:
        Name: ${firstName} ${lastName}
        Email: ${email}
        Organization: ${selectedNgo}
        Donation Type: ${donationItems}
        Amount: ${donationAmount}
        Details: ${other}
      `;
      
      try {
        await sendEmail(process.env.ADMIN_EMAIL, 'NGO Donation Request', emailContent);
      } catch (emailError) {
        console.log('Email notification failed:', emailError);
      }

      return res.status(201).json({ message: `Thank you for your donation to ${selectedNgo}! Your request has been submitted for approval.` });
    }

    return res.status(400).json({ message: 'Invalid donation type' });
    
  } catch (error) {
    console.error('Donation submission error:', error);
    res.status(500).json({ message: 'Failed to submit donation', error: error.message });
  }
};

exports.userDonations = async (req, res) => {
  try {
    // Find donations by userId or by email if user is logged in
    const query = {
      $or: [
        { userId: req.user._id },
        { email: req.user.email }
      ]
    };
    
    const list = await Donation.find(query).populate('ngoId', 'name').sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    console.error('userDonations error:', e);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.adminListDonations = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const list = await Donation.find().populate('userId', 'name email').populate('ngoId', 'name').sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.adminUpdateDonation = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const { id } = req.params;
    const { status, adminComment, scheduledAt } = req.body;
    const donation = await Donation.findById(id);
    if (!donation) return res.status(404).json({ message: 'Not found' });

    if (status && !['pending', 'approved', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    if (status) donation.status = status;
    if (adminComment !== undefined) donation.adminComment = adminComment;
    if (scheduledAt) donation.scheduledAt = new Date(scheduledAt);
    if (status === 'completed') donation.confirmedAt = new Date();
    await donation.save();

    // Notify user (best-effort)
    try {
      const subject = `Donation ${status}`;
      await sendEmail(donation.userId?.email || '', subject, `Your donation has been ${status}.`);
    } catch (_) { /* ignore */ }

    res.json({ message: 'Donation updated' });
  } catch (e) {
    if (e?.name === 'ValidationError' || e?.name === 'CastError') {
      return res.status(400).json({ message: e.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};
