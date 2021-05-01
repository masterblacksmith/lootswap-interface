import { Token, TokenAmount, Fraction, DEFAULT_CURRENCIES, ChainId } from '@venomswap/sdk'
import { unwrappedToken, wrappedCurrency } from '../utils/wrappedCurrency'
import calculateTotalStakedAmount from '../utils/calculateTotalStakedAmount'
import getPair from '../utils/getPair'
import { Result } from 'state/multicall/hooks'

export default function calculateWETHAdjustedTotalStakedAmount(
  chainId: ChainId,
  tokens: Record<string, any>,
  pairTokens: [Token, Token],
  totalLpTokenSupply: TokenAmount,
  totalStakedAmount: TokenAmount,
  lpTokenReserves: Result | undefined
): Record<string, any> | undefined {
  if (!lpTokenReserves) return undefined

  const pairToken0 = pairTokens[0]
  const pairToken1 = pairTokens[1]
  const currency0 = unwrappedToken(pairToken0)
  //const currency1 = unwrappedToken(pairToken1)
  //const token = currency0 && DEFAULT_CURRENCIES.includes(currency0) ? pairToken1 : pairToken0

  const baseToken = currency0 && DEFAULT_CURRENCIES.includes(currency0) ? pairToken0 : pairToken1
  const reserve0 = lpTokenReserves?.reserve0
  const reserve1 = lpTokenReserves?.reserve1

  const stakingTokenPair = getPair(
    wrappedCurrency(pairToken0, chainId),
    wrappedCurrency(pairToken1, chainId),
    reserve0,
    reserve1
  )

  let valueOfTotalStakedAmountInPairCurrency: TokenAmount | undefined
  let valueOfTotalStakedAmountInWETH: TokenAmount | Fraction | undefined

  if (totalLpTokenSupply && stakingTokenPair) {
    valueOfTotalStakedAmountInPairCurrency = calculateTotalStakedAmount(
      baseToken,
      stakingTokenPair,
      totalStakedAmount,
      totalLpTokenSupply
    )

    if (valueOfTotalStakedAmountInPairCurrency) {
      valueOfTotalStakedAmountInWETH = valueOfTotalStakedAmountInPairCurrency

      switch (baseToken.symbol?.toUpperCase()) {
        case tokens?.WETH?.token?.symbol?.toUpperCase():
          valueOfTotalStakedAmountInWETH = valueOfTotalStakedAmountInPairCurrency
          break
        case tokens?.govToken?.token?.symbol?.toUpperCase():
          valueOfTotalStakedAmountInWETH = tokens?.govToken?.price
            ? valueOfTotalStakedAmountInPairCurrency.multiply(tokens?.govToken?.price)
            : valueOfTotalStakedAmountInPairCurrency
          break
        case tokens?.BUSD?.token?.symbol?.toUpperCase():
          valueOfTotalStakedAmountInWETH = tokens?.BUSD?.price
            ? valueOfTotalStakedAmountInPairCurrency.multiply(tokens?.BUSD?.price)
            : valueOfTotalStakedAmountInPairCurrency
          break
        case tokens?.bscBUSD?.token?.symbol?.toUpperCase():
          valueOfTotalStakedAmountInWETH = tokens?.bscBUSD?.price
            ? valueOfTotalStakedAmountInPairCurrency.multiply(tokens?.bscBUSD?.price)
            : valueOfTotalStakedAmountInPairCurrency
          break
        case tokens?.bridgedETH?.token?.symbol?.toUpperCase():
          valueOfTotalStakedAmountInWETH = tokens?.bridgedETH?.price
            ? valueOfTotalStakedAmountInPairCurrency.multiply(tokens?.bridgedETH?.price)
            : valueOfTotalStakedAmountInPairCurrency
          break
        default:
          valueOfTotalStakedAmountInWETH = valueOfTotalStakedAmountInPairCurrency
          break
      }
    }
  }

  return {
    totalStakedAmountPairCurrency: valueOfTotalStakedAmountInPairCurrency,
    totalStakedAmountWETH: valueOfTotalStakedAmountInWETH
  }
}
