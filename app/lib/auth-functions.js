import { supabase } from "./supabase-client.js";
import { Alert } from "react-native";

// Ensure the `users` table exists in Supabase
// Ensure the `users` table exists in Supabase
async function ensureUsersTableExists() {
  const { error: createError } = await supabase.rpc("create_users_table");

  if (createError) {
    console.error("Error creating users table:", createError.message);
    return false;
  }

  console.log("Users table verified or created successfully.");
  return true;
}

// Sign up a new user
export async function signup(name , username, password) {
  const tableExists = await ensureUsersTableExists();
  if (!tableExists) {
    Alert.alert("Error", "Could not ensure users table exists.");
    return;
  }

  // Check if the username already exists
  const { data: existingUser, error: checkError } = await supabase
    .from("users")
    .select("username")
    .eq("username", username);

  if (checkError) {
    Alert.alert("Error", "Failed to check existing username.");
    return null;
  }

  if (existingUser.length > 0) {
    Alert.alert("Error", "Username already exists.");
    return null;
  }

  // Insert new user
  const { data, error } = await supabase
    .from("users")
    .insert([{name, username, password }]);

  if (error) {
    Alert.alert("Error", error.message);
    return null;
  }

  Alert.alert("Success", "User signed up successfully!");
  return data;
}

// Log in an existing user
export async function login(username, password) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("password", password);

  if (error) {
    Alert.alert("Error", error.message);
    return null;
  }

  if (data.length === 0) {
    Alert.alert("Error", "Invalid username or password.");
    return null;
  }

  Alert.alert("Success", "Logged in successfully!");
  return data[0];
}
