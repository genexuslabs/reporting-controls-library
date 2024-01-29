import { GXqueryConnector as OriginalGXqueryConnector,
    GET_METADATA_BY_NAME_SERVICE_PATH,
    GET_QUERY_BY_NAME_SERVICE_PATH,
    GET_LIST_QUERY_SERVICE_PATH,
    NEW_QUERY_SERVICE_PATH } from "../gxquery-connector";
import { ChatMessage, QueryViewerBase } from "@common/basic-types";

describe('GXqueryConnector', () => {
  test("Component should be exist", () => {
    expect(OriginalGXqueryConnector).toBeDefined();
  });
});

describe("Fetching data", () => {
  const GXqueryConnector = OriginalGXqueryConnector;
  const originalFetch = global.fetch;

  const query = { name: 'name', id: '123' } as QueryViewerBase;
  const options = {
    baseUrl: 'BASE_URL',
    metadataName: 'Metadata',
    apiKey: 'authorization_key',
    saiaToken: 'saia_token',
    saiaUserId: 'saia_user_id',
    query
  };
  const headers = {
    "Authorization": "authorization_key",
    "Content-Type": "application/json",
    "Saia-Auth": options.saiaToken,
    "X-Saia-User-Id": options.saiaUserId,
  };

  const newInputResult = {
    ChatMessages: [{ role: 'user', content: 'question' }, { role: 'assistant', content: 'answer' }],
    MetadataId: '123',
    Errors: [] as string[]
  };

  beforeEach(() => {
    global.fetch = jest.fn();
    const findResolveByUrl = (url: unknown) => {
      const baseUrl = url && url.toString();
      const fetchDict: Record<string, any> = {
        [`${options.baseUrl + GET_METADATA_BY_NAME_SERVICE_PATH}?Name=Metadata`]: { Metadata: { id: "a3f72", name: "Metadata" }},
        [`${options.baseUrl + GET_QUERY_BY_NAME_SERVICE_PATH}?MetadataId=a3f72&Name=name`]: { Query: query },
        [`${options.baseUrl + GET_LIST_QUERY_SERVICE_PATH}?MetadataId=a3f72`]: { Queries: [query] },
        [options.baseUrl + NEW_QUERY_SERVICE_PATH]: newInputResult,
      };
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ Errors: [], ...fetchDict[baseUrl] }) } as Response);
    }

    jest.spyOn(global, 'fetch').mockImplementation(
      jest.fn( url => findResolveByUrl(url))
    );
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  describe("Get query by name", () => {
    test("Connect and fetching data", async () => {

      const resp = await GXqueryConnector.getQueryByName(options);

      // expect(global.fetch).toHaveBeenNthCalledWith(1, "BASE_URL/Session/isValid?", {"body": undefined, "cache": "no-store", "headers": {"Content-Type": "application/json"}, "method": "GET"});

      expect(global.fetch).toHaveBeenNthCalledWith(1, "BASE_URL/Metadata/GetByName?Name=Metadata", {"body": undefined, "cache": "no-store", "headers": headers, "method": "GET"});
      expect(global.fetch).toHaveBeenNthCalledWith(2, "BASE_URL/Query/GetByName?MetadataId=a3f72&Name=name", {"body": undefined, "cache": "no-store", "headers": headers, "method": "GET"});

      expect(resp).toEqual({ Errors: [], Query: query })
    });

    test("Connection throws an error", async () => {
      jest.spyOn(global, 'fetch').mockImplementation(
        jest.fn(() => Promise.reject({ message: 'error message' }))
      );

      expect.assertions(1);
      try {
        await GXqueryConnector.getQueryByName(options);
      } catch (e) {
        expect(e).toMatchObject({Errors: [{Code: -1, Message: "error message"}]});
      }
    });
  });

  describe("Get query list", () => {
    test("Fetching data when the connection was connected", async () => {
      const result = { Queries: [query] };
      const resp = await GXqueryConnector.getQueryList(options);

      expect(global.fetch).toHaveBeenCalledWith("BASE_URL/Query/List?MetadataId=a3f72", {"body": undefined, "cache": "no-store", "headers": headers, "method": "GET"});
      // expect(global.fetch).toHaveBeenCalledTimes(2);

      expect(resp).toMatchObject(result)
    });
  });

  describe("New input", () => {
    test("Chat when the connection was connected", async () => {
      const messages = [{ role: 'user', content: 'question' }] as ChatMessage[];

      const resp = await GXqueryConnector.newInput(options, messages);

      expect(resp).toEqual(newInputResult);
    });
  });
});
