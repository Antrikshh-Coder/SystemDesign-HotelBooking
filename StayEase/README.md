# StayEase - Intelligent Hotel Booking System

An elegant, secure, and responsive full-stack luxury hotel reservation and management platform, designed as a B.Tech System Design Academic Submission.

StayEase reproduces commercial hotel-booking giants like Booking.com and Airbnb with state-of-the-art web interfaces, structured SQLite databases, and transparent Python business logic algorithms.

## 🌟 Key Features
1. **User Authentication & Profiles**: Register/Login system and personalized profile dashboard featuring persistent historical bookings.
2. **Intelligent Hotel Search**: Responsive city-based search queried, filtered by price ceiling sliding bars and star-rating tags (explained algorithmically).
3. **Atomic Room Availability**: Validates, reserves, and updates room occupancies transparently, preventing double-bookings.
4. **Unique Booking Transactions**: Generates recognizable, distinct transactional Booking IDs with check-in, check-out, and guest details.
5. **Secure Payment Gateways**: Simulated credit card, debit card, UPI, and Net Banking gateways complete with detailed security checks.
6. **Graceful Cancellations**: Instantly nullifies booking contracts, releases room vacancies back to "Available", and computes refunds.
7. **Interactive Admin Workbench**: Admin command center calculating live indicators (Total users, Revenue, Occupancies, Available items) utilizing responsive visual charts.

---

## 🛠️ Technologies & Dependencies
- **Frontend**: HTML5, Responsive CSS3 (Tailwind CSS custom grid structures), Vanilla ES6 JavaScript
- **Backend**: Python 3.x (Clean, standard, beginner-friendly libraries only)
- **Database**: SQLite 3 (Acid standard complaint table queries)
- **Visual Mock**: Charting, animations, CSS grid styling

---

## 🗂️ Project Directory Trees
```text
StayEase/
│
├── index.html          # Main landing hub, featured hotels, visual reviews
├── hotels.html         # Live interactive hotels list and advanced filters
├── rooms.html          # Individual room selectors, price, type, facilities
├── booking.html        # Booking checkout, calendar validators
├── payment.html        # Payment simulation gateway screen
├── profile.html        # User registration, login, and personal histories
├── admin.html          # Interactive admin command center with rich charts
│
├── css/
│   └── style.css       # Premium responsive utility CSS structures
│
├── js/
│   ├── app.js          # Global app drivers (Global user, database helpers)
│   ├── hotels.js       # Live search and filters (Algorithm comments)
│   ├── booking.js       # Booking validation and calendar updates
│   ├── payment.js      # Mock gateway transitions and confirmations
│   └── admin.js        # Dynamic analytics and graph drawing
│
├── python/
│   ├── database.py       # SQL schemas, db initializers, and sample seeders
│   ├── booking_system.py # Room allocation, reservation, cancellation algs
│   └── payment_system.py # Simulated security details checkout logics
│
├── database/
│   └── stayease.db     # Active SQLite database file
│
└── README.md           # Deployment manual
```

---

## 🖥️ Getting Started & Installation

### Step 1: Clone or Unpack the Materials
Place the files into your local directory.
```bash
git clone https://github.com/placeholder-username/stayease-booking-system.git
cd stayease-booking-system
```

### Step 2: Initialize are Populated the SQLite Database
Run the schema setup and seeding script. No external dependencies required!
```bash
python python/database.py
```
This automatically registers elements, generates `stayease.db` under `/database/`, creates tables, and seeds 5 high-end hotels, 20 luxury rooms, and standard user profiles.

---

## 🚀 Running the Services

### 1. Navigating the HTML UI Web Pages
Since the user interface uses vanilla CSS and client-side modern storage mechanisms:
- You can double-click **`index.html`** or load the files directly in any modern browser!
- For local performance with routing assets, start a lightweight web server in your project directory:
  ```bash
  # Python 3
  python -m http.server 8000
  ```
  Open `http://localhost:8000` in your browser.

### 2. Testing the Backend Python Algorithms
The Python scripts run independently to demonstrate core logic:
- Learn and debug **Allocations & Booking algorithms**:
  ```bash
  python python/booking_system.py
  ```
- Review **Payment Simulators**:
  ```bash
  python python/payment_system.py
  ```

---

## 🧩 Architectural Diagram
```text
                 Users
                   |
                   |
              Web Browser
                   |
      HTML + CSS + JavaScript UI
                   |
            Application Logic
                   |
------------------------------------------------
|               |               |               |
User Module  Hotel Module  Booking Module  Payment Module
                   |
                   |
            Python Business Logic
                   |
            SQLite Database
                   |
------------------------------------------------
|             |              |                  |
Users       Hotels         Rooms             Bookings
```

