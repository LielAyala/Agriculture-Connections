// הגדרת router עבור GroupVolunteerMapping
const express = require('express');
const db_pool = require('../database').pool;
const groupVolunteerMappingRouter = express.Router();

groupVolunteerMappingRouter.get('/A', (req, res) => {
    res.send('1קבוצה ');
    console.log("  1קבוצה ");
  });

// קריאת כל הפרטים של GroupVolunteerMapping
groupVolunteerMappingRouter.get('/all', (req, res) => {
    const query = "SELECT * FROM `GroupVolunteerMapping`";
    db_pool.query(query, (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.status(200).json(rows);
    });
});

// הוספת GroupVolunteerMapping חדש
groupVolunteerMappingRouter.post('/add', (req, res) => {
    const { GroupID, VolunteerID, DateAssigned, Status, Notes, StartTime, EndTime, Rating } = req.body;
    const query = `INSERT INTO GroupVolunteerMapping (GroupID, VolunteerID, DateAssigned, Status, Notes, StartTime, EndTime, Rating)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db_pool.query(query, [GroupID, VolunteerID, DateAssigned, Status, Notes, StartTime, EndTime, Rating], (err) => {
        if (err) {
            return res.status(500).json({ message: "Error adding group-volunteer mapping", error: err });
        }
        res.status(200).json({ message: "Group-volunteer mapping added successfully" });
    });
});

// עדכון GroupVolunteerMapping
groupVolunteerMappingRouter.patch('/edit', (req, res) => {
    const { ID, GroupID, VolunteerID, DateAssigned, Status, Notes, StartTime, EndTime, Rating } = req.body;
    const query = `UPDATE GroupVolunteerMapping SET GroupID = ?, VolunteerID = ?, DateAssigned = ?, Status = ?, Notes = ?, StartTime = ?, EndTime = ?, Rating = ? WHERE ID = ?`;
    db_pool.query(query, [GroupID, VolunteerID, DateAssigned, Status, Notes, StartTime, EndTime, Rating, ID], (err) => {
        if (err) {
            return res.status(500).json({ message: "Error updating group-volunteer mapping", error: err });
        }
        res.status(200).json({ message: "Group-volunteer mapping updated successfully" });
    });
});

// מחיקת GroupVolunteerMapping
groupVolunteerMappingRouter.delete('/delete', (req, res) => {
    const { ID } = req.body;
    const query = "DELETE FROM GroupVolunteerMapping WHERE ID = ?";
    db_pool.query(query, [ID], (err) => {
        if (err) {
            return res.status(500).json({ message: "Error deleting group-volunteer mapping", error: err });
        }
        res.status(200).json({ message: "Group-volunteer mapping deleted successfully" });
    });
});

module.exports = groupVolunteerMappingRouter;
