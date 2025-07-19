
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { FileText, Vote } from 'lucide-react'
import { useContractWrite } from '@/hooks/useSmartConstitution'
import { useToast } from '@/hooks/use-toast'

export function ProposalCreation() {
  const [provisions, setProvisions] = useState('')
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [reason, setReason] = useState('')
  const { writeContract, isPending } = useContractWrite()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!provisions) {
      toast({
        title: "Missing Information",
        description: "Please provide proposal provisions",
        variant: "destructive"
      })
      return
    }

    const payments = amount && recipient && reason ? [{
      amount: amount,
      recipient: recipient,
      reason: reason
    }] : []

    await writeContract('proposeProposal', [provisions, payments])
    
    // Reset form
    setProvisions('')
    setAmount('')
    setRecipient('')
    setReason('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Create Proposal</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="provisions">Proposal Provisions *</Label>
            <Textarea
              id="provisions"
              value={provisions}
              onChange={(e) => setProvisions(e.target.value)}
              placeholder="Describe your proposal in detail"
              required
            />
          </div>
          
          <div className="space-y-3">
            <Label>Optional Payment (if proposal involves treasury funds)</Label>
            
            <div>
              <Label htmlFor="amount">Amount (ETH)</Label>
              <Input
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                type="number"
                step="0.001"
              />
            </div>
            
            <div>
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
              />
            </div>
            
            <div>
              <Label htmlFor="reason">Payment Reason</Label>
              <Input
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for payment"
              />
            </div>
          </div>
          
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Creating Proposal...' : 'Submit Proposal'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export function ProposalVoting({ proposalId }: { proposalId: number }) {
  const { writeContract, isPending } = useContractWrite()

  const handleVote = async () => {
    await writeContract('voteForProposal', [proposalId])
  }

  return (
    <Button onClick={handleVote} disabled={isPending} size="sm">
      <Vote className="h-4 w-4 mr-2" />
      {isPending ? 'Voting...' : 'Vote Yes'}
    </Button>
  )
}
