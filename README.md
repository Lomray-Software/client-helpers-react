# Pack of common helpers for `React`

![npm](https://img.shields.io/npm/v/@lomray/client-helpers-react)
![GitHub](https://img.shields.io/github/license/Lomray-Software/client-helpers-react)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=client-helpers-react&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=client-helpers-react)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=client-helpers-react&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=client-helpers-react)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=client-helpers-react&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=client-helpers-react)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=client-helpers-react&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=client-helpers-react)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=client-helpers-react&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=client-helpers-react)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=client-helpers-react&metric=coverage)](https://sonarcloud.io/summary/new_code?id=client-helpers-react)

## How to use Modal Context
#### [Code example](https://github.com/Lomray-Software/modal-context-example)

## How to use Route service typings

src/typings/lomray/route.d.ts (Add new file in project)
```typescript
import type { IParams } from '@lomray/client-helpers-react/services/route';
import type ROUTE from '@constants/routes';

declare module '@lomray/client-helpers-react/services/route' {
  type TRoute = typeof ROUTE;

  export type TRouteKeys = keyof TRoute;

  export type TRouteParams<TKey extends TRouteKeys> = IParams<{
    [TK in TKey]: TRoute[TK];
  }>;
}
```

src/constants/routes.ts
```typescript
enum TEST_TAB {
  FOO = 'foo',
  BAR = 'bar',
}

const ROUTE = {
  TEST: {
    URL: '/test/:id/:tabName',
    PARAMS: { id: '', tabName: TEST_TAB },
  },
}
```

src/pages/test/index.tsx
```typescript jsx
import type { TRouteParams } from '@lomray/client-helpers-react/services/route';
import { useParams } from 'react-router-dom';

const Test: FC = () => {
  // id: string | undefined, tabName: TEST_TAB | undefined
  const { id, tabName } = useParams<TRouteParams<'TEST'>>();

  ...
}
```
