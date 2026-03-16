# School Forum

A full-stack discussion forum built with **Next.js**, **NestJS**, **MongoDB**, and **Firebase Auth**.

## Project Structure

```
├── frontend/   # Next.js 14 app (React, Tailwind CSS, Firebase Auth)
└── backend/    # NestJS REST API (MongoDB via Mongoose, Firebase Admin SDK)
```

---

## Prerequisites

- Node.js 18+
- A [MongoDB Atlas](https://cloud.mongodb.com/) cluster (or local MongoDB)
- A [Firebase](https://console.firebase.google.com/) project with **Google Sign-In** enabled

---

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```

Run the dev server:

```bash
npm run dev   # starts on http://localhost:3001
```

---

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/forum?retryWrites=true&w=majority
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FRONTEND_ORIGIN=http://localhost:3001
PORT=3000
```

> Get Firebase service account credentials from:
> Firebase Console → Project Settings → Service Accounts → Generate new private key

Run the dev server:

```bash
npm run start:dev   # starts on http://localhost:3000
```

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/categories` | No | List all categories |
| POST | `/categories` | Yes | Create a category |
| GET | `/categories/:slug/threads` | No | List threads in a category |
| POST | `/categories/:slug/threads` | Yes | Create a thread |
| GET | `/threads/:id` | No | Get a single thread |
| GET | `/threads/:id/posts` | No | List posts in a thread |
| POST | `/threads/:id/posts` | Yes | Reply to a thread |

---

## Deployment

### Frontend → Vercel
1. Push to GitHub
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Set **Root Directory** to `frontend`
4. Add environment variables in Vercel dashboard

### Backend → Railway / Render
1. Connect your repo
2. Set **Root Directory** to `backend`
3. Set build command: `npm run build`
4. Set start command: `npm run start:prod`
5. Add all environment variables

---

## Tech Stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS, Firebase JS SDK
- **Backend:** NestJS 10, Mongoose 8, Firebase Admin SDK
- **Database:** MongoDB Atlas
- **Auth:** Firebase Authentication (Google Sign-In)
