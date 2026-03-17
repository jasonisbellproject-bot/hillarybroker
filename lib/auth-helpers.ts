import { NextRequest } from 'next/server';
import { createClient } from './supabase/server';

export async function getAuthenticatedUser(request: NextRequest) {
  const supabase = await createClient();

  // Get session using Supabase's SSR client
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Error getting session:', error);
    return null;
  }

  if (session?.user) {
    return {
      user: session.user,
      session
    };
  }

  return null;
}

export async function requireAuth(request: NextRequest) {
  const auth = await getAuthenticatedUser(request);
  
  if (!auth) {
    throw new Error('Unauthorized');
  }
  
  return auth;
} 