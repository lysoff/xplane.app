import AsyncStorage from "@react-native-async-storage/async-storage";
import CookieManager, { Cookie } from "@react-native-cookies/cookies";

import { config } from "@/lib/appwrite";

export const handleIncomingCookie = async (url: string) => {
  if (!url.includes("appwrite-callback")) {
    return false;
  }

  const queryParams = parseQueryParams(url);

  if (!queryParams.key || !queryParams.secret || !queryParams.domain) {
    throw new Error(
      "Invalid OAuth2 Response. Key, Secret and Domain not available."
    );
  }

  const domainUrl = new URL(config.endpoint);

  const cookie: Cookie = {
    name: queryParams.key,
    value: queryParams.secret,
    path: queryParams.path,
    expires: queryParams.expires,
    secure: "secure" in queryParams,
    httpOnly: "httpOnly" in queryParams,
    domain: domainUrl.hostname,
  };

  await AsyncStorage.setItem("cookie", JSON.stringify(cookie));
  return setCookie(cookie);
};

export const setCookie = async (cookie: Cookie) => {
  return CookieManager.set(config.endpoint, cookie);
};

export const getCookie = async () => {
  return CookieManager.get(config.endpoint);
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
