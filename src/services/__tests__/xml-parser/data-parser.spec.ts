import { QueryViewerServiceData } from "../../types/service-result";
import { parseDataXML } from "../../xml-parser/data-parser";

describe('parseDataXML', () => {
  test('should be defined', () => {
    expect(parseDataXML).toBeDefined();
  })

  test('should return a undefined when a empty string was given', () => {
    expect(parseDataXML("")).toEqual(undefined);
  })

  test('should parse the xml string', () => {
    const data = "<?xml version = \"1.0\" encoding = \"UTF-8\"?>\n\r\n<Recordset RecordCount=\"1\" PageCount=\"1\">\n\t<Page PageNumber=\"1\">\n\t\t<Record>\n\t\t\t<F1>72.3845</F1>\n\t\t\t<F1_N>14476.9</F1_N>\n\t\t\t<F1_D>200</F1_D>\n\t\t</Record>\n\t</Page>\n</Recordset>\n";
    const result: QueryViewerServiceData = {
      rows: [
        {
          "F1": "72.3845",
          "F1_D": "200",
          "F1_N": "14476.9",
        },
      ],
    };

    expect(parseDataXML(data)).toEqual(result);
  })
})
