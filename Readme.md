# Markly Backend API Documentation

## Overview

Markly is a bookmark sharing platform that allows users to save, organize, and share bookmarks with others. This API provides endpoints for user authentication (including Google OAuth), bookmark management, comments, and file uploads.

**Base URL:** `http://localhost:5000/api`  
**Version:** 1.0.0

## Authentication

The API supports two authentication methods:

### 1. Local Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### 2. Google OAuth Authentication
Users can authenticate using their Google accounts. The frontend should:
1. Use Google Sign-In SDK to get an ID token
2. Send the ID token to the backend for verification
3. Receive a JWT token for subsequent API calls

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (optional)"
}
```

## API Endpoints

### Authentication (`/auth`)

#### Register User (Local)
- **POST** `/auth/register`
- **Description:** Create a new user account with email/password
- **Body:**
  ```json
  {
    "username": "string (3-30 chars, unique)",
    "email": "string (unique)",
    "password": "string (min 6 chars)",
    "displayName": "string (max 50 chars)"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "token": "jwt-token",
    "user": {
      "id": "user-id",
      "username": "username",
      "email": "email",
      "displayName": "display name",
      "avatar": "avatar-url",
      "isVerified": false,
      "authProvider": "local"
    }
  }
  ```

#### Login User (Local)
- **POST** `/auth/login`
- **Description:** Authenticate user with email/password and get access token
- **Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "jwt-token",
    "user": {
      "id": "user-id",
      "username": "username",
      "email": "email",
      "displayName": "display name",
      "avatar": "avatar-url",
      "isVerified": false,
      "authProvider": "local"
    }
  }
  ```

#### Google OAuth Authentication
- **POST** `/auth/google`
- **Description:** Authenticate or register user using Google OAuth
- **Body:**
  ```json
  {
    "idToken": "google-id-token"
  }
  ```
- **Response (New User):**
  ```json
  {
    "success": true,
    "message": "Google registration successful",
    "token": "jwt-token",
    "user": {
      "id": "user-id",
      "username": "auto-generated-username",
      "email": "email",
      "displayName": "display name",
      "avatar": "google-profile-picture",
      "isVerified": true,
      "authProvider": "google"
    }
  }
  ```
- **Response (Existing User):**
  ```json
  {
    "success": true,
    "message": "Google login successful",
    "token": "jwt-token",
    "user": {
      "id": "user-id",
      "username": "username",
      "email": "email",
      "displayName": "display name",
      "avatar": "avatar-url",
      "isVerified": true,
      "authProvider": "google"
    }
  }
  ```

#### Link Google Account
- **POST** `/auth/google/link`
- **Description:** Link Google account to existing local account
- **Authentication:** Required
- **Body:**
  ```json
  {
    "idToken": "google-id-token"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Google account linked successfully",
    "user": {
      "id": "user-id",
      "username": "username",
      "email": "email",
      "displayName": "display name",
      "avatar": "avatar-url",
      "isVerified": true,
      "authProvider": "google"
    }
  }
  ```

#### Unlink Google Account
- **DELETE** `/auth/google/unlink`
- **Description:** Unlink Google account from user account (requires password)
- **Authentication:** Required
- **Response:**
  ```json
  {
    "success": true,
    "message": "Google account unlinked successfully",
    "user": {
      "id": "user-id",
      "username": "username",
      "email": "email",
      "displayName": "display name",
      "avatar": "avatar-url",
      "isVerified": false,
      "authProvider": "local"
    }
  }
  ```

#### Get User Profile
- **GET** `/auth/profile`
- **Description:** Get current user's profile information
- **Authentication:** Required
- **Response:**
  ```json
  {
    "success": true,
    "user": {
      "id": "user-id",
      "username": "username",
      "email": "email",
      "displayName": "display name",
      "avatar": "avatar-url",
      "coverImage": "cover-image-url",
      "bio": "user bio",
      "location": "location",
      "website": "website",
      "socialLinks": {
        "twitter": "twitter-url",
        "github": "github-url",
        "linkedin": "linkedin-url"
      },
      "isVerified": false,
      "isActive": true,
      "role": "user",
      "authProvider": "local|google",
      "googleId": "google-id (if linked)",
      "preferences": {
        "emailNotifications": true,
        "pushNotifications": false,
        "publicProfile": true,
        "showEmail": false
      },
      "stats": {
        "followers": 0,
        "following": 0,
        "bookmarks": 0,
        "totalViews": 0,
        "totalLikes": 0
      },
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  }
  ```

