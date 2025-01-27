// הגדרת router עבור SystemMetrics
const express = require('express');
const db_pool = require('../database').pool;
const systemMetricsRouter = express.Router();

systemMetricsRouter.get('/A', (req, res) => {
    res.send('מערכת ');
    console.log("  מערכת  ");
  });

// קריאת כל הפרטים של SystemMetrics
systemMetricsRouter.get('/all', (req, res) => {
    const query = "SELECT * FROM `SystemMetrics`";
    db_pool.query(query, (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.status(200).json(rows);
    });
});

// הוספת SystemMetrics חדש
systemMetricsRouter.post('/add', (req, res) => {
    const { Date, FarmersReceivedAssistance, FarmersDidNotReceiveAssistance, FarmersRegistered, FarmersSentForm, FarmersSentStatement, GroupsRegistered, GroupsLeft, GroupsWantPermanentVolunteering, QuantityOfDunamsForContract, FarmerID, GroupID, VolunteerID } = req.body;
    const query = `INSERT INTO SystemMetrics (Date, FarmersReceivedAssistance, FarmersDidNotReceiveAssistance, FarmersRegistered, FarmersSentForm, FarmersSentStatement, GroupsRegistered, GroupsLeft, GroupsWantPermanentVolunteering, QuantityOfDunamsForContract, FarmerID, GroupID, VolunteerID)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db_pool.query(query, [Date, FarmersReceivedAssistance, FarmersDidNotReceiveAssistance, FarmersRegistered, FarmersSentForm, FarmersSentStatement, GroupsRegistered, GroupsLeft, GroupsWantPermanentVolunteering, QuantityOfDunamsForContract, FarmerID, GroupID, VolunteerID], (err) => {
        if (err) {
            return res.status(500).json({ message: "Error adding system metrics", error: err });
        }
        res.status(200).json({ message: "System metrics added successfully" });
    });
});

// עדכון SystemMetrics
systemMetricsRouter.patch('/edit', (req, res) => {
    const { ID, Date, FarmersReceivedAssistance, FarmersDidNotReceiveAssistance, FarmersRegistered, FarmersSentForm, FarmersSentStatement, GroupsRegistered, GroupsLeft, GroupsWantPermanentVolunteering, QuantityOfDunamsForContract, FarmerID, GroupID, VolunteerID } = req.body;
    const query = `UPDATE SystemMetrics SET Date = ?, FarmersReceivedAssistance = ?, FarmersDidNotReceiveAssistance = ?, FarmersRegistered = ?, FarmersSentForm = ?, FarmersSentStatement = ?, GroupsRegistered = ?, GroupsLeft = ?, GroupsWantPermanentVolunteering = ?, QuantityOfDunamsForContract = ?, FarmerID = ?, GroupID = ?, VolunteerID = ? WHERE ID = ?`;
    db_pool.query(query, [Date, FarmersReceivedAssistance, FarmersDidNotReceiveAssistance, FarmersRegistered, FarmersSentForm, FarmersSentStatement, GroupsRegistered, GroupsLeft, GroupsWantPermanentVolunteering, QuantityOfDunamsForContract, FarmerID, GroupID, VolunteerID, ID], (err) => {
        if (err) {
            return res.status(500).json({ message: "Error updating system metrics", error: err });
        }
        res.status(200).json({ message: "System metrics updated successfully" });
    });
});

// מחיקת SystemMetrics
systemMetricsRouter.delete('/delete', (req, res) => {
    const { ID } = req.body;
    const query = "DELETE FROM SystemMetrics WHERE ID = ?";
    db_pool.query(query, [ID], (err) => {
        if (err) {
            return res.status(500).json({ message: "Error deleting system metrics", error: err });
        }
        res.status(200).json({ message: "System metrics deleted successfully" });
    });
});

module.exports = systemMetricsRouter;
