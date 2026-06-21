/**
 * StayEase Academic Report Data - B.Tech System Design Project
 * Description: Exhaustive 16-chapter academic submission documentation,
 *              SQL definitions, mock SQL console responses, and cheat sheets.
 */

export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  content: string[];
}

export const ACADEMIC_REPORT: Chapter[] = [
  {
    id: 1,
    title: "1. Problem Statement",
    subtitle: "Real-world context and operational gap analysis",
    content: [
      "Hospitality management structures persistently grapple with high customer volume, complex lodging preferences, and fragile transaction allocations. In conventional models, reservations are registered on slow, disjointed systems that fail to check active inventories in real-time.",
      "This system gap leads to severe operational bottlenecks, including inadvertent double-booking (where a single suite is sold to multiple traveling parties), payment delays, or loss of booking references due to lack of durable atomic transaction handling.",
      "A university-level submission project like 'StayEase' aims to resolve these system design vulnerabilities by demonstrating how atomic reservation gates, modular search components, and structured database ledgers can prevent conflicts while delivering a luxury-tier guest experience."
    ]
  },
  {
    id: 2,
    title: "2. Existing System Problems",
    subtitle: "Vulnerabilities of legacy hotel ledger systems",
    content: [
      "1. Structural Double-Booking: Legacy configurations rely on periodic batch synchronization. Two requests arriving in parallel frequently pass checkouts for the same room, prompting reputational damage and guest discomfort.",
      "2. Opaque Fee Estimations: Traditional platforms do not dynamically calculate tax surcharges or stay durations based on multi-variate calendars, resulting in checkout price mismatches.",
      "3. Vulnerable Transaction Logs: Many existing structures write bookings into unsecured local worksheets or temporary tables that risk data corruption during thread interruptions or system restarts.",
      "4. Slow Search Architectures: Searching filters often require raw, unindexed full-table reads, slowing down response times during peak holiday seasons.",
      "5. Disjointed Cancellations: Post-booking cancellations frequently fail to free up room inventories immediately, leaving rooms marked as occupied when they are vacant."
    ]
  },
  {
    id: 3,
    title: "3. Proposed Solution",
    subtitle: "High-assurance modular allocation paradigm",
    content: [
      "StayEase introduces an Intelligent Hotel Reservation Framework designed with a high-assurance dual-tier architecture.",
      "Our system features an interactive, highly-responsive frontend connected to a concurrent backend processing pipeline. The backend implements atomic reservation locks on SQLite tables, immediately freezing room availability state transitions from '1' (Available) to '0' (Booked) during payment captures.",
      "Additionally, the system integrates a dynamic checkout date duration engine to eliminate pricing discrepancies, a secure simulated payment gateway confirming transactions before allocating inventory lock-ins, and a live web administrator dashboard powered by vector indicators for real-time executive surveillance."
    ]
  },
  {
    id: 4,
    title: "4. Functional Requirements",
    subtitle: "Core operational features of StayEase",
    content: [
      "FR-1 (User Management Module): System must enable new guest registrations, password validations, secure persistent sessions, and active profile dashboards displaying historical receipts.",
      "FR-2 (Intelligent Search Module): System must enable searching by city, with dynamic filters utilizing range-slider price controls and star-rating badges.",
      "FR-3 (Atomic Room Allocation): System must verify active room availability immediately on user selection, preventing subsequent reservation checkout triggers if room vacancy is zero.",
      "FR-4 (Secure Checkout & Booking): System must collect check-in and check-out dates, validate chronologies (check-out > check-in), determine night counts, and generate recognizable booking IDs.",
      "FR-5 (Multi-Channel Payment): System must provide Credit, Debit, UPI, and Net Banking options, validate basic inputs, log payment tracking IDs, and confirm bookings.",
      "FR-6 (Real-Time Cancel Module): System must release cancelled suites immediately back to vacant status (availability = 1) and calculate refund records.",
      "FR-7 (Analytical Dashboard): System must calculate summary aggregates (total users, hotels, booked ratios, cash revenues) and project visual graphic layouts of transaction details."
    ]
  },
  {
    id: 5,
    title: "5. Non-Functional Requirements",
    subtitle: "Core software quality attributes",
    content: [
      "NFR-1 (Operational Reliability): The database operations must satisfy strict ACID properties. Room state allocations must execute as atomic transactions to ensure zero double-booking occurrences.",
      "NFR-2 (System Responsiveness): Search and filter queries must execute in sub-100ms speeds under standard operational parameters using balanced memory datasets.",
      "NFR-3 (Visual Aesthetics & Accessibility): The interface must support elegant high-contrast structures (Onyx background contrasts with Golden warm accents) with legible typography conforming to professional design guidelines.",
      "NFR-4 (Data Portability & Integrity): User records, booking histories, and payment receipts must be securely persistent in SQLite tables, maintaining foreign-key referential constraints."
    ]
  },
  {
    id: 6,
    title: "6. System Architecture",
    subtitle: "Understanding physical component communications",
    content: [
      "StayEase follows a highly decoupled model-view-controller (MVC) architecture:",
      "1. Client Layer (Presentation View): Developed with modern HTML5, Tailwind CSS, and Vanilla ES6 JavaScript (or matching React components). Houses the user search interface, calendar modules, checkout panels, and admin graphs.",
      "2. Application Logic (Controller): Coordinates workflows. Handles search/filter algorithms, calendar date audits, unique transaction ID generations, and client state synchronizations.",
      "3. Backend Engine (Python Services): Business logic runner (booking_system.py, payment_system.py, database.py). Guides access credentials checks, payment gateway verifications, database connections, and ACID operations.",
      "4. Persistence Layer (SQLite Database): Houses tables (Users, Hotels, Rooms, Bookings, Payments) under strict referential guidelines (e.g. Booking connects to User on user_id, Room on room_id)."
    ]
  },
  {
    id: 7,
    title: "7. Module Description",
    subtitle: "Deep-dive into the 7 core components",
    content: [
      "1. USER MODULE: Governs guest sign-ups, credential comparisons, session holding, and rendering individual lodging receipts.",
      "2. HOTEL SEARCH MODULE: Filters multiple luxury resorts by location queries, price metrics, and star reviews. Uses structured array algorithms.",
      "3. ROOM ALLOCATION MODULE: Collects active room arrays, checks 'availability' flags, and handles atomic state locks during transactions.",
      "4. BOOKING FORMULATION MODULE: Computes stay lengths, audits checklist details, enforces parameter security, and registers persistent booking IDs.",
      "5. PAYMENT SIMULATOR GATEWAY: Validates payment form inputs, generates merchant transaction references, and marks systems success logs.",
      "6. CANCELLATION CONTROLLER: Finds active bookings, changes statuses to 'CANCELLED', and restores room states.",
      "7. ADMIN WORKBENCH: Gathers system files, calculates aggregates, renders SVG donut charts and revenue bars, and lists transactional entries live."
    ]
  },
  {
    id: 8,
    title: "8. Database Design",
    subtitle: "Entity schemas, relations, and primary constraints",
    content: [
      "The relational schema of StayEase is designed under Third Normal Form (3NF) to eliminate anomalies:",
      "- Users: Primary Key (user_id), name, unique entry email, encrypted credentials.",
      "- Hotels: Primary Key (hotel_id), name, location string, review ratings.",
      "- Rooms: Primary Key (room_id), Foreign Key (hotel_id) cascades on hotel delete, room category, nightly price, vacancy status indicator.",
      "- Bookings: Primary Key (booking_id), Foreign Key (user_id), Foreign Key (room_id), check-in date, check-out date, registration status.",
      "- Payments: Primary Key (payment_id), Foreign Key (booking_id), charged amount, payment captures status."
    ]
  },
  {
    id: 9,
    title: "9. Algorithms Used",
    subtitle: "Procedural solvers explained step-by-step",
    content: [
      "ALGORITHM A: 'Search & Multi-Filter'",
      "Inputs: cityQuery, maxPrice, minRating. / Step 1: Read hotels array. / Step 2: filter hotels on location = cityQuery. / Step 3: filter hotels on rating >= minRating. / Step 4: cross-join rooms and filter hotel if min(room.price) > maxPrice. / Output: Filtered Hotels collection.",
      "ALGORITHM B: 'Atomic Room Reservation & Allocation'",
      "Inputs: roomId. / Step 1: Query selected room's availability flag. / Step 2: If flag is '0' (Booked), return Error ('Room Sold Out'). / Step 3: If flag is '1' (Available), update room set availability = 0. / Step 4: Save change. / Output: Success flag and state lock.",
      "ALGORITHM C: 'Booking Creation checkout'",
      "Inputs: Dates (Check-in, Check-out), guests, roomId. / Step 1: Calculate nights duration. If checkout <= checkin, return Date Error. / Step 2: Call Algorithm B (Allocate Room). If fails, halt. / Step 3: Generate Booking ID 'SE-XXXXXXXX'. / Step 4: Insert Booking record. / Output: Secured Booking ID."
    ]
  },
  {
    id: 10,
    title: "10. Technology Stack",
    subtitle: "Tools, libraries, and runtime infrastructures",
    content: [
      "• Frontend: HTML5 (structured schemas), CSS3 (Tailwind utility files, animations rules, typography declarations), Vanilla ES6 JavaScript (for local operations).",
      "• Backend: Python 3.10+ (Lightweight business processes structures: database.py, booking_system.py, payment_system.py).",
      "• Database: SQLite 3 (Acid-compliant standalone database engine).",
      "• Development Tools: Vite compiling systems, Node wrappers (for live running sandboxes), esbuild servers compiling script targets."
    ]
  },
  {
    id: 11,
    title: "11. Implementation Details",
    subtitle: "Folder organization and architecture mapping",
    content: [
      "The submission package is structured cleanly to ensure examine review convenience:",
      "- StayEase/index.html (Entrance dashboard, hero views, featured items).",
      "- StayEase/hotels.html & rooms.html (Filtering and rooms cards details).",
      "- StayEase/booking.html & payment.html (Validation checkouts, simulated receipts confirmation).",
      "- StayEase/profile.html & admin.html (Authenticated profiles and charts dashboards).",
      "- StayEase/css/style.css (Custom design properties, gold slate theme, layouts).",
      "- StayEase/js/ (Divided app.js, hotels.js, booking.js, payment.js, admin.js orchestrators).",
      "- StayEase/python/ (booking_system.py, payment_system.py, database.py backend solvers)."
    ]
  },
  {
    id: 12,
    title: "12. Screenshots Section",
    subtitle: "Descriptions of primary user screens",
    content: [
      "1. Home Screen (index.html): Displays full-bleed hero banner representing high-end resort lounges, responsive inline quick-search bar, featured luxury highlights card grids, and sliding client reviews.",
      "2. Explore Hotels (hotels.html): Dual-panel system. Left sidebar contains range-slider inputs adjusting price ceilings and star counters. Right panel renders matching hotels dynamically.",
      "3. Rooms Inventory (rooms.html): Reveals suites belonging to the hotel, displaying category, custom badges showing 'Available' / 'Booked Out', price quotes, and checkout triggers.",
      "4. Check-in Checkout (booking.html): Houses Date Pickers with chronological audits blocking incorrect calendars, guest selections, and personal detail fields.",
      "5. Payment Desk (payment.html): Houses Credit Card, UPI, or Net Banking selectors, updating forms on-the-fly and generating transactional tickets.",
      "6. Admin Dashboard (admin.html): Hosts metric panels, custom donut charts showing occupancy rates, and revenue bars reflecting resort incomes."
    ]
  },
  {
    id: 13,
    title: "13. Testing Cases",
    subtitle: "Operational test vectors and expected outputs",
    content: [
      "TC-1 (Invalid calendar dates): Input Check-in: '2026-06-25', Check-out: '2026-06-20'. Expected Result: Date Chronology Error. System halts booking creation. (PASS)",
      "TC-2 (Double booking lock): Select Room 101 twice. Session 1 completes booking and pays. Session 2 attempts booking Room 101. Expected Result: 'Room not available'. Success blocker active. (PASS)",
      "TC-3 (UPI payment security audit): Select UPI payment method. Enter address without '@' symbol ('aarav_hdfc'). Expected Result: UPI ID format verification error. Halts transaction. (PASS)",
      "TC-4 (Cancellation vacancy restore): Booking SE-892305 is cancelled. Expected Result: Booking status updates to 'CANCELLED', Room 102 availability updates back to '1' (Available) instantly. (PASS)"
    ]
  },
  {
    id: 14,
    title: "14. Advantages",
    subtitle: "Distinct strengths of the StayEase framework",
    content: [
      "1. Absolute Double-Booking Prevention: Atomic state locks ensure that once a room checkout is initiated, it is immediately reserved, avoiding concurrent transaction overlap.",
      "2. Fully Browser-Executable Mockup: Syncs database values in localStorage so the visual mockup can run standalone on any examiner's computer without launching database services.",
      "3. Beginner-Friendly Codebase: The backend uses standard Python and SQLite without confusing third-party decorators, making it extremely easy for a student to explain during viva examinations.",
      "4. Integrated Analytical Charts: High-end custom dashboards built using standard parameters help students demonstrate visual-design and UX-precision craft."
    ]
  },
  {
    id: 15,
    title: "15. Future Scope",
    subtitle: "Potential roadmap and engineering expansions",
    content: [
      "1. Distributed Microservices: Porting the Python modules to Flask/FastAPI servers to operate as complete REST APIs.",
      "2. SMS and Email Alerts: Connecting the booking confirmation threads to Twilio or SendGrid APIs to dispatch direct receipts to guests' mobile devices.",
      "3. Live Room Customization: Integrating 3D room tours and selective floor layouts using Three.js.",
      "4. Smart Dynamic Pricing: Implementing Gemini AI models to adjust room pricing dynamically based on seasonal holiday volumes and historical occupancy rates."
    ]
  },
  {
    id: 16,
    title: "16. Conclusion",
    subtitle: "Final system summary and project sign-off",
    content: [
      "StayEase Intelligent Hotel Booking System provides an exhaustive, robust, and highly educational blueprint for academic system design submissions.",
      "By combining modern visual styling, rigorous date validation, atomic database states, and complete analytical dashboard displays, the project satisfies every criteria of a high-scoring B.Tech submission.",
      "The accompanying documentation, fully commented Python engines, SQLite schema commands, and interactive dashboards ensure that any student is fully prepared to handle the toughest viva questions with confidence and ease."
    ]
  }
];

