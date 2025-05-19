const express = require('express');
const router = express.Router();
const db = require('../models');
const Subject = db.Subject;

// Add new subject
router.post('/add-subject', async (req, res) => {
  try {
    const { subjectCode, subjectName, subjectFee } = req.body;

    if (!subjectCode || !subjectName || !subjectFee) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingSubject = await Subject.findOne({ where: { subjectCode } });
    if (existingSubject) {
      return res.status(400).json({ message: 'Subject code already exists' });
    }

    const newSubject = await Subject.create({
      subjectCode,
      SubjectName: subjectName,
      subjectFee: parseFloat(subjectFee),
    });

    res.status(201).json(newSubject);
  } catch (error) {
    console.error('Error adding subject:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all subjects
router.get('/get-subjects', async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      attributes: ['subjectCode', 'SubjectName', 'subjectFee'],
      order: [['SubjectName', 'ASC']],
    });

    const transformedSubjects = subjects.map((subject) => ({
      subjectCode: subject.subjectCode,
      subjectName: subject.SubjectName,
      fee: subject.subjectFee,
    }));

    res.json(transformedSubjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update subject fee
router.put('/update-fee/:subjectCode', async (req, res) => {
  try {
    const { subjectCode } = req.params;
    const { fee } = req.body;

    if (!fee || isNaN(fee)) {
      return res.status(400).json({ message: 'Valid fee is required' });
    }

    const [updated] = await Subject.update(
      { subjectFee: parseFloat(fee) },
      { where: { subjectCode } }
    );

    if (updated) {
      const updatedSubject = await Subject.findOne({ where: { subjectCode } });
      return res.json({
        subjectCode: updatedSubject.subjectCode,
        subjectName: updatedSubject.SubjectName,
        fee: updatedSubject.subjectFee,
      });
    }

    res.status(404).json({ message: 'Subject not found' });
  } catch (error) {
    console.error('Error updating fee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ Delete subject (NEWLY ADDED)
router.delete('/delete-subject/:subjectCode', async (req, res) => {
  try {
    const { subjectCode } = req.params;

    const deleted = await Subject.destroy({ where: { subjectCode } });

    if (deleted) {
      return res.json({ message: 'Subject deleted successfully' });
    }

    res.status(404).json({ message: 'Subject not found' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
