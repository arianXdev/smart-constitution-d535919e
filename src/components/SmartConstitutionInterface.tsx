import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Vote, 
  FileText, 
  Clock, 
  Shield, 
  Gavel, 
  Calendar, 
  CheckCircle,
  AlertCircle,
  User,
  Globe,
  Coins
} from 'lucide-react';

// Phase enum to match the smart contract
enum Phase {
  Registration = 0,
  Campaigning = 1,
  Election = 2,
  Governance = 3,
  Referendum = 4,
  Ratification = 5
}

const phaseNames = {
  [Phase.Registration]: "Registration",
  [Phase.Campaigning]: "Campaigning", 
  [Phase.Election]: "Election",
  [Phase.Governance]: "Governance",
  [Phase.Referendum]: "Referendum",
  [Phase.Ratification]: "Ratified"
};

const phaseDescriptions = {
  [Phase.Registration]: "Candidates & voters are being registered",
  [Phase.Campaigning]: "Candidates are campaigning for votes",
  [Phase.Election]: "Voting for transitional government members",
  [Phase.Governance]: "TG preparing constitution drafts",
  [Phase.Referendum]: "Citizens voting on constitution drafts",
  [Phase.Ratification]: "Constitution has been ratified"
};

const phaseColors = {
  [Phase.Registration]: "bg-blue-500",
  [Phase.Campaigning]: "bg-yellow-500",
  [Phase.Election]: "bg-green-500",
  [Phase.Governance]: "bg-purple-500",
  [Phase.Referendum]: "bg-orange-500",
  [Phase.Ratification]: "bg-emerald-500"
};

interface ConstitutionStats {
  currentPhase: Phase;
  candidateCount: number;
  voterCount: number;
  electedMembers: number;
  currentLeader: string;
  proposalCount: number;
  draftCount: number;
  registrationEnd?: Date;
  electionEnd?: Date;
  referendumEnd?: Date;
}

