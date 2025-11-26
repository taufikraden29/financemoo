-- MoneyPro Supabase Database Schema
-- This SQL creates all necessary tables for the MoneyPro financial management application

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USER PROFILES TABLE
-- ============================================
CREATE TABLE user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- User statistics and gamification
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  xp_to_next_level INTEGER DEFAULT 100,
  total_transactions INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  coins_earned INTEGER DEFAULT 0,
  
  -- Savings goals
  savings_goal_target DECIMAL(15,2) DEFAULT 0,
  savings_goal_current DECIMAL(15,2) DEFAULT 0,
  savings_goal_name VARCHAR(255) DEFAULT '',
  savings_goal_deadline DATE
);

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
CREATE TABLE transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Transaction details
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  category VARCHAR(50) NOT NULL,
  description TEXT,
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cash', 'bank', 'card', 'digital')),
  transaction_date DATE NOT NULL,
  
  -- Additional metadata
  tags TEXT[], -- Array of tags for better categorization
  receipt_url VARCHAR(500), -- URL to receipt image if uploaded
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_transaction_id UUID REFERENCES recurring_transactions(id)
);

-- ============================================
-- BUDGETS TABLE
-- ============================================
CREATE TABLE budgets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Budget details
  category VARCHAR(50) NOT NULL,
  budget_amount DECIMAL(15,2) NOT NULL CHECK (budget_amount > 0),
  spent_amount DECIMAL(15,2) DEFAULT 0,
  
  -- Budget period
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Notifications
  alert_threshold DECIMAL(5,2) DEFAULT 80.00, -- Alert when 80% spent
  
  UNIQUE(user_id, category, period_start, period_end)
);

-- ============================================
-- INSTALLMENTS TABLE
-- ============================================
CREATE TABLE installments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Installment details
  name VARCHAR(255) NOT NULL,
  description TEXT,
  total_amount DECIMAL(15,2) NOT NULL CHECK (total_amount > 0),
  installment_count INTEGER NOT NULL CHECK (installment_count > 0),
  installment_amount DECIMAL(15,2) NOT NULL,
  loan_date DATE NOT NULL,
  
  -- Status and categorization
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  category VARCHAR(50) DEFAULT 'personal',
  creditor VARCHAR(255)
);

-- ============================================
-- INSTALLMENT PAYMENT SCHEDULE TABLE
-- ============================================
CREATE TABLE installment_payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  installment_id UUID REFERENCES installments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Payment details
  installment_number INTEGER NOT NULL,
  due_date DATE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  paid_amount DECIMAL(15,2) DEFAULT 0,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'partial')),
  paid_date DATE,
  
  UNIQUE(installment_id, installment_number)
);

-- ============================================
-- RECURRING TRANSACTIONS TABLE
-- ============================================
CREATE TABLE recurring_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Transaction details
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  category VARCHAR(50) NOT NULL,
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cash', 'bank', 'card', 'digital')),
  
  -- Recurrence details
  frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  last_processed DATE,
  
  -- Additional settings
  day_of_month INTEGER, -- For monthly frequency (1-31)
  day_of_week INTEGER, -- For weekly frequency (0-6, Sunday = 0)
  skip_weekends BOOLEAN DEFAULT FALSE
);

-- ============================================
-- ACHIEVEMENTS TABLE
-- ============================================
CREATE TABLE achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Achievement details
  achievement_name VARCHAR(255) NOT NULL,
  description TEXT,
  is_unlocked BOOLEAN DEFAULT FALSE,
  icon VARCHAR(50),
  reward_coins INTEGER DEFAULT 0,
  
  -- Metadata
  unlocked_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(user_id, achievement_name)
);

-- ============================================
-- USER PREFERENCES TABLE
-- ============================================
CREATE TABLE user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Preferences
  currency VARCHAR(3) DEFAULT 'IDR',
  date_format VARCHAR(20) DEFAULT 'DD/MM/YYYY',
  language VARCHAR(10) DEFAULT 'id',
  theme VARCHAR(20) DEFAULT 'light',
  
  -- Notification settings
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  budget_alerts BOOLEAN DEFAULT TRUE,
  due_date_reminders BOOLEAN DEFAULT TRUE,
  
  -- Display settings
  items_per_page INTEGER DEFAULT 10,
  show_categories BOOLEAN DEFAULT TRUE,
  show_charts BOOLEAN DEFAULT TRUE,
  
  UNIQUE(user_id)
);

