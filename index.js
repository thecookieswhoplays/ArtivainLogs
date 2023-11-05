"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsObject = void 0;
function apiCall(url, apiKey, content, from, level, args) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", apiKey);
        args = args;
        const formatedContent = format(content, args);
        console.log(url);
        const response = yield fetch(url, {
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
        if (response.status === 200) {
            resolve({ success: true });
        }
        else {
            resolve({ success: false, error: response.json() });
        }
    }));
}
class LogsObject {
    constructor(url, apiKey, from, level, doLog) {
        this.apiKey = apiKey;
        this.from = from;
        this.level = level;
        this.url = appendToUrl(url, "/api.php");
        this.doLog = doLog !== null && doLog !== void 0 ? doLog : false;
    }
    log(content, args) {
        return apiCall(this.url, this.apiKey, content, this.from, this.level, args);
    }
}
exports.LogsObject = LogsObject;
function appendToUrl(baseUrl, appendString) {
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
                    const innerValue = typeof inputObject[key][innerKey] === "object"
                        ? `(${returnFromObject(inputObject[key][innerKey])})`
                        : inputObject[key][innerKey];
                    return `${innerKey}: ${innerValue}`;
                });
                result.push(`${key}: (${innerObjects.join(", ")})`);
            }
            else {
                result.push(`${key}: ${inputObject[key]}`);
            }
        }
    }
    return result.join(" | ");
}
