export const getGoogleUser = async (token: string) => {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const googleUser = await res.json();

  const userData = {
    email: googleUser.email,
    name: googleUser.name,
    avatar: googleUser.picture,
  };

  return userData;
};