export default function SmartConstitutionInterface() {
  const [stats, setStats] = useState<ConstitutionStats>({
    currentPhase: Phase.Registration,
    candidateCount: 0,
    voterCount: 0,
    electedMembers: 0,
    currentLeader: '',
    proposalCount: 0,
    draftCount: 0
  });

  const [isConnected, setIsConnected] = useState(false);

  const phaseProgress = ((stats.currentPhase + 1) / 6) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
                <Gavel className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                  Smart Constitution
                </h1>
                <p className="text-sm text-muted-foreground">
                  Blockchain-Powered Democratic Transition
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge 
                variant="secondary" 
                className={`${phaseColors[stats.currentPhase]} text-white`}
              >
                <Clock className="h-3 w-3 mr-1" />
                {phaseNames[stats.currentPhase]}
              </Badge>
              
              <Button 
                variant={isConnected ? "success" : "hero"}
                onClick={() => setIsConnected(!isConnected)}
              >
                {isConnected ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Connected
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4 mr-2" />
                    Connect Wallet
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Phase Progress */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Transition Progress</span>
            </CardTitle>
            <CardDescription>
              {phaseDescriptions[stats.currentPhase]}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={phaseProgress} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Registration</span>
                <span>Campaigning</span>
                <span>Election</span>
                <span>Governance</span>
                <span>Referendum</span>
                <span>Ratified</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Candidates</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.candidateCount}</div>
              <p className="text-xs text-muted-foreground">
                Registered for election
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Voters</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.voterCount}</div>
              <p className="text-xs text-muted-foreground">
                {stats.currentPhase >= Phase.Governance ? 'Referendum voters' : 'Election voters'}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">TG Members</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-governance">{stats.electedMembers}/50</div>
              <p className="text-xs text-muted-foreground">
                Transitional Government
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proposals</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{stats.proposalCount}</div>
              <p className="text-xs text-muted-foreground">
                {stats.currentPhase >= Phase.Governance ? 'Constitution drafts' : 'Active proposals'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="constitution">Constitution</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Current Phase: {phaseNames[stats.currentPhase]}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.currentPhase === Phase.Registration && (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Registration Phase</h3>
                      <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
                        Candidates and voters are being registered by neutral registrars. 
                        Minimum requirements: 100 candidates and 1,200 voters.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="default" size="sm">
                          <User className="h-4 w-4 mr-2" />
                          Register as Candidate
                        </Button>
                        <Button variant="outline" size="sm">
                          <Vote className="h-4 w-4 mr-2" />
                          Check Voter Status
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {stats.currentPhase === Phase.Campaigning && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Campaign Period</h3>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm mb-3">
                      Candidates are campaigning and presenting their platforms to voters.
                    </p>
                    <Button variant="warning" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      View Candidate Platforms
                    </Button>
                  </div>
                )}

                {stats.currentPhase === Phase.Election && (
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Election Day</h3>
                    <p className="text-green-700 dark:text-green-300 text-sm mb-3">
                      Voting is open for 24 hours. Use approval voting to select your preferred candidates.
                    </p>
                    <Button variant="success" size="sm">
                      <Vote className="h-4 w-4 mr-2" />
                      Cast Your Vote
                    </Button>
                  </div>
                )}

                {stats.currentPhase === Phase.Governance && (
                  <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Governance Phase</h3>
                    <p className="text-purple-700 dark:text-purple-300 text-sm mb-3">
                      The Transitional Government is preparing constitution drafts and managing the transition.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="governance" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Proposals
                      </Button>
                      <Button variant="outline" size="sm">
                        <Gavel className="h-4 w-4 mr-2" />
                        Submit Draft
                      </Button>
                    </div>
                  </div>
                )}

                {stats.currentPhase === Phase.Referendum && (
                  <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Constitutional Referendum</h3>
                    <p className="text-orange-700 dark:text-orange-300 text-sm mb-3">
                      Citizens are voting on the constitution drafts to determine the future governance structure.
                    </p>
                    <Button variant="warning" size="sm">
                      <Vote className="h-4 w-4 mr-2" />
                      Vote on Constitution
                    </Button>
                  </div>
                )}

                {stats.currentPhase === Phase.Ratification && (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">Constitution Ratified</h3>
                    <p className="text-emerald-700 dark:text-emerald-300 text-sm mb-3">
                      The new constitution has been ratified and the transition process is complete.
                    </p>
                    <Button variant="success" size="sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      View Final Constitution
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="candidates">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Candidate Registration & Election</CardTitle>
                <CardDescription>
                  Register as a candidate or view current candidates running for the Transitional Government
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <Button variant="hero">
                      <User className="h-4 w-4 mr-2" />
                      Register as Candidate
                    </Button>
                    <Button variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      View All Candidates
                    </Button>
                    {stats.currentPhase === Phase.Election && (
                      <Button variant="success">
                        <Vote className="h-4 w-4 mr-2" />
                        Vote for Candidates
                      </Button>
                    )}
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Candidate Requirements</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Pay registration fee (0.001 ETH)</li>
                      <li>• Provide full name, biography, and website</li>
                      <li>• Cannot be a neutral registrar or their relative</li>
                      <li>• Must register during the registration period</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="governance">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Governance & Proposals</CardTitle>
                <CardDescription>
                  View and participate in Transitional Government proposals and decisions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <Button variant="governance">
                      <FileText className="h-4 w-4 mr-2" />
                      Submit Proposal
                    </Button>
                    <Button variant="outline">
                      <Vote className="h-4 w-4 mr-2" />
                      Vote on Proposals
                    </Button>
                    <Button variant="outline">
                      <Gavel className="h-4 w-4 mr-2" />
                      View Leadership
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Governance Rules</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Proposals require 30 member approvals (supermajority)</li>
                      <li>• Each member can have only one active proposal</li>
                      <li>• Leadership rotates every 2 weeks</li>
                      <li>• All decisions are recorded on blockchain</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finance">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Treasury & Finance</CardTitle>
                <CardDescription>
                  Manage the transitional government treasury and lending system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <Button variant="success">
                      <Coins className="h-4 w-4 mr-2" />
                      Lend to Treasury
                    </Button>
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Propose Interest Rate
                    </Button>
                    <Button variant="outline">
                      <Shield className="h-4 w-4 mr-2" />
                      View Treasury
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">Current Interest Rate</h4>
                      <div className="text-2xl font-bold text-primary">2.5% APR</div>
                      <p className="text-sm text-muted-foreground">Determined by member median rate</p>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">Treasury Balance</h4>
                      <div className="text-2xl font-bold text-success">1,250 ETH</div>
                      <p className="text-sm text-muted-foreground">Available for governance</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="constitution">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Constitution Drafts & Referendum</CardTitle>
                <CardDescription>
                  Submit constitution drafts and participate in the referendum
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <Button variant="governance">
                      <FileText className="h-4 w-4 mr-2" />
                      Submit Constitution Draft
                    </Button>
                    <Button variant="outline">
                      <Vote className="h-4 w-4 mr-2" />
                      View Drafts
                    </Button>
                    {stats.currentPhase === Phase.Referendum && (
                      <Button variant="warning">
                        <Vote className="h-4 w-4 mr-2" />
                        Vote in Referendum
                      </Button>
                    )}
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Draft Requirements</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Only TG members can submit drafts</li>
                      <li>• Must include description and full constitution text</li>
                      <li>• Optional implementation code and supporting materials</li>
                      <li>• Hash verification required for integrity</li>
                    </ul>
                  </div>
                  
                  {stats.currentPhase >= Phase.Referendum && (
                    <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Referendum Process</h4>
                      <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                        <li>• All citizens born in 2006 or earlier can vote</li>
                        <li>• Approval voting allows multiple draft selection</li>
                        <li>• Two independent registrars verify each voter</li>
                        <li>• Draft with most votes becomes the new constitution</li>
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}