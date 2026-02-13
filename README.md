# Smart Bookmark App

A simple bookmark manager built using Next.js App Router and Supabase.

Users can log in using Google OAuth, add private bookmarks, delete them, and see updates in real-time without refreshing the page.

---

[Problems Faced During Development](#-problems-faced--solutions)

##  Live Demo

https://smart-bookmark-saver.vercel.app/

---

##  Tech Stack

- Next.js (App Router)
- Supabase (Auth, Database, Realtime)
- Google OAuth
- Tailwind CSS
- JavaScript (ES6+)

---

##  Features

- Google OAuth login (no email/password)
- Private bookmarks per user (Row Level Security)
- Add bookmarks (Title + URL)
- Delete bookmarks
- Realtime updates across multiple tabs
- Responsive UI

---

##  Project Architecture

- Next.js frontend
- Supabase for backend services:
  - Authentication
  - PostgreSQL database
  - Realtime subscriptions

---

##  Setup Instructions

1. Clone repository:

    git clone https://github.com/Sristy-72/smart-bookmark-saver


2. Install dependencies:

    npm install


3. Create `.env.local` file:

   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

4. Run development server:


---

## 🚧 Problems Faced & Solutions

### 1️ Google OAuth Setup Issues

**Problem:**  
Google login initially failed due to incorrect OAuth configuration.

**Solution:**  
Configured OAuth consent screen and added correct redirect URL:
https://PROJECT.supabase.co/auth/v1/callback


Also added production URL in Supabase Auth settings.

---

### 2️ Realtime Updates Not Working

**Problem:**  
Bookmarks were not updating automatically across tabs.

**Cause:**  
Table was not added to realtime publication.

**Solution:**  
Enabled realtime for `bookmarks` table from:

Database → Publications → supabase_realtime

---

### 3️ UI Not Updating After Add/Delete

**Problem:**  
Changes only visible after refreshing page.

**Solution:**  
Updated local state immediately after insert/delete and added realtime listener.

---

### 4️ URL Not Showing in UI

**Problem:**  
URL was saved in database but not visible.

**Solution:**  
Updated rendering logic to display both title and URL.

---

### 5️ Loading State & UX Improvements

Added:

- Loading indicators for async actions
- Disabled buttons during requests


---

##  Key Learnings

- Implementing OAuth with Supabase
- Managing realtime subscriptions
- Row Level Security for user privacy
- State management with async operations
- Deployment with Vercel

---

##  Deployment

Deployed using Vercel with environment variables configured.

---

##  Author

[Sristy](https://www.linkedin.com/in/sristy-720158266/)

