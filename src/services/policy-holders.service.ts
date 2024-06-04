import { PolicyHolders } from '../models';
import { policyHoldersRepository } from '../repositories';
import { policyHoldersService } from '.';

export {
  getParentHolder,
  getChildHolders,
  createRandomHolders,
  nodeBreathFirstSearch,
};

const MAX_BRANCHES = 2;

async function getParentHolder(code: string) {
  const node = await policyHoldersRepository.findOne({
    where: { code },
  });
  if (!node) throw new Error('policy holder not found');
  return policyHoldersService.getChildHolders(node.introducer_code);
}

async function getChildHolders(code: string) {
  const node = await policyHoldersRepository.findOne({
    where: { code },
  });
  if (!node) throw new Error('policy holder not found');
  const [leftNode, rightNode] = await policyHoldersRepository.find({
    where: { introducer_code: node.code },
  });
  const currentLevel = 2;
  const maxLevel = 4;
  const result = {
    ...node,
    l: [
      leftNode,
      ...(await policyHoldersService.nodeBreathFirstSearch(
        leftNode,
        currentLevel,
        maxLevel
      )),
    ],
    r: [
      rightNode,
      ...(await policyHoldersService.nodeBreathFirstSearch(
        rightNode,
        currentLevel,
        maxLevel
      )),
    ],
  };
  return result;
}

async function nodeBreathFirstSearch(
  node: PolicyHolders,
  currentLevel: number,
  maxLevel: number
) {
  const queue = [node];
  const result = [];
  let levelCount = 1;

  while (queue.length) {
    const current = queue.shift();
    if (!current) break;

    const children = await policyHoldersRepository.find({
      where: { introducer_code: current.code },
    });
    result.push(...children);
    queue.push(...children);

    levelCount--;
    if (levelCount === 0) {
      currentLevel++;
      levelCount = queue.length;
    }
    if (currentLevel >= maxLevel) break;
  }
  return result;
}

async function createRandomHolders(maxCount: number) {
  const root = await policyHoldersRepository.directCreate({
    name: `name-${0}`,
    registration_date: new Date(),
  });

  let current = 1;
  const queue = [root];
  while (current < maxCount) {
    const node = queue.shift();
    if (!node) break;

    for (let i = 0; i < MAX_BRANCHES; i++) {
      const childNode = await policyHoldersRepository.directCreate({
        name: `name`,
        registration_date: new Date(),
        introducer_code: node.code,
      });
      queue.push(childNode);
      current++;
    }
  }
}
