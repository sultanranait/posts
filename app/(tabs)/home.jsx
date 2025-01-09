import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";
import { supabase } from "../lib/supabase-client.js";
import { useUserStore } from "../zustand/store.js";
import { ActivityIndicator } from "react-native";
import {handleUserSignIn} from "../(auth)/authhelper.js"

export default function Home() {
  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [posts, setPosts] = useState([]);
  const user = useUserStore((state) => state.user);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  // console.log("user data is  : ", user);

  // console.log("User ID:", user?.id);
  useEffect(() => {
    if (user) {
      handleUserSignIn(user); // Ensure the user exists in the `users` table
    }
  }, [user]);

  useEffect(() => {
    fetchPosts();

    const subscription = supabase
      .channel("public:posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        (payload) => {
          setPosts((prevPosts) => {
            switch (payload.eventType) {
              case "INSERT":
                if (payload.new.user_id === user.id) {
                  return [payload.new, ...prevPosts];
                }
                return prevPosts;
              case "UPDATE":
                return prevPosts.map((post) =>
                  post.id === payload.new.id ? payload.new : post
                );
              case "DELETE":
                return prevPosts.filter((post) => post.id !== payload.old.id);
              default:
                return prevPosts;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    // .order("id", { ascending: false });
    setLoading(false);
    if (!error) setPosts(data || []);
  };

  const handlePostSubmit = async () => {
    setLoading(true);
    if (!postTitle.trim() || !postDescription.trim()) {
      Alert.alert("Validation Error", "Both fields are required!");
      return;
    }

    const { error } = await supabase.from("posts").insert([
      {
        title: postTitle.trim(),
        description: postDescription.trim(),
        user_id: user.id,
      },
    ]);
    setLoading(false);
    if (!error) {
      fetchPosts();
      setPostTitle("");
      setPostDescription("");
      setLoading(false);
    } else {
      console.log(error);
      Alert.alert("Error", "Failed to submit the post!");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome!</Text>
      <Text style={styles.subtitle}>Beautifully quoted: Make a Post</Text>

      <TextInput
        style={styles.input}
        placeholder="Post Title"
        value={postTitle}
        onChangeText={setPostTitle}
      />
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Post Description"
        multiline
        value={postDescription}
        onChangeText={setPostDescription}
      />

      {loading ? (
        <ActivityIndicator size={"large"} color={"blue"} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handlePostSubmit}>
          <Text style={styles.buttonText}>Submit Post</Text>
        </TouchableOpacity>
      )}

      <View style={styles.postContainer}>
        <Text style={styles.sectionTitle}>Posts</Text>
        {posts.length > 0 ? (
          <FlatList
            data={posts}
            refreshing={refresh}
            onRefresh={fetchPosts}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : index.toString()
            }
            renderItem={({ item }) => (
              <View style={styles.post}>
                <Text style={styles.postTitle}>{item.title}</Text>
                <Text style={styles.postDescription}>{item.description}</Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noPostsText}>
            Posts don't exist. Create a post!
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginVertical: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  postContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  post: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  postDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  noPostsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 24,
  },
});
