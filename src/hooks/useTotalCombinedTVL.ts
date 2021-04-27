import { useMemo } from 'react'
import { StakingInfo } from '../state/stake/hooks'
import useTotalTVL from './useTotalTVL'
import useDungeonTVL from './useDungeonTVL'

export default function useTotalCombinedTVL(stakingInfos: StakingInfo[]): Record<string, any> {
  const totalStakingPoolTVL = useTotalTVL(stakingInfos)
  const totalDungeonTVL = useDungeonTVL()

  return useMemo(() => {
    return {
      stakingPoolTVL: totalStakingPoolTVL ? totalStakingPoolTVL : undefined,
      totalDungeonTVL: totalDungeonTVL ? totalDungeonTVL : undefined,
      totalCombinedTVL: totalStakingPoolTVL && totalDungeonTVL ? totalStakingPoolTVL.add(totalDungeonTVL) : undefined
    }
  }, [stakingInfos, totalStakingPoolTVL, totalDungeonTVL])
}
