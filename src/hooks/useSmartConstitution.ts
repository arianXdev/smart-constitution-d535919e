
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { CONTRACT_ADDRESS } from '@/config/web3'
import SmartConstitutionABI from '@/abis/SmartConstitution.json'
import { useToast } from '@/hooks/use-toast'

export function useContractRead(functionName: string, args?: any[]) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SmartConstitutionABI,
    functionName,
    args,
  } as any)
}

export function useContractWrite() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { toast } = useToast()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const writeContractWithToast = async (functionName: string, args?: any[], value?: string) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: SmartConstitutionABI,
        functionName,
        args,
        value: value ? parseEther(value) : undefined,
      } as any)
    } catch (error: any) {
      // Handle revert messages
      let errorMessage = 'Transaction failed'
      
      if (error.message?.includes('User rejected')) {
        errorMessage = 'Transaction was rejected'
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for transaction'
      } else if (error.message?.includes('Wrong phase')) {
        errorMessage = 'Action not allowed in current phase'
      } else if (error.message?.includes('Already voted')) {
        errorMessage = 'You have already voted'
      } else if (error.message?.includes('Not a member')) {
        errorMessage = 'Only Transitional Government members can perform this action'
      } else if (error.message?.includes('Registration closed')) {
        errorMessage = 'Registration period has ended'
      }
      
      toast({
        title: "Transaction Error",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }

  return {
    writeContract: writeContractWithToast,
    hash,
    isPending: isPending || isConfirming,
    isSuccess
  }
}

// Specific hooks for major contract functions
export function useCurrentPhase() {
  return useContractRead('getCurrentPhase')
}

export function useCandidateCount() {
  const { data } = useContractRead('addedVoterCount')
  return data ? Number(data) : 0
}

export function useVoterCount() {
  const { data } = useContractRead('referendumVoterCount')
  return data ? Number(data) : 0
}

export function useTreasuryBalance() {
  const { data } = useContractRead('getBalance')
  return data ? formatEther(BigInt(data.toString())) : '0'
}

export function useCurrentRate() {
  const { data } = useContractRead('currentRate')
  return data ? Number(data) / 100 : 0 // Convert from basis points
}

export function useElectedMembers() {
  const { data } = useContractRead('membersElected')
  return data ? 50 : 0 // If election is complete, we have 50 members
}

export function useCurrentLeader() {
  const { data } = useContractRead('LeaderAddress')
  return data || ''
}

export function useProposalCount() {
  // This would need to be implemented based on contract events or a counter
  return 0
}
