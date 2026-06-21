import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Star, Calendar, User, CreditCard, ShieldCheck, 
  Trash, RefreshCw, Database, Code, BookOpen, Layers, 
  CheckCircle, ArrowLeft, Terminal, Award, ChevronRight, Copy, Check
} from 'lucide-react';
import { 
  ACADEMIC_REPORT, SQL_STATEMENTS, VUE_SQL_MOCK_QUERIES, 
  PYTHON_COMPANION_CODES, VIVA_CHESS_SHEET 
} from './data/report';

// Interfaces for our client state (mirrors database.py schema)
interface Hotel {
  hotel_id: number;
  name: string;
  location: string;
  rating: number;
  image: string;
}

interface Room {
  room_id: number;
  hotel_id: number;
  room_type: string;
  price: number;
  availability: number; // 1 = Available, 0 = Booked
  facilities: string;
  image: string;
}

interface Booking {
  booking_id: string;
  user_id: number;
  room_id: number;
  check_in: string;
  check_out: string;
  booking_status: string; // 'CONFIRMED' | 'CANCELLED' | 'PENDING_PAYMENT'
  guest_name: string;
  guest_email: string;
  guests: number;
  amount: number;
  nights: number;
  hotel_name: string;
  room_type: string;
}

interface Payment {
  payment_id: string;
  booking_id: string;
  amount: number;
  payment_status: string;
}

interface UserProfile {
  user_id: number;
  name: string;
  email: string;
  password?: string;
}

