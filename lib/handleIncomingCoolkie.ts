import CookieManager, { Cookie } from "@react-native-cookies/cookies";

import { parseQueryParams } from "./uri";

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
  await CookieManager.clearAll();

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
