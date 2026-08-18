import { supabase } from "../data/supabase.ts";

export function signUpAnonymousUser
(email: string, password: string): Promise<boolean> {
    return supabase.auth.updateUser({email, password}).then((response) => {
        if (response.error) {
            console.error('could not sign up user', response.error);
            return false;
        }
        return true;
    })
}

