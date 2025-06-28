const Tutor = require('../models/tutorModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerTutor = async (req, res) => {
  const { name, email, password, subject } = req.body;

  try {
    const existingTutor = await Tutor.findOne({ email });
    if (existingTutor) return res.status(400).json({ message: 'Tutor already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newTutor = new Tutor({ name, email, password: hashedPassword, subject });
    await newTutor.save();

    res.status(201).json({ message: 'Tutor registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.loginTutor = async (req, res) => {
  const { email, password } = req.body;

  try {
    const tutor = await Tutor.findOne({ email });
    if (!tutor) return res.status(404).json({ message: 'Tutor not found' });

    const isMatch = await bcrypt.compare(password, tutor.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: tutor._id, role: 'tutor' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
