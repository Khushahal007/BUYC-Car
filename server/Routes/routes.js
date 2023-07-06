const express = require('express')
const router = express.Router()
const userModel = require('../Model/userModel')
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const dotenv = require("dotenv");
dotenv.config();

const saltRounds = 10;
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
  




module.exports = router;


