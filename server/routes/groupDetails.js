// הגדרת router עבור GroupDetails
const express = require('express');
const groupDetailsRouter = express.Router();
const db_pool = require('../database').pool;

groupDetailsRouter.get('/A', (req, res) => {
    res.send('קבוצה ');
    console.log("  קבוצה ");
  });

// קריאת כל הפרטים של GroupDetails
groupDetailsRouter.get('/all', (req, res) => {
    const query = "SELECT * FROM `GroupDetails`";
    db_pool.query(query, (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.status(200).json(rows);
    });
});

// הוספת GroupDetails חדש
groupDetailsRouter.post('/add', (req, res) => {
    const { Name, NameOfResponsible, Phone, GroupQuantity, DateRange, RelevantStartTime, RelevantEndTime, PreferredArea, AgeRange, PermanentVolunteeringInterest, ACTIV } = req.body;
    const query = `INSERT INTO GroupDetails (Name, NameOfResponsible, Phone, GroupQuantity, DateRange, RelevantStartTime, RelevantEndTime, PreferredArea, AgeRange, PermanentVolunteeringInterest, ACTIV)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db_pool.query(query, [Name, NameOfResponsible, Phone, GroupQuantity, DateRange, RelevantStartTime, RelevantEndTime, PreferredArea, AgeRange, PermanentVolunteeringInterest, ACTIV], (err) => {
        if (err) {
            return res.status(500).json({ message: "Error adding group", error: err });
        }
        res.status(200).json({ message: "Group added successfully" });
    });
});

// עדכון GroupDetails
groupDetailsRouter.patch('/edit', (req, res) => {
    const { ID, Name, NameOfResponsible, Phone, GroupQuantity, DateRange, RelevantStartTime, RelevantEndTime, PreferredArea, AgeRange, PermanentVolunteeringInterest, ACTIV } = req.body;
    const query = `UPDATE GroupDetails SET Name = ?, NameOfResponsible = ?, Phone = ?, GroupQuantity = ?, DateRange = ?, RelevantStartTime = ?, RelevantEndTime = ?, PreferredArea = ?, AgeRange = ?, PermanentVolunteeringInterest = ?, ACTIV = ? WHERE ID = ?`;
    db_pool.query(query, [Name, NameOfResponsible, Phone, GroupQuantity, DateRange, RelevantStartTime, RelevantEndTime, PreferredArea, AgeRange, PermanentVolunteeringInterest, ACTIV, ID], (err) => {
        if (err) {
            return res.status(500).json({ message: "Error updating group", error: err });
        }
        res.status(200).json({ message: "Group updated successfully" });
    });
});

// מחיקת GroupDetails
groupDetailsRouter.delete('/delete', (req, res) => {
    const { ID } = req.body;
    const query = "DELETE FROM GroupDetails WHERE ID = ?";
    db_pool.query(query, [ID], (err) => {
        if (err) {
            return res.status(500).json({ message: "Error deleting group", error: err });
        }
        res.status(200).json({ message: "Group deleted successfully" });
    });
});

module.exports = groupDetailsRouter;
