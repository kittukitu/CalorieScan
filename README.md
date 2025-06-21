# CalorieScan

Tables
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE food_items (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    calories DECIMAL(10,2) NOT NULL,
    proteins DECIMAL(10,2) NOT NULL,
    carbohydrates DECIMAL(10,2) NOT NULL,
    fats DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    weight DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE usersettings (
    user_id INT NOT NULL PRIMARY KEY,
    chart_type VARCHAR(50),
    calories_color VARCHAR(50),
    protein_color VARCHAR(50),
    carbs_color VARCHAR(50),
    fats_color VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
