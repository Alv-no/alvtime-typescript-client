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
const mockPayload = "payload";
const mockHost = "https://url";
const mockDateRange = {
  fromDateInclusive: "2019-01-01",
  toDateInclusive: "2020-03-01",
};
const mockAccessToken = "super secret access token";

describe("getTasks", () => {
  it("Should return tasks", async () => {
    const mockFetch = createMockFetch(mockPayload, 200, "");
    const client = createAlvtimeClient(mockHost, mockFetch);

    const mockResult = ((await client.getTasks(
      "super secret access token"
    )) as unknown) as MockFetchResult;

    expect(mockResult.result).toEqual(mockPayload);
  });

  it("Should return tasks from api", async () => {
    const client = createAlvtimeClient(apiHost, fetch);

    const result = ((await client.getTasks(
      testAccessToken
    )) as unknown) as MockFetchResult;

    expect(result).toBeInstanceOf(Array);
  });
});

describe("getTimeEntries", () => {
  describe("Happy path", () => {
    let mockResult: MockFetchResult;
    beforeEach(async () => {
      const mockFetch = createMockFetch(mockPayload, 200, "");
      const client = createAlvtimeClient(mockHost, mockFetch);

      mockResult = ((await client.getTimeEntries(
        mockDateRange,
        mockAccessToken
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
        "Bearer " + mockAccessToken
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
