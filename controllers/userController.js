const User = require('../models/userModel');
const mongoose = require('mongoose');

// Create a new user
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  res.status(201).json({ _id: user._id, name: user.name, email: user.email });
};

//  Login existing user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log('loginUser req.body:', req.body);   

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await user.matchPassword(password);
      console.log('loginUser found user:', user.email, 'password match:', isMatch);
      if (isMatch) {
        return res.json({ _id: user._id, name: user.name, email: user.email });
      }
    }
    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (err) {
    console.error('loginUser error:', err); 
    return res.status(500).json({ message: err.message });
  }
};



// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '_id name email createdAt'); 
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const user = await User.findById(id, '_id name email createdAt');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

//Delete user by ID **********************************
exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


