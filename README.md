# Artivain Logs

Example:

```typescript
import { LogsObject } from "artivain-logs";

const logs = new LogsObject("apiKey", "from");
// Will log it in the database as "content | userId: 123"
logs.info("content", {
  userId: 123, //optional
});
//returns a promise
```
