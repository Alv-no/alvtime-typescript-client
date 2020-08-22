import createUserMethods, { AlvtimeApiClientUser } from "./user";

export interface RequestOptions {
  method?: string;
  headers?: { [key: string]: string };
  body?: string;
}

type FetchFunc = (
  uri: string,
  options: RequestOptions
) => Promise<{ json(): Promise<any>; status: number; statusText: string }>;

type AccessTokenGetter = () => Promise<string>;

export interface AlvtimeApiClient {
  user: AlvtimeApiClientUser;
}

export default function createAlvtimeClient(
  uri: string,
  getAccessToken: AccessTokenGetter,
  fetch: FetchFunc
): AlvtimeApiClient {
  async function alvtimeAPIFetcher(path: string, options: RequestOptions = {}) {
    let url = uri + path;
    const accessToken = await getAccessToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    const requestOptions = { ...options, headers };
    const response = await fetch(url, requestOptions);
    if (response.status !== 200) {
      throw response.statusText;
    }
    return response.json();
  }

  return {
    user: createUserMethods(alvtimeAPIFetcher),
  };
}
