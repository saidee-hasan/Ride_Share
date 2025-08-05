# 🚗 Ride-Sharing Backend API

A backend Node.js API for managing a ride-sharing platform, supporting features like user management, ride requests, driver assignment, and cost calculation.

🚀 Live Demo
🔗 **Live Link:** [https://ride-booking-backend-assignment-5.vercel.app/](https://ride-booking-backend-assignment-5.vercel.app/)

## 📦 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **TypeScript**
- **Zod (Validation)**
- **Passport.js (Authentication)**
- **JWT (Token Handling)**
- **Nodemailer (Emailing)**
- **EJS (Email Templates)**

---

## 📦 Core Features

- **User will loged in as User at first**
- **User can request for being a DRIVER or ADMIN**
- **Once a user Become a Drive or Admin they can't be a user again**
- **User, Driver or Admin can requset a ride**
- **Driver can't accept his own ride requset as a rider**
- **Rider can CANCELED a ride before Direver accept it**
- **Driver can CANCEL a ride after accept it**
- **Once a ride been canceled driver can't accept it**
- **Rider can't request multiple ride at once**
- **Driver can't accept multiple rides at once**
- **All user have a online status either ONLINE | OFFLINE**
- **If all riders are OFFLINE user have to wait untile they become ONLINE**
- **To become a driver requested user must have a vehicle**
- **Vehicle should be Car | Bike**
- **Admin can BLOCK | INACTIVE | DELETE any User or DRIVER**
- **No limit of cancel ride request**
- **Driver can see only requested, pending or completed rides**
- **After access token expired user will autometically get a new access token by Refresh token**
- **Admin end points are Shared**
- **User must have to send access token through req.heders.Authorization to get access protected routes**

---

## enums

- RideStatus {
  REQUESTED = "REQUESTED",
  ACCEPTED = "ACCEPTED",
  CANCELED = "CANCELED",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  COMPLETED = "COMPLETED",
  }

- Role {
  ADMIN = "ADMIN",
  USER = "USER",
  DRIVER = "DRIVER",
  }

- IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
  }

- RoleStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  CANCELED = "CANCELED",
  }

- IsOnline {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
  }

- IVehicle {
  CAR = "CAR",
  BIKE = "BIKE",
  }

---

## ⚙️ Installation

````bash
git clone <your-repo-url>
cd <project-folder>
npm install

## 🔐 Environment Variables

Create a `.env` file in the root with the following structure:

```env
PORT=5000
DB_URI=URI_LINK
NODE_ENV=development
EXPRESS_SESSION_SECRET=r0wOhrLJC2mRgmIG4+qwdVcP0C5vX+a1eJrIeMxb6Es
FRONTEND_URL=http://localhost:5173

# super_admin
SUPER_ADMIN_EMAIL=example@gmail.com
SUPER_ADMIN_PASSWORD=123456
SUPER_ADMIN_PHONE=01899999999
SUPER_ADMIN_ADDRESS="Lalbagh, Dhaka"

# google-passport
GOOGLE_CLIENT_SECRET=google-s4WDphw
GOOGLE_CLIENT_ID=example.googleusercontent.com
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# bcryptjs
BCRYPT_SALT=10

# JWT
JWT_ACCESS_SECRET=b6ad4f4067f613b7007cc62d6c4276b9
JWT_REFRESH_SECRET=3db0719626dfaa103f99a3ddc6ec7dce
JWT_ACCESS_EXPIRESIN="1d"
JWT_REFRESH_EXPIRESIN="30d"

##🚀 API Endpoints

##🧍 User Routes
- POST /api/v1/user/create – Register a new user

body:{
    "name":"ronit",
    "email": "ronit1@gmail.com",
    "password": "123456",
    "phone": "01831495895"
}

- GET /api/v1/user?searchTerm=01&name=Md Ranit Rubbyat Sultan&sort=-phone&page=1&limit=10&fields=name,email,phone,address,role - Get all users / auth protected ADMIN only

- GET /api/v1/user/me – Get user profile / auth protected

- GET /api/v1/user/:id – Get a single user profile / auth protected ADMIN only

- GET /api/v1/user/req-role/all-req?sort=-createdAt&page=1&limit=10 – Get all role update request(driver | admin) / auth protected

- GET /api/v1/user/req-role/stats – Get all role update request stats / auth protected ADMIN only

- POST /api/v1/user/req-role/request – Create a role update request(driver | admin) / auth protected

if driver role been requested body:{
    "reqRole":"DRIVER",
    "vehicle":"CAR"
}

else {
    "reqRole":"ADMIN",
}

PATCH /api/v1/user/req-role/:id - Accepte the reques or reject it / auth protected ADMIN only

body:{
    "isAccepted":"ACCEPTED" | "isAccepted":"CANCELED"
}

PATCH /api/v1/user/:id - Update a user / auth protected (Some status like active | deleted | verified | role can be changed by only ADMIN)

body:{
    "name":"change",
    "phone":"change",
    "role":"change",
    "isActive":"change",
    "isDeleted":"change",
    "isVerified":"change",
    "address":"change",
    "isOnline":"change"
}

##🚘 Driver Routes
- PATCH /api/v1/driver/request/:id – Update ride status / auth protected

body:{
    "status":"COMPLETED"
}

## REQUESTED -> ACCEPTED | CANCELED -> PICKED_UP -> IN_TRANSIT -> COMPLETED

- GET /api/v1/driver/earning-history?sort=-createdAt&page=1&limit=10 – Direver all earning status / auth protected Driver only

- GET /api/v1/driver/get-ride-request?sort=-createdAt&page=1&limit=10 – Get all requested rides / auth protected DRIVER and ADMIN only

- GET /api/v1/driver/pending-ride/:id - Get the pending ride status for driver / auth protected DRIVER only

##🚘 Ride Routes

- POST /api/v1/ride/request - Request for a ride / auth protected

body:{
    "location": {
      "from": { "lat": 23.8456, "lng": 90.4002 },
      "to": { "lat": 23.8601, "lng": 90.4156 }
    }
}

- GET /api/v1/ride/history?rideStatus=REQUESTED&sort=-createdAt&fields=phone,location&page=1&limit=10 - Driver earning history / auth protected

- PATCH /api/v1/ride/cancel – Cancel the requested ride / auth protected

- DELETE /api/v1/ride/delete-all-cancel - Delete all canceled request / auth protected ADMIN only

##🔐 Auth Routes

- POST /api/v1/auth/login – Login user

body: {
    "email":"example@xyz.com"
    "password":"123456"
}

- POST /api/v1/auth/logout – Logout user

- POST /api/v1/auth/refresh-token – Get new access token

- POST /api/v1/auth/google – Google OAuth login

- POST /api/v1/auth/google/callback – Google OAuth login Callback

- POST /api/v1/auth/set-password – If user loged in with google user can set a password for credential login / auth protected

body:{
    "password": "123456"
}

- POST /api/v1/auth/change-password – Change user password / auth protected

body:{
    "oldPassword":"12345678",
    "newPassword":"123456"
}

````

## You can find all the demo of routes in the file Ride share.postman_collection.json

- Cpoy Ride share.postman_collection.json -> postman.exe
# Ride_Share
