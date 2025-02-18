import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";

interface JwtPayload {
  id: number;  
  email:string;
  userid:string;
  iat: number;
  exp: number;
}

// Sign a JWT token
export const signJwt = (payload: object) => {
  return jwt.sign(payload, process.env.JWT_SECRET!);
};

// Verify a JWT token
export const verifyJwt = (token: string):JwtPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch (_) {
    return null; // Invalid token
  }
};

// Hash Password
export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

// Compare Passwords
export const comparePasswords = async (plainPassword: string, hashedPassword: string) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
