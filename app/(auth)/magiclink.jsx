const sendMagicLink = async ({ email }) => {
  const { error } = await supabase.auth.signInWithOtp({
    email: { email },
    options: {
      emailRedirectTo: redirectTo,
    },
  });

  if (error) throw error;
  // Email sent.
};
