import React from 'react'
import { useStakingInfo } from '../../state/stake/hooks'
import { useActiveWeb3React } from '../../hooks'
import useTotalCombinedTVL from '../../hooks/useTotalCombinedTVL'
import { CustomMouseoverTooltip } from '../Tooltip/custom'
import { DUNGEON_SETTINGS } from '../../constants'
import filterStakingInfos from '../../utils/filterStakingInfos'

export default function CombinedTVL({}) {
  const { chainId } = useActiveWeb3React()
  const dungeonSettings = chainId ? DUNGEON_SETTINGS[chainId] : undefined
  const filteredStakingInfos = filterStakingInfos(useStakingInfo())
  const TVLs = useTotalCombinedTVL(filteredStakingInfos)

  return (
    <>
      {TVLs && (
        <CustomMouseoverTooltip
          element={
            <>
              {TVLs.stakingPoolTVL && (
                <>
                  <b>Staking:</b> $
                  {TVLs.stakingPoolTVL.toSignificant(8, {
                    groupSeparator: ','
                  })}
                  <br />
                </>
              )}
              {TVLs.totalDungeonTVL && (
                <>
                  <b>{dungeonSettings?.name}:</b> ${TVLs.totalDungeonTVL.toSignificant(8, { groupSeparator: ',' })}
                  <br />
                </>
              )}
              {TVLs.totalCombinedTVL && (
                <>
                  <b>Total:</b> ${TVLs.totalCombinedTVL.toSignificant(8, { groupSeparator: ',' })}
                </>
              )}
            </>
          }
        >
          {TVLs.totalCombinedTVL && <>TVL: ${TVLs.totalCombinedTVL.toSignificant(8, { groupSeparator: ',' })}</>}
        </CustomMouseoverTooltip>
      )}
    </>
  )
}
