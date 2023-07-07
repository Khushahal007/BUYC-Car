const express = require('express')
const router = express.Router()
const userModel = require('../Model/userModel')
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const dotenv = require("dotenv");
const oemSpecsModel = require('../Model/oemSpecsModel')
dotenv.config();

const saltRounds = 10;

// AUTH Routes


router.post('/register', async (req, res) => {

    const { name, email, password } = req.body
    try {
        const existUser = await userModel.findOne({ email })

        if (existUser) {
            res.status(400).json({ message: 'User already exists' })
        } else {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const newUser = new userModel({ name, email, password: hashedPassword})
            await newUser.save()
            // jwt token
            const token = jwt.sign({ email }, process.env.secretKey);
            res.status(201).json({ message: 'User Created Successfully', token })
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})


router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if user exists
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Compare password with bcrypt
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Create JWT token
      const token = jwt.sign({ userId: user._id }, process.env.secretKey, { expiresIn: '1h' });
  
      // Send token as response
      return res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  


// Add Car Details

router.post('/add-car', async (req, res) => {
  try {
    const { image, make, model, year, listPrice, colors, mileage, power, maxSpeed } = req.body;
    const car = new oemSpecsModel({
      image,
      make,
      model,
      year,
      listPrice,
      colors,
      mileage,
      power,
      maxSpeed
    });
    await car.save();
    res.status(200).json({ message: 'Car details added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add car details' });
  }
});


// Get All Cars

router.get('/cars', async (req, res) => {
  try {
    const cars = await oemSpecsModel.find();
    res.status(200).json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve cars' });
  }
});

// Add inventory

router.post('/add-inventory', (req, res) => {
  const {
    make,
    model,
    year,
    kmOnOdometer,
    majorScratches,
    originalPaint,
    accidentsReported,
    previousBuyers,
    registrationPlace
  } = req.body;

  const inventoryDetails = {
    make,
    model,
    year,
    kmOnOdometer,
    majorScratches,
    originalPaint,
    accidentsReported,
    previousBuyers,
    registrationPlace
  };

  marketplaceInventory.push(inventoryDetails);
  res.status(200).json({ message: 'Inventory details added successfully' });
});





module.exports = router;


