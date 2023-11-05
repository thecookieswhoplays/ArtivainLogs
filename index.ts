import * as got from "node-fetch";

function apiCall(
  url: string,
  apiKey: string,
  content: string,
  from: string,
  level: number,
  doLog: boolean,
  args?: object
): Promise<{ success: true } | { success: false; error: object }> {
  return new Promise(async (resolve, reject) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", apiKey);
    args = args;
    const formatedContent = format(content, args);
    const response = await fetch(url, {
      method: "post",
      //   @ts-ignore
      //   Weird Error requesting a readable string????
      body: JSON.stringify({
        action: "create-log",
        program: from,
        level: level,
        content: formatedContent,
      }),
      headers: headers,
    });
    if (doLog) {
      console.log(formatedContent);
    }
    if (response.status === 200) {
      resolve({ success: true });
    } else {
      resolve({ success: false, error: response.json() });
    }
  });
}

export class LogsObject {
  private apiKey: string;
  private url: string;
  private from: string;
  private level: number;
  private doLog: boolean;
  constructor(
    // url: string,
    // apiKey: string,
    // from: string | "api",
    // level: number,
    // doLog?: boolean
    config: {
      url: string;
      apiKey: string;
      from: string | "api";
      level: number;
      doLog?: boolean;
    }
  ) {
    this.apiKey = config.apiKey;
    this.from = config.from;
    this.level = config.level;
    this.url = appendToUrl(config.url, "/api.php");
    this.doLog = config.doLog ?? false;
  }
  log(
    content: string,
    args?: object
  ): Promise<{ success: true } | { success: false; error: object }> {
    return apiCall(
      this.url,
      this.apiKey,
      content,
      this.from,
      this.level,
      this.doLog,
      args
    );
  }
}

function appendToUrl(baseUrl: string, appendString: string): string {
  // Check if the base URL already has a trailing slash and the append string has a leading slash
  if (baseUrl.endsWith("/") && appendString.startsWith("/")) {
    return baseUrl + appendString.slice(1);
  }

  // Check if the base URL and the append string both lack or have trailing slashes
  if (!baseUrl.endsWith("/") && !appendString.startsWith("/")) {
    return baseUrl + "/" + appendString;
  }

  // If none of the above conditions apply, simply concatenate the strings
  return baseUrl + appendString;
}

function format(content: string, args?: object) {
  if (!args) {
    return content;
  }
  let argsToPass = args as { [key: string]: any };
  const argsString = returnFromObject(argsToPass);
  return argsString ? content + " | " + argsString : content;
}

interface anyArray {
  [key: string]: any[];
}

function returnFromObject(inputObject: { [key: string]: any }): string {
  if (typeof inputObject !== "object") {
    return "";
  }

  const result = [];

  for (const key in inputObject) {
    if (inputObject.hasOwnProperty(key)) {
      if (typeof inputObject[key] === "object") {
        const innerKeys = Object.keys(inputObject[key]);
        const innerObjects = innerKeys.map((innerKey) => {
          const innerValue =
            typeof inputObject[key][innerKey] === "object"
              ? `(${returnFromObject(inputObject[key][innerKey])})`
              : inputObject[key][innerKey];
          return `${innerKey}: ${innerValue}`;
        });
        result.push(`${key}: (${innerObjects.join(", ")})`);
      } else {
        result.push(`${key}: ${inputObject[key]}`);
      }
    }
  }

  return result.join(" | ");
}
