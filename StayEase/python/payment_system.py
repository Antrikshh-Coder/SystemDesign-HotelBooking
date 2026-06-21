"""
StayEase Payment System - System Design Project (B.Tech)
Author: B.Tech Student
Description: Payment Gateway Simulation algorithm for credit, debit, UPI, and net-banking.
             Connects transactions to the database bookings. Includes detailed comments for viva.
"""

import sqlite3
import uuid
from database import get_connection

def process_stay_payment(booking_id, card_or_upi_details, payment_method, amount):
    """
    Function: Simulates processing of payments for a reservation and updates payment tables.
    Input Parameters:
        - booking_id (String): Selected Booking Reference ID (e.g., 'SE-A5B2CD3E').
        - card_or_upi_details (String): Custom details such as cardNumber, upiID, or Bank details.
        - payment_method (String): Selected option - 'CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'NET_BANKING'.
        - amount (Float): Total monetary value of the booking transaction.
    Output:
        - Tuple: (Boolean, Dict/String) - (Payment Success status, Details dict containing payment ID or error text)
    Algorithm Logic:
        Step 1: Check if booking details are valid and retrieve current booking status.
        Step 2: Verify parameter inputs. Confirm amount is valid (> 0). Identify payment method.
        Step 3: Conduct simulated "Security Verification" check:
                - If card details: ensure card number is 16 digits (simulated validation).
                - If UPI ID: ensure it contains '@' (simulated check).
                - If Net Banking: ensure bank name is specified.
        Step 4: Once verification succeeds, generate a unique simulated Payment ID (Format: 'TXN-XXXXXXXX').
        Step 5: Write query to find if a payment already exists for this booking_id to prevent double charge.
        Step 6: Insert transaction records inside SQLite 'Payments' Table with status 'SUCCESS'.
        Step 7: Commit transaction and return confirmation ID and status receipts.
    """
    conn = None
    try:
        # Step 2: Amount validation
        if float(amount) <= 0:
            return (False, "Process Error: Payment amount must be a positive number.")
            
        # Step 3: Payment details security validation
        payment_method = payment_method.strip().upper()
        details = card_or_upi_details.strip()
        
        if payment_method in ["CREDIT_CARD", "DEBIT_CARD"]:
            # Card numbers must be numeric and represent mock 16-digit cards
            clean_card = "".join(filter(str.isdigit, details))
            if len(clean_card) < 12 or len(clean_card) > 19:
                return (False, "Security Validation Failed: Incomplete Card Number. Must be 12-19 digits.")
                
        elif payment_method == "UPI":
            # UPI ID verification needs an '@' handle structure
            if "@" not in details or len(details) < 4:
                return (False, "Security Validation Failed: Incorrect UPI ID structure (Format: username@bank).")
                
        elif payment_method == "NET_BANKING":
            # Ensure merchant selected a bank
            if len(details) < 3:
                return (False, "Security Validation Failed: Please key in a valid Bank Name.")
                
        else:
            return (False, "Process Error: Unsupported payment option selected.")
            
        conn = get_connection()
        cursor = conn.cursor()
        
        # Step 1: Query Booking verification
        cursor.execute("SELECT booking_status FROM Bookings WHERE booking_id = ?;", (booking_id,))
        booking = cursor.fetchone()
        if not booking:
            return (False, "Process Error: Booking Reference ID error or does not exist.")
            
        # Step 5: Check duplication
        cursor.execute("SELECT payment_id FROM Payments WHERE booking_id = ? AND payment_status = 'SUCCESS';", (booking_id,))
        existing_txn = cursor.fetchone()
        if existing_txn:
            return (True, {
                "payment_id": existing_txn["payment_id"],
                "message": "Payment has already been successfully captured for this booking.",
                "amount": amount,
                "status": "SUCCESS"
            })
            
        # Step 4: Generate a unique payment confirmation ID
        payment_id = f"TXN-{str(uuid.uuid4())[:8].upper()}"
        
        # Step 6: Log payment transition record inside 'Payments' table
        cursor.execute("""
            INSERT INTO Payments (payment_id, booking_id, amount, payment_status)
            VALUES (?, ?, ?, 'SUCCESS');
        """, (payment_id, booking_id, float(amount)))
        
        # Commit transaction details
        conn.commit()
        
        print(f"[SUCCESS] Payment {payment_id} captured successfully for Booking {booking_id} ($ {amount})!")
        
        # Step 7: Completed payment verification response
        return (True, {
            "payment_id": payment_id,
            "booking_id": booking_id,
            "status": "SUCCESS",
            "amount": float(amount),
            "message": "Transaction verified and approved. Booking confirmed."
        })
        
    except sqlite3.Error as e:
        return (False, f"Secure payment platform error: {str(e)}")
    except ValueError:
        return (False, "Process Error: Amount parsing error.")
    finally:
        if conn:
            conn.close()