### Bookmarks (`/bookmarks`)

#### Get All Bookmarks
- **GET** `/bookmarks`
- **Description:** Get paginated list of public bookmarks
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 20)
  - `category` (optional): Filter by category
  - `sort` (optional): Sort order - "newest", "popular", "trending" (default: "newest")
- **Response:**
  ```json
  {
    "success": true,
    "bookmarks": [
      {
        "id": "bookmark-id",
        "title": "bookmark title",
        "description": "bookmark description",
        "url": "bookmark-url",
        "thumbnail": "thumbnail-url",
        "category": "Technology",
        "tags": ["tag1", "tag2"],
        "isPrivate": false,
        "isActive": true,
        "author": {
          "id": "author-id",
          "username": "username",
          "displayName": "display name",
          "avatar": "avatar-url",
          "isVerified": false,
          "authProvider": "local",
          "stats": {
            "followers": 0
          }
        },
        "stats": {
          "views": 0,
          "likes": 0,
          "dislikes": 0,
          "comments": 0,
          "shares": 0,
          "saves": 0
        },
        "metadata": {
          "domain": "domain.com",
          "favicon": "favicon-url",
          "ogImage": "og-image-url",
          "ogTitle": "og title",
          "ogDescription": "og description"
        },
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    ],
    "pagination": {
      "current": 1,
      "pages": 5,
      "total": 100
    }
  }
  ```

#### Get Bookmark by ID
- **GET** `/bookmarks/:id`
- **Description:** Get specific bookmark details
- **Response:**
  ```json
  {
    "success": true,
    "bookmark": {
      "id": "bookmark-id",
      "title": "bookmark title",
      "description": "bookmark description",
      "url": "bookmark-url",
      "thumbnail": "thumbnail-url",
      "category": "Technology",
      "tags": ["tag1", "tag2"],
      "isPrivate": false,
      "isActive": true,
      "author": {
        "id": "author-id",
        "username": "username",
        "displayName": "display name",
        "avatar": "avatar-url",
        "isVerified": false,
        "authProvider": "google",
        "bio": "author bio",
        "stats": {
          "followers": 0,
          "following": 0,
          "bookmarks": 0,
          "totalViews": 0,
          "totalLikes": 0
        }
      },
      "stats": {
        "views": 0,
        "likes": 0,
        "dislikes": 0,
        "comments": 0,
        "shares": 0,
        "saves": 0
      },
      "metadata": {
        "domain": "domain.com",
        "favicon": "favicon-url",
        "ogImage": "og-image-url",
        "ogTitle": "og title",
        "ogDescription": "og description"
      },
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  }
  ```

#### Create Bookmark
- **POST** `/bookmarks`
- **Description:** Create a new bookmark
- **Authentication:** Required
- **Body:**
  ```json
  {
    "title": "string (max 200 chars)",
    "description": "string (max 1000 chars)",
    "url": "string",
    "category": "Technology|Design|Business|Education|Entertainment|Health|Science|Sports|Travel|Food|Other",
    "tags": ["string (max 30 chars each)"],
    "isPrivate": false
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Bookmark created successfully",
    "bookmark": {
      "id": "bookmark-id",
      "title": "bookmark title",
      "description": "bookmark description",
      "url": "bookmark-url",
      "category": "Technology",
      "tags": ["tag1", "tag2"],
      "isPrivate": false,
      "author": "user-id",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  }
  ```

#### Like Bookmark
- **POST** `/bookmarks/:id/like`
- **Description:** Like a bookmark
- **Authentication:** Required
- **Response:**
  ```json
  {
    "success": true,
    "message": "Bookmark liked successfully"
  }
  ```