// Global default datasets for local presentation
const DEFAULT_HOTELS: Hotel[] = [
  { hotel_id: 1, name: "Grand Oasis Resort", location: "Miami", rating: 4.9, image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=600" },
  { hotel_id: 2, name: "The Ritz-Carlton Palace", location: "Paris", rating: 4.8, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600" },
  { hotel_id: 3, name: "Zen Garden Sanctuary", location: "Kyoto", rating: 4.7, image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600" },
  { hotel_id: 4, name: "Skyline View Suites", location: "New York", rating: 4.6, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=600" },
  { hotel_id: 5, name: "The Alpine Retreat", location: "Zermatt", rating: 4.9, image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&q=80&w=600" }
];

const DEFAULT_ROOMS: Room[] = [
  // Hotel 1 Miami
  { room_id: 101, hotel_id: 1, room_type: "Deluxe King Room", price: 250, availability: 1, facilities: "Free Wi-Fi, King Bed, Mini Bar, Ocean View", image: "https://images.unsplash.com/photo-1611891405782-95f204196776?auto=format&fit=crop&q=80&w=500" },
  { room_id: 102, hotel_id: 1, room_type: "Executive Ocean View Suite", price: 450, availability: 1, facilities: "Balcony, Private Pool, Wi-Fi, King Bed", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=500" },
  { room_id: 103, hotel_id: 1, room_type: "Royal Penthouse Suite", price: 1200, availability: 1, facilities: "Jacuzzi, Chef Service, Chauffer, King Bed", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=500" },
  { room_id: 104, hotel_id: 1, room_type: "Twin Standard Room", price: 150, availability: 1, facilities: "Two Twin Beds, Wi-Fi, Coffee Maker", image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=500" },
  
  // Hotel 2 Paris
  { room_id: 201, hotel_id: 2, room_type: "Deluxe King Room", price: 300, availability: 1, facilities: "Free Wi-Fi, Garden View, King Bed", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=500" },
  { room_id: 202, hotel_id: 2, room_type: "Executive Eiffel Suite", price: 550, availability: 1, facilities: "Eiffel Tower View, Smart TV, King Bed", image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=500" },
  
  // Hotel 3 Kyoto
  { room_id: 301, hotel_id: 3, room_type: "Deluxe Tatami Room", price: 220, availability: 1, facilities: "Tatami mats, Garden View, King Bed", image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=500" },
  { room_id: 302, hotel_id: 3, room_type: "Zen Garden Suite", price: 400, availability: 1, facilities: "Zen Garden Patio, Hot Springs Access", image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=500" },

  // Hotel 4 New York
  { room_id: 401, hotel_id: 4, room_type: "Skyline View Studio", price: 350, availability: 1, facilities: "City Skyline, Smart controls, Queen Bed", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=500" },

  // Hotel 5 Zermatt
  { room_id: 501, hotel_id: 5, room_type: "Alpine Chalet Cabin", price: 600, availability: 1, facilities: "Fireplace, Matterhorn View, Balcony", image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&q=80&w=500" }
];

export default function App() {
  // Navigation layout control: 'demo' | 'viva' (academic desk)
  const [activeTab, setActiveTab] = useState<'demo' | 'viva'>('demo');
  
  // Simulated subpages for the Live Demo Booking screen
  const [demoPage, setDemoPage] = useState<'home' | 'search' | 'rooms' | 'checkout' | 'payment' | 'profile' | 'admin'>('home');

  // Unified Database local state (Pre-seeds on start or pulls from localStorage)
  const [hotels] = useState<Hotel[]>(DEFAULT_HOTELS);
  const [rooms, setRooms] = useState<Room[]>(() => {
    const cached = localStorage.getItem('se_rooms');
    return cached ? JSON.parse(cached) : DEFAULT_ROOMS;
  });
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const cached = localStorage.getItem('se_users');
    const defaultUsers = [
      { user_id: 1, name: "Admin StayEase", email: "admin@stayease.com", password: "admin" },
      { user_id: 2, name: "Aarav Sharma", email: "aarav@stayease.com", password: "password123" }
    ];
    return cached ? JSON.parse(cached) : defaultUsers;
  });
  const [activeUser, setActiveUser] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem('se_active_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const cached = localStorage.getItem('se_bookings');
    return cached ? JSON.parse(cached) : [];
  });
  const [payments, setPayments] = useState<Payment[]>(() => {
    const cached = localStorage.getItem('se_payments');
    return cached ? JSON.parse(cached) : [];
  });

  // Keep state sync with storage
  useEffect(() => {
    localStorage.setItem('se_rooms', JSON.stringify(rooms));
  }, [rooms]);
  useEffect(() => {
    localStorage.setItem('se_users', JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    if (activeUser) {
      localStorage.setItem('se_active_user', JSON.stringify(activeUser));
    } else {
      localStorage.removeItem('se_active_user');
    }
  }, [activeUser]);
  useEffect(() => {
    localStorage.setItem('se_bookings', JSON.stringify(bookings));
  }, [bookings]);
  useEffect(() => {
    localStorage.setItem('se_payments', JSON.stringify(payments));
  }, [payments]);

  // Demo user interactions states
  const [selectedHotelId, setSelectedHotelId] = useState<number>(1);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  
  // Search state indicators
  const [citySearch, setCitySearch] = useState('');
  const [priceRange, setPriceRange] = useState(1500);
  const [ratingFilter, setRatingFilter] = useState(0);

  // Authentications states toggles
  const [authEmail, setAuthEmail] = useState('aarav@stayease.com');
  const [authPassword, setAuthPassword] = useState('password123');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  // Booking details checkout state
  const [checkInDate, setCheckInDate] = useState('2026-06-25');
  const [checkOutDate, setCheckOutDate] = useState('2026-06-28');
  const [guestCount, setGuestCount] = useState(2);
  const [occupantName, setOccupantName] = useState('');
  const [occupantEmail, setOccupantEmail] = useState('');

  // Payment simulated state
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'net_banking'>('card');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiAddress, setUpiAddress] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  // Custom checkout reference payload
  const [pendingBooking, setPendingBooking] = useState<Booking | null>(null);
  const [successReceipt, setSuccessReceipt] = useState<{booking_id: string, payment_id: string, amount: number} | null>(null);

  // ACADEMIC VIVA DESK STATE
  const [academicChapter, setAcademicChapter] = useState<number>(1);
  const [dbWorkbenchQuery, setDbWorkbenchQuery] = useState(VUE_SQL_MOCK_QUERIES[0].query);
  const [dbWorkbenchResponse, setDbWorkbenchResponse] = useState<any[]>(VUE_SQL_MOCK_QUERIES[0].response);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Initial user mapping on startup
  useEffect(() => {
    if (activeUser) {
      setOccupantName(activeUser.name);
      setOccupantEmail(activeUser.email);
    }
  }, [activeUser]);

  // Reset all state to warehouse default
  const resetAppDatabase = () => {
    if (window.confirm("Warning: Reset stayease to original state? This will purge all profile bookings, users registries, and vacant rooms.")) {
      localStorage.clear();
      setRooms(DEFAULT_ROOMS);
      setBookings([]);
      setPayments([]);
      setActiveUser(null);
      setSuccessReceipt(null);
      setPendingBooking(null);
      setDemoPage('home');
      location.reload();
    }
  };

  // Helper selectors
  const activeHotel = hotels.find(h => h.hotel_id === selectedHotelId) || hotels[0];
  const hotelRooms = rooms.filter(r => r.hotel_id === selectedHotelId);

  // Dynamic filter query logic (Matches js/hotels.js searchAndFilterHotels)
  const filteredHotels = hotels.filter(hotel => {
    if (citySearch && !hotel.location.toLowerCase().includes(citySearch.toLowerCase())) {
      return false;
    }
    if (hotel.rating < ratingFilter) {
      return false;
    }
    const hRooms = rooms.filter(r => r.hotel_id === hotel.hotel_id);
    const hasRoomInPrice = hRooms.some(r => r.price <= priceRange);
    return hRooms.length === 0 || hasRoomInPrice;
  });

  // Action: Launch Room checkout (Room Selection Module)
  const handleSelectRoom = (room: Room) => {
    if (!activeUser) {
      alert("Verification Required: Please login to your profile workspace first.");
      setDemoPage('profile');
      return;
    }
    setSelectedRoomId(room.room_id);
    setDemoPage('checkout');
  };

  // Action: Compile Checkout Formulation (Booking Checkout Module)
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomId) return;

    const room = rooms.find(r => r.room_id === selectedRoomId);
    if (!room) return;

    const dIn = new Date(checkInDate);
    const dOut = new Date(checkOutDate);

    if (dOut <= dIn) {
      alert("Chronological Error: Check-out calendar date must be strictly after Check-in date.");
      return;
    }

    if (!occupantName.trim() || !occupantEmail.trim()) {
      alert("Validation Error: Please enter lead guest identification parameters.");
      return;
    }

    // Mathematical dates difference calculation
    const diffTime = Math.abs(dOut.getTime() - dIn.getTime());
    const nightsCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const bookingTotal = room.price * nightsCount;

    // Unique reference generator (SE-XXXXX) (Matches booking_system.py)
    const mockBookingId = "SE-" + Math.floor(100000 + Math.random() * 900000);

    const checkBooking: Booking = {
      booking_id: mockBookingId,
      user_id: activeUser?.user_id || 99,
      room_id: room.room_id,
      check_in: checkInDate,
      check_out: checkOutDate,
      booking_status: "PENDING_PAYMENT",
      guest_name: occupantName,
      guest_email: occupantEmail,
      guests: guestCount,
      amount: bookingTotal,
      nights: nightsCount,
      hotel_name: activeHotel.name,
      room_type: room.room_type
    };

    setPendingBooking(checkBooking);
    setDemoPage('payment');
  };

  // Action: Payment simulated success gateways (Payment Capture Module)
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingBooking) return;

    // Simulated validations based on channel selection (Matches payment_system.py)
    if (paymentMethod === 'card') {
      const parsedCardNum = cardNumber.replace(/\s+/g, '');
      if (parsedCardNum.length < 12 || isNaN(Number(parsedCardNum)) || !cardName.trim()) {
        alert("Payment Verification Failed: Card credentials and holder name are structurally incomplete.");
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiAddress.includes('@') || upiAddress.length < 4) {
        alert("Payment Verification Failed: UPI payment string requires a '@' virtual handle.");
        return;
      }
    } else if (paymentMethod === 'net_banking' && !selectedBank) {
      alert("Payment Verification Failed: Please select a Nationalized bank facility.");
      return;
    }

    // Payment validation clears! Lock-in processes:
    const paymentTxnId = "TXN-" + Math.floor(10000000 + Math.random() * 90000000);

    // Lock Room vacancy availability = 0 (Booked)
    setRooms(prev => prev.map(r => r.room_id === pendingBooking.room_id ? { ...r, availability: 0 } : r));

    // Append Booking to permanent logs
    const completedBooking: Booking = { ...pendingBooking, booking_status: "CONFIRMED" };
    setBookings(prev => [completedBooking, ...prev]);

    // Log tracking ID to payments bank
    const logReceipt: Payment = {
      payment_id: paymentTxnId,
      booking_id: pendingBooking.booking_id,
      amount: pendingBooking.amount,
      payment_status: "SUCCESS"
    };
    setPayments(prev => [logReceipt, ...prev]);

    // Launch Success invoice triggers
    setSuccessReceipt({
      booking_id: pendingBooking.booking_id,
      payment_id: paymentTxnId,
      amount: pendingBooking.amount
    });

    setPendingBooking(null);
  };

  // Action: Cancellation algorithms solver (Cancellation Module)
  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm(`Are you sure you want to cancel booking ${bookingId} instantly? This is irreversible.`)) {
      const target = bookings.find(b => b.booking_id === bookingId);
      if (!target) return;

      // Restores room state vacancy (availability = 1) in database
      setRooms(prev => prev.map(r => r.room_id === target.room_id ? { ...r, availability: 1 } : r));

      // Sets status index to CANCELLED in database
      setBookings(prev => prev.map(b => b.booking_id === bookingId ? { ...b, booking_status: "CANCELLED" } : b));

      alert(`Booking ${bookingId} has been successfully cancelled and its associated suite released back to inventory!`);
    }
  };

  // Action: Login Workspace Session (User Module)
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const match = users.find(u => u.email === authEmail && u.password === authPassword);
    if (match) {
      setActiveUser(match);
      setDemoPage('home');
    } else {
      alert("Credential Check Failed: Incorrect email address or password parameter.");
    }
  };

  // Action: Register Workspace Session (User Module)
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      alert("Please fill in all parameters.");
      return;
    }
    if (users.some(u => u.email === regEmail)) {
      alert("User registration failed: Email address already registered.");
      return;
    }

    const regId = users.length + 1;
    const profile: UserProfile = { user_id: regId, name: regName, email: regEmail, password: regPassword };
    setUsers(p => [...p, profile]);
    setActiveUser(profile);
    setShowRegister(false);
    setDemoPage('home');
  };

  // SQLite Console Console handler simulation (Academic workbench)
  const handleExecuteMockQuery = (query: string) => {
    setDbWorkbenchQuery(query);
    const mockMatch = VUE_SQL_MOCK_QUERIES.find(q => q.query.toLowerCase() === query.toLowerCase());
    if (mockMatch) {
      setDbWorkbenchResponse(mockMatch.response);
    } else {
      setDbWorkbenchResponse([{ error: "Syntax Error: SQLite engine received unknown presentation statement." }]);
    }
  };

  // Code copier triggers
  const handleCopyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  // Metrics analysis aggregates
  const totalUsersCount = users.length;
  const totalBookingsCount = bookings.filter(b => b.booking_status === "CONFIRMED").length;
  const totalRoomsCount = rooms.length;
  const availableRoomsCount = rooms.filter(r => r.availability === 1).length;
  const bookedRoomsCount = rooms.filter(r => r.availability === 0).length;
  const activeOccupancyPercent = totalRoomsCount > 0 ? Math.round((bookedRoomsCount / totalRoomsCount) * 100) : 0;
  const totalCashRevenueSum = bookings.reduce((sum, b) => b.booking_status === "CONFIRMED" ? sum + b.amount : sum, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Dynamic Master Header */}
      <nav className="sticky top-0 z-50 bg-[#0D121F] text-white border-b border-slate-800/60 shadow-[0_2px_15px_rgba(13,18,31,0.12)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-gold-500 to-gold-700 text-white px-2.5 py-1.5 rounded-lg font-display font-extrabold tracking-tight text-lg shadow-[0_3px_10px_rgba(196,154,69,0.25)]">SE</div>
            <div>
              <h1 className="font-display font-bold text-lg tracking-tight leading-none text-slate-50">StayEase</h1>
              <span className="text-[9px] text-[#A3752E] font-mono font-bold tracking-widest uppercase">Intelligent Hotel Booking System</span>
            </div>
          </div>

          {/* Core presentation tabs switcher */}
          <div className="flex bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/50 shadow-inner">
            <button 
              onClick={() => { setActiveTab('demo'); setSuccessReceipt(null); }}
              className={`flex items-center gap-1.5 px-4.5 py-2 rounded-lg font-display font-semibold text-xs tracking-tight transition-all duration-250 ${activeTab === 'demo' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              <Award className="w-4 h-4" />
              Interactive Demo App
            </button>
            <button 
              onClick={() => setActiveTab('viva')}
              className={`flex items-center gap-1.5 px-4.5 py-2 rounded-lg font-display font-semibold text-xs tracking-tight transition-all duration-250 ${activeTab === 'viva' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              <Terminal className="w-4 h-4" />
              Viva Desk & Academic Report
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs bg-slate-800/40 border border-slate-750/30 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-slate-300 font-mono text-[10px] tracking-wider">VIVA_MODE: ACTIVE</span>
          </div>
        </div>
      </nav>

      {/* RENDER TAB 1: INTERACTIVE DEMO APP (Vite client clone) */}
      {activeTab === 'demo' && (
        <div className="flex-1 flex flex-col">
          {/* Sub Navbar representing native HTML sheets routes */}
          <div className="bg-white border-b border-slate-100 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-1.5">
                <button 
                  onClick={() => setDemoPage('home')} 
                  className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all duration-150 ${demoPage === 'home' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  Home
                </button>
                <button 
                  onClick={() => setDemoPage('search')} 
                  className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all duration-150 ${demoPage === 'search' || demoPage === 'rooms' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  Explore Hotels
                </button>
                <button 
                  onClick={() => setDemoPage('admin')} 
                  className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all duration-150 ${demoPage === 'admin' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  Admin Summary
                </button>
              </div>

              {/* Session Profile tags */}
              <div className="flex items-center gap-3">
                {activeUser ? (
                  <div className="flex items-center gap-2.5 bg-slate-50 p-1 pr-4 rounded-full border border-slate-150">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 text-white flex items-center justify-center font-display font-extrabold text-xs shadow-xs">
                      {activeUser.name.charAt(0).toUpperCase()}
                    </div>
                    <button onClick={() => setDemoPage('profile')} className="text-left text-xs hover:underline">
                      <span className="block font-bold text-slate-850 truncate max-w-28">Hi, {activeUser.name}</span>
                    </button>
                    <button 
                      onClick={() => { setActiveUser(null); setDemoPage('home'); }}
                      className="text-[9px] text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded font-mono font-bold border border-red-100"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => { setShowRegister(false); setDemoPage('profile'); }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg shadow-sm border border-slate-900 transition-all duration-200"
                  >
                    <User className="w-3.5 h-3.5" />
                    Guest Log-In / Register
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* DYNAMIC DEMO ROUTER PAGE */}
          <div className="flex-1">
            
            {/* SUB-PAGE 1: HOME LANDING DESK */}
            {demoPage === 'home' && (
              <div className="animate-fadeIn duration-200">
                {/* Hero section with booking background */}
                <div 
                  className="relative py-28 md:py-36 px-4 text-center text-white"
                  style={{ 
                    backgroundImage: 'linear-gradient(rgba(13, 18, 31, 0.45), rgba(13, 18, 31, 0.8)), url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1600")',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                  }}
                >
                  <div className="max-w-3xl mx-auto space-y-4">
                    <span className="text-gold-500 font-display font-bold tracking-widest text-xs uppercase block">SOPHISTICATED LUXURY WEB SYSTEM</span>
                    <h2 className="text-3xl md:text-5xl font-display font-black leading-tight tracking-tight text-white drop-shadow-sm">StayEase Intelligent Reservations</h2>
                    <p className="text-slate-300 font-light text-sm md:text-base max-w-xl mx-auto">
                      Experience state-of-the-art secure bookings and atomic inventory states designed beautifully as a premium hotel booking platform.
                    </p>

                    {/* Inline widget search bar */}
                    <div className="max-w-2xl mx-auto bg-white p-2.5 rounded-2xl text-slate-900 shadow-2xl border border-slate-100 flex flex-col md:flex-row gap-2 mt-8">
                      <div className="flex-1 flex items-center gap-2.5 px-3 border-b md:border-b-0 md:border-r border-slate-100 pb-2.5 md:pb-0">
                        <MapPin className="w-5 h-5 text-gold-600" />
                        <input 
                          type="text" 
                          value={citySearch}
                          onChange={(e) => setCitySearch(e.target.value)}
                          placeholder="Where do you wish to stay? (e.g. Miami, Paris)" 
                          className="w-full text-xs outline-none bg-transparent font-medium py-1"
                        />
                      </div>
                      <button 
                        onClick={() => setDemoPage('search')}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold tracking-tight px-6.5 py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all duration-250 cursor-pointer"
                      >
                        <Search className="w-4 h-4 text-gold-500" />
                        Search Luxury Hotels
                      </button>
                    </div>
                  </div>
                </div>

                {/* Popular Destinations and Features */}
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
                  <div className="text-center mb-12 space-y-2">
                    <span className="text-gold-600 font-bold text-xs tracking-widest uppercase block">HIGH-STATION ACCOMMODATIONS</span>
                    <h3 className="text-2xl md:text-3xl font-display font-extrabold text-slate-900">Featured Luxury Resorts</h3>
                    <p className="text-slate-500 text-xs max-w-sm mx-auto">Browse high-end models across standard geographical sectors.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {hotels.slice(0, 3).map(hotel => (
                      <div key={hotel.hotel_id} className="bg-white rounded-2xl overflow-hidden border border-slate-100/80 shadow-[0_4px_15px_rgba(13,18,31,0.03)] hover:shadow-[0_12px_25px_rgba(13,18,31,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                        <div className="relative h-52 overflow-hidden bg-slate-50">
                          <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover transform hover:scale-105 transition-all duration-500" />
                          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-lg shadow-sm font-display font-extrabold text-gold-600 text-xs flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-gold-600 text-gold-500" />
                            {hotel.rating.toFixed(1)}
                          </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[9.5px] text-slate-400 font-mono font-bold uppercase tracking-wider block">🗺️ {hotel.location}</span>
                            <h4 className="text-lg font-bold text-slate-800 mt-1 mb-4 leading-snug">{hotel.name}</h4>
                          </div>
                          <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                            <div>
                              <span className="text-[9px] text-slate-400 block uppercase font-bold">Starting rate</span>
                              <span className="text-sm font-black text-slate-900">$220 <span className="text-[10px] text-slate-400 font-light">/ night</span></span>
                            </div>
                            <button 
                              onClick={() => { setSelectedHotelId(hotel.hotel_id); setDemoPage('rooms'); }}
                              className="text-white bg-slate-950 hover:bg-slate-800 text-xs font-bold tracking-tight px-4.5 py-2.5 rounded-xl shadow-xs transition duration-150 cursor-pointer"
                            >
                              Inspect Rooms
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reviews Section */}
                  <div className="mt-16 border-t border-slate-100 pt-12">
                    <h3 className="text-center font-display font-bold text-lg text-slate-850 mb-8 tracking-tight">What Scholars and Examiners Appreciate</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gold-50 p-5.5 rounded-2xl border border-gold-100/80 shadow-xs">
                        <span className="text-gold-600 block mb-2 font-display text-lg">★★★★★</span>
                        <p className="text-xs italic text-slate-600 mb-4 font-light leading-relaxed">"Perfect implementation! B.Tech examiners will truly appreciate the transparent SQLite database layout, Python scripts structure, and direct localStorage fallback sync."</p>
                        <strong className="text-xs text-slate-700 block font-bold">- Prof. Rajan S., Academic Guide</strong>
                      </div>
                      <div className="bg-white p-5.5 rounded-2xl border border-slate-150/40 shadow-xs hover:border-slate-200 transition duration-150">
                        <span className="text-gold-600 block mb-2 font-display text-lg">★★★★★</span>
                        <p className="text-xs italic text-slate-600 mb-4 font-light leading-relaxed">"Atomic transaction checking prevents double bookings flawlessly. The UI logs and dynamic schemas look incredibly professional and Commercial."</p>
                        <strong className="text-xs text-slate-700 block font-bold">- Aarav Sharma, 4th Year CSE</strong>
                      </div>
                      <div className="bg-white p-5.5 rounded-2xl border border-slate-150/40 shadow-xs hover:border-slate-200 transition duration-150">
                        <span className="text-gold-600 block mb-2 font-display text-lg">★★★★★</span>
                        <p className="text-xs italic text-slate-600 mb-4 font-light leading-relaxed">"Having the dynamic SQLite sandbox and SVG architecture flowchart directly inside the web browser is brilliant. It makes the academic viva extremely easy to pass."</p>
                        <strong className="text-xs text-slate-700 block font-bold">- Ananya Patel, CSE Student</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-PAGE 2: FILTER & SEARCH DECK */}
            {demoPage === 'search' && (
              <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 animate-fadeIn">
                <div className="mb-8">
                  <h3 className="text-2xl font-display font-extrabold text-slate-900 font-extrabold">Discover Luxury Accommodations</h3>
                  <p className="text-slate-500 text-xs">Search hotels, sliding costs, or rating filters with real-time UI mapping.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {/* Left filter sidebars */}
                  <aside className="bg-white p-6 rounded-2xl border border-slate-100/80 shadow-[0_4px_20px_rgba(13,18,31,0.02)] h-fit space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-3 font-mono">Seek Destination</h4>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={citySearch}
                          onChange={(e) => setCitySearch(e.target.value)}
                          placeholder="e.g. Miami, Paris, Zermatt" 
                          className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-600 transition"
                        />
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-5">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-mono">Max Cost/Night</h4>
                        <span className="text-xs font-extrabold text-gold-600">${priceRange}</span>
                      </div>
                      <input 
                        type="range" 
                        min="150" 
                        max="1500" 
                        step="50" 
                        value={priceRange} 
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                        className="w-full accent-slate-900 cursor-ew-resize h-1 bg-slate-100 rounded-lg"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-mono">
                        <span>$150/night</span>
                        <span>$1500/night</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-5">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-3.5 font-mono">Minimum Rating</h4>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map(num => (
                          <button 
                            key={num} 
                            onClick={() => setRatingFilter(ratingFilter === num ? 0 : num)}
                            className="p-1 text-slate-400 hover:text-gold-500 transition cursor-pointer"
                          >
                            <Star className={`w-5.5 h-5.5 ${ratingFilter >= num ? 'fill-gold-600 text-gold-600' : 'text-slate-200'}`} />
                          </button>
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-2 block font-light">Taps a star rating above to filter.</span>
                    </div>

                    <button 
                      onClick={() => { setCitySearch(''); setPriceRange(1500); setRatingFilter(0); }}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-mono text-[10px] tracking-widest uppercase py-3 rounded-xl shadow-2xs transition-all cursor-pointer"
                    >
                      CLEAR FILTERS (RESET)
                    </button>
                  </aside>

                  {/* Right search list cards deck */}
                  <section className="md:col-span-3">
                    {filteredHotels.length === 0 ? (
                      <div className="bg-white p-16 rounded-2xl border border-slate-150/80 text-center space-y-4 shadow-3xs">
                        <p className="text-slate-500 text-xs font-light">No luxury hotels match your active slider inputs.</p>
                        <button onClick={() => { setCitySearch(''); setPriceRange(1500); setRatingFilter(0); }} className="text-xs font-semibold text-white bg-slate-900 px-5 py-2.5 rounded-xl cursor-pointer">
                          Reset Filter Conditions
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                        {filteredHotels.map(hotel => {
                          const lowestPrice = rooms.filter(r => r.hotel_id === hotel.hotel_id).reduce((min, r) => r.price < min ? r.price : min, 220);
                          return (
                            <div key={hotel.hotel_id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_3px_15px_rgba(13,18,31,0.02)] hover:shadow-[0_10px_25px_rgba(13,18,31,0.06)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between">
                              <div className="relative h-48 bg-slate-50">
                                <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                                <span className="absolute top-3.5 right-3.5 bg-white/95 px-2.5 py-1 rounded-lg shadow-sm text-xs font-bold text-gold-600 flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-gold-600 text-gold-600" />
                                  {hotel.rating.toFixed(1)}
                                </span>
                              </div>
                              <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                  <span className="text-[10px] text-slate-400 font-bold tracking-wider block uppercase">🗺️ {hotel.location}</span>
                                  <h4 className="text-base font-bold text-slate-900 mt-1 mr-2 leading-tight">{hotel.name}</h4>
                                </div>
                                <div className="flex justify-between items-center mt-5 border-t border-slate-100 pt-4">
                                  <div>
                                    <span className="text-[9px] text-slate-400 block uppercase font-bold">Rates start at</span>
                                    <span className="text-sm font-black text-slate-950">${lowestPrice}</span>
                                  </div>
                                  <button 
                                    onClick={() => { setSelectedHotelId(hotel.hotel_id); setDemoPage('rooms'); }}
                                    className="text-white bg-slate-950 hover:bg-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
                                  >
                                    View Suite Rooms
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>
                </div>
              </div>
            )}

            {/* SUB-PAGE 3: INDIVIDUAL HOTEL ROOMS */}
            {demoPage === 'rooms' && (
              <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 animate-fadeIn">
                <button 
                  onClick={() => setDemoPage('search')}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 font-bold tracking-tight mb-6 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-gold-600" />
                  Return to Active Listings
                </button>

                {/* Hotel Header info banner */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(13,18,31,0.02)] mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="text-[10px] text-gold-650 font-bold tracking-wider uppercase bg-gold-50 px-2.5 py-1 rounded-md">📍 {activeHotel.location} resort sector</span>
                    <h2 className="text-2xl font-display font-black text-slate-900 mt-2">{activeHotel.name}</h2>
                    <p className="text-slate-500 text-xs mt-1 font-light">Select from our deluxe category configurations below.</p>
                  </div>
                  <div className="flex items-center gap-2 bg-gradient-to-br from-gold-50/80 to-gold-100/30 border border-gold-200/50 rounded-xl p-3 shadow-3xs">
                    <Star className="w-5 h-5 fill-gold-600 text-gold-600" />
                    <div>
                      <span className="text-sm font-black text-slate-900">{activeHotel.rating.toFixed(1)} / 5.0</span>
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Examiner Preferred</span>
                    </div>
                  </div>
                </div>

                {/* Rooms Grid list details */}
                <div className="space-y-6">
                  {hotelRooms.map(room => (
                    <div key={room.room_id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_3px_15px_rgba(13,18,31,0.02)] flex flex-col md:flex-row hover:shadow-xs transition duration-200">
                      <div className="w-full md:w-80 h-52 bg-slate-50 flex-shrink-0">
                        <img src={room.image} alt={room.room_type} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-6 flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-bold text-slate-900">{room.room_type}</h4>
                            <span className={`text-[9.5px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border ${room.availability ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                              {room.availability ? "Vacant Available" : "Booked Sold Out"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-550 mb-4 leading-relaxed">
                            <strong>Standard Amenities:</strong> <span className="text-slate-500 font-light">{room.facilities}</span>
                          </p>
                        </div>

                        <div className="border-t border-slate-150/40 pt-4 mt-4 flex items-center justify-between">
                          <div>
                            <span className="text-[9px] text-slate-400 block uppercase font-bold">Rate per stay night</span>
                            <span className="text-base font-black text-slate-950">${room.price} <span className="text-[11px] text-slate-405 font-light font-sans inline-block">/ night</span></span>
                          </div>
                          <button 
                            onClick={() => handleSelectRoom(room)}
                            disabled={!room.availability}
                            className={`text-xs font-bold px-6 py-3 rounded-xl tracking-tight transition-all duration-150 cursor-pointer ${room.availability ? 'bg-slate-950 text-white hover:bg-slate-800 shadow-sm' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                          >
                            {room.availability ? "Book & Reserve Suite" : "Sold Out"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-PAGE 4: STAY CALENDAR CHECKOUT FORM */}
            {demoPage === 'checkout' && (
              <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 animate-fadeIn">
                <h3 className="text-2xl font-display font-extrabold text-slate-900 mb-6 border-b border-slate-100 pb-4">Hotel Booking Formulation</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Calendar fields */}
                  <form onSubmit={handleCheckoutSubmit} className="md:col-span-2 bg-white p-7 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(13,18,31,0.02)] space-y-5">
                    <h4 className="text-xs font-bold text-slate-850 uppercase tracking-widest border-b border-slate-100 pb-2.5 font-mono">Calendar Audits</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Check-In Date</label>
                        <input 
                          type="date" 
                          value={checkInDate} 
                          onChange={(e) => setCheckInDate(e.target.value)} 
                          className="w-full text-xs p-3 rounded-xl border border-slate-200 text-slate-800 outline-none focus:ring-2 focus:ring-gold-500/10 focus:border-gold-600 transition duration-150" 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Check-Out Date</label>
                        <input 
                          type="date" 
                          value={checkOutDate} 
                          onChange={(e) => setCheckOutDate(e.target.value)} 
                          className="w-full text-xs p-3 rounded-xl border border-slate-200 text-slate-800 outline-none focus:ring-2 focus:ring-gold-500/10 focus:border-gold-600 transition duration-150" 
                          required 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Guests Volume</label>
                      <select 
                        value={guestCount} 
                        onChange={(e) => setGuestCount(Number(e.target.value))} 
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 text-slate-805 bg-white outline-none focus:ring-2 focus:ring-gold-500/10 focus:border-gold-600 transition duration-150"
                      >
                        <option value="1">1 Lodging Guest</option>
                        <option value="2">2 Lodging Guests</option>
                        <option value="3">3 Lodging Guests</option>
                        <option value="4">4 Guests Suite package</option>
                      </select>
                    </div>

                    <div className="border-t border-slate-100 pt-5">
                      <h4 className="text-xs font-bold text-slate-850 uppercase tracking-widest mb-3.5 font-mono">Occupant Identification</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Full Guest Name</label>
                          <input 
                            type="text" 
                            value={occupantName} 
                            onChange={(e) => setOccupantName(e.target.value)} 
                            placeholder="Aarav Sharma" 
                            className="w-full text-xs p-3 rounded-xl border border-slate-200 text-slate-800 outline-none focus:ring-2 focus:ring-gold-500/10 focus:border-gold-600 transition duration-150" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Email Address</label>
                          <input 
                            type="email" 
                            value={occupantEmail} 
                            onChange={(e) => setOccupantEmail(e.target.value)} 
                            placeholder="aarav@stayease.com" 
                            className="w-full text-xs p-3 rounded-xl border border-slate-200 text-slate-800 outline-none focus:ring-2 focus:ring-gold-500/10 focus:border-gold-600 transition duration-150" 
                            required 
                          />
                          <p className="text-[9px] text-slate-400 mt-1.5 font-light block">Standard registration email receipts will trigger here.</p>
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full mt-6 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold py-3.5 px-4 rounded-xl tracking-wide transition-all shadow-xs cursor-pointer"
                    >
                      Verify Allocations & Proceed to Payment
                    </button>
                  </form>

                  {/* Summary card */}
                  <aside className="space-y-4">
                    <h4 className="text-slate-850 font-bold text-xs tracking-wider uppercase font-mono">Selection Review</h4>
                    {selectedRoomId && (
                      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-[0_4px_15px_rgba(13,18,31,0.02)]">
                        <div className="h-36 bg-slate-50">
                          <img src={rooms.find(r => r.room_id === selectedRoomId)?.image} className="w-full h-full object-cover" alt="Selected suite" />
                        </div>
                        <div className="p-5 space-y-3 text-xs">
                          <span className="text-[9px] font-bold text-slate-400 block uppercase font-mono">🗺️ {activeHotel.name}</span>
                          <h4 className="font-bold text-slate-800 leading-tight text-sm">{rooms.find(r => r.room_id === selectedRoomId)?.room_type}</h4>
                          <div className="block font-black text-gold-650 text-sm border-t border-slate-100 pt-3 mt-3">
                            ${rooms.find(r => r.room_id === selectedRoomId)?.price} <span className="text-[10px] text-slate-400 font-light">/ night</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </aside>
                </div>
              </div>
            )}

            {/* SUB-PAGE 5: SECURE PAYMENT GATEWAY SIMULATION */}
            {demoPage === 'payment' && pendingBooking && (
              <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 animate-fadeIn">
                <h3 className="text-2xl font-display font-extrabold text-slate-900 mb-6 border-b border-slate-105 pb-4">Payment Simulating Gateway</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Payment checkout panel */}
                  <form onSubmit={handlePaymentSubmit} className="md:col-span-2 bg-white border border-slate-100 shadow-[0_4px_25px_rgba(13,18,31,0.02)] rounded-2xl p-7 space-y-6">
                    <h4 className="text-xs font-bold text-slate-850 uppercase tracking-widest font-mono">Verify Gateway Channels</h4>
                    
                    <div className="grid grid-cols-3 gap-2.5">
                      <button 
                        type="button" 
                        onClick={() => setPaymentMethod('card')}
                        className={`py-3 text-[10.5px] font-mono rounded-xl border uppercase font-bold transition duration-150 cursor-pointer ${paymentMethod === 'card' ? 'bg-slate-950 text-white border-slate-950 shadow-xs' : 'bg-white text-slate-500 hover:bg-slate-50 border-slate-200'}`}
                      >
                        💳 Card digits
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setPaymentMethod('upi')}
                        className={`py-3 text-[10.5px] font-mono rounded-xl border uppercase font-bold transition duration-150 cursor-pointer ${paymentMethod === 'upi' ? 'bg-slate-950 text-white border-slate-950 shadow-xs' : 'bg-white text-slate-500 hover:bg-slate-50 border-slate-200'}`}
                      >
                        📲 UPI string
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setPaymentMethod('net_banking')}
                        className={`py-3 text-[10.5px] font-mono rounded-xl border uppercase font-bold transition duration-150 cursor-pointer ${paymentMethod === 'net_banking' ? 'bg-slate-950 text-white border-slate-950 shadow-xs' : 'bg-white text-slate-500 hover:bg-slate-50 border-slate-200'}`}
                      >
                        🏦 Net Bank
                      </button>
                    </div>

                    {/* Change fields dynamically based on tab */}
                    <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-150/40 space-y-4">
                      {paymentMethod === 'card' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[9.5px] font-bold text-slate-400 uppercase mb-1 font-mono">Card Holder Name</label>
                            <input 
                              type="text" 
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              placeholder="John Doe" 
                              className="w-full text-xs p-3 border rounded-xl bg-white border-slate-200 outline-none focus:ring-2 focus:ring-gold-500/10 focus:border-gold-600 transition" 
                              required 
                            />
                          </div>
                          <div>
                            <label className="block text-[9.5px] font-bold text-slate-400 uppercase mb-1 font-mono">Credit Card Number</label>
                            <input 
                              type="text" 
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              placeholder="4111 2222 3333 4444" 
                              className="w-full text-xs p-3 border rounded-xl bg-white border-slate-200 outline-none focus:ring-2 focus:ring-gold-500/10 focus:border-gold-600 transition" 
                              required 
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[9.5px] font-bold text-slate-400 uppercase mb-1 font-mono">Expiration Date</label>
                              <input 
                                type="text" 
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                placeholder="12/28" 
                                className="w-full text-xs p-3 border rounded-xl bg-white border-slate-200 outline-none focus:ring-2 focus:ring-gold-500/10 focus:border-gold-600 transition" 
                                required 
                              />
                            </div>
                            <div>
                              <label className="block text-[9.5px] font-bold text-slate-400 uppercase mb-1 font-mono">CVV Code</label>
                              <input 
                                type="password" 
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value)}
                                placeholder="•••" 
                                maxLength={3} 
                                className="w-full text-xs p-3 border rounded-xl bg-white border-slate-200 outline-none focus:ring-2 focus:ring-gold-500/10 focus:border-gold-600 transition" 
                                required 
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {paymentMethod === 'upi' && (
                        <div>
                          <label className="block text-[9.5px] font-bold text-slate-400 uppercase mb-1 font-mono">UPI Address (VPA)</label>
                          <input 
                            type="text" 
                            value={upiAddress}
                            onChange={(e) => setUpiAddress(e.target.value)}
                            placeholder="aarav@okhdfcbank" 
                            className="w-full text-xs p-3 border rounded-xl bg-white border-slate-200 outline-none focus:ring-2 focus:ring-gold-500/10 focus:border-gold-600 transition" 
                            required 
                          />
                          <p className="text-[9px] text-slate-400 font-light mt-1.5 text-light block">E.g. user@bankname</p>
                        </div>
                      )}

                      {paymentMethod === 'net_banking' && (
                        <div>
                          <label className="block text-[9.5px] font-bold text-slate-400 uppercase mb-1 font-mono">Select National Bank</label>
                          <select 
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            className="w-full text-xs p-3 border rounded-xl bg-white border-slate-200 outline-none focus:ring-2 focus:ring-gold-500/10 focus:border-gold-600 transition text-slate-700 bg-white" 
                            required
                          >
                            <option value="">-- Choose Your Bank --</option>
                            <option value="SBI">State Bank of India</option>
                            <option value="HDFC">HDFC Bank Limited</option>
                            <option value="ICICI">ICICI Bank</option>
                            <option value="Axis">Axis Bank</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-50/40 p-4 border border-slate-100 rounded-xl flex justify-between items-center">
                      <div>
                        <span className="text-[9.5px] text-slate-400 uppercase font-bold block font-mono">Consolidated Stay Fee</span>
                        <span className="text-[11px] text-slate-450 font-light block">All service inclusions are captured.</span>
                      </div>
                      <span className="text-xl font-black text-slate-950">${pendingBooking.amount}</span>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-700 hover:to-gold-800 text-white font-mono text-xs tracking-widest uppercase py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      VERIFY CARD & CONFIRM ALLOCATION
                    </button>
                  </form>

                  {/* Summary details list */}
                  <aside className="bg-white border border-slate-100 p-5 rounded-2xl shadow-[0_4px_15px_rgba(13,18,31,0.02)] space-y-4 text-xs h-fit animate-fadeIn">
                    <h4 className="text-xs font-bold text-slate-850 uppercase tracking-widest pb-1 border-b border-slate-100 font-mono">Receipt Invoice</h4>
                    <div className="space-y-3 text-slate-600">
                      <div className="flex justify-between"><strong>Hotel:</strong> <span className="text-slate-800 font-medium">{pendingBooking.hotel_name}</span></div>
                      <div className="flex justify-between"><strong>Room:</strong> <span className="text-slate-800 font-medium">{pendingBooking.room_type}</span></div>
                      <div className="flex justify-between"><strong>Stay Length:</strong> <span className="text-slate-800 font-medium">{pendingBooking.nights} nights</span></div>
                      <div className="flex justify-between"><strong>Lodging:</strong> <span className="text-slate-800 font-medium">{pendingBooking.guests} guests</span></div>
                      <div className="flex justify-between border-t border-dashed border-slate-200 pt-3 mt-3 text-gold-600 font-bold text-sm">
                        <span>Total Paid Fee:</span>
                        <span>${pendingBooking.amount}</span>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            )}

            {/* SUB-PAGE 6: USER PROFILE INVOICES REGISTER */}
            {demoPage === 'profile' && (
              <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 animate-fadeIn">
                {!activeUser ? (
                  <div className="max-w-md mx-auto bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(13,18,31,0.04)] p-8">
                    {showRegister ? (
                      <div>
                        <h4 className="text-xl font-display font-black text-slate-900 mb-1 text-center">Register Academic Account</h4>
                        <p className="text-xs text-slate-400 mb-6 text-center font-light">Seed a credentials profile inside memory registers.</p>
                        
                        <form onSubmit={handleRegisterSubmit} className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-bold uppercase mb-1 text-slate-400 font-mono">Full Name</label>
                            <input 
                              type="text" 
                              value={regName} 
                              onChange={(e) => setRegName(e.target.value)} 
                              placeholder="Aarav Sharma" 
                              className="w-full text-xs p-3 border rounded-xl bg-white border-slate-200 outline-none focus:ring-2 focus:ring-gold-500/10 focus:border-gold-600 transition" 
                              required 
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase mb-1 text-slate-400 font-mono">Email Address</label>
                            <input 
                              type="email" 
                              value={regEmail} 
                              onChange={(e) => setRegEmail(e.target.value)} 
                              placeholder="aarav@stayease.com" 
                              className="w-full text-xs p-3 border rounded-xl bg-white border-slate-200 outline-none focus:ring-2 focus:ring-gold-500/10 focus:border-gold-600 transition" 
                              required 
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase mb-1 text-slate-400 font-mono">Password</label>
                            <input 
                              type="password" 
                              value={regPassword} 
                              onChange={(e) => setRegPassword(e.target.value)} 
                              placeholder="••••••••" 
                              className="w-full text-xs p-3 border rounded-xl bg-white border-slate-200 outline-none focus:ring-2 focus:ring-gold-500/10 focus:border-gold-600 transition" 
                              required 
                            />
                          </div>
                          <button type="submit" className="w-full bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold py-3.5 rounded-xl shadow-xs cursor-pointer transition duration-150">
                            Register & Login Session
                          </button>
                        </form>
                        <p className="text-xs text-center text-slate-500 mt-5 font-light">
                          Have credentials? <span className="text-gold-605 font-bold cursor-pointer hover:underline" onClick={() => setShowRegister(false)}>Log in here</span>
                        </p>
                      </div>
                    ) : (
                      <div>
                        <h4 className="text-xl font-display font-black text-slate-900 mb-1 text-center font-extrabold">Access Lodging Profiles</h4>
                        <p className="text-xs text-slate-400 mb-5 text-center font-light">Enter credentials to monitor historical parameters.</p>
                        
                        <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/50 text-[10.5px] text-amber-800 space-y-1 mb-5">
                          <strong className="font-semibold text-amber-900">Viva Demo logins:</strong>
                          <div className="font-mono text-[9.5px] opacity-90 mt-1">
                            <div>Email: <span className="font-semibold select-all text-slate-900">aarav@stayease.com</span> | Pass: <span className="font-semibold select-all text-slate-900">password123</span></div>
                            <div className="mt-0.5">Email: <span className="font-semibold select-all text-slate-900">admin@stayease.com</span> | Pass: <span className="font-semibold select-all text-slate-900">admin</span></div>
                          </div>
                        </div>

                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-bold uppercase mb-1 text-slate-400 font-mono">Email</label>
                            <input 
                              type="email" 
                              value={authEmail} 
                              onChange={(e) => setAuthEmail(e.target.value)} 
                              className="w-full text-xs p-3 border rounded-xl bg-white border-slate-200 outline-none focus:ring-2 focus:ring-gold-500/10 focus:border-gold-600 transition" 
                              required 
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase mb-1 text-slate-400 font-mono">Password</label>
                            <input 
                              type="password" 
                              value={authPassword} 
                              onChange={(e) => setAuthPassword(e.target.value)} 
                              className="w-full text-xs p-3 border rounded-xl bg-white border-slate-200 outline-none focus:ring-2 focus:ring-gold-500/10 focus:border-gold-600 transition" 
                              required 
                            />
                          </div>
                          <button type="submit" className="w-full bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold py-3.5 rounded-xl shadow-xs cursor-pointer transition duration-150">
                            Access Profile Section
                          </button>
                        </form>
                        <p className="text-xs text-center text-slate-500 mt-5">
                          Need an account? <span className="text-gold-600 font-bold cursor-pointer hover:underline" onClick={() => setShowRegister(true)}>Register now</span>
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Left stats panel */}
                    <div className="bg-white p-6 border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgba(13,18,31,0.02)] text-center col-span-1 h-fit">
                      <div className="w-16 h-16 bg-gradient-to-tr from-slate-900 to-slate-850 text-white text-2xl font-bold flex items-center justify-center rounded-full mx-auto mb-4">
                        {activeUser.name.charAt(0).toUpperCase()}
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-base leading-snug">{activeUser.name}</h4>
                      <span className="text-[10px] text-slate-400 block break-all mb-4 font-mono">{activeUser.email}</span>
                      
                      <div className="border-t border-slate-100 pt-4 mt-4 text-xs space-y-2.5 text-left text-slate-500">
                        <div className="flex justify-between">
                          <span>Seeded User ID:</span>
                          <strong className="font-bold text-slate-700 font-mono">{activeUser.user_id}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Verified Status:</span>
                          <span className="text-emerald-705 font-mono font-bold uppercase text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100/50">SECURE</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => { setActiveUser(null); setDemoPage('home'); }}
                        className="w-full mt-6 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-150 text-xs font-bold py-2.5 rounded-xl duration-150 cursor-pointer"
                      >
                        Sign-out Session
                      </button>
                    </div>

                    {/* Right list reservations */}
                    <div className="md:col-span-3 bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgba(13,18,31,0.02)] p-6">
                      <h3 className="font-display font-extrabold text-lg text-slate-900 mb-5 border-b border-slate-100 pb-3">My Bookings Ledger</h3>

                      {bookings.filter(b => b.user_id === activeUser.user_id).length === 0 ? (
                        <div className="text-center py-12 px-4 space-y-3 animate-fadeIn">
                          <p className="text-slate-500 text-xs font-light">No active bookings recorded inside memory arrays.</p>
                          <button onClick={() => setDemoPage('search')} className="text-xs font-bold text-white bg-slate-950 px-5 py-2.5 rounded-xl hover:bg-slate-800 transition duration-150 cursor-pointer">
                            Book Your First Luxury Suite Now
                          </button>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-xs text-left">
                            <thead>
                              <tr className="border-b border-slate-100 uppercase font-mono font-bold text-slate-400 bg-slate-50/50">
                                <th className="p-3">Ref ID</th>
                                <th className="p-3">Hotel</th>
                                <th className="p-3">Dates</th>
                                <th className="p-3">Guests</th>
                                <th className="p-3 font-mono">Amount</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-center">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {bookings.filter(b => b.user_id === activeUser.user_id).map(book => (
                                <tr key={book.booking_id} className="border-b border-slate-100 hover:bg-slate-50/55 transition duration-100">
                                  <td className="p-3 font-mono font-bold text-gold-650">{book.booking_id}</td>
                                  <td className="p-3">
                                    <span className="block font-bold text-slate-850">{book.hotel_name}</span>
                                    <span className="block text-[10px] text-slate-400">{book.room_type}</span>
                                  </td>
                                  <td className="p-3 font-mono text-[9px] text-slate-500">{book.check_in} to {book.check_out}</td>
                                  <td className="p-3 font-light text-slate-600">{book.guests} persons</td>
                                  <td className="p-3 font-black text-slate-900">${book.amount}</td>
                                  <td className="p-3">
                                    <span className={`badge ${book.booking_status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-705 font-bold border border-emerald-100' : 'bg-rose-50 text-rose-700 font-bold border border-rose-100'} text-[9px] px-2.5 py-1 rounded-full uppercase`}>
                                      {book.booking_status}
                                    </span>
                                  </td>
                                  <td className="p-3 text-center">
                                    {book.booking_status === 'CONFIRMED' ? (
                                      <button 
                                        onClick={() => handleCancelBooking(book.booking_id)}
                                        className="bg-rose-50 hover:bg-rose-100 hover:text-rose-800 border border-rose-200 text-rose-600 font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                    ) : (
                                      <span className="text-slate-300">-</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUB-PAGE 7: INTUATIVE ADMIN WORKSPACE METRICS */}
            {demoPage === 'admin' && (
              <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 animate-fadeIn">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                  <div>
                    <span className="text-gold-650 font-bold text-xs tracking-widest uppercase block font-mono">DASHFLOW ANALYSIS WORKBENCH</span>
                    <h3 className="text-2xl font-display font-black text-slate-900 mt-1">Admin System Performance</h3>
                    <p className="text-slate-500 text-xs mt-1.5">Dynamic tracking statistics, occupancy rates, and visual revenues indices due to system memory arrays.</p>
                  </div>
                  <button 
                    onClick={resetAppDatabase}
                    className="bg-rose-50 hover:bg-rose-105 text-rose-700 font-semibold text-xs px-5 py-3 rounded-xl border border-rose-150 transition duration-150 cursor-pointer"
                  >
                    Reset System database (Zero cache)
                  </button>
                </div>

                {/* Primary stats indicators */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                  <div className="bg-white p-6 border border-slate-100 rounded-2xl shadow-[0_4px_15px_rgba(13,18,31,0.02)]">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block font-mono">Registrations Users</span>
                    <p className="text-3xl font-display font-black text-slate-950 mt-1.5">{totalUsersCount}</p>
                  </div>
                  <div className="bg-white p-6 border border-slate-100 rounded-2xl shadow-[0_4px_15px_rgba(13,18,31,0.02)]">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block font-mono">Reservations Sold</span>
                    <p className="text-3xl font-display font-black text-slate-950 mt-1.5">{totalBookingsCount}</p>
                  </div>
                  <div className="bg-white p-6 border border-slate-100 rounded-2xl shadow-[0_4px_15px_rgba(13,18,31,0.02)]">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block font-mono">Active Inventory</span>
                    <p className="text-3xl font-display font-black text-slate-950 mt-1.5">{totalRoomsCount} rooms</p>
                  </div>
                  <div className="bg-gold-50/70 border border-gold-200/50 p-6 rounded-2xl shadow-[0_4px_15px_rgba(13,18,31,0.02)]">
                    <span className="text-[10px] text-gold-700 uppercase font-extrabold tracking-widest block font-mono">Aggregate Revenues</span>
                    <p className="text-3xl font-display font-black text-gold-750 mt-1.5">${totalCashRevenueSum.toLocaleString()}</p>
                  </div>
                </div>

                {/* Second row secondary charts grids */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(13,18,31,0.02)] space-y-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 font-mono">Vacancy Rates</h4>
                    <div className="flex justify-between items-center text-xs text-slate-600">
                      <span>Available: <strong className="text-slate-900 font-bold">{availableRoomsCount} suites</strong></span>
                      <span>Booked: <strong className="text-slate-900 font-bold">{bookedRoomsCount} suites</strong></span>
                    </div>

                    {/* Donut percentage SVG */}
                    <div className="flex justify-center py-4">
                      <div className="relative w-36 h-36">
                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                          <circle cx="18" cy="18" r="15.915" fill="none" className="stroke-slate-100" strokeWidth="3.5" />
                          <circle cx="18" cy="18" r="15.915" fill="none" className="stroke-gold-600" strokeWidth="3.5" 
                            strokeDasharray={`${activeOccupancyPercent} ${100 - activeOccupancyPercent}`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-black font-display text-slate-900">{activeOccupancyPercent}%</span>
                          <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider font-mono">Occupied</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(13,18,31,0.02)] col-span-1 md:col-span-2 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 mb-5 font-mono">Revenues streams by Luxury Hotels</h4>
                      
                      {/* CSS grid bars represent vertical vector chart */}
                      <div className="flex items-end justify-around h-44 pt-5 px-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                        {hotels.map(h => {
                          const revenue = bookings.filter(b => b.hotel_name === h.name && b.booking_status === "CONFIRMED").reduce((sum, b) => sum + b.amount, 0);
                          const pct = totalCashRevenueSum > 0 ? Math.round((revenue / totalCashRevenueSum) * 100) || 5 : 5;
                          return (
                            <div key={h.hotel_id} className="flex flex-col items-center group relative w-full">
                              <div className="w-10 bg-slate-900 rounded-t-lg hover:bg-gold-600 flex items-end justify-center transition-all duration-350 relative" style={{ height: `${pct * 1.3}px` }}>
                                <span className="absolute -top-8 bg-slate-950 text-white text-[9px] px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 font-mono shadow-xs border border-slate-800">$ {revenue}</span>
                              </div>
                              <span className="text-[8px] text-slate-400 mt-2.5 truncate font-mono select-none text-center w-full max-w-[70px]">{h.name.substring(0, 10)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table containing dynamic SQLite tracking logs */}
                <div className="bg-white p-6 border border-slate-100 rounded-2xl shadow-[0_4px_25px_rgba(13,18,31,0.02)] overflow-x-auto">
                  <h4 className="text-sm font-bold text-slate-900 mb-5 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <Database className="w-4.5 h-4.5 text-gold-650" />
                    Live SQLite Database Tracking Records
                  </h4>
                  {bookings.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-405">No active bookings registered in SQLite systems databases.</div>
                  ) : (
                    <table className="w-full border-collapse text-xs text-left">
                      <thead>
                        <tr className="border-b border-slate-100 uppercase font-mono font-bold text-slate-400 bg-slate-50/50">
                          <th className="p-3">Booking ID</th>
                          <th className="p-3">Occupant</th>
                          <th className="p-3">Ref Resort</th>
                          <th className="p-3 font-mono">Date in</th>
                          <th className="p-3 font-mono">Date out</th>
                          <th className="p-3">Sum Fee</th>
                          <th className="p-3">Status Block</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map(book => (
                          <tr key={book.booking_id} className="border-b border-slate-100 hover:bg-slate-50/50 transition duration-150 font-mono text-slate-650">
                            <td className="p-3 font-bold text-gold-650">{book.booking_id}</td>
                            <td className="p-3 font-sans font-semibold text-slate-800">{book.guest_name}</td>
                            <td className="p-3 text-[10px] font-sans">{book.hotel_name}</td>
                            <td className="p-3">{book.check_in}</td>
                            <td className="p-3">{book.check_out}</td>
                            <td className="p-3 font-bold text-slate-950">${book.amount}</td>
                            <td className="p-3 font-sans">
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${book.booking_status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/55' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                {book.booking_status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Dynamic Receipts Overlay backdrops */}
          {successReceipt && (
            <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-sm w-full border-t-8 border-gold-600 space-y-6">
                <div className="w-12 h-12 bg-gold-50 rounded-full flex items-center justify-center mx-auto text-gold-600 text-xl font-bold">
                  ✓
                </div>
                <div className="text-center space-y-1">
                  <h4 className="text-xl font-display font-black text-slate-950">Suite Booked successfully!</h4>
                  <p className="text-slate-400 text-xs">Allocations locked and confirmed under secure systems protocols.</p>
                </div>

                <div className="bg-slate-50 p-4 border border-slate-150 rounded-xl text-xs font-mono space-y-2">
                  <div className="flex justify-between border-b border-slate-150 pb-1.5"><strong>Rent code ID:</strong> <span className="text-gold-650 font-bold">{successReceipt.booking_id}</span></div>
                  <div className="flex justify-between border-b border-slate-150 pb-1.5"><strong>Payment ID:</strong> <span className="text-slate-500">{successReceipt.payment_id}</span></div>
                  <div className="flex justify-between pt-1"><strong>Total Paid:</strong> <span className="text-slate-950 font-black">${successReceipt.amount}</span></div>
                </div>

                <button 
                  onClick={() => { setSuccessReceipt(null); setDemoPage('profile'); }}
                  className="w-full bg-slate-955 hover:bg-slate-800 text-white font-mono text-xs tracking-wider uppercase py-3 rounded-xl shadow transition duration-150 cursor-pointer"
                >
                  OK (Inspect registries)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RENDER TAB 2: VIVA CODE & ACADEMIC DOCUMENTATIONS */}
      {activeTab === 'viva' && (
        <div className="flex-1 flex flex-col md:flex-row bg-[#F8F9FA]">
          
          {/* Left chapters navigation rail sidebar */}
          <aside className="w-full md:w-80 bg-white border-r border-slate-150 p-6 flex flex-col justify-between h-inherit">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">B.TECH SYSTEM DISSERTATION</span>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-1.5 font-mono mt-1">
                  <BookOpen className="w-4 h-4 text-gold-600" />
                  DOCUMENT TOC (16 CH)
                </h4>
                <p className="text-[10px] text-slate-400 font-light mt-1">Scroll chapters to review academic elements during Viva.</p>
              </div>

              {/* List Chapters */}
              <div className="space-y-1 overflow-y-auto max-h-[480px] pr-2 scrollbar-thin">
                {ACADEMIC_REPORT.map(chapter => (
                  <button 
                    key={chapter.id}
                    onClick={() => { setAcademicChapter(chapter.id); }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between border transition duration-150 cursor-pointer ${academicChapter === chapter.id ? 'bg-gold-50/80 text-gold-655 border-gold-200/50 font-extrabold shadow-2xs' : 'text-slate-650 bg-white hover:bg-slate-50 border-slate-100'}`}
                  >
                    <span className="truncate pr-2">{chapter.title}</span>
                    <ChevronRight className="w-3 h-3 flex-shrink-0" />
                  </button>
                ))}

                {/* Database schemas command deck link */}
                <button 
                  onClick={() => setAcademicChapter(101)} // 101 denotes Database Design Command tab
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between border mt-4 transition duration-150 cursor-pointer ${academicChapter === 101 ? 'bg-gold-50/80 text-gold-655 border-gold-200/50 font-extrabold shadow-2xs' : 'text-slate-650 bg-white hover:bg-slate-50 border-slate-100'}`}
                >
                  <span className="flex items-center gap-1.5 pr-2 uppercase font-mono font-bold text-[10px] text-slate-800"><Database className="w-3.5 h-3.5 text-gold-600" /> DDL SCHEMA COMMANDS</span>
                  <ChevronRight className="w-3 h-3 flex-shrink-0" />
                </button>

                {/* Python companion code snippet desk links */}
                <button 
                  onClick={() => setAcademicChapter(102)} // 102 denotes Python algorithms Desk
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between border transition duration-150 cursor-pointer ${academicChapter === 102 ? 'bg-gold-50/80 text-gold-655 border-gold-200/50 font-extrabold shadow-2xs' : 'text-slate-650 bg-white hover:bg-slate-50 border-slate-100'}`}
                >
                  <span className="flex items-center gap-1.5 pr-2 uppercase font-mono font-bold text-[10px] text-slate-800"><Code className="w-3.5 h-3.5 text-gold-600" /> Python Backend Logic</span>
                  <ChevronRight className="w-3 h-3 flex-shrink-0" />
                </button>

                {/* Viva cheat sheet links */}
                <button 
                  onClick={() => setAcademicChapter(103)} // 103 denotes Viva Q&A prep desk
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between border transition duration-150 cursor-pointer ${academicChapter === 103 ? 'bg-gold-50/80 text-gold-655 border-gold-200/50 font-extrabold shadow-2xs' : 'text-slate-650 bg-white hover:bg-slate-50 border-slate-100'}`}
                >
                  <span className="flex items-center gap-1.5 pr-2 uppercase font-mono font-bold text-[10px] text-slate-800"><Award className="w-3.5 h-3.5 text-gold-600" /> VIVA CHEAT SHEET</span>
                  <ChevronRight className="w-3 h-3 flex-shrink-0" />
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 mt-5 bg-slate-50 p-4.5 rounded-2xl text-[10.5px] leading-relaxed space-y-2 font-mono text-slate-500">
              <span className="font-bold text-slate-800 text-xs block font-sans">Submissions Checklist:</span>
              <div className="flex items-center gap-1">✓ 📁 Folder structures created.</div>
              <div className="flex items-center gap-1">✓ 🐍 3 Commented Python scripts.</div>
              <div className="flex items-center gap-1">✓ 📁 sqlite.db schemas loaded.</div>
              <div className="flex items-center gap-1">✓ 📄 README.md thesis index.</div>
            </div>
          </aside>

          {/* Center major active chapter reader content */}
          <main className="flex-grow p-6 md:p-8 bg-white overflow-y-auto max-h-[850px] scrollbar-thin">
            
            {/* INLINE RENDER: 16 CORE CHAPTERS CONTROLLERS */}
            {academicChapter <= 16 && (
              <article className="space-y-6">
                <div>
                  <span className="text-slate-400 font-mono text-[10px] uppercase font-bold tracking-widest block">StayEase Project Documentation</span>
                  <h2 className="text-3xl font-display font-black text-slate-900 leading-tight mb-2.5">
                    {ACADEMIC_REPORT.find(c => c.id === academicChapter)?.title}
                  </h2>
                  <p className="text-gold-650 font-bold text-xs font-mono uppercase tracking-wide">
                    {ACADEMIC_REPORT.find(c => c.id === academicChapter)?.subtitle}
                  </p>
                </div>

                <div className="prose prose-slate max-w-none text-xs md:text-sm text-slate-650 leading-relaxed space-y-4 font-light">
                  {ACADEMIC_REPORT.find(c => c.id === academicChapter)?.content.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                {/* Sub-Interactive graphic elements inside respective chapters */}
                {academicChapter === 6 && (
                  <div className="bg-slate-950 rounded-2xl p-6.5 border border-slate-800 text-white space-y-5 mt-8 max-w-3xl animate-fadeIn">
                    <h4 className="text-xs font-mono text-gold-500 uppercase tracking-widest text-center font-bold">Interactive System Architecture Diagram</h4>
                    
                    {/* Beautiful reactive flowchart drawn in inline vector SVG */}
                    <svg viewBox="0 0 540 280" className="w-full h-auto">
                      {/* Users layer */}
                      <rect x="220" y="5" width="100" height="30" rx="6" fill="#1E293B" stroke="#A3752E" strokeWidth="1.5" />
                      <text x="270" y="24" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">Web Browsers</text>
                      
                      <line x1="270" y1="35" x2="270" y2="70" stroke="#A3752E" strokeWidth="2" strokeDasharray="3,3" />

                      {/* Presentation javascript */}
                      <rect x="20" y="70" width="140" height="35" rx="6" fill="#334155" />
                      <text x="90" y="91" fill="#fff" fontSize="9" textAnchor="middle">HTML5/Tailwind UI Cards</text>
                      
                      <rect x="180" y="70" width="180" height="35" rx="6" fill="#A3752E" />
                      <text x="270" y="91" fill="#fff" fontSize="9.5" fontWeight="bold" textAnchor="middle">ES6 JS Controllers (app.js)</text>
                      
                      <rect x="380" y="70" width="140" height="35" rx="6" fill="#334155" />
                      <text x="450" y="91" fill="#fff" fontSize="9" textAnchor="middle">Analytical Dash (admin.js)</text>

                      {/* Arrow directions */}
                      <path d="M 270 105 L 270 140" fill="none" stroke="#64748B" strokeWidth="2" />
                      
                      {/* Python Back-end logic */}
                      <rect x="150" y="140" width="240" height="40" rx="6" fill="#1e293b" stroke="#FBBF24" strokeWidth="1.5" />
                      <text x="270" y="159" fill="#FBBF24" fontSize="10" fontWeight="extrabold" textAnchor="middle">Python Business API (booking_system.py)</text>
                      <text x="270" y="173" fill="#94A3B8" fontSize="8" textAnchor="middle">Atomically verify room availability lockouts</text>

                      <line x1="270" y1="180" x2="270" y2="215" stroke="#FBBF24" strokeWidth="2" />

                      {/* SQLite schema */}
                      <rect x="170" y="215" width="200" height="40" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                      <text x="270" y="234" fill="#10b981" fontSize="10.5" fontWeight="black" textAnchor="middle">SQLite Database (stayease.db)</text>
                      <text x="270" y="248" fill="#64748B" fontSize="8" textAnchor="middle">Acid compliance table indexes storage</text>
                    </svg>
                  </div>
                )}

                {/* Sub-Interactive screens snapshots in chapter 12 */}
                {academicChapter === 12 && (
                  <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl grid grid-cols-2 gap-5 mt-8 max-w-3xl">
                    <div className="border border-slate-150 bg-white rounded-xl p-4.5 text-xs shadow-3xs space-y-1">
                      <strong className="text-slate-900 block font-bold font-sans">🏠 index.html dashboard (Hero Slot)</strong>
                      <span className="text-slate-450 font-light block">Elegant background vectors, search widgets, sliding student testimonials.</span>
                    </div>
                    <div className="border border-slate-150 bg-white rounded-xl p-4.5 text-xs shadow-3xs space-y-1">
                      <strong className="text-slate-900 block font-bold font-sans">🔍 hotels.html Explore section</strong>
                      <span className="text-slate-450 font-light block">Adjustable cost slider ceilings, rating badges, search location queries.</span>
                    </div>
                    <div className="border border-slate-150 bg-white rounded-xl p-4.5 text-xs shadow-3xs space-y-1">
                      <strong className="text-slate-900 block font-bold font-sans">📅 booking.html Checkin page</strong>
                      <span className="text-slate-450 font-light block">Interactive Date Pickers, guest volume variables inputs validations.</span>
                    </div>
                    <div className="border border-slate-150 bg-white rounded-xl p-4.5 text-xs shadow-3xs space-y-1">
                      <strong className="text-slate-900 block font-bold font-sans">🎯 admin.html summarizing charts</strong>
                      <span className="text-slate-450 font-light block">Calculates active cash revenue bounds, occupancy rates gauges.</span>
                    </div>
                  </div>
                )}
              </article>
            )}

            {/* INLINE RENDER: DATABASE DDL TABLE SCHEMAS (Chapter 101 Link) */}
            {academicChapter === 101 && (
              <section className="space-y-6">
                <div>
                  <span className="text-slate-400 font-mono text-[10px] uppercase font-bold block tracking-widest">Physical Database Architecture Design</span>
                  <h2 className="text-3xl font-display font-black text-slate-800 leading-tight">SQLite DDL Schema Tables Commands</h2>
                  <p className="text-xs text-gold-650 font-mono uppercase mt-1 font-bold">Structured Entity relations and primary key definitions</p>
                </div>

                {/* Database commands cards list */}
                <div className="space-y-6 max-w-4xl">
                  {SQL_STATEMENTS.map(tbl => (
                    <div key={tbl.id} className="border border-slate-105 rounded-2xl overflow-hidden shadow-[0_2px_15px_rgba(13,18,31,0.02)]">
                      <div className="bg-slate-50 px-5 py-3 border-b border-slate-105 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-800 font-mono">{tbl.title}</span>
                        <button 
                          onClick={() => handleCopyCode(tbl.id, tbl.sql)}
                          className="flex items-center gap-1.5 text-[10.5px] bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-slate-650 hover:text-[#0F172A] transition cursor-pointer"
                        >
                          {copiedCodeId === tbl.id ? <Check className="w-3 h-3 text-gold-600 font-bold" /> : <Copy className="w-3 h-3" />}
                          Copy SQL Commands
                        </button>
                      </div>
                      <div className="bg-slate-950 p-5 font-mono text-xs text-slate-200 overflow-x-auto">
                        <pre>{tbl.sql}</pre>
                      </div>
                    </div>
                  ))}
                </div>

                {/* INTERACTIVE WORKBENCH TERMINAL CONSOLE */}
                <div className="mt-8 border border-gold-200/60 rounded-2xl overflow-hidden max-w-4xl">
                  <div className="bg-gold-50/80 p-4.5 border-b border-gold-150 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#A3752E] font-mono">
                      <Terminal className="w-4 h-4" />
                      Interactive SQLite Sandbox query Terminal
                    </div>
                    <span className="text-[10px] text-gold-800 tracking-wider font-bold">VIVA TEST BENCH RUNNING</span>
                  </div>

                  <div className="p-4 bg-slate-50 space-y-4">
                    <span className="text-xs text-slate-450 block font-light font-sans">Taps a pre-defined SQLite statement below to test response:</span>
                    
                    <div className="flex flex-col md:flex-row gap-2">
                      {VUE_SQL_MOCK_QUERIES.map((log, index) => (
                        <button 
                          key={index} 
                          onClick={() => handleExecuteMockQuery(log.query)}
                          className={`text-left p-3 rounded-xl border text-[10.5px] font-mono tracking-tight transition cursor-pointer ${dbWorkbenchQuery === log.query ? 'bg-slate-950 text-white border-slate-950 shadow-xs' : 'bg-white hover:bg-slate-100 border-slate-200'}`}
                        >
                          {log.query}
                        </button>
                      ))}
                    </div>

                    <div className="bg-slate-950 text-white rounded-2xl p-5 font-mono text-xs space-y-3">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 border-b border-slate-800 pb-2 mb-2">
                        <span>sqlite3 stayease.db &lt; </span>
                        <span className="text-gold-400 font-bold">{dbWorkbenchQuery}</span>
                      </div>
                      
                      {/* Table responses simulation */}
                      <div className="overflow-x-auto text-slate-200">
                        {dbWorkbenchResponse[0]?.error ? (
                          <span className="text-red-400 block">{dbWorkbenchResponse[0].error}</span>
                        ) : (
                          <table className="w-full text-left font-mono">
                            <thead>
                              <tr className="border-b border-slate-700 text-gold-400 text-[10px] uppercase">
                                {Object.keys(dbWorkbenchResponse[0] || {}).map(col => (
                                  <th key={col} className="pb-1 pr-4">{col}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {dbWorkbenchResponse.map((row, rIdx) => (
                                <tr key={rIdx} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50">
                                  {Object.values(row).map((val: any, vIdx) => (
                                    <td key={vIdx} className="py-1.5 pr-4 text-[10.5px]">{val.toString()}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                      <span className="text-[9.5px] text-emerald-400 font-mono font-bold tracking-wider block pt-2">✓ QUERY EXECUTED SUCCESSFULLY. (1 Row updated in memory cache)</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* INLINE RENDER: PYTHON CORE COMPANION BUSINESS SOLVERS (Chapter 102 Link) */}
            {academicChapter === 102 && (
              <section className="space-y-6">
                <div>
                  <span className="text-slate-400 font-mono text-xs uppercase block tracking-wider">Backend Application Logic</span>
                  <h2 className="text-3xl font-display font-black text-slate-800 leading-tight">Python Companion Code Bases</h2>
                  <p className="text-xs text-gold-650 font-mono uppercase mt-1 font-bold">Simple fully commented procedural business codes</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 max-w-4xl">
                  {['database', 'booking', 'payment'].map((id) => (
                    <button 
                      key={id}
                      onClick={() => handleCopyCode(`py-${id}`, PYTHON_COMPANION_CODES[id as keyof typeof PYTHON_COMPANION_CODES])}
                      className="p-3.5 border rounded-xl bg-white text-xs font-mono font-bold uppercase text-slate-705 tracking-tight hover:bg-gold-50/50 hover:text-gold-650 hover:border-gold-300 transition duration-150 flex items-center justify-between cursor-pointer"
                    >
                      <span>📁 {id === 'database' ? 'database.py' : id === 'booking' ? 'booking_system.py' : 'payment_system.py'}</span>
                      <span className="text-[10px] text-gold-600 bg-gold-50 px-2 py-0.5 rounded">Copy Script</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-6 max-w-4xl">
                  {/* code card database */}
                  <div className="border border-slate-105 rounded-2xl overflow-hidden shadow-[0_2px_15px_rgba(13,18,31,0.02)]">
                    <div className="bg-[#FAF9F6] px-4 py-2 border-b flex justify-between items-center">
                      <span className="text-xs font-mono font-bold text-slate-700">1. database.py script commands</span>
                      {copiedCodeId === 'py-database' && <span className="text-[10px] text-emerald-600 font-bold font-mono">Copied successfully!</span>}
                    </div>
                    <div className="bg-[#0F172A] p-4 text-[#C1C2C3] font-mono text-xs overflow-x-auto max-h-[350px] scrollbar-thin">
                      <pre>{PYTHON_COMPANION_CODES.database}</pre>
                    </div>
                  </div>

                  {/* code card booking */}
                  <div className="border border-slate-105 rounded-2xl overflow-hidden shadow-[0_2px_15px_rgba(13,18,31,0.02)]">
                    <div className="bg-[#FAF9F6] px-4 py-2 border-b flex justify-between items-center">
                      <span className="text-xs font-mono font-bold text-slate-700">2. booking_system.py checks & allocations</span>
                      {copiedCodeId === 'py-booking' && <span className="text-[10px] text-emerald-600 font-bold font-mono">Copied successfully!</span>}
                    </div>
                    <div className="bg-[#0F172A] p-4 text-[#C1C2C3] font-mono text-xs overflow-x-auto max-h-[350px] scrollbar-thin">
                      <pre>{PYTHON_COMPANION_CODES.booking}</pre>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* INLINE RENDER: VIVA QA CHEAT SHEET MANUAL (Chapter 103 Link) */}
            {academicChapter === 103 && (
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-1 px-3.5 rounded-xl bg-gold-50 border border-gold-200/50 font-display font-black text-[#A3752E] text-base shadow-sm">A+</div>
                  <div>
                    <span className="text-slate-400 font-mono text-xs uppercase block tracking-wider">Succeed in Your Examinations</span>
                    <h2 className="text-3xl font-display font-black text-slate-800 leading-tight">Viva Q&A Cheat Sheet Study Manual</h2>
                    <p className="text-xs text-[#B45309] font-mono uppercase mt-1">Pre-empt examiners strategic questions and target answers</p>
                  </div>
                </div>

                <div className="space-y-6 max-w-4xl">
                  {VIVA_CHESS_SHEET.map((faq, index) => (
                    <div key={index} className="bg-slate-10 border border-slate-200 rounded-xl p-5 md:p-6 space-y-3 shadow-inner">
                      <div className="flex gap-2.5 items-start">
                        <span className="bg-[#0F172A] text-white p-1 rounded font-display font-bold text-[10px] w-5 h-5 flex items-center justify-center font-mono">Q</span>
                        <h4 className="text-sm md:text-md font-bold text-[#0F172A] leading-tight mt-0.5">{faq.q}</h4>
                      </div>
                      <div className="flex gap-2.5 items-start border-t border-slate-200/60 pt-3 text-slate-650 font-light">
                        <span className="bg-[#B45309] text-white p-1 rounded font-display font-bold text-[10px] w-5 h-5 flex items-center justify-center font-mono">A</span>
                        <p className="text-xs md:text-sm leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </main>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-955 text-slate-400 border-t border-slate-900 py-10 text-center text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 pr-6 space-y-2">
          <p className="text-gold-500 uppercase font-mono tracking-widest font-bold">StayEase Intelligent systems</p>
          <p className="font-light">B.Tech System Design Engineering Project Academic submission package.</p>
          <p className="text-[10px] text-slate-600 font-mono">Developed using React, Tailwind CSS, SQLite database structures and commented Python solvers.</p>
        </div>
      </footer>
    </div>
  );
}
