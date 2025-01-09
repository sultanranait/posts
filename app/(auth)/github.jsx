import { Button, Image, TouchableOpacity, View } from "react-native";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase } from "../lib/supabase-client";

WebBrowser.maybeCompleteAuthSession();
const redirectTo = makeRedirectUri();
// console.log("Redirect url : ", { redirectTo });

const createSessionFromUrl = async (url) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);
  

  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;
  // console.log("access Token :  ", access_token);
  // console.log("refresh Token :  ",refresh_token);
  // console.log("params :  ",params);

  if (!access_token) return;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) throw error;
  return data.session;
};

const performOAuth = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });
  if (error) throw error;

  const res = await WebBrowser.openAuthSessionAsync(
    data?.url ?? "",
    redirectTo
  );

  if (res.type === "success") {
    const { url } = res;
    await createSessionFromUrl(url);
  }
};

export default function Auth() {
  // Handle linking into app from email app.
  const url = Linking.useURL();
  if (url) createSessionFromUrl(url);

  return (
    <>
      <View
        style={{
          gap: 20,
          marginTop: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity onPress={performOAuth}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/2504/2504911.png",
            }}
            width={30}
            height={30}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    </>
  );
}
