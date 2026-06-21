"""
StayEase Database - System Design Project (B.Tech)
Author: B.Tech Student
Description: SQLite Database initialization, table definitions, and helper functions
             for StayEase Intelligent Hotel Booking System. Highly commented for viva.
"""

import sqlite3
import os

# Define the database path
DB_PATH = os.path.join(os.path.dirname(__file__), "..", "database", "stayease.db")

def get_connection():
    """
    Function: Connects to the SQLite database and returns the connection object
    Input: None
    Output: sqlite3.Connection object
    Logic:
        Step 1: Check if the target database directory exists; if not, create it.
        Step 2: Connect to the SQLite file using sqlite3.connect().
        Step 3: Enable foreign keys to maintain referential integrity.
        Step 4: Return the connection reference.
    """
    db_dir = os.path.dirname(DB_PATH)
    if db_dir and not os.path.exists(db_dir):
        os.makedirs(db_dir)
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Access columns by name like dictionary
    
    # Enable foreign keys for relation maintenance
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


def create_schema():
    """
    Function: Creates the physical data tables for StayEase (Users, Hotels, Rooms, Bookings, Payments)
    Input: None
    Output: Boolean (True if successful, False otherwise)
    Logic:
        Step 1: Establish connection using get_connection().
        Step 2: Write separate SQL DDL commands with appropriate primary/foreign keys and constraints.
        Step 3: Execute table creations sequentially.
        Step 4: Commit changes to persist the schema structure.
        Step 5: Close connection and return True.
    """
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        print("[INIT] Creating StayEase SQLite Tables...")
        
        # 1. Users Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS Users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        );
        """)
        
        # 2. Hotels Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS Hotels (
            hotel_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            location TEXT NOT NULL,
            rating REAL NOT NULL CHECK(rating >= 1.0 AND rating <= 5.0)
        );
        """)
        
        # 3. Rooms Table
        # availability: 1 = Available, 0 = Booked
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS Rooms (
            room_id INTEGER PRIMARY KEY AUTOINCREMENT,
            hotel_id INTEGER,
            room_type TEXT NOT NULL,
            price REAL NOT NULL,
            availability INTEGER DEFAULT 1,
            FOREIGN KEY(hotel_id) REFERENCES Hotels(hotel_id) ON DELETE CASCADE
        );
        """)
        
        # 4. Bookings Table
        # booking_status: 'CONFIRMED', 'CANCELLED', 'PENDING'
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS Bookings (
            booking_id TEXT PRIMARY KEY,
            user_id INTEGER,
            room_id INTEGER,
            check_in TEXT NOT NULL,
            check_out TEXT NOT NULL,
            booking_status TEXT DEFAULT 'CONFIRMED',
            FOREIGN KEY(user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
            FOREIGN KEY(room_id) REFERENCES Rooms(room_id) ON DELETE CASCADE
        );
        """)
        
        # 5. Payments Table
        # payment_status: 'SUCCESS', 'REFUNDED', 'FAILED'
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS Payments (
            payment_id TEXT PRIMARY KEY,
            booking_id TEXT,
            amount REAL NOT NULL,
            payment_status TEXT NOT NULL,
            FOREIGN KEY(booking_id) REFERENCES Bookings(booking_id) ON DELETE CASCADE
        );
        """)
        
        conn.commit()
        print("[SUCCESS] All tables created successfully!")
        return True
        
    except sqlite3.Error as e:
        print(f"[ERROR] Database schemas failed: {e}")
        return False
    finally:
        if conn:
            conn.close()


def seed_sample_data():
    """
    Function: Seeds the database with premium hotels and luxurious rooms for demonstration.
    Input: None
    Output: None
    Logic:
        Step 1: Open database connection.
        Step 2: Check if hotels are already seeded to prevent duplicate inserts.
        Step 3: Define 5 luxury hotels (location and star-ratings matching the system spec).
        Step 4: Loop and insert each hotel; retrieve its dynamic primary key hotel_id.
        Step 5: For each hotel, register 4 luxury room configurations with distinct room ID, types, prices, and default to Available (1).
        Step 6: Insert sample users (including an Administrator accounts).
        Step 7: Commit transactions and close connections.
    """
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        # Verify if hotels already exist
        cursor.execute("SELECT COUNT(*) FROM Hotels;")
        if cursor.fetchone()[0] > 0:
            print("[INFO] Database already populated with records. Skipping seed.")
            return
            
        print("[SEED] Seeding StayEase luxury items...")
        
        # Insert Hotels
        hotels = [
            ("Grand Oasis Resort", "Miami", 4.9),
            ("The Ritz-Carlton Palace", "Paris", 4.8),
            ("Zen Garden Sanctuary", "Kyoto", 4.7),
            ("Skyline View Suites", "New York", 4.6),
            ("The Alpine Retreat", "Zermatt", 4.9)
        ]
        
        for name, location, rating in hotels:
            cursor.execute(
                "INSERT INTO Hotels (name, location, rating) VALUES (?, ?, ?);",
                (name, location, rating)
            )
            hotel_id = cursor.lastrowid
            
            # Insert Rooms for each hotel
            rooms = [
                (hotel_id, "Deluxe King Room", 250.00, 1),
                (hotel_id, "Executive Ocean View Suite", 450.00, 1),
                (hotel_id, "Royal Penthouse Suite", 1200.00, 1),
                (hotel_id, "Twin Standard Room", 150.00, 1)
            ]
            cursor.executemany(
                "INSERT INTO Rooms (hotel_id, room_type, price, availability) VALUES (?, ?, ?, ?);",
                rooms
            )
            
        # Seed premium users
        users = [
            ("Admin User", "admin@stayease.com", "admin123"),
            ("Aarav Sharma", "aarav@stayease.com", "password123"),
            ("Ananya Patel", "ananya@stayease.com", "password123")
        ]
        cursor.executemany(
            "INSERT INTO Users (name, email, password) VALUES (?, ?, ?);",
            users
        )
        
        conn.commit()
        print("[SUCCESS] Seeding operations completed successfully!")
        
    except sqlite3.Error as e:
        print(f"[ERROR] Database seeding failed: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    # If run directly, recreate the db from scratch and seed it
    create_schema()
    seed_sample_data()
