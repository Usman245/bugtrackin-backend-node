-- Bug Tracking Database Schema
-- Migration: 001_create_users_roles

CREATE EXTENSION IF NOT EXISTS "pgcrypto";



-- Create Roles table
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Create Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  domain VARCHAR(100) NOT NULL,
  designation VARCHAR(100),
  joining_date DATE,
  employment_type VARCHAR(100),
  contract_type VARCHAR(100),
  otp_code VARCHAR(100),
  timezone VARCHAR(100),
  is_verified BOOLEAN DEFAULT true,
  payment_type VARCHAR(100),
  currency VARCHAR(100),
  payment_amount NUMERIC DEFAULT 0,
  picture TEXT,
  is_staff BOOLEAN DEFAULT true,
  is_superuser BOOLEAN DEFAULT false,
  is_app_logged_in BOOLEAN DEFAULT false,
  is_primary_admin BOOLEAN DEFAULT true,
  role UUID REFERENCES roles(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
