# Blue Waves Aquatic Center 🌊

Welcome to the official repository for the **Blue Waves Aquatic Center** website. This is a modern, high-performance Single Page Application (SPA) built with React, Vite, and Supabase. It features a fully dynamic, database-driven Admin Panel that allows non-technical users to manage the site's content instantly.

## 🚀 Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite (Lightning fast HMR and optimized production builds)
- **Styling**: Modern Custom CSS (Variables, Flexbox/Grid, clamp() responsive typography, Glassmorphism)
- **Database / Backend**: Supabase (PostgreSQL)
- **Form Handling**: Formspree (AJAX submission)
- **Routing**: React Router DOM
- **Deployment Ready**: Configured perfectly for Netlify or Cloudflare Pages

---

## 📂 Project Structure

```text
BLUEWAVES_ATTINGAL/
├── database/
│   └── schema.sql          # PostgreSQL table schemas and RLS security policies
├── frontend/
│   ├── public/             # Static assets, SVG icons, and Netlify _redirects
│   ├── src/
│   │   ├── components/     # Reusable UI components (Icons, Animations)
│   │   ├── lib/            # Configuration files (Supabase client)
│   │   ├── pages/          # Main application views (Home, About, Contact, etc.)
│   │   │   └── admin/      # Secure dashboard panels for content management
│   │   ├── styles/         # Global and component-level CSS (index.css)
│   │   ├── App.jsx         # Main React Router setup
│   │   └── main.jsx        # React DOM entry point
│   ├── index.html          # HTML template
│   ├── package.json        # Dependencies and build scripts
│   └── vite.config.js      # Vite build configuration
└── README.md               # You are here!
```

---

## 🛠️ Local Development & Setup

To run this project locally on your machine, follow these steps:

**1. Navigate into the frontend directory:**
```bash
cd frontend
```

**2. Install all dependencies:**
```bash
npm install
```

**3. Start the development server:**
```bash
npm run dev
```
Your local server will start (usually at `http://localhost:5173`). Vite provides instant Hot Module Replacement (HMR) as you edit files.

**4. Build for Production:**
```bash
npm run build
```
This command compiles the site into tiny, highly-optimized static files located in the `frontend/dist` directory.

---

## 🗄️ Database & Admin Features

The site is connected to **Supabase**. The database securely manages the schedules, pricing, and gallery images. 

### Core Features:
- **Fully Dynamic Content:** The "Programs", "Membership Fees", and "Gallery" pages pull data directly from the Supabase database.
- **Admin Dashboard:** Located at `/admin`. Authorized admins can log in to directly manage, edit, and delete site content without touching the code.
- **Auto-Load Default Data:** If the database tables are ever empty, visiting the admin page will automatically seed the database with the original hardcoded site data to ensure the site never breaks.
- **No-Refresh Form Submission:** The Contact page is securely integrated with Formspree using background `fetch` requests, keeping the user on the site after submission.

*(Note: The database schema and security policies required for this site are located in `database/schema.sql`)*

---

## 🌐 Deployment to Netlify

This project is fully configured for a 1-click deployment to Netlify. 

Since this is a React SPA, a `public/_redirects` file is included to prevent 404 errors on sub-pages (like `/about`).

**Use these exact settings in your Netlify Dashboard:**
- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `dist`

No environment variables are required in Netlify because the Supabase connection keys are securely handled within the Vite build process.

---
*Designed & built for premium aquatic training facilities.*
