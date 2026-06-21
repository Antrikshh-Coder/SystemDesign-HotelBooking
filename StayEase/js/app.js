/**
 * StayEase App Engine - Global Client Storage & Mock DB Integrator (ES6)
 * Description: Initializes local schema structures representing Users, Hotels, Rooms, Bookings,
 *              and Payments. Synchronizes with localStorage to ensure seamless viva presentations.
 *              Contains descriptive comments for B.Tech Viva questions.
 */

// Global Seed Data (Mirrors database.py tables)
const DEFAULT_HOTELS = [
  { hotel_id: 1, name: "Grand Oasis Resort", location: "Miami", rating: 4.9, image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=600" },
  { hotel_id: 2, name: "The Ritz-Carlton Palace", location: "Paris", rating: 4.8, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600" },
  { hotel_id: 3, name: "Zen Garden Sanctuary", location: "Kyoto", rating: 4.7, image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600" },
  { hotel_id: 4, name: "Skyline View Suites", location: "New York", rating: 4.6, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=600" },
  { hotel_id: 5, name: "The Alpine Retreat", location: "Zermatt", rating: 4.9, image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&q=80&w=600" }
];

const DEFAULT_ROOMS = [
  // Hotel 1 Rooms
  { room_id: 101, hotel_id: 1, room_type: "Deluxe King Room", price: 250, availability: 1, facilities: "Free Wi-Fi, King Bed, Mini Bar, Ocean View", image: "https://images.unsplash.com/photo-1611891405782-95f204196776?auto=format&fit=crop&q=80&w=500" },
  { room_id: 102, hotel_id: 1, room_type: "Executive Ocean View Suite", price: 450, availability: 1, facilities: "Balcony, Private Pool, Wi-Fi, King Bed", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=500" },
  { room_id: 103, hotel_id: 1, room_type: "Royal Penthouse Suite", price: 1200, availability: 1, facilities: "Jacuzzi, Chef Service, Chauffer, King Bed", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=500" },
  { room_id: 104, hotel_id: 1, room_type: "Twin Standard Room", price: 150, availability: 1, facilities: "Two Twin Beds, Wi-Fi, Coffee Maker", image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=500" },
  
  // Hotel 2 Rooms
  { room_id: 201, hotel_id: 2, room_type: "Deluxe King Room", price: 300, availability: 1, facilities: "Free Wi-Fi, Garden View, King Bed", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=500" },
  { room_id: 202, hotel_id: 2, room_type: "Executive Ocean View Suite", price: 550, availability: 1, facilities: "Eiffel Tower View, Smart TV, King Bed", image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=500" },
  
  // Hotel 3 Rooms
  { room_id: 301, hotel_id: 3, room_type: "Deluxe King Room", price: 220, availability: 1, facilities: "Tatami mats, Garden View, King Bed", image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=500" },
  { room_id: 302, hotel_id: 3, room_type: "Executive Suite", price: 400, availability: 1, facilities: "Zen Garden Patio, Hot Springs Access", image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=500" }
];

// Initialize global storage if empty
(function initStorage() {
  if (!localStorage.getItem("se_hotels")) {
    localStorage.setItem("se_hotels", JSON.stringify(DEFAULT_HOTELS));
  }
  if (!localStorage.getItem("se_rooms")) {
    localStorage.setItem("se_rooms", JSON.stringify(DEFAULT_ROOMS));
  }
  if (!localStorage.getItem("se_users")) {
    // Admin user seeded as default
    const DEFAULT_USERS = [
      { user_id: 1, name: "Admin StayEase", email: "admin@stayease.com", password: "admin" },
      { user_id: 2, name: "Aarav Sharma", email: "aarav@stayease.com", password: "password123" }
    ];
    localStorage.setItem("se_users", JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem("se_bookings")) {
    localStorage.setItem("se_bookings", JSON.stringify([]));
  }
  if (!localStorage.getItem("se_payments")) {
    localStorage.setItem("se_payments", JSON.stringify([]));
  }
})();

// Database Query Helpers (CRUD simulations representing python DB API)
const StayEaseDB = {
  // 1. User DB operations
  getUsers: () => JSON.parse(localStorage.getItem("se_users") || "[]"),
  saveUsers: (users) => localStorage.setItem("se_users", JSON.stringify(users)),
  getActiveUser: () => JSON.parse(localStorage.getItem("se_active_user") || "null"),
  setActiveUser: (user) => localStorage.setItem("se_active_user", JSON.stringify(user)),
  logout: () => localStorage.removeItem("se_active_user"),

  // 2. Hotel DB operations
  getHotels: () => JSON.parse(localStorage.getItem("se_hotels") || "[]"),
  
  // 3. Room DB operations
  getRooms: () => JSON.parse(localStorage.getItem("se_rooms") || "[]"),
  saveRooms: (rooms) => localStorage.setItem("se_rooms", JSON.stringify(rooms)),

  // 4. Booking DB operations
  getBookings: () => JSON.parse(localStorage.getItem("se_bookings") || "[]"),
  saveBookings: (bookings) => localStorage.setItem("se_bookings", JSON.stringify(bookings)),

  // 5. Payments DB operations
  getPayments: () => JSON.parse(localStorage.getItem("se_payments") || "[]"),
  savePayments: (payments) => localStorage.setItem("se_payments", JSON.stringify(payments))
};

// Global Nav Bar injector
document.addEventListener("DOMContentLoaded", () => {
  const navContainer = document.getElementById("se-global-navbar");
  if (navContainer) {
    const user = StayEaseDB.getActiveUser();
    navContainer.innerHTML = `
      <div class="nav-brand">
        <a href="index.html" class="logo">
          <span class="logo-accent">Stay</span>Ease
        </a>
      </div>
      <ul class="nav-links">
        <li><a href="index.html" class="${isActive('index.html')}">Home</a></li>
        <li><a href="hotels.html" class="${isActive('hotels.html') || isActive('rooms.html')}">Explore Hotels</a></li>
        <li><a href="admin.html" class="${isActive('admin.html')}">Admin Dashboard</a></li>
      </ul>
      <div class="nav-actions">
        ${user ? `
          <a href="profile.html" class="nav-user-profile bg-elegant hover:bg-neutral">
            <span class="user-avatar-initial">${user.name.charAt(0).toUpperCase()}</span>
            <span>Hi, ${user.name.split(" ")[0]}</span>
          </a>
          <button id="se-logout-btn" class="nav-btn bg-danger text-white">Log Out</button>
        ` : `
          <a href="profile.html" class="nav-btn bg-primary text-white">Log In / Sign Up</a>
        `}
      </div>
    `;

    const logoutBtn = document.getElementById("se-logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        StayEaseDB.logout();
        window.location.href = "index.html";
      });
    }
  }

  // Inject footer automatically
  const footerContainer = document.getElementById("se-global-footer");
  if (footerContainer) {
    footerContainer.innerHTML = `
      <div class="footer-grid">
        <div class="footer-col brand-col">
          <h2 class="footer-logo"><span class="logo-accent">Stay</span>Ease</h2>
          <p>Experiencing true luxury, crafted systematically. Book premium destinations globally with high-assurance transaction safety.</p>
        </div>
        <div class="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="hotels.html">Explore Hotels</a></li>
            <li><a href="admin.html">Admin Dashboard</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3>System Modules</h3>
          <ul>
            <li>User Auth Engine</li>
            <li>Search Optimizer</li>
            <li>Allocation Matrix</li>
            <li>Secure Payment API</li>
          </ul>
        </div>
        <div class="footer-col">
          <h3>Contact</h3>
          <p>🏛️ AI Studio University, CSE Dept.</p>
          <p>📧 team@stayease.com</p>
          <p>📞 +91 98765 43210</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 StayEase Intelligent Hotel Booking System. B.Tech System Design Project. Highly documented for Viva.</p>
      </div>
    `;
  }
});

function isActive(pageName) {
  return window.location.pathname.endsWith(pageName) ? 'active' : '';
}
