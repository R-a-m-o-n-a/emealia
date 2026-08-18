import { supabase } from '../data/supabase.ts';

export async function getUserId(): Promise<string> {
    // 1. Check for existing local session
    const {data: {session}} = await supabase.auth.getSession();

    if (session?.user?.id) {
        return session.user.id;
    }

    // 2. Fall back to anonymous sign in
    const {data, error} = await supabase.auth.signInAnonymously();

    if (error || !data.user) {
        throw new Error(`Failed to initialize anonymous user: ${error?.message}`);
    }

    return data.user.id;
}

export async function ensureAuthentication() {
    await getUserId();
    console.log('authentication successful.');
}
