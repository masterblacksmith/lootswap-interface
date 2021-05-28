import { Interface } from '@ethersproject/abi'
import { abi as STAKING_REWARDS_ABI } from '@uniswap/liquidity-staker/build/StakingRewards.json'
import { abi as STAKING_REWARDS_FACTORY_ABI } from '@uniswap/liquidity-staker/build/StakingRewardsFactory.json'
import { abi as MASTER_LOOTER_ABI } from '@venomswap/contracts/build/MasterBreeder.json'

const STAKING_REWARDS_INTERFACE = new Interface(STAKING_REWARDS_ABI)

const MASTER_LOOTER_INTERFACE = new Interface(MASTER_LOOTER_ABI)

const STAKING_REWARDS_FACTORY_INTERFACE = new Interface(STAKING_REWARDS_FACTORY_ABI)

export { STAKING_REWARDS_FACTORY_INTERFACE, STAKING_REWARDS_INTERFACE, MASTER_LOOTER_INTERFACE }
