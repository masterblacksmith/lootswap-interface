import { ChainId, Token } from '@venomswap/sdk'
import getPairTokensWithDefaults from '../utils/getPairTokensWithDefaults'

export const STAKING_REWARDS_INFO: {
  [chainId in ChainId]?: {
    pid: number
    tokens: [Token, Token]
  }[]
} = {
  [ChainId.HARMONY_MAINNET]: [
    {
      pid: 0,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_MAINNET, 'WONE/BUSD')
    }
  ],
  [ChainId.HARMONY_TESTNET]: [
    {
      pid: 0,
      tokens: getPairTokensWithDefaults(ChainId.HARMONY_TESTNET, 'WONE/BUSD')
    }
  ],
  [ChainId.BSC_TESTNET]: [
    {
      pid: 0,
      tokens: getPairTokensWithDefaults(ChainId.BSC_TESTNET, 'WBNB/BUSD')
    }
  ]
}
