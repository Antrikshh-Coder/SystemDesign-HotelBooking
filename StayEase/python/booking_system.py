"""
StayEase Booking System - System Design Project (B.Tech)
Author: B.Tech Student
Description: Booking and reservation algorithms, managing transactions and room states
             interfaced with the SQLite database. Fully annotated for examiners.
"""

import sqlite3
import uuid
from datetime import datetime
from database import get_connection

def check_and_reserve_room(room_id):
    """
    Function: Verifies if a room is available and reserves it atomically.
    Input Parameters:
        - room_id (Integer): The unique primary key of the room.
    Output:
        - Tuple: (Boolean, String) matching (Success/Failure status, Explanation message)
    Algorithm Logic:
        Step 1: Open connection to the database.
        Step 2: Query the Rooms table for the specific room ID and retrieve its 'availability' status.
        Step 3: If room does not exist, return False with "Room not found" message.
        Step 4: Check if 'availability' is equal to 1 (Available).
        Step 5: If room is NOT available (availability == 0), return False with "Room not available" message.
        Step 6: If room IS available, run an UPDATE statement on Rooms to set availability = 0.
        Step 7: Commit transaction to lock in the reservation and return True with "Room reserved successfully".
    """
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        # Step 2: Fetch current availability status of the designated room
        cursor.execute("SELECT availability FROM Rooms WHERE room_id = ?;", (room_id,))
        room = cursor.fetchone()
        
        # Step 3: Check existence validation
        if not room:
            return (False, "Room not found")
            
        # Step 4-5: Evaluate availability status
        if room["availability"] == 0:
            return (False, "Room not available")
            
        # Step 6: Perform atomic state transition - Book the room (0 = Booked)
        cursor.execute("UPDATE Rooms SET availability = 0 WHERE room_id = ?;", (room_id,))
        conn.commit()
        
        # Step 7: Completed reservation state
        return (True, "Room reserved successfully")
        
    except sqlite3.Error as e:
        return (False, f"Database error encountered: {str(e)}")
    finally:
        if conn:
            conn.close()


def create_booking(user_id, room_id, check_in_date, check_out_date, num_guests):
    """
    Function: Validates details, reserves the room, and registers a unique booking entry.
    Input Parameters:
        - user_id (Integer): The client making the booking.
        - room_id (Integer): The selected room.
        - check_in_date (String): "YYYY-MM-DD" format check-in.
        - check_out_date (String): "YYYY-MM-DD" format check-out.
        - num_guests (Integer): Number of lodging guests.
    Output:
        - Dict/Tuple: (Boolean, Object/String) - Status and booking object or error description.
    Algorithm Logic:
        Step 1: Validate input parameters (Dates must be logical, num_guests must be > 0).
        Step 2: Validate that the User exists in the database.
        Step 3: Initiate room reservation via `check_and_reserve_room(room_id)`.
                If that returns False, halt and return the reservation error message.
        Step 4: Generate a unique booking ID using `uuid.uuid4()` (guarantees transaction isolation).
        Step 5: Compute dates difference to determine duration (for reference/payments calculation).
        Step 6: Insert the new transaction record into the 'Bookings' table with default status 'CONFIRMED'.
        Step 7: Commit database transaction to guarantee ACID standard compliance.
        Step 8: Return True and the booking ID.
    """
    conn = None
    try:
        # Step 1: Input Validation
        try:
            check_in = datetime.strptime(check_in_date, "%Y-%m-%d")
            check_out = datetime.strptime(check_out_date, "%Y-%m-%d")
            if check_out <= check_in:
                return (False, "Validation Error: Check-out date must be after Check-in date.")
            if int(num_guests) <= 0:
                return (False, "Validation Error: Number of guests must be greater than zero.")
        except ValueError:
            return (False, "Validation Error: Dates must be formatted in YYYY-MM-DD format.")
            
        conn = get_connection()
        cursor = conn.cursor()
        
        # Step 2: Validate user existance
        cursor.execute("SELECT name FROM Users WHERE user_id = ?;", (user_id,))
        user_exists = cursor.fetchone()
        if not user_exists:
            return (False, "Validation Error: User ID is invalid or does not exist.")
            
        # Step 3: Check and Reserve the Room
        reservation_ok, res_message = check_and_reserve_room(room_id)
        if not reservation_ok:
            return (False, f"Booking Failed: {res_message}")
            
        # Step 4: Generate a unique, recognizable booking ID
        booking_uuid = f"SE-{str(uuid.uuid4())[:8].upper()}"
        
        # Step 6: Create the Booking Record in the database
        cursor.execute("""
            INSERT INTO Bookings (booking_id, user_id, room_id, check_in, check_out, booking_status)
            VALUES (?, ?, ?, ?, ?, 'CONFIRMED');
        """, (booking_uuid, user_id, room_id, check_in_date, check_out_date))
        
        # Step 7: Commit transaction to SQLite
        conn.commit()
        
        print(f"[SUCCESS] Booking {booking_uuid} created successfully for {user_exists['name']}!")
        return (True, booking_uuid)
        
    except sqlite3.Error as e:
        return (False, f"System database error: {str(e)}")
    finally:
        if conn:
            conn.close()


def cancel_booking(booking_id):
    """
    Function: Locates an active booking, cancels it, and frees up the occupied room.
    Input Parameters:
        - booking_id (String): The custom generated Booking reference.
    Output:
        - Tuple: (Boolean, String) - Operation success review
    Algorithm Logic:
        Step 1: Open database connection.
        Step 2: Query 'Bookings' using booking_id to retrieve 'room_id' and the current 'booking_status'.
        Step 3: If booking record does not exist, return False with "Booking ID error".
        Step 4: Check if booking is already 'CANCELLED'. If yes, return False with "Booking already cancelled".
        Step 5: Write an UPDATE query on Bookings to change status to 'CANCELLED'.
        Step 6: Write an UPDATE query on Rooms to restore availability to 1 (Available) for that room ID.
        Step 7: Commit transactions to satisfy Database Integrity.
        Step 8: Return True and feedback confirmation message.
    """
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        # Step 2: Search for the booking record
        cursor.execute("SELECT room_id, booking_status FROM Bookings WHERE booking_id = ?;", (booking_id,))
        booking = cursor.fetchone()
        
        # Step 3 & 4: Record validation and sanity checks
        if not booking:
            return (False, "Booking reference ID not found in system registers.")
            
        if booking["booking_status"] == "CANCELLED":
            return (False, "This booking has already been cancelled previously.")
            
        room_id = booking["room_id"]
        
        # Step 5: Transition booking status to CANCELLED in database
        cursor.execute("UPDATE Bookings SET booking_status = 'CANCELLED' WHERE booking_id = ?;", (booking_id,))
        
        # Step 6: Revert Room state back to Available (1)
        cursor.execute("UPDATE Rooms SET availability = 1 WHERE room_id = ?;", (room_id,))
        
        # Step 7: Commit transaction atomic updates
        conn.commit()
        
        print(f"[SUCCESS] Cancellation Completed! Booking {booking_id} cancelled. Room {room_id} is now vacant.")
        return (True, "Booking cancelled successfully. Room is once again available.")
        
    except sqlite3.Error as e:
        return (False, f"System cancellation database error: {str(e)}")
    finally:
        if conn:
            conn.close()
