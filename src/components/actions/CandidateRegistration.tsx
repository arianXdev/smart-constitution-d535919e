
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { User } from 'lucide-react'
import { useContractWrite } from '@/hooks/useSmartConstitution'
import { useToast } from '@/hooks/use-toast'

export function CandidateRegistration() {
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [website, setWebsite] = useState('')
  const { writeContract, isPending } = useContractWrite()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!fullName || !bio || !website) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    await writeContract('registerAsCandidate', [fullName, bio, website], '0.001')
    
    // Reset form on success
    setFullName('')
    setBio('')
    setWebsite('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Register as Candidate</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="bio">Biography *</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell voters about yourself"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="website">Website *</Label>
            <Input
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://your-website.com"
              required
            />
          </div>
          
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Registration Fee: <strong>0.001 ETH</strong>
            </p>
          </div>
          
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Registering...' : 'Register (0.001 ETH)'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
