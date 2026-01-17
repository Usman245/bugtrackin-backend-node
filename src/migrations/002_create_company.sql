CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,

  owner_id UUID NOT NULL,

  name VARCHAR(150) NOT NULL,
  site_url TEXT,
  logo TEXT,
  stamp TEXT,

  address TEXT,
  postal_code VARCHAR(20),
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),

  vat NUMERIC DEFAULT 0,
  employee_yearly_holidays INTEGER DEFAULT 0,
  domain VARCHAR(100) UNIQUE NOT NULL,

  archived_at TIMESTAMP NULL,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_company_owner
  FOREIGN KEY (owner_id)
  REFERENCES public.users(id)
  ON DELETE RESTRICT

);
