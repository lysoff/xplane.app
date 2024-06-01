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
