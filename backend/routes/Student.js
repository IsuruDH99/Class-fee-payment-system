const express = require('express');
const router = express.Router();
const db = require('../models'); // Adjust path as needed
const Student = db.Student;

// Add new student
router.post('/add-student', async (req, res) => {
  try {
    const { name, sid, grade } = req.body;
    
    // Validate input
    if (!name || !sid || !grade) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if student ID already exists
    const existingStudent = await Student.findOne({ where: { sid } });
    if (existingStudent) {
      return res.status(400).json({ error: 'Student ID already exists' });
    }

    // Create new student
    const newStudent = await Student.create({
      sid,
      studentName: name,
      studentGrade: grade
    });

    res.status(201).json(newStudent);
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all students
router.get('/get-students', async (req, res) => {
  try {
    const students = await Student.findAll({
      order: [['studentName', 'ASC']] // Optional: sort by name
    });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete student
router.delete('/delete-student/:sid', async (req, res) => {
  try {
    const { sid } = req.params;
    const deleted = await Student.destroy({ where: { sid } });
    
    if (deleted) {
      return res.json({ message: 'Student deleted successfully' });
    }
    res.status(404).json({ error: 'Student not found' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;