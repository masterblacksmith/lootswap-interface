import { ChainId, Token, WETH } from '@venomswap/sdk'
import { TOKENS } from '@venomswap/sdk-extra'
import { ZERO_ONE_ADDRESS } from '../constants/index'

export default function getTokenWithDefault(chainId: ChainId, symbol: string): Token {
  symbol = symbol.toUpperCase()
  let token: Token

  switch (symbol) {
    case 'WETH':
    case 'WBNB':
    case 'WONE':
      token = WETH[chainId]
      break
    default:
      const retrievedToken = TOKENS[chainId].firstBySymbol(symbol)
      token = retrievedToken ? retrievedToken : new Token(chainId, ZERO_ONE_ADDRESS, 18, symbol, symbol)
      break
  }

  return token
}
