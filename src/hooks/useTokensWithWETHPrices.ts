import { WETH, Token, Blockchain } from '@venomswap/sdk'
import { useMemo } from 'react'
import useGovernanceToken from './useGovernanceToken'
import useTokenWETHPrice from './useTokenWETHPrice'
import useBlockchain from './useBlockchain'
import getToken from '../utils/getToken'
import { useActiveWeb3React } from './index'

export default function useTokensWithWETHPrices(): Record<string, any> {
  const { chainId } = useActiveWeb3React()
  const blockchain = useBlockchain()

  const weth = chainId && WETH[chainId]

  const govToken = useGovernanceToken()
  const govTokenWETHPrice = useTokenWETHPrice(govToken)

  const BUSD: Token | undefined = getToken(chainId, 'BUSD')
  const BUSDWETHPrice = useTokenWETHPrice(BUSD)

  // Harmony specific tokens
  const bscBUSD: Token | undefined = blockchain === Blockchain.HARMONY ? getToken(chainId, 'bscBUSD') : undefined
  const bscBUSDWETHPrice = useTokenWETHPrice(bscBUSD)

  const bridgedETH: Token | undefined = Blockchain.HARMONY ? getToken(chainId, '1ETH') : undefined
  const bridgedETHWETHPrice = useTokenWETHPrice(bridgedETH)

  return useMemo(() => {
    return {
      WETH: { token: weth, price: undefined },
      govToken: { token: govToken, price: govTokenWETHPrice },
      BUSD: { token: BUSD, price: BUSDWETHPrice },
      bscBUSD: { token: bscBUSD, price: bscBUSDWETHPrice },
      bridgedETH: { token: bridgedETH, price: bridgedETHWETHPrice }
    }
  }, [
    chainId,
    blockchain,
    weth,
    govToken,
    govTokenWETHPrice,
    BUSD,
    BUSDWETHPrice,
    bscBUSD,
    bscBUSDWETHPrice,
    bridgedETH,
    bridgedETHWETHPrice
  ])
}
