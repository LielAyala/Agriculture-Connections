const express = require('express');
const router = express.Router();
const db_pool = require('../database').pool; // חיבור למסד הנתונים

router.get('/A', (req, res) => {
  res.send('חקלאי ');
  console.log(" הגעה לחקלאי ");
});


// הגדרת נתיב לכל החקלאים
router.get('/All', async (req, res) => {
  try {
    const [results] = await db_pool.execute('SELECT * FROM FarmerDetails');
    res.json(results);
  } catch (err) {
    return res.status(500).send('Database error');
  }
});

// הגדרת נתיב לחקלאי אחד לפי ID
router.get('/oneFarmer/:id', async (req, res) => {
  const farmerId = req.params.id;
  try {
    const [results] = await db_pool.execute('SELECT * FROM FarmerDetails WHERE ID = ?', [farmerId]);
    if (results.length === 0) {
      return res.status(404).send('Farmer not found');
    }
    res.json(results[0]);
  } catch (err) {
    return res.status(500).send('Database error');
  }
});

// הוספת חקלאי חדש
router.post('/Add', async (req, res) => {
  const { Name, FarmName, Telephone, Email, Address, QuantityOfDunams, WorkingDays, BriefExplanationOfWork, IDNumber, RelevantStartTime, RelevantEndTime, DesiredVolunteersCount, ACTIV } = req.body;
  try {
    await db_pool.execute('INSERT INTO FarmerDetails (Name, FarmName, Telephone, Email, Address, QuantityOfDunams, WorkingDays, BriefExplanationOfWork, IDNumber, RelevantStartTime, RelevantEndTime, DesiredVolunteersCount, ACTIV) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [Name, FarmName, Telephone, Email, Address, QuantityOfDunams, WorkingDays, BriefExplanationOfWork, IDNumber, RelevantStartTime, RelevantEndTime, DesiredVolunteersCount, ACTIV]);
    res.status(201).send('Farmer added successfully');
  } catch (err) {
    return res.status(500).send('Database error');
  }
});

module.exports = router;
