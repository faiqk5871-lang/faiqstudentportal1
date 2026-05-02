# Student Portal Deployment Guide

## Vercel Deployment (Frontend)
1. Push `index.html`, `style.css`, `script.js` to GitHub
2. Deploy on Vercel - it will serve static files automatically

## Backend Deployment (Railway/Render)
1. Create `uploads` folder in backend
2. Deploy backend folder to Railway/Render
3. Set MongoDB Atlas connection string in environment variables
4. Update frontend API URLs to your backend URL

## MongoDB Setup
1. Create free MongoDB Atlas account
2. Create new cluster
3. Get connection string and update `.env`

## Local Development
```bash
cd backend
npm install
npm run dev