import createAlvtimeClient, { RequestOptions } from "./index";
import fetch from "node-fetch";

interface MockFetchResult {
  result: any;
  uri: string;
  init: RequestOptions;
}

function createMockFetch(result: any, status: number, statusText: string) {
  const mockFetch = async (uri: string, init: RequestOptions) => {
    return {
      status,
      statusText,
      async json() {
        return {
          result,
          uri,
          init,
        };
      },
    };
  };

  return mockFetch;
}

const apiHost = "http://alvtime-web-api";
const testAccessToken = "5801gj90-jf39-5j30-fjk3-480fj39kl409";
const getTestAccessToken = (): Promise<string> =>
  new Promise((r) => r(testAccessToken));
const mockPayload = "payload";
const mockHost = "https://url";
const mockDateRange = {
  fromDateInclusive: "2019-01-01",
  toDateInclusive: "2020-03-01",
};

describe("Tasks", () => {
  describe("getTasks", () => {
    it("Should return tasks", async () => {
      const mockFetch = createMockFetch(mockPayload, 200, "");
      const client = createAlvtimeClient(
        mockHost,
        getTestAccessToken,
        mockFetch
      );

      const mockResult = ((await client.user.getTasks()) as unknown) as MockFetchResult;

      expect(mockResult.result).toEqual(mockPayload);
    });

    it("Should return tasks from api", async () => {
      const client = createAlvtimeClient(apiHost, getTestAccessToken, fetch);
      const result = await client.user.getTasks();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe("editTasks", () => {
    test("Should return edited task", async () => {
      const {
        user: { editTasks },
      } = createAlvtimeClient(apiHost, getTestAccessToken, fetch);
      const task = { id: 17, favorite: true };
      const result = await editTasks([task]);
      expect(result).toBeInstanceOf(Array);
    });
  });
});

describe("getTimeEntries", () => {
  describe("Happy path", () => {
    let mockResult: MockFetchResult;
    beforeEach(async () => {
      const mockFetch = createMockFetch(mockPayload, 200, "");
      const client = createAlvtimeClient(
        mockHost,
        getTestAccessToken,
        mockFetch
      );

      mockResult = ((await client.user.getTimeEntries(
        mockDateRange
      )) as unknown) as MockFetchResult;
    });

    it("Should return timeEntries", async () => {
      expect(mockResult.result).toEqual(mockPayload);
    });

    it("Should use correct url", () => {
      expect(mockResult.uri).toEqual(
        `${mockHost}/api/user/TimeEntries?fromDateInclusive=${mockDateRange.fromDateInclusive}&toDateInclusive=${mockDateRange.toDateInclusive}`
      );
    });

    it("Should include access token", () => {
      //@ts-ignore
      expect(mockResult.init.headers["Authorization"]).toEqual(
        "Bearer " + testAccessToken
      );
    });

    it("Should set Content-Type to application/json", () => {
      //@ts-ignore
      expect(mockResult.init.headers["Content-Type"]).toEqual(
        "application/json"
      );
    });
  });
});

describe("AccessToken", () => {
  let client = createAlvtimeClient(apiHost, getTestAccessToken, fetch);
  beforeEach(() => {
    client = createAlvtimeClient(apiHost, getTestAccessToken, fetch);
  });

  describe("getAccessToken", () => {
    test("Should get access token info from api", async () => {
      const result = await client.user.getActiveAccessTokens();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe("createAccessToken", () => {
    test("Should create an accessToken", async () => {
      const result = await client.user.createAccessToken("super friendly");
      expect(result).toHaveProperty("token");
      expect(result).toHaveProperty("expiryDate");
    });
  });

  describe("deleteAccessToken", () => {
    test("Should return access token info", async () => {
      await client.user.createAccessToken("super friendly");
      const result = await client.user.deleteAccessTokens([{ tokenId: 2 }]);
      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toHaveProperty("id");
      expect(result[0]).toHaveProperty("friendlyName");
      expect(result[0]).toHaveProperty("expiryDate");
    });
  });
});

describe("FlexiHour", () => {
  describe("FlexiHours", () => {
    test("Should return a result", async () => {
      const {
        user: { getFlexiHours },
      } = createAlvtimeClient(apiHost, getTestAccessToken, fetch);
      const result = await getFlexiHours(mockDateRange);
      expect(result).toBeInstanceOf(Array);
    });
  });
});

describe("Profile", () => {
  describe("Profile", () => {
    test("Should", async () => {
      const {
        user: { getProfile },
      } = createAlvtimeClient(apiHost, getTestAccessToken, fetch);
      const result = await getProfile();
      expect(result).toHaveProperty("name");
    });
  });
});
