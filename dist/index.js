"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// index.ts
var package_exports = {};
__export(package_exports, {
  LogsObject: () => LogsObject
});
module.exports = __toCommonJS(package_exports);
function apiCall(url, apiKey, content, from, level, doLog, args) {
  return new Promise((resolve, reject) => __async(this, null, function* () {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", apiKey);
    args = args;
    const formatedContent = format(content, args);
    const response = yield fetch(url, {
      method: "post",
      //   @ts-ignore
      //   Weird Error requesting a readable string????
      body: JSON.stringify({
        action: "create-log",
        program: from,
        level,
        content: formatedContent
      }),
      headers
    });
    if (doLog) {
      console.log(formatedContent);
    }
    if (response.status === 200) {
      resolve({ success: true });
    } else {
      resolve({ success: false, error: response.json() });
    }
  }));
}
var LogsObject = class {
  constructor(config) {
    var _a;
    this.apiKey = config.apiKey;
    this.from = config.from;
    this.level = config.level;
    this.url = appendToUrl(config.url, "/api.php");
    this.doLog = (_a = config.doLog) != null ? _a : false;
  }
  log(content, args) {
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
};
function appendToUrl(baseUrl, appendString) {
  if (baseUrl.endsWith("/") && appendString.startsWith("/")) {
    return baseUrl + appendString.slice(1);
  }
  if (!baseUrl.endsWith("/") && !appendString.startsWith("/")) {
    return baseUrl + "/" + appendString;
  }
  return baseUrl + appendString;
}
function format(content, args) {
  if (!args) {
    return content;
  }
  let argsToPass = args;
  const argsString = returnFromObject(argsToPass);
  return argsString ? content + " | " + argsString : content;
}
function returnFromObject(inputObject) {
  if (typeof inputObject !== "object") {
    return "";
  }
  const result = [];
  for (const key in inputObject) {
    if (inputObject.hasOwnProperty(key)) {
      if (typeof inputObject[key] === "object") {
        const innerKeys = Object.keys(inputObject[key]);
        const innerObjects = innerKeys.map((innerKey) => {
          const innerValue = typeof inputObject[key][innerKey] === "object" ? `(${returnFromObject(inputObject[key][innerKey])})` : inputObject[key][innerKey];
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LogsObject
});
