import { queryParamsToString } from "./queryMethods";

export interface RequestOptions {
  method?: string;
  headers?: { [key: string]: string };
  body?: string;
}

interface DateRange {
  [key: string]: string;
  fromDateInclusive: string;
  toDateInclusive: string;
}

export interface Task {
  id: number;
  name: string;
  description: string;
  project: {
    id: number;
    name: string;
    customer: {
      id: number;
      name: string;
    };
  };
  favorite: boolean;
  locked: boolean;
}

export interface TimeEntrie {
  id: number;
  date: string;
  value: number;
  taskId: number;
}

export interface ReportTimeEntrie {
  user: number;
  userEmail: string;
  id: number;
  date: string;
  value: number;
  taskId: number;
}

export interface AccessTokenCreatedInfo {
  friendlyname: string;
  expiryDate: string;
}

export interface AccessTokenInfo extends AccessTokenCreatedInfo {
  id: number;
}

export interface AlvtimeApiClient {
  createAccessToken: (friendlyName: string) => Promise<AccessTokenInfo[]>;
  deleteAccessTokens: (
    tokenIds: { tokenId: number }[]
  ) => Promise<AccessTokenInfo[]>;
  getActiveAccessTokens: () => Promise<AccessTokenInfo[]>;
  getTasks: () => Promise<Task[]>;
  editFavoriteTasks: (tasks: Task[]) => Promise<Task[]>;
  getTimeEntries: (dateRange: DateRange) => Promise<TimeEntrie[]>;
  editTimeEntries: (timeEntries: TimeEntrie[]) => Promise<TimeEntrie[]>;
  getTimeEntriesReport: (dateRange: DateRange) => Promise<ReportTimeEntrie[]>;
}

type FetchFunc = (
  uri: string,
  options: RequestOptions
) => Promise<{ json(): Promise<any>; status: number; statusText: string }>;

type AccessTokenGetter = () => Promise<string>;

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
    createAccessToken(friendlyName: string) {
      const method = "post";
      const body = JSON.stringify({ friendlyName });
      const options = { method, body };
      return alvtimeAPIFetcher("/api/user/AccessToken", options);
    },

    deleteAccessTokens(tokenIds: { tokenId: number }[]) {
      const method = "delete";
      const body = JSON.stringify(tokenIds);
      const options = { method, body };
      return alvtimeAPIFetcher("/api/user/AccessToken", options);
    },

    getActiveAccessTokens() {
      return alvtimeAPIFetcher("/api/user/ActiveAccessTokens");
    },

    getTasks() {
      return alvtimeAPIFetcher("/api/user/tasks");
    },

    editFavoriteTasks(tasks: Task[]) {
      const method = "post";
      const body = JSON.stringify(tasks);
      const options = { method, body };
      return alvtimeAPIFetcher("/api/user/Tasks", options);
    },

    getTimeEntries(dateRange: DateRange) {
      return alvtimeAPIFetcher(
        "/api/user/TimeEntries" + queryParamsToString(dateRange)
      );
    },

    editTimeEntries(timeEntries: TimeEntrie[]) {
      const method = "post";
      const body = JSON.stringify(timeEntries);
      const options = { method, body };
      return alvtimeAPIFetcher("/api/user/TimeEntries", options);
    },

    getTimeEntriesReport(dateRange: DateRange) {
      return alvtimeAPIFetcher(
        "/api/user/TimeEntriesReport" + queryParamsToString(dateRange)
      );
    },
  };
}
