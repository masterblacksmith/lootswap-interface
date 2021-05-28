import { JSBI, TokenAmount } from '@venomswap/sdk'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useMasterLooterContract } from './useContract'
import useGovernanceToken from './useGovernanceToken'

export default function useBaseStakingRewardsEmission(): TokenAmount | undefined {
  const govToken = useGovernanceToken()
  const masterLooterContract = useMasterLooterContract()

  const result = useSingleCallResult(masterLooterContract, 'getNewRewardPerBlock', [0])
  const baseRewardsPerBlock =
    govToken && result && !result.loading && result.result
      ? new TokenAmount(govToken, JSBI.BigInt(result.result))
      : undefined

  return baseRewardsPerBlock
}
