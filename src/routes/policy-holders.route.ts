import * as Router from '@koa/router';
import { Context } from 'koa';
import { respondData, respondMessage } from '../utils/responses.util';
import { policyHoldersService } from '../services';
import { validateSchema } from '../middlewares/validate.middleware';
import { CreatePolicyHoldersBody } from '../models/policy-holders.model';

const router = new Router();

router.get('/api/policyholders/:code/top', async (ctx: Context) => {
  const code = ctx.params.code as string;
  if (!code) throw new Error('code is required');
  const res = await policyHoldersService.getParentHolder(code);
  return respondData(ctx, res);
});

router.get('/api/policyholders', async (ctx: Context) => {
  const code = ctx.query.code as string | undefined;
  if (!code) throw new Error('code is required');
  const res = await policyHoldersService.getChildHolders(code);
  return respondData(ctx, res);
});

router.post(
  '/api/policyholders',
  validateSchema(CreatePolicyHoldersBody),
  async (ctx: Context) => {
    const { maxCount } = ctx.request.body as { maxCount: number };
    await policyHoldersService.createRandomHolders(maxCount);
    return respondMessage(ctx, 'ok');
  }
);

export default router.routes();
