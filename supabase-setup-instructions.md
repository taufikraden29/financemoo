# Supabase Setup Instructions for MoneyPro

This guide will help you set up Supabase for your MoneyPro financial management application.

## 🚀 Quick Start

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up/login with your GitHub account
4. Create a new project:
   - Choose your organization
   - Project name: `moneypro` (or your preferred name)
   - Database password: Use a strong password
   - Region: Choose the closest region to your users

### 2. Run the SQL Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy and paste the entire content from `supabase-schema.sql`
4. Click **Run** to execute the schema

### 3. Set Up Authentication

1. Go to **Authentication** → **Settings**
2. Configure your authentication providers:
   - Enable **Email** authentication
   - Optionally enable Google, GitHub, etc.
3. Configure your site URL and redirect URLs in the **URL Configuration** section

### 4. Get Your Project Keys

1. Go to **Project Settings** → **API**
2. Copy your **Project URL** and **anon public** key
3. Keep these secure - you'll need them for your React app

### 5. Configure Your React App

1. Copy `.env.example` to `.env`
2. Fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 6. Install Dependencies

```bash
npm install @supabase/supabase-js
```

## 📋 Database Schema Overview

### Main Tables Created:

1. **user_profiles** - User information and gamification stats
2. **transactions** - All income and expense transactions
3. **budgets** - Budget limits by category and period
4. **installments** - Installment debts and loans
5. **installment_payments** - Payment schedule for installments
6. **recurring_transactions** - Automatic recurring transactions
7. **achievements** - User achievements and rewards
8. **user_preferences** - User settings and preferences
9. **bank_accounts** - User bank accounts and balances

### Key Features:

✅ **Row Level Security (RLS)** - Users can only access their own data  
✅ **Auto-updating timestamps** - `updated_at` fields update automatically  
✅ **Budget tracking** - Automatic budget progress calculation  
✅ **Performance indexes** - Optimized for fast queries  
✅ **Data validation** - Constraints ensure data integrity  
✅ **Helpful views** - Pre-built queries for common operations  

## 🔧 Integration with Your React App

### 1. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 2. Create Supabase Client

Create `src/lib/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 3. Replace LocalStorage Hooks

Replace your `useLocalStorage` hooks with Supabase queries. Example for transactions:

```javascript
// Old approach (useTransactions.js)
const [transactions, setTransactions] = useLocalStorage("transactions", []);

// New Supabase approach
const [transactions, setTransactions] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetchTransactions()
}, [])

const fetchTransactions = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('transaction_date', { ascending: false })
  
  if (error) console.error('Error fetching transactions:', error)
  else setTransactions(data)
  setLoading(false)
}

const addTransaction = async (transaction) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transaction])
    .select()
  
  if (error) console.error('Error adding transaction:', error)
  else {
    setTransactions(prev => [data[0], ...prev])
    return data[0]
  }
}
```

## 🔒 Security Features

### Row Level Security (RLS)

The schema includes comprehensive RLS policies that ensure:
- Users can only access their own data
- No data leakage between users
- Secure CRUD operations for all tables

### Authentication Integration

All tables are linked to the `auth.users` system through the `user_profiles` table. When a user signs up:

```sql
-- This trigger automatically creates a user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 📊 Helpful Views

### 1. Transaction Summaries
```sql
SELECT * FROM transaction_summaries 
WHERE user_id = 'your-user-id'
AND month = '2024-01-01'
```

### 2. Budget Progress
```sql
SELECT * FROM budget_progress 
WHERE user_id = 'your-user-id'
```

### 3. Installment Overview
```sql
SELECT * FROM installment_summaries 
WHERE user_id = 'your-user-id'
```

## 🚀 Next Steps

1. **Test the connection** - Try connecting from your React app
2. **Migrate existing data** - Create scripts to move data from localStorage
3. **Set up real-time subscriptions** - Get live updates when data changes
4. **Add storage** - Use Supabase Storage for receipt images
5. **Configure Edge Functions** - For complex server-side logic

## 🛠️ Troubleshooting

### Common Issues:

1. **Permission denied errors**
   - Check that RLS policies are enabled
   - Ensure user is authenticated

2. **Connection issues**
   - Verify your Supabase URL and keys
   - Check network connectivity

3. **Schema errors**
   - Make sure you ran the complete SQL schema
   - Check for any syntax errors in the SQL

### Useful Queries:

```sql
-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check if user profile exists
SELECT * FROM user_profiles WHERE email = 'user@example.com';

-- Test basic query
SELECT COUNT(*) FROM transactions WHERE user_id = 'your-user-id';
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase React Guide](https://supabase.com/docs/guides/with-react)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime Subscriptions](https://supabase.com/docs/guides/realtime)

---

**Need help?** Check the Supabase docs or create an issue in your repository. The schema is designed to be comprehensive yet flexible for your MoneyPro application!
