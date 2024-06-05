import CookieManager, { Cookie } from "@react-native-cookies/cookies";

export const handleIncomingCookie = async (url: string, endpoint: string) => {
  if (!url.includes("appwrite-callback")) {
    return false;
  }

  const queryParams = parseQueryParams(url);

  if (!queryParams.key || !queryParams.secret || !queryParams.domain) {
    throw new Error(
      "Invalid OAuth2 Response. Key, Secret and Domain not available."
    );
  }

  const domainUrl = new URL(endpoint);

  const cookie: Cookie = {
    name: queryParams.key,
    value: queryParams.secret,
    path: queryParams.path,
    expires: queryParams.expires,
    secure: "secure" in queryParams,
    httpOnly: "httpOnly" in queryParams,
    domain: domainUrl.hostname,
  };

  return CookieManager.set(domainUrl.toString(), cookie);
};

export const deleteCookies = async () => {
  try {
    await CookieManager.clearAll();
  } catch (e) {
    console.log(e);
  }
};

export const parseQueryParams = (url: string) => {
  const queryParams = url.includes("?") ? url.split("?")[1] : url;

  if (!queryParams) {
    return {};
  }

  return queryParams.split("&").reduce((acc, curr) => {
    const [key, value] = curr.split("=");
    return { ...acc, [key as string]: value };
  }, {} as Record<string, string | undefined>);
};
