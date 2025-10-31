
# Poll Voting App

A simple MERN app where Admins create polls, Users vote once, and results show in a bar chart.


 Features
- Register / Login
- Admin: Create, Close, Delete Polls
- User: Vote (once per poll)
- View live results (after poll closes)
- Responsive UI


 Tech Used
- **Frontend**: React, Axios, Recharts
- **Backend**: Node.js (ESM), Express, JWT
- **Database**: MongoDB (Mongoose)


 How to Run

 1. Clone & Install
git clone https://github.com/cs350892/pollsVoting.git
cd poll-voting-app

 Backend
cd backend
npm install

 Frontend
cd ../frontend
npm install


2. Setup `.env` (in `backend`)
   
PORT=5000
MONGO_URI=mongodb+srv://cs350892_db_user:XzZwdok7uyxNsn3x@cluster0.g1u1e67.mongodb.net/?appName=Cluster0
JWT_SECRET=0a72536b5889c03b70edc0cbde5184639ba2310c8211e48d08970e1725447421291d9a1ecb7bc21f0af84e8b13d52a9af5bd387109013d4031a189ffde1a03df


 4. Run
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start
```

Open: [http://localhost:3000](http://localhost:3000)

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


