-- FitTrack Database Setup
-- Run this file first to create the database and tables

CREATE DATABASE IF NOT EXISTS fittrack;
USE fittrack;

-- Users table: stores registered accounts
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workouts table: each row is one workout session logged by a user
CREATE TABLE IF NOT EXISTS workouts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    exercise_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,       -- e.g. Cardio, Strength, Flexibility
    sets INT DEFAULT NULL,
    reps INT DEFAULT NULL,
    duration_mins INT DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    workout_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
