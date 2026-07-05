'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Sign out the current Supabase user, clear the session cookie, and send the
 * visitor home. Co-located under the workspace so the app layout and UserMenu
 * can import it as a server action.
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
