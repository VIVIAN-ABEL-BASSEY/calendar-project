/*
Type definition for user registration request
*/
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/*
Type definition for login request
*/
export interface LoginRequest {
  email: string;
  password: string;
}

/*
JWT payload structure
*/
export interface JwtPayload {
  userId: string;
  email: string;
}