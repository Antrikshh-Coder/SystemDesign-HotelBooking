/**
 * StayEase Payment Processor - System Design (B.Tech)
 * Author: B.Tech Student
 * Description: Drives simulated transactions across credit/debit channels, UPI strings, and
 *              banking forms. Handles success metrics and lock-in allocations. Highly commented.
 */

function setupPaymentForm() {
  const pendingBookingStr = localStorage.getItem("se_pending_booking");
  if (!pendingBookingStr) {
    alert("Process conflict: No booking transactions are pending capture.");
    window.location.href = "hotels.html";
    return;
  }

  const booking = JSON.parse(pendingBookingStr);
  
  // Update price indicators in UI
  const totalAmountElem = document.getElementById("se-payment-total-amount");
  const billingSummary = document.getElementById("se-payment-billing-summary");

  if (totalAmountElem) {
    totalAmountElem.innerText = `$${booking.amount}`;
  }

  if (billingSummary) {
    billingSummary.innerHTML = `
      <div class="space-y-2 text-sm">
        <div class="flex justify-between"><strong>Hotel:</strong> <span>${booking.hotel_name}</span></div>
        <div class="flex justify-between"><strong>Room:</strong> <span>${booking.room_type}</span></div>
        <div class="flex justify-between"><strong>Duration:</strong> <span>${booking.nights} nights (${booking.check_in} to ${booking.check_out})</span></div>
        <div class="flex justify-between border-t pt-2 mt-2 font-bold text-base text-primary">
          <span>Amount Payable:</span>
          <span>$${booking.amount}</span>
        </div>
      </div>
    `;
  }
}

// Switches form fields depending on chosen payment channel
function switchPaymentMethod(method) {
  const customFields = document.getElementById("se-payment-custom-fields");
  if (!customFields) return;

  // Toggle active styling on buttons
  document.querySelectorAll(".payment-method-tab").forEach(btn => {
    if (btn.getAttribute("data-method") === method) {
      btn.classList.add("active", "border-primary", "bg-warm-lighter");
    } else {
      btn.classList.remove("active", "border-primary", "bg-warm-lighter");
    }
  });

  if (method === "card") {
    customFields.innerHTML = `
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-semibold uppercase mb-1">Card Holder Name</label>
          <input type="text" id="pay-card-name" placeholder="John Doe" class="input-field" required>
        </div>
        <div>
          <label class="block text-xs font-semibold uppercase mb-1">Card Number (16 Digits)</label>
          <input type="text" id="pay-card-number" placeholder="4111 2222 3333 4444" maxlength="19" class="input-field" required>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold uppercase mb-1">Expiration Date</label>
            <input type="text" id="pay-card-expiry" placeholder="12/28" maxlength="5" class="input-field" required>
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase mb-1">CVV Security Code</label>
            <input type="password" id="pay-card-cvv" placeholder="•••" maxlength="3" class="input-field" required>
          </div>
        </div>
      </div>
    `;
  } else if (method === "upi") {
    customFields.innerHTML = `
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-semibold uppercase mb-1">UPI Address (VPA)</label>
          <input type="text" id="pay-upi-id" placeholder="aarav@okhdfcbank" class="input-field" required>
          <p class="text-xs text-slate-400 mt-1">Please enter your registered virtual payments address.</p>
        </div>
      </div>
    `;
  } else if (method === "net") {
    customFields.innerHTML = `
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-semibold uppercase mb-1">Select Nationalized Bank</label>
          <select id="pay-bank-name" class="input-field" required>
            <option value="">-- Choose Your Bank --</option>
            <option value="State Bank of India">State Bank of India</option>
            <option value="HDFC Bank">HDFC Bank</option>
            <option value="ICICI Bank">ICICI Bank</option>
            <option value="Axis Bank">Axis Bank</option>
            <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
          </select>
        </div>
      </div>
    `;
  }
}

/**
 * SECURE PAYMENT GATEWAY TRANSACTION ALGORITHM
 * 
 * STEP 1: Verify payment capture forms based on active channel selection. 
 *         - Card numbers must support digit integrity.
 *         - UPI handles must feature character validity (@).
 * STEP 2: Generate a custom, secure Payment ID (Format: TXN-XXXXXXXX).
 * STEP 3: Create a database/localStorage transaction success marker and link with Booking.
 * STEP 4: Lock the checked room availability - Save Room.availability = 0 in master list.
 * STEP 5: Push the finalized Booking into the master book list (saving it persistently).
 * STEP 6: Revoke the pending checkout state cache and trigger success screens!
 */
