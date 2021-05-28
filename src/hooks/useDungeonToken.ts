import { Token } from '@venomswap/sdk'
import { DUNGEON } from '../constants'
import { useActiveWeb3React } from './index'

export default function useDungeonToken(): Token | undefined {
  const { chainId } = useActiveWeb3React()
  return chainId ? DUNGEON[chainId] : undefined
}
