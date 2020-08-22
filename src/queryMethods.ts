export function queryParamsToString(queryParams: { [key: string]: string }) {
  let query = "";
  for (let [key, value] of Object.entries(queryParams)) {
    query = query ? query + "&" : "?";
    query = query + key + "=" + value;
  }
  return query;
}
