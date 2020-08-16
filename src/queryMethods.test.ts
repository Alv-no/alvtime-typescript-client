import createQueryMethods, {
  QueryMethods,
  queryParamsToString,
} from "./queryMethods";

describe("createQueryMethods", () => {
  let queryMethods: QueryMethods;
  beforeEach(() => {
    queryMethods = createQueryMethods("https://uri");
  });

  describe("queryParamsToString", () => {
    it("Should create correct string", () => {
      const queryParams = { entext: "en", tonummer: "2" };
      const result = queryParamsToString(queryParams);
      expect(result).toEqual("?entext=en&tonummer=2");
    });
  });
});
