import { GxChatMessage, GxQueryItem, Query } from "../../common/basic-types";
import {
  mapGxQueryItemToChatItem,
  transformQueryDtoListToUIData,
  transformQueryDtoToGxQueryItem
} from "../query-transformations";

describe("transformation between dto and ui data", () => {
  const RealDate = Date.now;

  beforeAll(() => {
    global.Date.now = jest.fn(() => new Date("2023-08-15T14:09:49").getTime());
  });

  afterAll(() => {
    global.Date.now = RealDate;
  });

  it("should returns a GxQueryItem object", () => {
    const dto: Partial<Query>[] = [
      {
        Id: "4bf29a4a-b79b-45af-9277-7bc87704df79",
        Name: "AverageLifeExpectancy",
        Description: "Average Life Expectancy",
        Modified: "2023-07-15T14:09:49",
        Expression: "a"
      },
      {
        Id: "8cca6f2c-65e5-4830-aebe-803362c13b3f",
        Name: "CityPopulationForCountry",
        Description: "City Population For Country",
        Modified: "2023-08-02T14:09:49",
        Expression: "b"
      }
    ];
    const expected = [
      {
        Id: "4bf29a4a-b79b-45af-9277-7bc87704df79",
        Name: "AverageLifeExpectancy",
        Description: "Average Life Expectancy",
        Modified: new Date("2023-07-15T14:09:49"),
        Expression: "a",
        differenceInDays: 31
      },
      {
        Id: "8cca6f2c-65e5-4830-aebe-803362c13b3f",
        Name: "CityPopulationForCountry",
        Description: "City Population For Country",
        Modified: new Date("2023-08-02T14:09:49"),
        Expression: "b",
        differenceInDays: 13
      }
    ] as GxQueryItem[];

    const result = transformQueryDtoListToUIData(dto);
    expect(result[0]).toEqual(expected[0]);
    expect(result[1]).toEqual(expected[1]);
  });
});

describe("transformation between dto and ui data", () => {
  const RealDate = Date.now;

  beforeAll(() => {
    global.Date.now = jest.fn(() => new Date("2023-08-15T14:09:49").getTime());
  });

  afterAll(() => {
    global.Date.now = RealDate;
  });

  it("should return a GX Query Item", () => {
    const dto = {
      Id: "4bf29a4a-b79b-45af-9277-7bc87704df79",
      Name: "AverageLifeExpectancy",
      Description: "Average Life Expectancy",
      Modified: "2023-07-15T14:09:49",
      Expression: "a"
    } as Query;
    const expected = {
      Id: "4bf29a4a-b79b-45af-9277-7bc87704df79",
      Name: "AverageLifeExpectancy",
      Description: "Average Life Expectancy",
      Modified: new Date("2023-07-15T14:09:49"),
      Expression: "a",
      differenceInDays: 31
    } as GxQueryItem;

    const result = transformQueryDtoToGxQueryItem(dto);
    expect(result).toEqual(expected);
  });
});

describe("map query item to chat item", () => {
  it("should return a GxChatItem object", () => {
    const dto = {
      Id: "4bf29a4a-b79b-45af-9277-7bc87704df79",
      Name: "AverageLifeExpectancy",
      Description: "Average Life Expectancy",
      Modified: new Date("2023-07-15T14:09:49"),
      Expression: "CountryName [Name='Element1']",
      differenceInDays: 31
    } as GxQueryItem;
    const expected: GxChatMessage = {
      id: "4bf29a4a-b79b-45af-9277-7bc87704df79",
      messageType: "assistant",
      expression: "CountryName [Name='Element1']",
      content: "Average Life Expectancy"
    };

    const result = mapGxQueryItemToChatItem(dto);
    expect(result).toEqual(expected);
  });
});
