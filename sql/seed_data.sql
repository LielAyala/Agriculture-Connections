USE agricultural_volunteers;

-- ניקוי נתונים קיימים (אם יש)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE tasks;
TRUNCATE TABLE volunteers;
TRUNCATE TABLE farmers;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- משתמשים
INSERT INTO users (username, email, password, role) VALUES
('admin1',    'admin@agri.com',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('moshe_k',   'moshe@farm.com',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'farmer'),
('yosef_l',   'yosef@farm.com',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'farmer'),
('rivka_s',   'rivka@farm.com',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'farmer'),
('dani_m',    'dani@farm.com',       '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'farmer'),
('avi_cohen', 'avi@farm.com',        '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'farmer'),
('tnuva_v',   'tnuva@vol.com',       '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'volunteer'),
('tzahal_g',  'tzahal@vol.com',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'volunteer'),
('bnei_akiva','bnei@vol.com',        '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'volunteer'),
('lior_p',    'lior@vol.com',        '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'volunteer');

-- חקלאים
INSERT INTO farmers (user_id, name, phone, location, dunams, crop_type) VALUES
(2, 'משה כהן',   '0521234567', 'גליל עליון',    80,  'ענבים'),
(3, 'יוסף לוי',  '0534567890', 'עמק יזרעאל',   120, 'חיטה ושעורה'),
(4, 'רבקה שמיר', '0547891234', 'נגב צפוני',     60,  'עגבניות ופלפלים'),
(5, 'דני מזרחי', '0551234560', 'שרון',          95,  'הדרים'),
(6, 'אבי כהן',   '0561234567', 'גולן',          75,  'תפוחים ואגסים');

-- מתנדבים
INSERT INTO volunteers (user_id, name, phone, is_group, group_size) VALUES
(7,  'תנובה מתנדבים',    '0521111111', TRUE,  25),
(8,  'קבוצת צהל',        '0532222222', TRUE,  40),
(9,  'בני עקיבא ירושלים','0543333333', TRUE,  18),
(10, 'ליאור פרידמן',     '0554444444', FALSE,  1);

-- התנדבויות (שונות - פתוחות, שובצו, הושלמו)
INSERT INTO tasks (farmer_id, volunteer_id, title, description, work_type, volunteers_needed, work_hours, start_date, end_date, status, created_at) VALUES
-- הושלמו
(1, 1, 'בציר ענבים עונת 2025',    'בציר ידני של כרמי מרלו',     'קציר',  20, '06:00-12:00', '2025-09-10', '2025-09-12', 'completed', DATE_SUB(NOW(), INTERVAL 20 DAY)),
(2, 2, 'קציר חיטה שדה צפוני',     'קציר ידני לפני הקומבין',      'קציר',  35, '07:00-13:00', '2025-06-01', '2025-06-02', 'completed', DATE_SUB(NOW(), INTERVAL 15 DAY)),
(3, 3, 'שתילת עגבניות',           'שתילה ידנית בשורות מוכנות',   'שתילה', 15, '07:30-11:30', '2025-10-05', '2025-10-06', 'completed', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(5, 4, 'קטיף תפוחים גולן',        'קטיף עדין של תפוחי גרנד סמית','קטיף',   1, '08:00-15:00', '2025-11-01', '2025-11-03', 'completed', DATE_SUB(NOW(), INTERVAL 5 DAY)),

-- שובצו (בתהליך)
(4, 1, 'ניכוש שדות השרון',        'פינוי עשבים בין השורות',       'ניכוש', 20, '07:00-12:00', '2025-12-10', '2025-12-11', 'assigned',  DATE_SUB(NOW(), INTERVAL 3 DAY)),
(2, 2, 'קציר שעורה עמק יזרעאל',  'שדה של 30 דונם צפון המשק',     'קציר',  30, '06:30-13:00', '2025-12-15', '2025-12-16', 'assigned',  DATE_SUB(NOW(), INTERVAL 2 DAY)),

-- פתוחות - ממתינות למתנדבים
(1, NULL, 'כינוס ענפי גפן לחורף', 'כיסוח וסידור ענפים לקראת חורף','אחר',  10, '08:00-13:00', '2025-12-20', '2025-12-21', 'open', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(3, NULL, 'השקיית שדות פלפלים',   'חיבור צינורות והשקיה ידנית',   'השקיה',  8, '06:00-10:00', '2025-12-22', '2025-12-22', 'open', NOW()),
(5, NULL, 'קטיף אגסים גולן',      'קטיף עדין ואריזה לשוק',        'קטיף',  15, '07:00-14:00', '2025-12-25', '2025-12-27', 'open', NOW());
