# Nacos

nacos sdk for browser

## Example

```typescript
import { Nacos } from "@silkjs/nacos";

const client = new Nacos({
  endpoint: "<endpoint>",
  username: "<username>",
  password: "<password>",
});

const config = await client.GetConfig<{ uri: { sso: string } }>({
  dataId: "<dataId>",
  group: "<group>",
});
```
