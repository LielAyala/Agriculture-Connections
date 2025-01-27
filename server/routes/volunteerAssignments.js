// הגדרת router עבור VolunteerAssignments
const express = require('express');
const db_pool = require('../database').pool;
const volunteerAssignmentsRouter = express.Router();

volunteerAssignmentsRouter.get('/A', (req, res) => {
    res.send('מתנדב ');
    console.log("  מתנדב ");
  });

// קריאת כל הפרטים של VolunteerAssignments
volunteerAssignmentsRouter.get('/all', (req, res) => {
    const query = "SELECT * FROM `VolunteerAssignments`";
    db_pool.query(query, (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.status(200).json(rows);
    });
});

// הוספת VolunteerAssignments חדש
volunteerAssignmentsRouter.post('/add', (req, res) => {
    const { VolunteerID, FarmerID, AssignmentDate, StartTime, EndTime, Status, Rating, Notes } = req.body;
    const query = `INSERT INTO VolunteerAssignments (VolunteerID, FarmerID, AssignmentDate, StartTime, EndTime, Status, Rating, Notes)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db_pool.query(query, [VolunteerID, FarmerID, AssignmentDate, StartTime, EndTime, Status, Rating, Notes], (err) => {
        if (err) {
            return res.status(500).json({ message: "Error adding assignment", error: err });
        }
        res.status(200).json({ message: "Assignment added successfully" });
    });
});

// עדכון VolunteerAssignments
volunteerAssignmentsRouter.patch('/edit', (req, res) => {
    const { ID, VolunteerID, FarmerID, AssignmentDate, StartTime, EndTime, Status, Rating, Notes } = req.body;
    const query = `UPDATE VolunteerAssignments SET VolunteerID = ?, FarmerID = ?, AssignmentDate = ?, StartTime = ?, EndTime = ?, Status = ?, Rating = ?, Notes = ? WHERE ID = ?`;
    db_pool.query(query, [VolunteerID, FarmerID, AssignmentDate, StartTime, EndTime, Status, Rating, Notes, ID], (err) => {
        if (err) {
            return res.status(500).json({ message: "Error updating assignment", error: err });
        }
        res.status(200).json({ message: "Assignment updated successfully" });
    });
});

// מחיקת VolunteerAssignments
volunteerAssignmentsRouter.delete('/delete', (req, res) => {
    const { ID } = req.body;
    const query = "DELETE FROM VolunteerAssignments WHERE ID = ?";
    db_pool.query(query, [ID], (err) => {
        if (err) {
            return res.status(500).json({ message: "Error deleting assignment", error: err });
        }
        res.status(200).json({ message: "Assignment deleted successfully" });
    });
});

module.exports = volunteerAssignmentsRouter;