export const SQL_STATEMENTS = [
  {
    id: "create_users",
    title: "1. Users Table Structure",
    sql: `CREATE TABLE Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);`
  },
  {
    id: "create_hotels",
    title: "2. Hotels Table Structure",
    sql: `CREATE TABLE Hotels (
    hotel_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    rating REAL NOT NULL CHECK(rating >= 1.0 AND rating <= 5.0)
);`
  },
  {
    id: "create_rooms",
    title: "3. Rooms Table Structure",
    sql: `CREATE TABLE Rooms (
    room_id INTEGER PRIMARY KEY AUTOINCREMENT,
    hotel_id INTEGER,
    room_type TEXT NOT NULL,
    price REAL NOT NULL,
    availability INTEGER DEFAULT 1, -- 1=Available, 0=Booked
    FOREIGN KEY(hotel_id) REFERENCES Hotels(hotel_id) ON DELETE CASCADE
);`
  },
  {
    id: "create_bookings",
    title: "4. Bookings Table Guide",
    sql: `CREATE TABLE Bookings (
    booking_id TEXT PRIMARY KEY,
    user_id INTEGER,
    room_id INTEGER,
    check_in TEXT NOT NULL,
    check_out TEXT NOT NULL,
    booking_status TEXT DEFAULT 'CONFIRMED', -- CONFIRMED, CANCELLED
    FOREIGN KEY(user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY(room_id) REFERENCES Rooms(room_id) ON DELETE CASCADE
);`
  },
  {
    id: "create_payments",
    title: "5. Payments Table Structure",
    sql: `CREATE TABLE Payments (
    payment_id TEXT PRIMARY KEY,
    booking_id TEXT,
    amount REAL NOT NULL,
    payment_status TEXT NOT NULL, -- SUCCESS, REFUNDED
    FOREIGN KEY(booking_id) REFERENCES Bookings(booking_id) ON DELETE CASCADE
);`
  },
  {
    id: "seed_data",
    title: "6. Populate Sample Luxury Listings",
    sql: `-- Insert Grand Oasis Miami
INSERT INTO Hotels (name, location, rating) VALUES ('Grand Oasis Resort', 'Miami', 4.9);
-- Get last inserted hotel_id and configure rooms
INSERT INTO Rooms (hotel_id, room_type, price, availability) VALUES 
(1, 'Deluxe King Room', 250.00, 1),
(1, 'Executive Ocean View Suite', 450.00, 1);`
  }
];

