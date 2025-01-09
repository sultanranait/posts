import { router, Stack } from "expo-router";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useUserStore } from "../zustand/store.js";
import { supabase } from "../lib/supabase-client"; // Import your Supabase client

export default function Setting() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const doLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut(); // Remove session
      if (error) {
        throw error;
      }
      setUser(null); // Clear Zustand user state
      router.replace("/(auth)/login"); // Navigate to login screen
    } catch (error) {
      Alert.alert("Error Signing Out", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Avatar */}
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/1999/1999625.png",
          }}
          style={styles.avatar}
        />
        {/* User Name */}
        <Text style={styles.userName}>{user?.name || user?.email || "Guest"}</Text>
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={doLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    width: "90%",
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  logoutButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
