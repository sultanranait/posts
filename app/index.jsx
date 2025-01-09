// import { useEffect, useState } from "react";
// import { Redirect, router } from "expo-router";
// import { useUserStore } from "./zustand/store.js";

// export default function IndexPage() {
//   const [isLayoutReady, setIsLayoutReady] = useState(false); 
//   const user = useUserStore((state) => state.user);

//   // Set layout ready to true once the component is mounted
//   useEffect(() => {
//     setIsLayoutReady(true);
//   }, []);

//   // Navigate when the layout is ready or when user state changes
//   useEffect(() => {
//     if (isLayoutReady) {
//       if (user) {
//         console.log("User exists:", user);
//         router.replace("/(tabs)/home");
//       } else {
//         console.log("No user, navigating to login");
//         router.replace("/(auth)/login"); 

//       }
//     }
//   }, [isLayoutReady, user]); // This hook will re-run when user changes

//   return null; // No UI needed; just handles the navigation
// }


// import { useEffect, useState } from "react";
// import { Redirect, router } from "expo-router";
// import { useUserStore } from "./zustand/store.js";
// import { supabase } from "./lib/supabase-client";

// export default function IndexPage() {
//   const [isLayoutReady, setIsLayoutReady] = useState(false);
//   const setUser = useUserStore((state) => state.setUser);

//   // Function to check Supabase session and set the user in Zustand store
//   const fetchUserSession = async () => {
//     try {
//       const { data: { session } } = await supabase.auth.getSession();

//       if (session) {
//         const { user } = session;
//         // console.log("User session found:", user);

//         // Update Zustand store with user details
//         setUser({
//           id: user.id,
//           email: user.email,
//           username: user.user_metadata.username || null,
//           provider: user.user_metadata.provider || "supabase",
//         });

//         // Redirect to the home page
//         router.replace("/(tabs)/home");
//       } else {
//         // console.log("No session found, navigating to login");
//         router.replace("/(auth)/login");
//       }
//     } catch (error) {
//       // console.error("Error fetching session:", error);
//       router.replace("/(auth)/login");
//     }
//   };

//   useEffect(() => {
//     setIsLayoutReady(true); // Mark layout as ready
//   }, []);

//   useEffect(() => {
//     if (isLayoutReady) {
//       fetchUserSession(); // Fetch user session on app load
//     }
//   }, [isLayoutReady]);

//   return null; // No UI needed; just handles the navigation
// }




import { useEffect, useState } from "react";
import { router } from "expo-router";
import { supabase } from "./lib/supabase-client";
import { useUserStore } from "./zustand/store.js";

export default function IndexPage() {
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const { user } = session;
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile && !error) {
          setUser({ ...user, ...profile });
          router.replace("/(tabs)/home");
        } else {
          console.error("Error fetching profile:", error);
          router.replace("/(auth)/login");
        }
      } else {
        router.replace("/(auth)/login");
      }
    };

    setIsLayoutReady(true);
    if (isLayoutReady) fetchProfile();
  }, [isLayoutReady]);

  return null;
}