### Users (`/users`)

#### Get Public Profile
- **GET** `/users/:username`
- **Description:** Get public profile information by username
- **Response:**
  ```json
  {
    "success": true,
    "user": {
      "id": "user-id",
      "username": "username",
      "displayName": "display name",
      "avatar": "avatar-url",
      "coverImage": "cover-image-url",
      "bio": "user bio",
      "location": "location",
      "website": "website",
      "socialLinks": {
        "twitter": "twitter-url",
        "github": "github-url",
        "linkedin": "linkedin-url"
      },
      "isVerified": false,
      "isActive": true,
      "role": "user",
      "authProvider": "google",
      "stats": {
        "followers": 0,
        "following": 0,
        "bookmarks": 0,
        "totalViews": 0,
        "totalLikes": 0
      },
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  }
  ```

#### Update Profile
- **PUT** `/users/update`
- **Description:** Update current user's profile
- **Authentication:** Required
- **Body:** (any combination of user fields)
  ```json
  {
    "displayName": "new display name",
    "bio": "new bio",
    "location": "new location",
    "website": "new website",
    "socialLinks": {
      "twitter": "twitter-url",
      "github": "github-url",
      "linkedin": "linkedin-url"
    },
    "preferences": {
      "emailNotifications": true,
      "pushNotifications": false,
      "publicProfile": true,
      "showEmail": false
    }
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Profile updated successfully",
    "user": {
      "id": "user-id",
      "username": "username",
      "email": "email",
      "displayName": "updated display name",
      "avatar": "avatar-url",
      "bio": "updated bio",
      "location": "updated location",
      "website": "updated website",
      "socialLinks": {
        "twitter": "twitter-url",
        "github": "github-url",
        "linkedin": "linkedin-url"
      },
      "isVerified": false,
      "isActive": true,
      "role": "user",
      "authProvider": "local",
      "preferences": {
        "emailNotifications": true,
        "pushNotifications": false,
        "publicProfile": true,
        "showEmail": false
      },
      "stats": {
        "followers": 0,
        "following": 0,
        "bookmarks": 0,
        "totalViews": 0,
        "totalLikes": 0
      },
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  }
  ```

### Comments (`/comments`)

#### Add Comment
- **POST** `/comments`
- **Description:** Add a comment to a bookmark
- **Authentication:** Required
- **Body:**
  ```json
  {
    "content": "string (max 1000 chars)",
    "bookmarkId": "bookmark-id",
    "parentComment": "parent-comment-id (optional, for replies)"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Comment added successfully",
    "comment": {
      "id": "comment-id",
      "content": "comment content",
      "bookmark": "bookmark-id",
      "author": "user-id",
      "parentComment": null,
      "isActive": true,
      "stats": {
        "likes": 0,
        "dislikes": 0,
        "replies": 0
      },
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  }
  ```

#### Get Comments for Bookmark
- **GET** `/comments/:bookmarkId`
- **Description:** Get all comments for a specific bookmark
- **Response:**
  ```json
  {
    "success": true,
    "comments": [
      {
        "id": "comment-id",
        "content": "comment content",
        "bookmark": "bookmark-id",
        "author": {
          "id": "author-id",
          "username": "username",
          "displayName": "display name",
          "avatar": "avatar-url",
          "isVerified": false,
          "authProvider": "google"
        },
        "parentComment": null,
        "isActive": true,
        "stats": {
          "likes": 0,
          "dislikes": 0,
          "replies": 0
        },
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    ]
  }
  ```

### File Upload (`/upload`)

#### Upload Image
- **POST** `/upload/image`
- **Description:** Upload an image file
- **Authentication:** Required
- **Content-Type:** `multipart/form-data`
- **Body:**
  - `file`: Image file (supported formats: jpg, jpeg, png, gif, webp)
- **Response:**
  ```json
  {
    "success": true,
    "message": "Image uploaded successfully",
    "url": "cloudinary-url",
    "public_id": "cloudinary-public-id"
  }
  ```

