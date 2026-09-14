# BHG Patient Portal — Project Overview

This document provides a comprehensive overview of the **BHG Patient Portal**, including its architecture, core features, and technical implementation details.

## 🏥 Project Mission
The BHG Patient Portal is designed as a **Unified Healthcare Experience Platform**. Its goal is to provide patients with a centralized, secure, and intuitive interface to manage their medical journey—from viewing lab results and tracking appointments to handling billing and communicating with care teams.

---

## 🏗️ Architecture & Tech Stack

The project is built using a modern, client-side web architecture optimized for speed and responsiveness.

### **Core Technology Stack**
*   **Frontend Framework:** [React 18](https://reactjs.org/) (Functional components with Hooks).
*   **Build Tooling:** [Vite](https://vitejs.dev/) (Extremely fast development server and optimized production builds).
*   **Routing:** [React Router DOM v6](https://reactrouter.com/) (Handles single-page application navigation).
*   **Styling:** CSS Modules / Tailwind-like approach with standard CSS for modularity and performance.
*   **Icons:** [Lucide React](https://lucide.dev/) (Clean, consistent iconography).
*   **State Management:** **React Context API** (Centralized `AppContext` for global state like authentication, navigation, and notifications).

### **System Architecture**
The application follows a **Single Page Application (SPA)** architecture:
1.  **Provider Layer (`AppProvider`):** Wraps the entire application to manage global state (auth status, current page, notifications, toasts, and sidebar state).
2.  **Routing Layer (`AppRouter`):** Dynamically renders components based on the `currentPage` value in the global context.
*   **Component Layer:** Modularized into:
    *   `Layout`: Provides the structural wrapper (Sidebar, Topbar).
    *   `Pages`: Individual views for specific features (Dashboard, Records, etc.).
    *   `Components`: Reusable UI elements (Sidebar items, Navigation links).
3.  **Data Layer (`mockData.js`):** A robust, internally consistent mock data system that simulates real-world medical records, appointments, and billing information, allowing for full-scale feature testing without a backend.

---

## ✨ Key Features

### **1. Unified Patient Dashboard**
The central hub of the portal, providing a high-level summary of upcoming appointments, recent medical activity, and critical notifications at a glance.

### **2. Medical Records Management (`Records`)**
A secure repository for all clinical data:
*   **Lab Results:** View detailed blood work (e.g., CBC, Metabolic Panels) with reference ranges and status indicators (Normal/Abnormal).
*   **Imaging Reports:** Access radiology reports (MRI, X-Ray) with findings and impressions.
*   **Prescription Tracking:** Monitor active medications, dosages, and refill status.
*   **Visit Summaries:** Review notes from recent consultations and physical examinations.

### **3. Appointment Scheduling (`Appointments`)**
Complete visibility into the patient's medical calendar:
*   **Upcoming/Past Appointments:** View details for scheduled visits and historical records.
*   **Provider Information:** Access specialist bios, department locations, and visit modes (In-Person vs. Telehealth).
*   **Status Tracking:** Real-time status updates (Confirmed, Scheduled, Completed).

### **4. Secure Messaging (`Messages`)**
A direct communication channel between patients and their care teams:
*   **Threaded Conversations:** Maintain a history of interactions with primary care physicians and billing departments.
*   **Real-time Notifications:** Unread message indicators to ensure timely responses.

### **5. Financial Management (`Billing`)**
Streamlined healthcare billing and transparency:
*   **Statement Overview:** View itemized statements, including service codes and costs.
*   **Insurance Integration:** Clear breakdown of covered vs. patient-responsibility amounts (Co-pays/Deductibles).
*   **Payment History:** Track previous transactions and upcoming due dates.

### **6. Patient Timeline (`Timeline`)**
A chronological "Medical Journey" view that aggregates events from all modules—appointments, lab results, and billing updates—into a single, easy-to-digest feed.

### **7. Self-Service & Support (`HelpCenter` & `Profile`)**
*   **Knowledge Base:** Categorized FAQs covering appointment booking, record sharing, and technical support.
*   **Profile Management:** Update personal information, contact preferences, and communication settings (Email/SMS).
*   **Notification Center:** Centralized hub for system alerts, appointment reminders, and lab result availability.

---

## 📂 Project Structure

```text
└── packages/
    ├── frontEnd/
    │   ├── public/          # Static assets
    │   ├── src/
    │   │   ├── components/ # Reusable UI components
    │   │   ├── context/    # Global state management
    │   │   ├── data/       # Mock data and business logic
    │   │   └── pages/      # Main feature views
    │   ├── package.json
    │   └── vite.config.js
    └── backend/
        ├── index.js         # Express API entry point
        └── package.json
```

---

## 🔐 Security & Privacy (Design Intent)
*   **Authentication Flow:** Integrated Login/Logout mechanism with protected route rendering.
*   **Data Integrity:** Use of structured, internally consistent mock data to ensure clinical accuracy in the UI.
*   **End-to-End Concept:** The architecture is designed to support end-to-end encryption for all patient communications and record access (as indicated by the platform's design goals).
