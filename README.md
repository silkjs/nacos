# nacos

nacos sdk for browser

## example

```typescript
import { Nacos } from "@silkjs/nacos";

const client = new Nacos({
  endpoint: "<endpoint>",
  namespace: "<namespace>",
  username: "<username>",
  password: "<password>",
});
const config = await client.GetConfig<{ uri: { sso: string } }>(
  "<dataId>",
  "<group>"
);
```
