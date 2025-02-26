# Vomychat Backend

## Objective
To build the backend for a platform similar to Linktr.ee or Bento.me, incorporating user registration, login, referral system, and other essential functionalities. The backend should be secure, efficient, and scalable.

## Overview
The backend is designed for a platform where users create profiles to share social links, similar to Linktr.ee or Bento.me. Built with **Node.js and Express.js**, it uses **MongoDB** for data storage and emphasizes security, scalability, and RESTful API design. Key functionalities include:
- **User authentication**
- **Referral tracking**
- **Password management**
- **Analytics**

Security measures include protection against **SQL injection, XSS, and brute-force attacks**.

## Core Features
### A. User Authentication
- **Registration:**
  - Users provide email, username, and password.
  - Passwords are hashed using bcrypt (10 salt rounds) via a Mongoose pre-save hook.
  - A unique referral code is generated for each user.
  - Referral codes from existing users are validated and linked to the referredBy field.
- **Login:**
  - Validates credentials using bcrypt.compare.
  - Returns a JWT token (1-hour expiry) stored in an HttpOnly cookie to prevent XSS.
- **Password Reset:**
  - Generates a time-limited (1-hour) token.
  - Sends a reset link via email using Nodemailer (supports Gmail/Mailtrap).
  - Tokens are invalidated after use or expiration.

### B. Referral System
- **Referral Tracking:**
  - Users share unique referral links (e.g., `/register?referral=CODE`).
  - Referrals are stored with `referrerId` and `referredUserId`.
  - Status fields (pending/successful) track referral completion.
- **Rewards:**
  - Optional rewards collection logs credits or premium features awarded to referrers.
  - Business logic (e.g., awarding points) can be added via background jobs.

### C. API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register a new user |
| `/api/auth/login` | POST | Authenticate user |
| `/api/auth/logout` | POST | Clear JWT cookie |
| `/api/auth/forgot-password` | POST | Initiate password reset |
| `/api/auth/reset-password` | POST | Reset password |
| `/api/referrals/referral-stats` | GET | Fetch referral stats |

## Security Measures
### A. Vulnerability Mitigation
- **SQL/NoSQL Injection:** Prevented via Mongoose schema validation and parameterized queries.
- **XSS (Cross-Site Scripting):** Basic input sanitization using regex (email validation). HTML sanitization using **DOMPurify** is pending.
- **CSRF (Cross-Site Request Forgery):** Partial protection via `SameSite=Lax` cookie attribute. **CSRF tokens using `csurf` middleware** are pending.
- **Brute-Force Attacks:** Rate limiting (`express-rate-limit`) on `/login` and `/register` (5 attempts per 15 minutes).

### B. JWT Security
- Tokens signed with a secret key (`JWT_SECRET`) and stored in HttpOnly cookies.
- Short-lived tokens (1-hour expiry) reduce exposure risks.
- **Pending Improvements:**
  - Refresh token rotation.
  - Token blacklisting via Redis for immediate invalidation.

### C. Data Validation
- **Email:** Regex validation (`/^[\\w-]+(\\.[\\w-]+)*@([\\w-]+\\.)+[a-zA-Z]{2,7}$/`).
- **Password:** Hashed with bcrypt; optional strength checks (e.g., length, special characters).
- **Referral Codes:** Validated against the database to ensure existence.

## Database Design
The system consists of **three main collections:**
- **Users**: Stores user data (email, password, referral codes).
- **Referrals**: Tracks referrer-referred relationships.
- **Rewards (Optional)**: Stores credits or incentives for successful referrals.

Timestamps track account creation and token expiration.

## Error Handling
- **Custom Error Messages:**
  - `409 Conflict`: "Email/username already exists."
  - `401 Unauthorized`: "Invalid credentials."
  - `400 Bad Request`: "Invalid referral code" or "Expired token."
- **Global Error Middleware:**
  - Catches unhandled exceptions and returns `500 Internal Server Error`.
  - Logs errors to the console for debugging.

## Tools and Libraries
- **Express.js** - Routing and middleware handling.
- **Mongoose** - MongoDB interactions.
- **bcrypt** - Password hashing.
- **JWT** - User authentication.
- **Nodemailer** - Email handling for password resets.
- **Helmet & CORS** - Security enhancements.
- **express-rate-limit** - Prevents brute-force attacks.

## Testing and Validation
- **Manual Testing:**
  - Verified registration, login, and password reset using Postman.
  - Tested referral code generation and tracking.
- **Database Checks:**
  - Ensured data consistency in **MongoDB Compass**.
- **Security Audits:**
  - Validated HttpOnly cookies and rate limiting.
  - Tested edge cases (e.g., duplicate emails, invalid tokens).

## Deployment Readiness
- **Environment Variables:** Secrets like `JWT_SECRET` and database URLs are stored in `.env`.
- **Scalability:** Stateless JWT design supports horizontal scaling.
- **Production Improvements:**
  - Implement **HTTPS**.
  - **Redis** for token management.

## Conclusion
The backend is functional for core use cases but requires additional **security hardening (CSRF, XSS)** before production deployment. Next steps include **frontend integration, load testing, and deploying with HTTPS**.

---

