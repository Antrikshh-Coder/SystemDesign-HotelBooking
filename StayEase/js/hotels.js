/**
 * StayEase Hotel Search Engine - System Design (B.Tech)
 * Author: B.Tech Student
 * Description: Implements hotel queries, slider-based pricing, and star reviews processing.
 *              Highly illustrated search algorithm with step-by-step JavaScript comments.
 */

// Global search state variables
let currentCityFilter = "";
let currentPriceFilter = 1500; // default maximum ceiling
let currentRatingFilter = 0; // minimum stars (0 means any rating)

/**
 * ALGORITHM: Hotel Intelligent Searching and Filtering
 * 
 * STEP 1: Read the complete hotel and room inventory from localStorage (acts as SQLite).
 * STEP 2: Capture user search filter inputs:
 *         - City Name (from Search bar text field input, case-insensitive)
 *         - Maximum Price ceiling (from range slider)
 *         - Minimum Star-rating (from clicked star or filter buttons)
 * STEP 3: Iterate through every hotel in the collection:
 *         - Filter 3.1: Compare hotel location with the city name filter. If city is provided, matching location MUST exist.
 *         - Filter 3.2: Compare hotel rating. Rating must be >= selected minimum rating.
 *         - Filter 3.3 (Cross-Join validation with Rooms): Query rooms associated with this hotel. If room prices are <= Max Price ceiling, the hotel remains search-eligible.
 * STEP 4: Render the dynamically filtered items within UI Grid containers. If no items match, display a friendly "No results" alert.
 */
function searchAndFilterHotels() {
  // Step 1: Read master lists
  const hotels = StayEaseDB.getHotels();
  const rooms = StayEaseDB.getRooms();

  console.log("[SEARCH ALGORITHM ACTIVE] Inputs:", {
    city: currentCityFilter,
    maxPrice: currentPriceFilter,
    minRating: currentRatingFilter
  });

  // Step 2 & 3: Compare and Filter matching hotels
  const filteredHotels = hotels.filter(hotel => {
    // Audit 3.1: City check (case-insensitive substring match)
    if (currentCityFilter && !hotel.location.toLowerCase().includes(currentCityFilter.toLowerCase())) {
      return false;
    }

    // Audit 3.2: Rating tag check
    if (hotel.rating < currentRatingFilter) {
      return false;
    }

    // Audit 3.3: Cross-match Rooms for pricing rules
    const hotelRooms = rooms.filter(room => room.hotel_id === hotel.hotel_id);
    const hasRoomInPriceRange = hotelRooms.some(room => room.price <= currentPriceFilter);
    return hotelRooms.length === 0 || hasRoomInPriceRange;
  });

  // Step 4: Display filtered results in DOM
  renderHotelResults(filteredHotels);
}

function renderHotelResults(hotels) {
  const container = document.getElementById("se-hotels-grid");
  if (!container) return;

  if (hotels.length === 0) {
    container.innerHTML = `
      <div class="search-no-results col-span-3 text-center">
        <p class="neutral-text">No luxury destinations found matching your specific system criteria.</p>
        <button onclick="resetAllFilters()" class="btn-outline">Reset Filter Conditions</button>
      </div>
    `;
    return;
  }

  const rooms = StayEaseDB.getRooms();

  container.innerHTML = hotels.map(hotel => {
    // Calculate lowest starting price for rooms
    const hotelRooms = rooms.filter(room => room.hotel_id === hotel.hotel_id);
    const minPrice = hotelRooms.reduce((min, r) => r.price < min ? r.price : min, 9999);
    
    return `
      <div class="hotel-card shadow-lg" data-id="${hotel.hotel_id}">
        <div class="card-img-wrapper">
          <img src="${hotel.image}" alt="${hotel.name}" loading="lazy">
          <div class="card-rating-tag">⭐ ${hotel.rating.toFixed(1)}</div>
        </div>
        <div class="card-content">
          <span class="card-location"><i class="location-icon">📍</i> ${hotel.location}</span>
          <h3 class="card-title">${hotel.name}</h3>
          
          <div class="card-amenities text-xs">
            <span>🛡️ Fast Check-in</span>
            <span>🍽️ Breakfast Included</span>
          </div>
          
          <div class="card-footer">
            <div class="card-price-info">
              <span class="price-label">Starts from</span>
              <span class="price-value">$${minPrice === 9999 ? '150' : minPrice}/night</span>
            </div>
            <button onclick="viewRooms(${hotel.hotel_id})" class="btn bg-primary text-white">View Rooms</button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function viewRooms(hotelId) {
  localStorage.setItem("se_view_hotel_id", hotelId.toString());
  window.location.href = "rooms.html";
}

function resetAllFilters() {
  currentCityFilter = "";
  currentPriceFilter = 1500;
  currentRatingFilter = 0;

  const cityInput = document.getElementById("search-city-input");
  if (cityInput) cityInput.value = "";

  const priceSlider = document.getElementById("filter-price-slider");
  const priceDisplay = document.getElementById("filter-price-display");
  if (priceSlider) {
    priceSlider.value = 1500;
    if (priceDisplay) priceDisplay.innerText = "$1500";
  }

  const activeStars = document.querySelectorAll(".star-rating-filter .star");
  activeStars.forEach(s => s.classList.remove("selected"));

  searchAndFilterHotels();
}

// Initial Listeners Setup
document.addEventListener("DOMContentLoaded", () => {
  // Bind inputs if matches are found on hotels.html page
  const cityInput = document.getElementById("search-city-input");
  const searchBtn = document.getElementById("search-submit-btn");
  const priceSlider = document.getElementById("filter-price-slider");
  const priceDisplay = document.getElementById("filter-price-display");

  if (cityInput) {
    cityInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        currentCityFilter = cityInput.value.trim();
        searchAndFilterHotels();
      }
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      if (cityInput) currentCityFilter = cityInput.value.trim();
      searchAndFilterHotels();
    });
  }

  if (priceSlider) {
    priceSlider.addEventListener("input", () => {
      currentPriceFilter = parseInt(priceSlider.value);
      if (priceDisplay) priceDisplay.innerText = `$${currentPriceFilter}`;
      searchAndFilterHotels();
    });
  }

  // Setup rating button handlers
  const stars = document.querySelectorAll(".star-rating-filter .star");
  stars.forEach(star => {
    star.addEventListener("click", () => {
      const rating = parseInt(star.getAttribute("data-rating"));
      
      // Toggle selected class on sibling elements
      stars.forEach(s => {
        if (parseInt(s.getAttribute("data-rating")) <= rating) {
          s.classList.add("selected");
        } else {
          s.classList.remove("selected");
        }
      });

      currentRatingFilter = rating;
      searchAndFilterHotels();
    });
  });

  // Render initial hotel profiles
  searchAndFilterHotels();
});