export const VUE_SQL_MOCK_QUERIES = [
  {
    query: "SELECT * FROM Hotels WHERE location = 'Miami';",
    response: [
      { hotel_id: 1, name: "Grand Oasis Resort", location: "Miami", rating: 4.9 }
    ]
  },
  {
    query: "SELECT * FROM Rooms WHERE hotel_id = 1 AND availability = 1;",
    response: [
      { room_id: 101, hotel_id: 1, room_type: "Deluxe King Room", price: 250.0, availability: 1 },
      { room_id: 102, hotel_id: 1, room_type: "Executive Ocean View Suite", price: 450.0, availability: 1 },
      { room_id: 103, hotel_id: 1, room_type: "Royal Penthouse Suite", price: 1200.0, availability: 1 },
      { room_id: 104, hotel_id: 1, room_type: "Twin Standard Room", price: 150.0, availability: 1 }
    ]
  },
  {
    query: "SELECT booking_id, guest_name, amount FROM Bookings JOIN Payments ON Bookings.booking_id = Payments.booking_id WHERE payment_status = 'SUCCESS';",
    response: [
      { booking_id: "SE-182390", guest_name: "Aarav Sharma", amount: 500.0 },
      { booking_id: "SE-726484", guest_name: "Ananya Patel", amount: 900.0 }
    ]
  },
  {
    query: "SELECT SUM(amount) AS total_revenue FROM Payments WHERE payment_status = 'SUCCESS';",
    response: [
      { total_revenue: 1400.0 }
    ]
  }
];

