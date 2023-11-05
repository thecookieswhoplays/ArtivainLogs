import { LogsObject } from "../index";
import { config } from "dotenv";

config();

const apiKey = process.env.APIKEY as string;
const url = process.env.URL as string;
const LogObject = new LogsObject(url, apiKey, "api", 4, true);

LogObject.log("test", {
  test1: { key1: "value1", key2: { test: 1, testd: { test: 2 } } },
  test2: 69,
});
