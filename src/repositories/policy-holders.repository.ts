import { datasource } from './typeorm';
import { PolicyHolders } from '../models/policy-holders.model';
import { Repository } from 'typeorm';

export { setupRepo, policyHoldersRepository };

let policyHoldersRepository: PolicyHoldersRepository | undefined;

interface PolicyHoldersRepository extends Repository<PolicyHolders> {
  directCreate(data: Partial<PolicyHolders>): Promise<PolicyHolders>;
}

function setupRepo() {
  policyHoldersRepository = datasource().getRepository(PolicyHolders).extend({
    directCreate,
  });
}

async function directCreate(data: Partial<PolicyHolders>) {
  const holder = policyHoldersRepository.create(data);
  const createdHolder = await policyHoldersRepository.save(holder);
  createdHolder.code = `${createdHolder.id}`.padStart(10, '0');
  return policyHoldersRepository.save(createdHolder);
}
