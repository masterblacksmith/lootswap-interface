import { StakingInfo } from '../state/stake/hooks'

export default function filterStakingInfos(stakingInfos: StakingInfo[], isActive: boolean): StakingInfo[] {
  return stakingInfos
    .filter(s => s.active === isActive)
    .sort((a, b) => {
      if (a.apr === undefined || b.apr === undefined) {
        return 0
      }
      return b.apr.greaterThan(a.apr) ? 1 : -1
    })
}
