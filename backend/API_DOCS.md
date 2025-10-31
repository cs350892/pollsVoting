# Poll Voting API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints except registration and login require a JWT token in the header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

## 1. Auth Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
    "name": "Your Name",
    "email": "your.email@example.com",
    "password": "yourpassword"
}

Response: {
    "message": "User registered successfully",
    "token": "jwt_token_here"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
    "email": "your.email@example.com",
    "password": "yourpassword"
}

Response: {
    "token": "jwt_token_here"
}
```

## 2. Polls Endpoints

### Create Poll (Admin Only)
```http
POST /polls
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
    "question": "What's your favorite color?",
    "options": ["Red", "Blue", "Green"],
    "closingAt": "2025-12-31T23:59:59.999Z"
}

Response: {
    "_id": "poll_id",
    "question": "What's your favorite color?",
    "options": ["Red", "Blue", "Green"],
    "closingAt": "2025-12-31T23:59:59.999Z",
    "isClosed": false,
    "createdBy": "user_id"
}
```

### Get Open Polls
```http
GET /polls/open
Authorization: Bearer YOUR_TOKEN

Response: [
    {
        "_id": "poll_id",
        "question": "What's your favorite color?",
        "options": ["Red", "Blue", "Green"],
        "closingAt": "2025-12-31T23:59:59.999Z",
        "isClosed": false
    }
]
```

### Get Admin Polls
```http
GET /polls/admin
Authorization: Bearer YOUR_TOKEN

Response: [
    {
        "_id": "poll_id",
        "question": "What's your favorite color?",
        "options": ["Red", "Blue", "Green"],
        "closingAt": "2025-12-31T23:59:59.999Z",
        "isClosed": false,
        "createdBy": "user_id"
    }
]
```

## 3. Votes Endpoints

### Cast Vote
```http
POST /votes
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
    "pollId": "poll_id_here",
    "optionIndex": 0
}

Response: {
    "msg": "Vote recorded"
}
```

### Check If User Voted
```http
GET /votes/:pollId/voted
Authorization: Bearer YOUR_TOKEN

Response: {
    "voted": true/false
}
```

## Common Issues & Solutions

### 1. Poll Creation Issues
- Ensure you're logged in as an admin user
- Check that your token is valid and included in the request
- Use the exact format for the request body:
  ```json
  {
    "question": "Your question here",
    "options": ["Option 1", "Option 2", "Option 3"],
    "closingAt": "YYYY-MM-DDTHH:mm:ss.sssZ"
  }
  ```

### 2. Authentication Issues
- Token format must be: `Bearer YOUR_TOKEN`
- Token must be included in the Authorization header
- Token must not be expired

### 3. Date Format
- Always use ISO format for dates: `YYYY-MM-DDTHH:mm:ss.sssZ`
- Example: `2025-12-31T23:59:59.999Z`

## Testing in Postman

1. First create a workspace in Postman
2. Set up environment variables:
   - `BASE_URL`: `http://localhost:5000/api`
   - `TOKEN`: (after login, store token here)

3. Testing Sequence:
   ```
   1. Register an admin user
   2. Login and save token
   3. Create a poll
   4. Get open polls
   5. Cast a vote
   6. Check results
   ```

4. Common Headers for all requests:
   ```
   Content-Type: application/json
   Authorization: Bearer {{TOKEN}}
   ```

## Error Codes

- `400`: Bad Request (Invalid data)
- `401`: Unauthorized (Missing or invalid token)
- `403`: Forbidden (Not admin for admin-only endpoints)
- `404`: Not Found
- `500`: Server Error