const express = require('express');
const router = express.Router();

// Bring in Models & Helpers
const Address = require('../../models/address');
const auth = require('../../middleware/auth');

// add address api
router.post('/add', auth, async (req, res) => {
  try {
    const user = req.user;

    // Validate required fields
    const { name, phoneNumber, address, city, state, country, zipCode } = req.body;
    
    if (!name) {
      return res.status(400).json({
        error: 'Name is required.'
      });
    }
    
    if (!phoneNumber) {
      return res.status(400).json({
        error: 'Phone number is required.'
      });
    }
    
    if (!address) {
      return res.status(400).json({
        error: 'Address is required.'
      });
    }
    
    if (!city) {
      return res.status(400).json({
        error: 'City is required.'
      });
    }
    
    if (!state) {
      return res.status(400).json({
        error: 'State is required.'
      });
    }
    
    if (!country) {
      return res.status(400).json({
        error: 'Country is required.'
      });
    }
    
    if (!zipCode) {
      return res.status(400).json({
        error: 'Zip code is required.'
      });
    }

    const addressDoc = new Address({
      ...req.body,
      user: user._id
    });
    
    const savedAddress = await addressDoc.save();

    res.status(200).json({
      success: true,
      message: `Address has been added successfully!`,
      address: savedAddress
    });
  } catch (error) {
    console.error('Add Address Error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        error: errors.join(', ')
      });
    }
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch all addresses api
router.get('/', auth, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ created: -1 });

    res.status(200).json({
      addresses
    });
  } catch (error) {
    console.error('Fetch Addresses Error:', error);
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const addressId = req.params.id;

    const addressDoc = await Address.findOne({ _id: addressId });

    if (!addressDoc) {
      return res.status(404).json({
        message: `Cannot find Address with the id: ${addressId}.`
      });
    }

    res.status(200).json({
      address: addressDoc
    });
  } catch (error) {
    console.error('Fetch Address Error:', error);
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const addressId = req.params.id;
    const update = req.body;
    const query = { _id: addressId };

    // Validate required fields
    if (update.name && !update.name.trim()) {
      return res.status(400).json({
        error: 'Name cannot be empty.'
      });
    }
    
    if (update.phoneNumber && !update.phoneNumber.trim()) {
      return res.status(400).json({
        error: 'Phone number cannot be empty.'
      });
    }

    const updatedAddress = await Address.findOneAndUpdate(query, {
      ...update,
      updated: new Date()
    }, {
      new: true,
      runValidators: true
    });

    if (!updatedAddress) {
      return res.status(404).json({
        error: 'Address not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Address has been updated successfully!',
      address: updatedAddress
    });
  } catch (error) {
    console.error('Update Address Error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        error: errors.join(', ')
      });
    }
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const addressId = req.params.id;
    
    const deletedAddress = await Address.findOneAndDelete({ _id: addressId });

    if (!deletedAddress) {
      return res.status(404).json({
        error: 'Address not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: `Address has been deleted successfully!`,
      address: deletedAddress
    });
  } catch (error) {
    console.error('Delete Address Error:', error);
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

module.exports = router;