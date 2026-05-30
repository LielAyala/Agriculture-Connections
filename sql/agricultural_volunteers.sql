-- מסד נתונים: חיבורים חקלאים ומתנדבים
CREATE DATABASE IF NOT EXISTS agricultural_volunteers CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE agricultural_volunteers;

-- טבלת משתמשים
CREATE TABLE IF NOT EXISTS users (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    username   VARCHAR(50)  NOT NULL UNIQUE,
    email      VARCHAR(100) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    role       ENUM('farmer','volunteer','admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- טבלת חקלאים
CREATE TABLE IF NOT EXISTS farmers (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL UNIQUE,
    name       VARCHAR(100) NOT NULL,
    phone      VARCHAR(15)  NOT NULL,
    location   VARCHAR(150) NOT NULL,
    dunams     FLOAT DEFAULT 0,
    crop_type  VARCHAR(100) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- טבלת מתנדבים
CREATE TABLE IF NOT EXISTS volunteers (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT NOT NULL UNIQUE,
    name         VARCHAR(100) NOT NULL,
    phone        VARCHAR(15)  NOT NULL,
    is_group     BOOLEAN DEFAULT FALSE,
    group_size   INT DEFAULT 1,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- טבלת התנדבויות
CREATE TABLE IF NOT EXISTS tasks (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id         INT NOT NULL,
    volunteer_id      INT DEFAULT NULL,
    title             VARCHAR(200) NOT NULL,
    description       TEXT,
    work_type         VARCHAR(100) NOT NULL,
    volunteers_needed INT DEFAULT 1,
    work_hours        VARCHAR(50) DEFAULT '',
    start_date        DATE NOT NULL,
    end_date          DATE NOT NULL,
    status            ENUM('open','assigned','completed','cancelled') DEFAULT 'open',
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id)    REFERENCES farmers(id)   ON DELETE CASCADE,
    FOREIGN KEY (volunteer_id) REFERENCES volunteers(id) ON DELETE SET NULL
);