-- ============================================
-- BANK ACCOUNTS TABLE
-- ============================================
CREATE TABLE bank_accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Account details
  account_name VARCHAR(255) NOT NULL,
  bank_name VARCHAR(255),
  account_number VARCHAR(50),
  account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('checking', 'savings', 'credit', 'cash')),
  balance DECIMAL(15,2) DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_default BOOLEAN DEFAULT FALSE,
  
  -- Additional info
  currency VARCHAR(3) DEFAULT 'IDR',
  notes TEXT
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- User profiles
CREATE INDEX idx_user_profiles_email ON user_profiles(email);

-- Transactions
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category ON transactions(category);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date);

-- Budgets
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_category ON budgets(category);
CREATE INDEX idx_budgets_period ON budgets(period_start, period_end);

-- Installments
CREATE INDEX idx_installments_user_id ON installments(user_id);
CREATE INDEX idx_installments_status ON installments(status);
CREATE INDEX idx_installments_loan_date ON installments(loan_date);

-- Installment payments
CREATE INDEX idx_installment_payments_installment_id ON installment_payments(installment_id);
CREATE INDEX idx_installment_payments_due_date ON installment_payments(due_date);
CREATE INDEX idx_installment_payments_status ON installment_payments(status);

-- Recurring transactions
CREATE INDEX idx_recurring_transactions_user_id ON recurring_transactions(user_id);
CREATE INDEX idx_recurring_transactions_frequency ON recurring_transactions(frequency);
CREATE INDEX idx_recurring_transactions_active ON recurring_transactions(is_active);

-- Achievements
CREATE INDEX idx_achievements_user_id ON achievements(user_id);
CREATE INDEX idx_achievements_unlocked ON achievements(is_unlocked);

-- Bank accounts
CREATE INDEX idx_bank_accounts_user_id ON bank_accounts(user_id);
CREATE INDEX idx_bank_accounts_type ON bank_accounts(account_type);
CREATE INDEX idx_bank_accounts_active ON bank_accounts(is_active);

-- ============================================
-- TRIGGERS FOR AUTO-UPDATING FIELDS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_installments_updated_at BEFORE UPDATE ON installments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_installment_payments_updated_at BEFORE UPDATE ON installment_payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recurring_transactions_updated_at BEFORE UPDATE ON recurring_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bank_accounts_updated_at BEFORE UPDATE ON bank_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update budget spent amount when transactions are added/updated/deleted
CREATE OR REPLACE FUNCTION update_budget_spent_amount()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the corresponding budget's spent amount
    UPDATE budgets 
    SET spent_amount = (
        SELECT COALESCE(SUM(amount), 0)
        FROM transactions 
        WHERE user_id = NEW.user_id 
        AND type = 'expense'
        AND category = NEW.category
        AND transaction_date BETWEEN budgets.period_start AND budgets.period_end
        AND id != COALESCE(OLD.id, '00000000-0000-0000-0000-000000000000')::uuid
    )
    WHERE user_id = NEW.user_id 
    AND category = NEW.category
    AND NEW.transaction_date BETWEEN period_start AND period_end;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Triggers for budget updates
