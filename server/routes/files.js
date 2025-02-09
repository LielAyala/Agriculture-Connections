// הגדרת router עבור Files
const express = require('express');
const multer = require('multer');
const path = require('path');
const db_pool = require('../database').pool;

const filesRouter = express.Router();
const fs = require('fs');

filesRouter.get('/A', (req, res) => {
    res.send('קובץ ');
    console.log("  קובץ ");
  });


  
  // הגדרת אחסון קבצים
  const storage = multer.diskStorage({
      destination: (req, file, cb) => {
          cb(null, 'uploads/'); // תיקייה שבה ישמרו הקבצים
      },
      filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, uniqueSuffix + path.extname(file.originalname)); // שם קובץ ייחודי
      }
  });
  
  const upload = multer({ storage: storage });
  
  // קריאת כל הקבצים
  filesRouter.get('/all', (req, res) => {
      const query = "SELECT * FROM `Files`";
      db_pool.query(query, (err, rows) => {
          if (err) {
              return res.status(500).json({ message: "Database error", error: err });
          }
          res.status(200).json(rows);
      });
  });
  
  // API להעלאת קובץ
  // API להעלאת קובץ עם תמיכה בסוגי קבצים שונים לפי סוג המשתמש
  filesRouter.post('/upload', upload.fields([
    { name: 'leaseContract', maxCount: 1 }, // מאפשר העלאת קובץ בשם "leaseContract" (מקסימום קובץ אחד)
    { name: 'declaration', maxCount: 1 }, // מאפשר העלאת קובץ בשם "declaration" (מקסימום קובץ אחד)
    { name: 'excelFile', maxCount: 1 } // מאפשר העלאת קובץ בשם "excelFile" (מקסימום קובץ אחד)
]), (req, res) => {
    // הדפסה למסוף כדי לבדוק את גוף הבקשה (השדות שנשלחו)
    console.log('Request Body:', req.body); 
    
    // הדפסה למסוף כדי לבדוק את הקבצים שהועלו
    console.log('Uploaded Files:', req.files); 

    // חילוץ נתונים מהבקשה
    const { userType, UploadedBy, VolunteerID, FarmerID, GroupID, VolunteerAssignmentID } = req.body;

    // בדיקה האם השדות החיוניים קיימים
    if (!userType || !UploadedBy) {
        console.error("Missing required fields: userType or UploadedBy");
        return res.status(400).json({ message: 'Missing required fields: userType or UploadedBy' });
    }

    // יצירת תאריך ושעה של ההעלאה
    const uploadedAt = new Date();

    // אם סוג המשתמש הוא חקלאי
    if (userType === 'Farmer') {
        // קבלת הקבצים שהועלו (אם קיימים)
        const leaseContract = req.files['leaseContract'] ? req.files['leaseContract'][0] : null;
        const declaration = req.files['declaration'] ? req.files['declaration'][0] : null;

        // בדיקה אם כל הקבצים הנדרשים הועלו
        if (!leaseContract || !declaration) {
            console.error("Missing required files for Farmer");
            return res.status(400).json({ message: 'Missing required files for Farmer' });
        }

        // הדפסת פרטי הקבצים למסוף
        console.log('Lease Contract:', leaseContract);
        console.log('Declaration:', declaration);

        // שאילתה להוספת פרטי הקבצים לטבלה "Files" במסד הנתונים
        const query = `
            INSERT INTO Files 
            (VolunteerID, FarmerID, GroupID, VolunteerAssignmentID, ReferenceType, FileName, FilePath, FileType, UploadedAt, UploadedBy)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // ביצוע השאילתה עם ערכים עבור שני הקבצים (חוזה חכירה והצהרה)
        db_pool.query(query, [
            VolunteerID, FarmerID, GroupID, VolunteerAssignmentID, 'LeaseContract', leaseContract.filename, leaseContract.path, leaseContract.mimetype, uploadedAt, UploadedBy,
            VolunteerID, FarmerID, GroupID, VolunteerAssignmentID, 'Declaration', declaration.filename, declaration.path, declaration.mimetype, uploadedAt, UploadedBy
        ], (err) => {
            if (err) {
                // במקרה של שגיאה במסד הנתונים
                console.error('Database Error:', err);
                return res.status(500).json({ message: 'Error saving files to database', error: err });
            }
            // החזרת תגובה למשתמש שהקבצים נשמרו בהצלחה
            res.status(200).json({ message: 'Files uploaded successfully for Farmer' });
        });

    // אם סוג המשתמש הוא קבוצה
    } else if (userType === 'Group') {
        // קבלת הקובץ שהועלה (אם קיים)
        const excelFile = req.files['excelFile'] ? req.files['excelFile'][0] : null;

        // בדיקה אם הקובץ הנדרש הועלה
        if (!excelFile) {
            console.error("Missing required file for Group");
            return res.status(400).json({ message: 'Missing required file for Group' });
        }

        // הדפסת פרטי הקובץ למסוף
        console.log('Excel File:', excelFile);

        // שאילתה להוספת פרטי הקובץ לטבלה "Files" במסד הנתונים
        const query = `
            INSERT INTO Files 
            (VolunteerID, FarmerID, GroupID, VolunteerAssignmentID, ReferenceType, FileName, FilePath, FileType, UploadedAt, UploadedBy)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // ביצוע השאילתה עם ערכים עבור הקובץ
        db_pool.query(query, [
            VolunteerID, FarmerID, GroupID, VolunteerAssignmentID, 'ExcelFile', excelFile.filename, excelFile.path, excelFile.mimetype, uploadedAt, UploadedBy
        ], (err) => {
            if (err) {
                // במקרה של שגיאה במסד הנתונים
                console.error('Database Error:', err);
                return res.status(500).json({ message: 'Error saving file to database', error: err });
            }
            // החזרת תגובה למשתמש שהקובץ נשמר בהצלחה
            res.status(200).json({ message: 'Excel file uploaded successfully for Group' });
        });
    } else {
        // אם סוג המשתמש אינו תקין
        console.error("Invalid userType:", userType);
        res.status(400).json({ message: 'Invalid userType. Must be "Farmer" or "Group"' });
    }
});




  module.exports = filesRouter;
  