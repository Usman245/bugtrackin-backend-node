CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Status flags
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,

  -- Stripe / Billing
  stripe_id VARCHAR(150) UNIQUE NOT NULL,

  -- Plan details
  name VARCHAR(100) NOT NULL,
  description TEXT,

  number_of_users INTEGER NOT NULL CHECK (number_of_users >= 0),

  amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',

  billing_interval VARCHAR(20) NOT NULL
    CHECK (billing_interval IN ('day', 'week', 'month', 'year')),

  trial_period_days INTEGER CHECK (trial_period_days >= 0),

  is_enterprise BOOLEAN DEFAULT false,
  is_promotional BOOLEAN DEFAULT false,

  -- Timestamps
  archived_at TIMESTAMP NULL,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
