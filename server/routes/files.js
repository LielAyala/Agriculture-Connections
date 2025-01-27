// הגדרת router עבור Files
const express = require('express');
const db_pool = require('../database').pool;
const filesRouter = express.Router();

filesRouter.get('/A', (req, res) => {
    res.send('קובץ ');
    console.log("  קובץ ");
  });

// קריאת כל הפרטים של Files
filesRouter.get('/all', (req, res) => {
    const query = "SELECT * FROM `Files`";
    db_pool.query(query, (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.status(200).json(rows);
    });
});

// הוספת קובץ חדש
filesRouter.post('/add', (req, res) => {
    const { VolunteerID, FarmerID, GroupID, VolunteerAssignmentID, ReferenceType, FileName, FilePath, FileType, UploadedAt, UploadedBy } = req.body;
    const query = `INSERT INTO Files (VolunteerID, FarmerID, GroupID, VolunteerAssignmentID, ReferenceType, FileName, FilePath, FileType, UploadedAt, UploadedBy)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db_pool.query(query, [VolunteerID, FarmerID, GroupID, VolunteerAssignmentID, ReferenceType, FileName, FilePath, FileType, UploadedAt, UploadedBy], (err) => {
        if (err) {
            return res.status(500).json({ message: "Error adding file", error: err });
        }
        res.status(200).json({ message: "File added successfully" });
    });
});

// עדכון קובץ
filesRouter.patch('/edit', (req, res) => {
    const { ID, VolunteerID, FarmerID, GroupID, VolunteerAssignmentID, ReferenceType, FileName, FilePath, FileType, UploadedAt, UploadedBy } = req.body;
    const query = `UPDATE Files SET VolunteerID = ?, FarmerID = ?, GroupID = ?, VolunteerAssignmentID = ?, ReferenceType = ?, FileName = ?, FilePath = ?, FileType = ?, UploadedAt = ?, UploadedBy = ? WHERE ID = ?`;
    db_pool.query(query, [VolunteerID, FarmerID, GroupID, VolunteerAssignmentID, ReferenceType, FileName, FilePath, FileType, UploadedAt, UploadedBy, ID], (err) => {
        if (err) {
            return res.status(500).json({ message: "Error updating file", error: err });
        }
        res.status(200).json({ message: "File updated successfully" });
    });
});

// מחיקת קובץ
filesRouter.delete('/delete', (req, res) => {
    const { ID } = req.body;
    const query = "DELETE FROM Files WHERE ID = ?";
    db_pool.query(query, [ID], (err) => {
        if (err) {
            return res.status(500).json({ message: "Error deleting file", error: err });
        }
        res.status(200).json({ message: "File deleted successfully" });
    });
});

module.exports = filesRouter;
