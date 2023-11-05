import { LogsObject } from "./index";

const o = new LogsObject({
  url: "https://logs.hospenza.com/",
  apiKey: "edd586d0ce664cb668f1b99f6953169ac82cc63c3116fa622a56f8499a71db80",
  from: "test",
  level: 4,
  doLog: true,
});
o.log("test", { test: "dw" });