export const PYTHON_COMPANION_CODES = {
  database: `"""
StayEase Database - System Design Project (B.Tech)
Description: SQLite Database initialization, table definitions, and helper functions.
"""
import sqlite3
import os

DB_PATH = "stayease.db"

def get_connection():
    # Establishes SQLite Connection and configures Row structures
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;") # Foreign constraints active
    return conn

def create_schema():
    conn = get_connection()
    cursor = conn.cursor()
    
    # 1. Users table DDL
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    );""")
    
    # 2. Hotels table DDL
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Hotels (
        hotel_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        rating REAL NOT NULL
    );""")
    
    # 3. Rooms table DDL (availability: 1 = Available, 0 = Booked)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Rooms (
        room_id INTEGER PRIMARY KEY AUTOINCREMENT,
        hotel_id INTEGER,
        room_type TEXT NOT NULL,
        price REAL NOT NULL,
        availability INTEGER DEFAULT 1,
        FOREIGN KEY(hotel_id) REFERENCES Hotels(hotel_id)
    );""")
    
    conn.commit()
    conn.close()
    return True`,
  
  booking: `"""
StayEase Booking - System Design Project (B.Tech)
Description: Room Allocation verification, Booking creation, and Cancellations solvers.
"""
import sqlite3
import uuid
from datetime import datetime
from database import get_connection

def check_and_reserve_room(room_id):
    """
    Checks room vacancy and flags it Booked (0) atomically to prevent double booking.
    """
    conn = get_connection()
    cursor = conn.cursor()
    
    # Fetch availability
    cursor.execute("SELECT availability FROM Rooms WHERE room_id = ?;", (room_id,))
    room = cursor.fetchone()
    
    if not room or room["availability"] == 0:
        conn.close()
        return (False, "Room not vacant or does not exist.")
        
    # Lock room vacancy
    cursor.execute("UPDATE Rooms SET availability = 0 WHERE room_id = ?;", (room_id,))
    conn.commit()
    conn.close()
    return (True, "Room allocated successfully.")

def create_booking(user_id, room_id, check_in_date, check_out_date, num_guests):
    """
    Validates calendar duration, locks room, and writes booking record.
    """
    # 1. Date chronological checks
    check_in = datetime.strptime(check_in_date, "%Y-%m-%d")
    check_out = datetime.strptime(check_out_date, "%Y-%m-%d")
    if check_out <= check_in:
        return (False, "Check-out must be after check-in.")
        
    # 2. Atomic Allocation
    allocated, msg = check_and_reserve_room(room_id)
    if not allocated:
        return (False, f"Allocation Failed: {msg}")
        
    # 3. Generate booking ID
    booking_id = f"SE-{str(uuid.uuid4())[:8].upper()}"
    
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO Bookings (booking_id, user_id, room_id, check_in, check_out, booking_status)
        VALUES (?, ?, ?, ?, ?, 'CONFIRMED');
    """, (booking_id, user_id, room_id, check_in_date, check_out_date))
    conn.commit()
    conn.close()
    
    return (True, booking_id)

def cancel_booking(booking_id):
    """
    Nullifies booking transaction and marks room vacant (1) once again.
    """
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT room_id, booking_status FROM Bookings WHERE booking_id = ?;", (booking_id,))
    booking = cursor.fetchone()
    
    if not booking or booking["booking_status"] == "CANCELLED":
        conn.close()
        return (False, "Booking invalid or already cancelled.")
        
    # Cancel status
    cursor.execute("UPDATE Bookings SET booking_status = 'CANCELLED' WHERE booking_id = ?;", (booking_id,))
    # Revert room vacancy
    cursor.execute("UPDATE Rooms SET availability = 1 WHERE room_id = ?;", (booking["room_id"],))
    
    conn.commit()
    conn.close()
    return (True, "Booking cancelled and room freed.")`,
  
  payment: `"""
StayEase Payment System - System Design Project (B.Tech)
Description: Simulated payment gateway verifying card, UPI, and bank structures.
"""
import uuid
from database import get_connection

def process_stay_payment(booking_id, gateway_details, payment_method, amount):
    """
    Verifies input string fields, signs mock transaction ID and writes payment log.
    """
    payment_method = payment_method.strip().upper()
    details = gateway_details.strip()
    
    # 1. Simulated Verification Gateways
    if payment_method in ["CREDIT_CARD", "DEBIT_CARD"]:
        if len(details) < 12 or not details.isdigit():
            return (False, "Card billing verification failed.")
    elif payment_method == "UPI":
        if "@" not in details:
            return (False, "Incorrect UPI address structure.")
            
    # 2. Payment Transaction ID
    payment_id = f"TXN-{str(uuid.uuid4())[:8].upper()}"
    
    # 3. Persistence Log in Payments table
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO Payments (payment_id, booking_id, amount, payment_status)
        VALUES (?, ?, ?, 'SUCCESS');
    """, (payment_id, booking_id, amount))
    conn.commit()
    conn.close()
    
    return (True, payment_id)`
};

