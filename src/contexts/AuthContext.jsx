import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    let isMounted = true; // To prevent state updates on unmounted components

    // Get initial session with a timeout to prevent hanging
    const getInitialSession = async () => {
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => resolve({ error: { message: 'Session retrieval timeout' } }), 5000); // 5 second timeout
      });

      try {
        // Use Promise.race to prevent hanging on session retrieval
        const sessionResult = await Promise.race([
          supabase.auth.getSession(),
          timeoutPromise
        ]);

        if (sessionResult.error) {
          console.error('Error getting session or timeout:', sessionResult.error);
          // Continue without a session instead of hanging
        } else {
          const { data: { session }, error } = sessionResult;
          if (error) {
            console.error('Error getting session:', error);
          } else if (session?.user && isMounted) {
            setUser(session.user);
            await fetchUserProfile(session.user.id);
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        if (isMounted) {
          // Always set loading to false to prevent blank screen
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (!isMounted) return;
        
        // Only set loading to true when not a redirect event (which happens during OAuth)
        if (!event.includes('RECOVERY') && !event.includes('MFA')) {
          setLoading(true);
        }
        if (session?.user && isMounted) {
          setUser(session.user);
          await fetchUserProfile(session.user.id);
        } else if (isMounted) {
          setUser(null);
          setUserProfile(null);
        }
        // Always set loading to false to prevent blank screen
        if (isMounted) {
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription?.unsubscribe && subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId) => {
    if (!userId) return; // Early return if no userId provided

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        // If profile doesn't exist, create one
        if (error.code === 'PGRST116' || error.message.includes('Row not found')) {
          await createUserProfile(userId);
        } else {
          console.error('Error code:', error.code, error.message);
        }
      } else if (data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const createUserProfile = async (userId) => {
    if (!userId) return; // Early return if no userId provided

    try {
      // Get user details from auth session instead of making another call
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: userId,
            email: authUser?.email || '',
            level: 1,
            xp: 0,
            xp_to_next_level: 100,
            total_transactions: 0,
            streak_days: 0,
            coins_earned: 0
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        // Check if the profile was already created by another request
        if (error.code === '23505') { // Unique violation
          // Profile already exists, fetch it instead
          await fetchUserProfile(userId);
        }
      } else if (data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error in createUserProfile:', error);
      // If we still have an error, try to fetch the profile
      await fetchUserProfile(userId);
    }
  };

  const signUp = async (email, password, name) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0]
          }
        }
      });

      if (error) {
        throw error;
      }

      // If the user is created successfully, we need to handle the case where
      // email confirmation is required. For now, we'll return the data and let
      // the UI handle the next steps
      return { success: true, data };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { success: false, error: error.message };
    } finally {
      // Set loading to false after a short delay to ensure UI updates properly
      setTimeout(() => {
        if (document.readyState !== 'loading') {
          setLoading(false);
        }
      }, 300); // Small delay to ensure UI updates properly
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in signIn:', error);
      return { success: false, error: error.message };
    } finally {
      // Set loading to false after a short delay to ensure UI updates properly
      setTimeout(() => {
        if (document.readyState !== 'loading') {
          setLoading(false);
        }
      }, 300); // Small delay to ensure UI updates properly
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in signInWithGoogle:', error);
      return { success: false, error: error.message };
    }
  };

  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in resetPassword:', error);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Error in signOut:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updates) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user?.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setUserProfile(data);
      return { success: true, data };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
