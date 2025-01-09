import { supabase } from "../lib/supabase-client";

export const handleUserSignIn = async (user) => {
  try {
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!existingUser) {
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: user.id, 
          name: user.user_metadata.full_name || user.email, // Use name or email
          username: user.user_metadata.preferred_username, // GitHub username
        },
      ]);

      if (insertError) {
        console.error("Failed to insert user into the database:", insertError);
        throw new Error("Failed to create user in the database.");
      }
    } else if (fetchError) {
      console.error("Failed to fetch user:", fetchError);
      throw new Error("Error fetching user.");
    }
  } catch (err) {
    console.error("Error during user sign-in handling:", err);
  }
};
