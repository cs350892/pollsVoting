
# Poll Voting App

A simple MERN app where Admins create polls, Users vote once, and results show in a bar chart.

## 🚀 Live Demo
[View on Render](https://your-app-name.onrender.com) _(Update after deployment)_

## ✨ Features
- Register / Login with JWT authentication
- Admin: Create, Close, Delete Polls
- User: Vote (once per poll)
- View live results (after poll closes)
- Responsive UI with React

## 🛠 Tech Stack
- **Frontend**: React, Vite, Axios, Recharts
- **Backend**: Node.js (ESM), Express, JWT
- **Database**: MongoDB (Mongoose)

## 📦 Deployment

This project is ready to deploy on Render! See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Quick Deploy to Render

1. Push code to GitHub
2. Connect repository to Render
3. Render will auto-detect `render.yaml`
4. Set environment variables (MONGO_URI, JWT_SECRET, etc.)
5. Deploy!

## 💻 Local Development

### 1. Clone & Install
```bash
git clone https://github.com/cs350892/pollsVoting.git
cd pollsVoting
npm run install:all
```

### 2. Setup Environment Variables

**Backend** - Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
FRONTEND_URL=http://localhost:5173
```

**Frontend** - Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Development Servers
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Open: [http://localhost:5173](http://localhost:5173)

---

1.  Test Accounts
| Role  | Email               | Password  |
|-------|---------------------|-----------|
| Admin | `admin@example.com` | `admin123`|
| User  | Register new        | Any       |



2.  API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Polls
- `POST /api/polls` → Create (Admin)
- `GET /api/polls/open` → Open polls
- `GET /api/polls/admin` → Admin's polls
- `GET /api/polls/:id/results` → Results


- `POST /api/votes` → Vote
- `GET /api/votes/:pollId/voted` → Check vote


