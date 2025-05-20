const express = require('express');
const router = express.Router();
const db = require('../models'); // Assuming your models are properly set up

// Create Fee Record
router.post('/create', async (req, res) => {
  try {
    const { studentId, monthYear, totalAmount } = req.body;

    // Validate required fields
    if (!studentId || !monthYear || !totalAmount) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields: studentId, monthYear, or totalAmount' 
      });
    }

    // Check if fee record already exists for this student and month
    const existingRecord = await db.FeeRecord.findOne({
      where: {
        sid: studentId,
        monthYear: monthYear
      }
    });

    if (existingRecord) {
      return res.status(400).json({
        success: false,
        message: 'Fee record already exists for this student and month'
      });
    }

    // Create new fee record
    const newFeeRecord = await db.FeeRecord.create({
      sid: studentId,
      monthYear: monthYear,
      totalAmount: totalAmount
    });

    res.status(201).json({
      success: true,
      message: 'Fee record created successfully',
      data: newFeeRecord
    });
  } catch (error) {
    console.error('Error creating fee record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create fee record',
      error: error.message
    });
  }
});

// Get Fee Records by Student ID
// router.get('/student/:sid', async (req, res) => {
//   try {
//     const { sid } = req.params;
//     const feeRecords = await db.FeeRecord.findAll({
//       where: { sid },
//       order: [['monthYear', 'DESC']]
//     });

//     res.json({
//       success: true,
//       data: feeRecords
//     });
//   } catch (error) {
//     console.error('Error fetching fee records:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch fee records',
//       error: error.message
//     });
//   }
// });

module.exports = router;