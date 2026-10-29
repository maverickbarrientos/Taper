
import { createClient } from "@/lib/supabase/client";

export async function signInWithEmail({ email, password }: { email: string, password: string }) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    // Supabase's messages are decent as-is, but normalize the common one
    if (error.message.toLowerCase().includes("invalid login credentials")) {
      throw new Error("Incorrect email or password.");
    }
    throw new Error(error.message);
  }

  return data
}
export async function signOut() {
  const supabase = createClient();

  // Ends the session and clears the auth cookies
  const { error } = await supabase.auth.signOut();

  if (error) throw new Error(error.message);
}
