import * as Koa from 'koa';
import * as logger from 'koa-logger';
import * as routes from './routes';

import { parseBody, logRequest } from './middlewares/common.middleware';
import { respondError } from './utils/responses.util';
import { CONFIG } from './config';
import { get } from 'lodash';
import * as orm from './repositories/typeorm';

run();

async function run() {
  const app = new Koa({ proxy: false });

  await orm.init();
  app.use(parseBody());
  app.use(logger());
  app.use(logRequest());

  app.use(async (ctx: Koa.Context, next: Koa.Next) => {
    try {
      await next();
      return ctx;
    } catch (err) {
      return respondError(ctx, err);
    }
  });

  for (const route in routes) {
    const routeModule = get(routes, route) as Koa.Middleware;
    app.use(routeModule);
    console.log(`routeModule ${route} is bind`);
  }

  app.listen(CONFIG.PORT, () =>
    console.log(`Server running on port ${CONFIG.PORT}`)
  );
}
