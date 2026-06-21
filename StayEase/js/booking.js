/**
 * StayEase Booking Coordinator - System Design (B.Tech)
 * Author: B.Tech Student
 * Description: Powers room cards, tracks state allocation metrics, validates calendars inputs,
 *              and drives the checkout reservation algorithm. Highly commented for viva.
 */

// 1. Room Availability Allocation Algorithm (Mirrors booking_system.py)
function selectAndRentRoom(roomId) {
  /**
   * Room Availability Check Allocation Algorithm:
   * 1. Retrieve the list of rooms in active memory.
   * 2. Find the designated roomId.
   * 3. Evaluate availability.
   * 4. If availability status is 0 (Booked), block selection and throw "Room occupied".
   * 5. If availability status is 1 (Available), cache roomId and forward to checkout form booking.html.
   */
  const rooms = StayEaseDB.getRooms();
  const room = rooms.find(r => r.room_id === parseInt(roomId));

  if (!room) {
    alert("System error: Selected room ID is invalid.");
    return;
  }

  if (room.availability === 0) {
    alert("Warning: Room not available. It has been booked by another user.");
    return;
  }

  // Pre-approve reservation and forward to booking
  localStorage.setItem("se_selected_room_id", roomId);
  window.location.href = "booking.html";
}


// Renders room cards on rooms.html
function renderHotelRooms() {
  const hotelIdStr = localStorage.getItem("se_view_hotel_id");
  if (!hotelIdStr) {
    const mainSection = document.getElementById("se-rooms-section");
    if (mainSection) {
      mainSection.innerHTML = `<p class="error-msg">No hotel selected. Please <a href="hotels.html">Select a Hotel</a>.</p>`;
    }
    return;
  }

  const hotelId = parseInt(hotelIdStr);
  const hotels = StayEaseDB.getHotels();
  const hotel = hotels.find(h => h.hotel_id === hotelId);
  const rooms = StayEaseDB.getRooms().filter(r => r.hotel_id === hotelId);

  // Update header text details
  const titleElem = document.getElementById("se-hotel-rooms-title");
  if (titleElem && hotel) {
    titleElem.innerText = `Premium Accommodations - ${hotel.name}`;
    const descElem = document.getElementById("se-hotel-rooms-location");
    if (descElem) descElem.innerHTML = `📍 ${hotel.location} &nbsp;|&nbsp; ⭐ ${hotel.rating} Rating`;
  }

  const container = document.getElementById("se-rooms-grid");
  if (!container) return;

  container.innerHTML = rooms.map(room => `
    <div class="room-card shadow-md">
      <img src="${room.image}" alt="${room.room_type}">
      <div class="room-details">
        <div class="badge ${room.availability ? 'bg-success' : 'bg-secondary'}">
          ${room.availability ? 'Available' : 'Booked Out'}
        </div>
        <h3 class="room-type">${room.room_type}</h3>
        <p class="room-facilities text-xs">🛠️ <strong>Accommodations:</strong> ${room.facilities}</p>
        <div class="room-price-checkout">
          <div class="price-box">
            <span class="room-price">$${room.price}</span>
            <span class="room-unit">/ night</span>
          </div>
          <button onclick="selectAndRentRoom(${room.room_id})" 
                  class="btn ${room.availability ? 'bg-primary' : 'bg-neutral text-muted'}" 
                  ${room.availability ? '' : 'disabled'}>
            ${room.availability ? 'Reserve This Room' : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  `).join("");
}


