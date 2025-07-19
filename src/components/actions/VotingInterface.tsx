
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Vote } from 'lucide-react'
import { useContractWrite } from '@/hooks/useSmartConstitution'
import { useToast } from '@/hooks/use-toast'

interface Candidate {
  id: number
  name: string
  bio: string
  voteCount: number
}

// Mock candidates - in real app, fetch from contract
const mockCandidates: Candidate[] = [
  { id: 0, name: "John Doe", bio: "Experienced leader with vision for change", voteCount: 23 },
  { id: 1, name: "Jane Smith", bio: "Advocate for transparent governance", voteCount: 18 },
  { id: 2, name: "Bob Johnson", bio: "Economic reform specialist", voteCount: 15 },
]

export function VotingInterface() {
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([])
  const { writeContract, isPending } = useContractWrite()
  const { toast } = useToast()

  const handleCandidateToggle = (candidateId: number) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    )
  }

  const handleSubmitVotes = async () => {
    if (selectedCandidates.length === 0) {
      toast({
        title: "No Candidates Selected",
        description: "Please select at least one candidate",
        variant: "destructive"
      })
      return
    }

    await writeContract('voteCandidates', [selectedCandidates])
    setSelectedCandidates([])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Vote className="h-5 w-5" />
          <span>Vote for Candidates</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Select candidates you approve of using approval voting. You can select multiple candidates.
        </p>
        
        <div className="space-y-3">
          {mockCandidates.map((candidate) => (
            <div key={candidate.id} className="flex items-start space-x-3 p-3 border rounded-lg">
              <Checkbox
                id={`candidate-${candidate.id}`}
                checked={selectedCandidates.includes(candidate.id)}
                onCheckedChange={() => handleCandidateToggle(candidate.id)}
              />
              <div className="flex-1">
                <label 
                  htmlFor={`candidate-${candidate.id}`}
                  className="font-medium cursor-pointer"
                >
                  {candidate.name}
                </label>
                <p className="text-sm text-muted-foreground mt-1">
                  {candidate.bio}
                </p>
                <p className="text-xs text-primary mt-1">
                  Current votes: {candidate.voteCount}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <Button 
          onClick={handleSubmitVotes}
          disabled={isPending || selectedCandidates.length === 0}
          className="w-full"
        >
          {isPending ? 'Submitting Vote...' : `Vote for ${selectedCandidates.length} Candidate(s)`}
        </Button>
      </CardContent>
    </Card>
  )
}
