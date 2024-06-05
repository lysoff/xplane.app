export const getGoogleUser = async (token: string) => {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};
