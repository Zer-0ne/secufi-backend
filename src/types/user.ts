/**
 * @fileoverview User Type Definitions
 * @description Type definitions for user management, authentication, and user-related operations
 * 
 * @module types/user
 * @author Secufi Team
 * @version 1.0.0
 */

/**
 * Interface for creating a new user request
 * 
 * @interface CreateUserRequest
 * @description Represents the data required to create a new user account
 * 
 * @property {string} email - User's email address (required)
 * @property {string} [name] - User's full name (optional)
 * @property {string} [password] - User's password (optional for OAuth flows)
 * @property {'parent' | 'family'} [user_type] - Type of user account
 * @property {string} [phone] - User's phone number (optional)
 * @property {string} [google_id] - Google OAuth ID (for Google sign-in)
 * @property {string} [google_email] - Google email address (for Google sign-in)
 * @property {string} [profile_picture] - URL to user's profile picture
 */
export interface CreateUserRequest {
  email: string;
  name?: string;
  password?: string;
  user_type?: 'parent' | 'family';
  phone?: string;
  google_id?: string;
  google_email?: string;
  profile_picture?: string;
}

/**
 * Interface for user creation response
 * 
 * @interface CreateUserResponse
 * @description Represents the response from user creation operations
 * 
 * @property {boolean} success - Whether the user creation was successful
 * @property {string} message - Human-readable message describing the result
 * @property {User} [user] - Created user object if successful
 * @property {boolean} [isNewUser] - Indicates if this was a new user creation
 * @property {string} [error] - Error message if creation failed
 * @property {Object} tokens - Authentication tokens for the new user
 * @property {string} tokens.accessToken - JWT access token for API authentication
 * @property {string} tokens.refreshToken - Refresh token for obtaining new access tokens
 * @property {boolean} wasInvited - Indicates if user was created via invitation
 */
export interface CreateUserResponse {
  success: boolean;
  message: string;
  user?:User;
  isNewUser?: boolean;
  error?: string;
  tokens:{
    accessToken:string;
    refreshToken:string;
  }
  wasInvited:boolean
}

/**
 * Interface for user retrieval response
 * 
 * @interface GetUserResponse
 * @description Represents the response from user retrieval operations
 * 
 * @property {boolean} success - Whether the user retrieval was successful
 * @property {string} message - Human-readable message describing the result
 * @property {User} [user] - Retrieved user object if found
 * @property {string} [error] - Error message if retrieval failed
 */
export interface GetUserResponse {
  success: boolean;
  message: string;
  user?:User;
  error?: string;
}


/**
 * Interface representing a user entity
 * 
 * @interface User
 * @description Core user entity with authentication and profile information
 * 
 * @property {string} id - Unique identifier for the user
 * @property {string} email - User's email address
 * @property {string | null} name - User's full name (nullable)
 * @property {string | null} user_type - Type of user account (nullable)
 * @property {string | null} role - User's role/permissions (nullable)
 * @property {boolean} is_verified - Whether the user's email is verified
 * @property {boolean} is_active - Whether the user account is active
 * @property {string} created_at - Timestamp when the user was created
 */
export interface User {
  id: string;
  email: string;
  name: string | null;
  user_type: string | null;
  role: string | null;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}