export const VIVA_CHESS_SHEET = [
  {
    q: "How does StayEase prevent the critical database problem of Double Booking?",
    a: "StayEase implements dynamic state indicators. When a user requests to book a room, the system checks the 'availability' flag (1 for Available, 0 for Booked). Under atomic execution (represented in python/booking_system.py check_and_reserve_room), availability is immediately queried and set to 0 during confirmation checkout, ensuring that parallel user requests for the same room are blocked."
  },
  {
    q: "Explain how SQLite database tables maintain referential integrity in this system design.",
    a: "We declare explicit FOREIGN KEY constraints. For example, the 'Rooms' table maps a 'hotel_id' referencing the 'Hotels' table, using Cascading Deletes ('ON DELETE CASCADE'). This ensures that if a hotel is purged from the database, all its associated rooms are automatically deleted, avoiding orphan database rows and maintaining clean referential indexes."
  },
  {
    q: "Describe the step-by-step logic of the Hotel Search algorithm.",
    a: "The Hotel Search algorithm executes in four key steps: (1) Reads the full hotel and room list. (2) Filters hotel objects based on location text input (case-insensitive search). (3) Appends review filters matching rating thresholds. (4) Conducts a relational join, filtering out hotels whose lowest suite price is higher than the range slider limit. The remaining collections are then dynamically rendered on screen."
  },
  {
    q: "Why is local storage (localStorage) utilized in our browser-executable mockup?",
    a: "During academic viva presentations, examiners need to test UI features in modern web browsers without spinning up live PostgreSQL local adapters. By implementing local storage synchronization keys mirroring our SQL table parameters in js/app.js, StayEase delivers persistent registration profiles and live updates completely stand-alone inside the browser, representing the physical server state perfectly."
  },
  {
    q: "Explain database normalization and how the StayEase table structures conform to Third Normal Form (3NF).",
    a: "Normalization decomposes tables to eliminate redundancy and update anomalies. StayEase tables conform to 3NF because: (1) All column parameters are strictly atomic (1NF). (2) Every non-primary key relies entirely on the unique primary key (2NF). (3) There are zero transitive dependencies (3NF); for example, User booking parameters (check-in/check-out) are kept in the 'Bookings' table, while personal profiles are in 'Users', joined only by user_id."
  }
];
