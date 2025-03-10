export const request = async (
  url: string,
  options: RequestInit
): Promise<any> => {
  const response = await fetch(url, options);
  return response;
};
