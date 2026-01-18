# MediFind LK 💊

**Sri Lanka's #1 crowdsourced medicine tracker.**

## Introduction

MediFind LK is the "Waze for Medicines" in Sri Lanka. It solves the critical problem of medicine shortages by allowing users to find pharmacy stock in real-time through crowdsourced data and direct inventory verification.

## Key Features

*   **🔍 Real-time Medicine Search**: Instantly find which pharmacies have the medicine you need.
*   **🗺️ Google Maps Integration**: View pharmacy locations and get directions.
*   **🚦 Crowdsourced Stock Verification**: Users can report stock levels (In Stock/Out of Stock), helping others (Waze-style).
*   **🏆 Gamified Leaderboard & Points System**: Earn points for contributing accurate data and climb the leaderboard.
*   **🏥 Pharmacy Owner Dashboard**: Dedicated dashboard for pharmacy owners to manage their inventory and update stock statuses.

## Tech Stack

*   **Frontend**: React (Vite), Tailwind CSS
*   **Backend**: Node.js, Express
*   **Database**: MongoDB (Mongoose)
*   **Deployment**: Vercel

## Installation Guide

Follow these steps to run the project locally.

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd medifind-lk
    ```

2.  **Install dependencies:**
    *   **Root (for backend and scripts):**
        ```bash
        npm install
        ```
    *   **Client (for frontend):**
        ```bash
        cd client
        npm install
        cd ..
        ```
    *   **API (for backend):**
        ```bash
        cd api
        npm install
        cd ..
        ```

3.  **Environment Variables:**
    Create a `.env` file in the `api` directory with the following variables:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```
    *(Note: Ensure you have a MongoDB instance running or a cloud cluster URL)*

4.  **Run the application:**
    From the root directory, run:
    ```bash
    npm start
    ```
    This command uses `concurrently` to start both the backend server (port 3000) and the frontend dev server (port 5173).

## Author

Developed by **Kavindu** (SLIIT Undergraduate).
