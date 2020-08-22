import { RequestOptions } from "./index";
import { queryParamsToString } from "./queryMethods";

export interface DateRange {
  [key: string]: string;
  fromDateInclusive: string;
  toDateInclusive: string;
}

interface Customer {
  contactEmail: string;
  contactPerson: string;
  contactPhone: string;
  id: number;
  invoiceAddress: string;
  name: string;
}

interface Project {
  customer: Customer;
  id: number;
  name: string;
}

interface Task {
  compensationRate: number;
  description: string;
  favorite: boolean;
  id: number;
  locked: boolean;
  name: string;
  project: Project;
}

interface TimeEntrie {
  id: number;
  date: string;
  value: number;
  taskId: number;
}

interface ReportTimeEntrie {
  user: number;
  userEmail: string;
  id: number;
  date: string;
  value: number;
  taskId: number;
}

interface AccessTokenCreatedInfo {
  friendlyname: string;
  expiryDate: string;
}

interface AccessTokenInfo extends AccessTokenCreatedInfo {
  id: number;
}

interface AccessToken extends AccessTokenInfo {
  value: string;
}

interface HourRate {
  fromDate: string;
  rate: number;
  taskId: number;
  id: number;
}

interface CustomerNavigation {
  id: number;
  name: string;
  invoiceAddress: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  project: [null];
}

interface ProjectNavigation {
  id: number;
  name: string;
  customer: number;
  customerNavigation: CustomerNavigation;
  task: [null];
}

interface ProfileTask {
  id: number;
  name: string;
  description: string;
  project: number;
  locked: boolean;
  favorite: boolean;
  compensationRate: number;
  projectNavigation: ProjectNavigation;
  associatedTasks: [null];
  hourRate: HourRate[];
  hours: [null];
  taskFavorites: [null];
}

interface Hour {
  id: number;
  user: number;
  value: number;
  date: string;
  dayNumber: number;
  year: number;
  taskId: number;
  locked: boolean;
  task: ProfileTask;
}

interface AssociatedTasks {
  id: number;
  userId: number;
  taskId: number;
  fromDate: string;
  endDate: string;
  task: ProfileTask;
}

interface TaskFavorite {
  id: number;
  userId: number;
  taskId: number;
  task: ProfileTask;
}

interface Profile {
  result: {
    id: number;
    name: string;
    email: string;
    startDate: string;
    flexiHours: number;
    accessTokens: AccessToken[];
    associatedTasks: AssociatedTasks[];
    hours: Hour[];
    taskFavorites: TaskFavorite[];
  };
}

export interface AlvtimeApiClientUser {
  createAccessToken: (friendlyName: string) => Promise<AccessTokenInfo[]>;
  deleteAccessTokens: (
    tokenIds: { tokenId: number }[]
  ) => Promise<AccessTokenInfo[]>;
  getActiveAccessTokens: () => Promise<AccessTokenInfo[]>;
  getFlexiHours: (
    dateRange: DateRange
  ) => Promise<{ result: { value: number; date: string } }[]>;
  getProfile: () => Promise<any>;
  getTasks: () => Promise<Task[]>;
  editTasks: (tasks: { id: number; favorite: boolean }[]) => Promise<Task[]>;
  getTimeEntries: (dateRange: DateRange) => Promise<TimeEntrie[]>;
  editTimeEntries: (timeEntries: TimeEntrie[]) => Promise<TimeEntrie[]>;
  getTimeEntriesReport: (dateRange: DateRange) => Promise<ReportTimeEntrie[]>;
}

export default function createUserMethods(
  alvtimeAPIFetcher: (path: string, options?: RequestOptions) => any
) {
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

    getFlexiHours(dateRange: DateRange) {
      return alvtimeAPIFetcher(
        "/api/user/FlexiHours" + queryParamsToString(dateRange)
      );
    },

    getProfile() {
      return alvtimeAPIFetcher("/api/user/Profile");
    },

    getTasks() {
      return alvtimeAPIFetcher("/api/user/tasks");
    },

    editTasks(tasks: { id: number; favorite: boolean }[]) {
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