// Handles checkout algorithm and creation on booking.html
function processCheckoutAlgorithm(event) {
  event.preventDefault();

  const user = StayEaseDB.getActiveUser();
  if (!user) {
    alert("Authentication required: Please log in or register before completing bookings.");
    window.location.href = "profile.html";
    return;
  }

  const roomIdStr = localStorage.getItem("se_selected_room_id");
  if (!roomIdStr) {
    alert("Validation failure: No room selected.");
    window.location.href = "hotels.html";
    return;
  }

  const roomId = parseInt(roomIdStr);
  const checkIn = document.getElementById("booking-checkin").value;
  const checkOut = document.getElementById("booking-checkout").value;
  const guests = parseInt(document.getElementById("booking-guests").value);
  const guestName = document.getElementById("booking-guest-name").value.trim();
  const guestEmail = document.getElementById("booking-guest-email").value.trim();

  /**
   * ACADEMIC BOOKING ALGORITHM INTEGRATION
   * 
   * STEP 1: Validate checkout user and date fields. Calendar dates must not be null & Checkout > Checkin.
   * STEP 2: Validate room availability. Make sure room still enjoys availability === 1.
   * STEP 3: Compute total booking price (nights diff * room standard rate).
   * STEP 4: Generate a unique alphanumerical booking ID (SE-XXXXXXXX prefix).
   * STEP 5: Create a new transaction item record with status 'PENDING_PAYMENT'.
   * STEP 6: Save checkout metadata to active localStorage registries redirects to secure payment screen.
   */
  
  // Step 1: Validations
  if (!checkIn || !checkOut || !guestName || !guestEmail || !guests) {
    alert("System check failed: Ensure all personal and date details are entered.");
    return;
  }

  const dateIn = new Date(checkIn);
  const dateOut = new Date(checkOut);

  if (dateOut <= dateIn) {
    alert("Chronology error: Check-out date must be strictly after Check-in date.");
    return;
  }

  // Step 2: Double check room availability in memory
  const rooms = StayEaseDB.getRooms();
  const room = rooms.find(r => r.room_id === roomId);
  if (!room || room.availability === 0) {
    alert("Reservation Conflict: The selected room is no longer vacant.");
    window.location.href = "hotels.html";
    return;
  }

  // Step 3: Calculation of pricing metrics
  const diffTime = Math.abs(dateOut - dateIn);
  const numDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  const totalAmount = room.price * numDays;

  // Step 4: Unique booking reference generation
  const bookingId = "SE-" + Math.floor(100000 + Math.random() * 900000);

  // Step 5: Construct Booking Record in pending state
  const newBooking = {
    booking_id: bookingId,
    user_id: user.user_id,
    room_id: roomId,
    check_in: checkIn,
    check_out: checkOut,
    booking_status: "PENDING_PAYMENT",
    guest_name: guestName,
    guest_email: guestEmail,
    guests: guests,
    amount: totalAmount,
    nights: numDays,
    hotel_name: getHotelNameFromRoom(room.hotel_id),
    room_type: room.room_type
  };

  // Step 6: Temporarily store transaction in cache and route to payment screen
  localStorage.setItem("se_pending_booking", JSON.stringify(newBooking));
  window.location.href = "payment.html";
}


function getHotelNameFromRoom(hotelId) {
  const hotels = StayEaseDB.getHotels();
  const h = hotels.find(x => x.hotel_id === hotelId);
  return h ? h.name : "Luxury Hotel";
}

// Initial script binders
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.endsWith("rooms.html")) {
    renderHotelRooms();
  }

  if (window.location.pathname.endsWith("booking.html")) {
    // Populate checkout item details
    const roomIdStr = localStorage.getItem("se_selected_room_id");
    const checkoutSummary = document.getElementById("se-checkout-room-summary");

    if (roomIdStr && checkoutSummary) {
      const roomId = parseInt(roomIdStr);
      const rooms = StayEaseDB.getRooms();
      const room = rooms.find(r => r.room_id === roomId);
      
      if (room) {
        const hotelName = getHotelNameFromRoom(room.hotel_id);
        checkoutSummary.innerHTML = `
          <div class="checkout-summary-card bg-warm rounded-lg p-5 border border-dashed my-5">
            <h4 class="font-medium text-lg">${hotelName}</h4>
            <p class="neutral-text text-sm">${room.room_type}</p>
            <div class="flex justify-between border-t mt-4 pt-3">
              <span class="text-sm">Price per Night:</span>
              <span class="font-medium">$${room.price}</span>
            </div>
          </div>
        `;

        // Pre-fill user profile info if logged in
        const user = StayEaseDB.getActiveUser();
        if (user) {
          const nameInput = document.getElementById("booking-guest-name");
          const emailInput = document.getElementById("booking-guest-email");
          if (nameInput) nameInput.value = user.name;
          if (emailInput) emailInput.value = user.email;
        }
      }
    }

    const form = document.getElementById("se-booking-form");
    if (form) {
      form.addEventListener("submit", processCheckoutAlgorithm);
    }
  }
});
