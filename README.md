# SkillSwap

A production-ready full-stack MERN application where users exchange skills and learn from each other.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + Tailwind CSS v4 |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Real-time | Socket.io |
| Uploads | Cloudinary |
| State | Context API |

## Project Structure

```
SkillSwap/
├── backend/                 # Express API (MVC)
│   ├── config/              # DB & Cloudinary config
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Auth, validation, upload, errors
│   ├── models/              # Mongoose schemas
│   ├── routes/              # REST API routes
│   ├── socket/              # Socket.io handlers
│   ├── utils/               # Helpers & email
│   ├── seed.js              # Database seeder
│   └── server.js            # Entry point
├── frontend/                # React SPA
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Auth, Theme, Socket, Notifications
│   │   ├── pages/           # Route pages
│   │   └── services/        # API client
│   └── public/
└── README.md
```

## Features

- **Public**: Home, About, Contact, Browse Skills, Skill Details, 404
- **Auth**: Register, Login, Logout, Forgot/Reset Password, Protected Routes
- **User**: Profile CRUD, Avatar upload, Skills offered/wanted, Search, Favorites, Dashboard
- **Swaps**: Send/Accept/Reject requests, Request history, Complete swaps
- **Chat**: Real-time messaging, Online/offline status, Typing indicators
- **Reviews**: Rate users, Leave reviews, Average ratings
- **Admin**: Analytics, User/Skill management, Review moderation, Activity logs
- **UI/UX**: Dark/light mode, Skeleton loaders, Toast notifications, Framer Motion animations

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, Cloudinary keys, SMTP settings
npm install
npm run dev
```

Seed the database (optional):

```bash
node seed.js
```

**Demo credentials after seeding:**
- Admin: `admin@skillswap.com` / `admin123`
- User: `demo@skillswap.com` / `demo123`

### Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/users` | Search users |
| GET | `/api/skills` | Browse skills |
| POST | `/api/swaps` | Create swap request |
| GET | `/api/messages/conversations` | Get conversations |
| POST | `/api/reviews` | Leave review |
| GET | `/api/admin/analytics` | Admin analytics |

## Deployment

### Frontend (Vercel)

1. Connect repo, set root to `frontend`
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environment variables:
   - `VITE_API_URL=https://your-api.onrender.com/api`
   - `VITE_SOCKET_URL=https://your-api.onrender.com`

### Backend (Render)

1. Connect repo, set root to `backend`
2. Build command: `npm install`
3. Start command: `npm start`
4. Environment variables from `.env.example`

## Security

- Helmet, CORS, Rate limiting
- JWT with httpOnly cookies
- bcrypt password hashing (12 rounds)
- Input validation with express-validator
- Role-based authorization (user/admin)
- Global error handling

## License

MIT
