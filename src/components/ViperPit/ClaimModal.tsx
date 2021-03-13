import React, { useState, useMemo } from 'react'
import { JSBI } from '@venomswap/sdk'
import Modal from '../Modal'
import { AutoColumn } from '../Column'
import styled from 'styled-components'
import { RowBetween } from '../Row'
import { TYPE, CloseIcon } from '../../theme'
import { ButtonError } from '../Button'
import { usePitBreederContract } from '../../hooks/useContract'
import { SubmittedView, LoadingView } from '../ModalViews'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useActiveWeb3React } from '../../hooks'
import { calculateGasMargin } from '../../utils'
import { STAKING_REWARDS_INFO } from '../../constants/staking'
import { abi as IUniswapV2PairABI } from '@venomswap/core/build/IUniswapV2Pair.json'
import { Interface } from '@ethersproject/abi'
import { useMultipleContractSingleData } from '../../state/multicall/hooks'
import { toV2LiquidityToken } from '../../state/user/hooks'
const PAIR_INTERFACE = new Interface(IUniswapV2PairABI)

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`
interface ClaimModalProps {
  isOpen: boolean
  onDismiss: () => void
}

export default function ClaimModal({ isOpen, onDismiss }: ClaimModalProps) {
  const { account, chainId } = useActiveWeb3React()

  // monitor call to help UI loading state
  const addTransaction = useTransactionAdder()
  const [hash, setHash] = useState<string | undefined>()
  const [attempting, setAttempting] = useState(false)

  function wrappedOnDismiss() {
    setHash(undefined)
    setAttempting(false)
    onDismiss()
  }

  const pitBreeder = usePitBreederContract()
  const stakingPools = useMemo(() => (chainId ? STAKING_REWARDS_INFO[chainId] : []), [chainId])

  const liquidityTokenAddresses = useMemo(
    () =>
      stakingPools
        ? stakingPools.map(item => {
            return toV2LiquidityToken(item.tokens).address
          })
        : [],
    [stakingPools]
  )

  const results = useMultipleContractSingleData(liquidityTokenAddresses, PAIR_INTERFACE, 'balanceOf', [
    pitBreeder?.address
  ])

  const minimumAmountWei = 1000

  const [claimFrom, claimTo] = useMemo<string[][]>(() => {
    const claimFrom: string[] = []
    const claimTo: string[] = []

    for (let index = 0; stakingPools && index < stakingPools.length; index++) {
      const stakingPool = stakingPools[index]
      const result = results[index]
      if (result && !result.loading) {
        if (JSBI.GT(JSBI.BigInt(result?.result?.[0]), minimumAmountWei)) {
          claimFrom.push(stakingPool.tokens[0].address)
          claimTo.push(stakingPool.tokens[1].address)
        }
      }
    }

    return [claimFrom, claimTo]
  }, [stakingPools, results])

  const rewardsAreClaimable = claimFrom.length > 0 && claimTo.length > 0

  async function onClaimRewards() {
    if (pitBreeder) {
      setAttempting(true)

      const estimatedGas = await pitBreeder.estimateGas.convertMultiple(claimFrom, claimTo)

      await pitBreeder
        .convertMultiple(claimFrom, claimTo, {
          gasLimit: calculateGasMargin(estimatedGas)
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Claim ViperPit rewards`
          })
          setHash(response.hash)
        })
        .catch((error: any) => {
          setAttempting(false)
          console.log(error)
        })
    }
  }

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOnDismiss} maxHeight={90}>
      {!attempting && !hash && (
        <ContentWrapper gap="lg">
          <RowBetween>
            <TYPE.mediumHeader> Claim</TYPE.mediumHeader>
            <CloseIcon onClick={wrappedOnDismiss} />
          </RowBetween>
          <TYPE.body fontSize={32} style={{ textAlign: 'center' }}>
            <span role="img" aria-label="wizard-icon" style={{ marginRight: '8px' }}>
              💎
            </span>
          </TYPE.body>
          {rewardsAreClaimable && (
            <>
              <TYPE.body fontSize={14} style={{ textAlign: 'center' }}>
                When you claim rewards, collected LP fees will be used to market buy VIPER.
                <br /><br />
                The purchased VIPER tokens will then be distributed to the ViperPit stakers as a reward.
              </TYPE.body>
              <ButtonError disabled={!!error} error={!!error} onClick={onClaimRewards}>
                {error ?? 'Claim'}
              </ButtonError>
            </>
          )}
          {!rewardsAreClaimable && (
            <TYPE.body fontSize={14} style={{ textAlign: 'center' }}>
              There are no trading fee rewards available
              <br />
              to claim right now.
              <br /><br />
              Please wait a little bit and then check back here again.
            </TYPE.body>
          )}
        </ContentWrapper>
      )}
      {attempting && !hash && (
        <LoadingView onDismiss={wrappedOnDismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.body fontSize={20}>Claiming ViperPit rewards</TYPE.body>
          </AutoColumn>
        </LoadingView>
      )}
      {hash && (
        <SubmittedView onDismiss={wrappedOnDismiss} hash={hash}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.largeHeader>Transaction Submitted</TYPE.largeHeader>
            <TYPE.body fontSize={20}>Claimed VIPER!</TYPE.body>
          </AutoColumn>
        </SubmittedView>
      )}
    </Modal>
  )
}