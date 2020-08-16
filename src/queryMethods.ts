export interface QueryMethods {
  getHeaders: (
    accessToken: string
  ) => {
    headers: { [key: string]: string };
  };
  concatURL: (path: string, queryParams?: { [key: string]: string }) => string;
}
export default function createQueryMethods(uri: string): QueryMethods {
  return {
    getHeaders,
    concatURL(path: string, queryParams?: { [key: string]: string }) {
      let url = uri + path;
      if (queryParams) url = url + queryParamsToString(queryParams);
      return url;
    },
  };
}

function getHeaders(accessToken: string) {
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
}

export function queryParamsToString(queryParams: { [key: string]: string }) {
  let query = "";
  for (let [key, value] of Object.entries(queryParams)) {
    query = query ? query + "&" : "?";
    query = query + key + "=" + value;
  }
  return query;
}
