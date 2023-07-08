const express = require('express')
const router = express.Router()
const userModel = require('../Model/userModel')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const dotenv = require("dotenv");
const oemSpecsModel = require('../Model/oemSpecsModel')
const multer = require('multer');
dotenv.config();

const saltRounds = 10;
const upload = multer();

// AUTH Routes
router.post('/register', async (req, res) => {

  const { name, email, password } = req.body
  try {
    const existUser = await userModel.findOne({ email })

    if (existUser) {
      res.status(400).json({ message: 'User already exists' })
    } else {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = new userModel({ name, email, password: hashedPassword })
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

router.post('/add-car', upload.single('image'), async (req, res) => {
  // Access the car data from req.body
  const carData = req.body;

  // Access the uploaded image from req.file
  const image = req.file;

  const newCar = new oemSpecsModel({
    image: {
      data: image.buffer,
      contentType: image.mimetype,
    },
    make: carData.make,
    model: carData.model,
    year: carData.year,
    listPrice: carData.listPrice,
    colors: carData.colors,
    mileage: carData.mileage,
    power: carData.power,
    maxSpeed: carData.maxSpeed,

  });


  try {
    // Save the new car to the database
    const savedCar = await newCar.save();

    // Respond with a success message or the saved car data
    res.json({ message: 'Car added successfully', car: savedCar });
  } catch (error) {
    console.error('Error saving car:', error);
    res.status(500).json({ error: 'Error saving car' });
  }
});


// Edit car By ID

router.put('/cars/:id', async (req, res) => {
  try {
    const carId = req.params.id;

    // Find the car by ID and update its details
    const updatedCar = await oemSpecsModel.findByIdAndUpdate(carId, req.body, {
      new: true, // Return the updated car object
    });

    if (!updatedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.status(200).json({ message: 'Car updated successfully', car: updatedCar });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update car' });
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

router.delete('/cars/:id', (req, res) => {
  const id = req.params.id;

  // Find the car by ID and delete it
  oemSpecsModel.findByIdAndDelete(id)
    .then(deletedCar => {
      if (!deletedCar) {
        return res.status(404).json({ message: 'Car not found' });
      }

      res.json({ message: 'Car deleted successfully' });
    })
    .catch(err => {
      console.error('Failed to delete car:', err);
      res.status(500).json({ message: 'Failed to delete car' });
    });
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