## Data Models

### User Model
```javascript
{
  username: String (3-30 chars, unique),
  email: String (unique),
  password: String (min 6 chars, hashed, optional for Google OAuth),
  googleId: String (unique, optional),
  displayName: String (max 50 chars),
  avatar: String (URL),
  coverImage: String (URL),
  bio: String (max 500 chars),
  location: String (max 100 chars),
  website: String,
  socialLinks: {
    twitter: String,
    github: String,
    linkedin: String
  },
  isVerified: Boolean,
  isActive: Boolean,
  role: String (enum: 'user', 'admin', 'moderator'),
  authProvider: String (enum: 'local', 'google'),
  preferences: {
    emailNotifications: Boolean,
    pushNotifications: Boolean,
    publicProfile: Boolean,
    showEmail: Boolean
  },
  stats: {
    followers: Number,
    following: Number,
    bookmarks: Number,
    totalViews: Number,
    totalLikes: Number
  }
}
```

### Bookmark Model
```javascript
{
  title: String (max 200 chars),
  description: String (max 1000 chars),
  url: String,
  thumbnail: String (URL),
  author: ObjectId (ref: User),
  category: String (enum: Technology, Design, Business, Education, Entertainment, Health, Science, Sports, Travel, Food, Other),
  tags: [String (max 30 chars each)],
  isPrivate: Boolean,
  isActive: Boolean,
  stats: {
    views: Number,
    likes: Number,
    dislikes: Number,
    comments: Number,
    shares: Number,
    saves: Number
  },
  metadata: {
    domain: String,
    favicon: String,
    ogImage: String,
    ogTitle: String,
    ogDescription: String
  }
}
```

### Comment Model
```javascript
{
  content: String (max 1000 chars),
  author: ObjectId (ref: User),
  bookmark: ObjectId (ref: Bookmark),
  parentComment: ObjectId (ref: Comment, optional),
  isActive: Boolean,
  stats: {
    likes: Number,
    dislikes: Number,
    replies: Number
  }
}
```

## Google OAuth Setup

### Frontend Integration

1. **Include Google Sign-In SDK:**
   ```html
   <script src="https://accounts.google.com/gsi/client" async defer></script>
   ```

2. **Initialize Google Sign-In:**
   ```javascript
   google.accounts.id.initialize({
     client_id: 'YOUR_GOOGLE_CLIENT_ID',
     callback: handleCredentialResponse
   });
   ```

3. **Handle the response:**
   ```javascript
   async function handleCredentialResponse(response) {
     try {
       const result = await fetch('/api/auth/google', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           idToken: response.credential
         })
       });
       
       const data = await result.json();
       if (data.success) {
         // Store JWT token
         localStorage.setItem('token', data.token);
         // Redirect or update UI
       }
     } catch (error) {
       console.error('Google auth error:', error);
     }
   }
   ```

### Backend Configuration

Required environment variables:
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **Limit:** 100 requests per 15 minutes per IP address
- **Headers:** Rate limit information is included in response headers

## Security Features

- **CORS:** Configured for frontend origin
- **Helmet:** Security headers enabled
- **JWT Authentication:** Token-based authentication
- **Google OAuth:** Secure Google account integration
- **Password Hashing:** Bcrypt with salt rounds of 12
- **Input Validation:** Express-validator middleware
- **File Upload Security:** Multer with file type restrictions

## Environment Variables

Required environment variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/markly
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:3000
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env` file

3. Configure Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized origins and redirect URIs

4. Start the server:
   ```bash
   npm run dev  # Development mode
   npm start    # Production mode
   ```

5. The API will be available at `http://localhost:5000/api`

## Testing the API

You can test the API endpoints using tools like:
- Postman
- Insomnia
- curl
- Thunder Client (VS Code extension)

Example curl command for Google OAuth:
```bash
curl -X POST http://localhost:5000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "google-id-token-from-frontend"
  }'
```

Example curl command for local registration:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "displayName": "Test User"
  }'
``` 