function submitStayPayment(event) {
  event.preventDefault();

  const pendingBookingStr = localStorage.getItem("se_pending_booking");
  if (!pendingBookingStr) return;

  const booking = JSON.parse(pendingBookingStr);
  const activeTab = document.querySelector(".payment-method-tab.active");
  const method = activeTab ? activeTab.getAttribute("data-method") : "card";

  // Step 1: Verification procedures
  if (method === "card") {
    const cardNum = document.getElementById("pay-card-number").value.replace(/\s+/g, '');
    const cardName = document.getElementById("pay-card-name").value.trim();
    if (cardNum.length < 12 || isNaN(cardNum) || !cardName) {
      alert("Verification Failed: Card digits and card holder name must be completed.");
      return;
    }
  } else if (method === "upi") {
    const upiId = document.getElementById("pay-upi-id").value.trim();
    if (!upiId || !upiId.includes("@")) {
      alert("Verification Failed: Unique VPA address must contain '@' handle syntax.");
      return;
    }
  } else if (method === "net") {
    const bankSelect = document.getElementById("pay-bank-name").value;
    if (!bankSelect) {
      alert("Verification Failed: Please choose a valid banking facility.");
      return;
    }
  }

  // Step 2: Generate a secure Payment Transaction ID
  const paymentId = "TXN-" + Math.floor(10000000 + Math.random() * 90000000);

  // Step 3: Record transaction status successfully
  const transactionReceipt = {
    payment_id: paymentId,
    booking_id: booking.booking_id,
    amount: booking.amount,
    payment_status: "SUCCESS"
  };

  // Step 4: Lock the chosen Room vacancy - Availability set to 0 (Booked)
  const rooms = StayEaseDB.getRooms();
  const indexRoom = rooms.findIndex(r => r.room_id === booking.room_id);
  if (indexRoom !== -1) {
    rooms[indexRoom].availability = 0;
    StayEaseDB.saveRooms(rooms);
  }

  // Step 5: Save complete confirmed booking to central registries
  booking.booking_status = "CONFIRMED";
  const bookings = StayEaseDB.getBookings();
  bookings.push(booking);
  StayEaseDB.saveBookings(bookings);

  const payments = StayEaseDB.getPayments();
  payments.push(transactionReceipt);
  StayEaseDB.savePayments(payments);

  // Step 6: Purge pending references and trigger confirmation UI
  localStorage.removeItem("se_pending_booking");
  localStorage.removeItem("se_selected_room_id");

  showPaymentSuccessModal(booking.booking_id, paymentId, booking.amount);
}

function showPaymentSuccessModal(bookingId, paymentId, amount) {
  // Overlays a premium receipts modal directly on standard screen
  const modalHTML = `
    <div id="payment-success-overlay" class="modal-backdrop animated fadeIn flex items-center justify-center">
      <div class="modal-card bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center border-t-4 border-success">
        <div class="success-icon-wrapper mb-4">
          <span class="success-checkmark text-4xl">🎉</span>
        </div>
        <h2 class="text-2xl font-bold mb-2">Booking Confirmed!</h2>
        <p class="neutral-text text-sm mb-6">Payment verified and allocation completed successfully.</p>
        
        <div class="receipt-box text-left bg-warm p-4 rounded-lg space-y-2 mb-6 border text-sm">
          <div class="flex justify-between"><strong>Booking Ref ID:</strong> <span class="text-primary font-mono">${bookingId}</span></div>
          <div class="flex justify-between"><strong>Payment ID:</strong> <span class="font-mono text-neutral">${paymentId}</span></div>
          <div class="flex justify-between border-t pt-2 mt-2"><strong>Total Charged:</strong> <span class="font-bold">$${amount}</span></div>
        </div>

        <button onclick="forwardToProfile()" class="btn bg-primary text-white w-full">View My Bookings</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

function forwardToProfile() {
  const overlay = document.getElementById("payment-success-overlay");
  if (overlay) overlay.remove();
  window.location.href = "profile.html";
}

// Global UI listeners bindings
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.endsWith("payment.html")) {
    setupPaymentForm();
    switchPaymentMethod("card"); // default card view

    // Bind method tab selectors
    document.querySelectorAll(".payment-method-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        const selectedMethod = tab.getAttribute("data-method");
        switchPaymentMethod(selectedMethod);
      });
    });

    const payForm = document.getElementById("se-payment-form");
    if (payForm) {
      payForm.addEventListener("submit", submitStayPayment);
    }
  }
});
