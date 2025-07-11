const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subject: {
    type: String,
    enum: ['maths', 'english'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Tutor', tutorSchema);
