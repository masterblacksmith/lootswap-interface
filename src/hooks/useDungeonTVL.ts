import { useMemo } from 'react'
import { TokenAmount, Fraction } from '@venomswap/sdk'
import { useTokenBalance } from '../state/wallet/hooks'
import useBUSDPrice from './useBUSDPrice'
import useDungeonToken from './useDungeonToken'
import { GOVERNANCE_TOKEN_INTERFACE } from '../constants/abis/governanceToken'
import useGovernanceToken from 'hooks/useGovernanceToken'

export default function useDungeonTVL(): Fraction | undefined {
  const govToken = useGovernanceToken()
  const govTokenBusdPrice = useBUSDPrice(govToken)
  const dungeon = useDungeonToken()
  const dungeonGovTokenBalance: TokenAmount | undefined = useTokenBalance(
    dungeon && dungeon.address,
    govToken,
    'balanceOf',
    GOVERNANCE_TOKEN_INTERFACE
  )

  return useMemo(() => {
    return govTokenBusdPrice ? dungeonGovTokenBalance?.multiply(govTokenBusdPrice?.raw) : undefined
  }, [govToken, govTokenBusdPrice, dungeon, dungeonGovTokenBalance])
}
