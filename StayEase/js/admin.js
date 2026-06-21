/**
 * StayEase Admin Center Analysis - System Design (B.Tech)
 * Author: B.Tech Student
 * Description: Calculates booking indices, aggregates cash reserves, details occupied states,
 *              and constructs responsive, customized vector charts from local states. Highly commented.
 */

function calculateAdminMetrics() {
  const users = StayEaseDB.getUsers();
  const hotels = StayEaseDB.getHotels();
  const rooms = StayEaseDB.getRooms();
  const bookings = StayEaseDB.getBookings().filter(b => b.booking_status === "CONFIRMED");

  // Sum active indicators
  const totalUsers = users.length;
  const totalHotels = hotels.length;
  const totalRooms = rooms.length;
  const totalBookings = bookings.length;

  // Occupancies metrics
  const availableRoomsCount = rooms.filter(r => r.availability === 1).length;
  const bookedRoomsCount = rooms.filter(r => r.availability === 0).length;

  // Total cash revenue summation
  const totalRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);

  // Update DOM selectors with calculated metrics
  updateDOMText("se-admin-total-users", totalUsers);
  updateDOMText("se-admin-total-hotels", totalHotels);
  updateDOMText("se-admin-total-rooms", totalRooms);
  updateDOMText("se-admin-total-bookings", totalBookings);
  updateDOMText("se-admin-available-rooms", availableRoomsCount);
  updateDOMText("se-admin-booked-rooms", bookedRoomsCount);
  updateDOMText("se-admin-total-revenue", `$${totalRevenue.toLocaleString()}`);

  // Push results into visual diagrams
  drawOccupancyPieChart(availableRoomsCount, bookedRoomsCount);
  drawRevenueBarChart(bookings);
}

function updateDOMText(elementId, text) {
  const el = document.getElementById(elementId);
  if (el) el.innerText = text;
}

// 1. Renders Occupancy Gauge Chart using SVGs
function drawOccupancyPieChart(available, booked) {
  const canvas = document.getElementById("se-admin-occupancy-chart");
  if (!canvas) return;

  const total = available + booked;
  if (total === 0) {
    canvas.innerHTML = `<p class="neutral-text text-sm">No inventory recorded to generate graphs.</p>`;
    return;
  }

  const occupiedPct = Math.round((booked / total) * 100);
  const availablePct = 100 - occupiedPct;

  // Render a clean modern donut SVG with high-end legends
  canvas.innerHTML = `
    <div class="flex flex-col items-center justify-center space-y-4">
      <div class="relative w-40 h-40">
        <svg viewBox="0 0 36 36" class="w-full h-full transform -rotate-90">
          <circle cx="18" cy="18" r="15.915" fill="none" class="stroke-neutral" stroke-width="3"></circle>
          <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--color-primary)" stroke-width="3"
                  stroke-dasharray="${occupiedPct} ${availablePct}" stroke-dashoffset="0"></circle>
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-3xl font-extrabold text-primary">${occupiedPct}%</span>
          <span class="text-xs text-slate-400 font-semibold uppercase">Occupied</span>
        </div>
      </div>
      <div class="flex justify-around w-full text-xs">
        <div class="flex items-center"><span class="w-3 h-3 rounded-full bg-primary mr-2"></span> Booked (${booked} rooms)</div>
        <div class="flex items-center"><span class="w-3 h-3 rounded-full bg-neutral mr-2"></span> Available (${available} rooms)</div>
      </div>
    </div>
  `;
}

// 2. Renders dynamic multi-bar vertical graphs detailing revenue streams
function drawRevenueBarChart(bookings) {
  const chartWrapper = document.getElementById("se-admin-revenue-chart");
  if (!chartWrapper) return;

  // Aggregate revenues by luxury resorts
  const hotelRevenueMap = {};
  const hotels = StayEaseDB.getHotels();
  
  hotels.forEach(h => {
    hotelRevenueMap[h.name] = 0;
  });

  bookings.forEach(b => {
    if (hotelRevenueMap[b.hotel_name] !== undefined) {
      hotelRevenueMap[b.hotel_name] += b.amount;
    } else {
      hotelRevenueMap[b.hotel_name] = b.amount;
    }
  });

  const hotelNames = Object.keys(hotelRevenueMap);
  const values = Object.values(hotelRevenueMap);
  const maxVal = Math.max(...values, 500) * 1.1; // adding some headroom

  // Construct a bespoke horizontal visual scale dynamically
  let barHeightsHTML = "";
  hotelNames.forEach((name, i) => {
    const revenue = hotelRevenueMap[name];
    const percentage = Math.round((revenue / maxVal) * 100) || 4; // minimum visual stub
    
    // Split long names for vertical scaling
    const displayName = name.length > 15 ? name.substring(0, 15) + "..." : name;

    barHeightsHTML += `
      <div class="flex items-end flex-col justify-end group">
        <div class="relative w-12 md:w-16 flex items-end justify-center bg-warm rounded-t-md hover:bg-neutral transition-all h-48">
          <div class="bg-primary w-8 md:w-12 rounded-t-sm transition-all" style="height: ${percentage}%;" title="${name}: $${revenue}"></div>
          <span class="absolute -top-6 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">$${revenue}</span>
        </div>
        <span class="text-[10px] text-slate-400 font-medium rotate-45 origin-top-left translate-x-1 translate-y-3 whitespace-nowrap" title="${name}">${displayName}</span>
      </div>
    `;
  });

  chartWrapper.innerHTML = `
    <div class="flex justify-between items-end border-b border-l pb-4 h-60 px-6 gap-x-2">
      ${barHeightsHTML}
    </div>
  `;
}

// Admin database reset helper for demonstrations
function resetSystemDatabase() {
  if (confirm("Are you sure you want to reset StayEase to warehouse settings? This will clear all current bookings, users, and release rooms.")) {
    localStorage.clear();
    location.reload();
  }
}

// Initial admin logs
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.endsWith("admin.html")) {
    calculateAdminMetrics();

    // Render tables detailing active database entries
    const bookingsTable = document.getElementById("se-admin-bookings-table");
    if (bookingsTable) {
      const bookings = StayEaseDB.getBookings();
      if (bookings.length === 0) {
        bookingsTable.innerHTML = `<tr><td colspan="7" class="text-center p-6 text-slate-400">No transactions recorded in digital files.</td></tr>`;
      } else {
        bookingsTable.innerHTML = bookings.map(b => `
          <tr class="border-b hover:bg-slate-50 text-sm">
            <td class="p-4 font-mono font-bold text-primary">${b.booking_id}</td>
            <td class="p-4">${b.guest_name}</td>
            <td class="p-4 text-xs font-medium">${b.hotel_name}</td>
            <td class="p-4 font-mono text-xs">${b.check_in}</td>
            <td class="p-4 font-mono text-xs">${b.check_out}</td>
            <td class="p-4 font-bold text-primary">$${b.amount}</td>
            <td class="p-4">
              <span class="badge ${b.booking_status === 'CONFIRMED' ? 'bg-success' : 'bg-danger'}">
                ${b.booking_status}
              </span>
            </td>
          </tr>
        `).join("");
      }
    }

    const resetBtn = document.getElementById("se-admin-reset-db");
    if (resetBtn) {
      resetBtn.addEventListener("click", resetSystemDatabase);
    }
  }
});