CREATE TRIGGER update_budget_on_transaction_insert AFTER INSERT ON transactions FOR EACH ROW EXECUTE FUNCTION update_budget_spent_amount();
CREATE TRIGGER update_budget_on_transaction_update AFTER UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_budget_spent_amount();
CREATE TRIGGER update_budget_on_transaction_delete AFTER DELETE ON transactions FOR EACH ROW EXECUTE FUNCTION update_budget_spent_amount();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE installment_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own transactions" ON transactions FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own transactions" ON transactions FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view own budgets" ON budgets FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own budgets" ON budgets FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own budgets" ON budgets FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own budgets" ON budgets FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view own installments" ON installments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own installments" ON installments FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own installments" ON installments FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own installments" ON installments FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view own installment payments" ON installment_payments FOR SELECT USING (
    EXISTS (SELECT 1 FROM installments WHERE id = installment_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert own installment payments" ON installment_payments FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM installments WHERE id = installment_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update own installment payments" ON installment_payments FOR UPDATE USING (
    EXISTS (SELECT 1 FROM installments WHERE id = installment_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete own installment payments" ON installment_payments FOR DELETE USING (
    EXISTS (SELECT 1 FROM installments WHERE id = installment_id AND user_id = auth.uid())
);

CREATE POLICY "Users can view own recurring transactions" ON recurring_transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own recurring transactions" ON recurring_transactions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own recurring transactions" ON recurring_transactions FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own recurring transactions" ON recurring_transactions FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view own achievements" ON achievements FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own achievements" ON achievements FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own achievements" ON achievements FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own achievements" ON achievements FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view own preferences" ON user_preferences FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own preferences" ON user_preferences FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own preferences" ON user_preferences FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can view own bank accounts" ON bank_accounts FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own bank accounts" ON bank_accounts FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own bank accounts" ON bank_accounts FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own bank accounts" ON bank_accounts FOR DELETE USING (user_id = auth.uid());

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View for transaction summaries by category and month
CREATE VIEW transaction_summaries AS
SELECT 
    user_id,
    type,
    category,
    DATE_TRUNC('month', transaction_date) as month,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount,
    AVG(amount) as average_amount
FROM transactions
GROUP BY user_id, type, category, DATE_TRUNC('month', transaction_date);

-- View for budget progress
CREATE VIEW budget_progress AS
SELECT 
    b.*,
    CASE 
        WHEN b.budget_amount > 0 THEN ROUND((b.spent_amount / b.budget_amount) * 100, 2)
        ELSE 0 
    END as percentage_used,
    CASE 
        WHEN b.spent_amount >= b.budget_amount THEN 'over_budget'
        WHEN b.spent_amount >= (b.budget_amount * b.alert_threshold / 100) THEN 'near_limit'
        ELSE 'on_track'
    END as budget_status
FROM budgets b;

-- View for installment summaries
CREATE VIEW installment_summaries AS
SELECT 
    i.*,
    COALESCE(ip.total_paid, 0) as total_paid,
    COALESCE(ip.total_remaining, i.total_amount) as total_remaining,
    CASE 
        WHEN i.total_amount > 0 THEN ROUND((COALESCE(ip.total_paid, 0) / i.total_amount) * 100, 2)
        ELSE 0 
    END as progress_percentage,
    COALESCE(ip.next_payment_date, NULL) as next_payment_date,
    COALESCE(ip.overdue_count, 0) as overdue_count
FROM installments i
LEFT JOIN (
    SELECT 
        installment_id,
        SUM(paid_amount) as total_paid,
        SUM(amount - paid_amount) as total_remaining,
        MIN(due_date) FILTER (WHERE status != 'paid' AND due_date <= CURRENT_DATE) as next_payment_date,
        COUNT(*) FILTER (WHERE status = 'overdue' OR (status != 'paid' AND due_date < CURRENT_DATE)) as overdue_count
    FROM installment_payments
    GROUP BY installment_id
) ip ON i.id = ip.installment_id;

-- ============================================
-- INITIAL DATA (Optional)
-- ============================================

-- You can uncomment and modify these sections if you want to seed initial data

-- -- Insert default achievements
-- INSERT INTO achievements (user_id, achievement_name, description, icon, reward_coins)
-- VALUES 
--     (auth.uid(), 'First Transaction', 'Add your first transaction', 'Star', 50),
--     (auth.uid(), 'Budget Master', 'Set budget for 5 categories', 'Target', 100),
--     (auth.uid(), 'Savings Hero', 'Save 20% of income', 'Trophy', 150),
--     (auth.uid(), 'Debt Free', 'Pay off all debts', 'CheckCircle', 200),
--     (auth.uid(), 'Consistent Tracker', '7-day tracking streak', 'Zap', 100),
--     (auth.uid(), 'Budget Guardian', 'Stay under budget for 3 months', 'Award', 250);

-- ============================================
-- COMMENTS AND DOCUMENTATION
-- ============================================

COMMENT ON TABLE user_profiles IS 'Main user profile table containing user information and gamification stats';
COMMENT ON TABLE transactions IS 'All financial transactions (income and expenses)';
COMMENT ON TABLE budgets IS 'Budget limits and tracking by category and period';
COMMENT ON TABLE installments IS 'Installment debts and loans';
COMMENT ON TABLE installment_payments IS 'Individual payment schedule for installments';
COMMENT ON TABLE recurring_transactions IS 'Recurring/automatic transactions';
COMMENT ON TABLE achievements IS 'User achievements and gamification rewards';
COMMENT ON TABLE user_preferences IS 'User settings and preferences';
COMMENT ON TABLE bank_accounts IS 'User bank accounts and balances';

COMMENT ON VIEW transaction_summaries IS 'Aggregated transaction data by category and month';
COMMENT ON VIEW budget_progress IS 'Budget progress with status indicators';
COMMENT ON VIEW installment_summaries IS 'Installment overview with payment progress';
