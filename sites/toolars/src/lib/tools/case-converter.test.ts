import { describe, expect, it } from "vitest";
import { convertCaseText } from "./case-converter";

describe("convertCaseText", () => {
  it("generates copy-ready case variants from mixed naming input", () => {
    const result = convertCaseText("XMLHttp_request parser demo");

    expect(result.words).toEqual(["XML", "Http", "request", "parser", "demo"]);
    expect(result.variants.map((variant) => [variant.key, variant.value])).toEqual([
      ["camelCase", "xmlHttpRequestParserDemo"],
      ["pascalCase", "XmlHttpRequestParserDemo"],
      ["snakeCase", "xml_http_request_parser_demo"],
      ["kebabCase", "xml-http-request-parser-demo"],
      ["constantCase", "XML_HTTP_REQUEST_PARSER_DEMO"],
      ["titleCase", "Xml Http Request Parser Demo"],
      ["sentenceCase", "Xml http request parser demo"],
      ["dotCase", "xml.http.request.parser.demo"],
      ["lowerCase", "xml http request parser demo"],
      ["upperCase", "XML HTTP REQUEST PARSER DEMO"]
    ]);
    expect(result.summary).toBe("10 case formats generated from 5 detected words.");
    expect(result.privacyNote).toBe("Local conversion only; input text stays in the browser.");
  });
});
