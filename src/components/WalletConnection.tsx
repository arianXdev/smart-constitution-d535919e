
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Globe, Wallet } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function WalletConnection() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { toast } = useToast()

  const handleConnect = () => {
    const injectedConnector = connectors.find(connector => connector.id === 'injected')
    if (injectedConnector) {
      connect({ connector: injectedConnector }, {
        onSuccess: () => {
          toast({
            title: "Wallet Connected",
            description: "Successfully connected to MetaMask",
          })
        },
        onError: (error) => {
          toast({
            title: "Connection Failed",
            description: error.message,
            variant: "destructive"
          })
        }
      })
    }
  }

  const handleDisconnect = () => {
    disconnect()
    toast({
      title: "Wallet Disconnected",
      description: "Wallet has been disconnected",
    })
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-2">
        <Badge variant="secondary" className="bg-green-500 text-white">
          <CheckCircle className="h-3 w-3 mr-1" />
          Connected
        </Badge>
        <Button variant="outline" size="sm" onClick={handleDisconnect}>
          <Wallet className="h-4 w-4 mr-2" />
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </Button>
      </div>
    )
  }

  return (
    <Button 
      variant="hero" 
      onClick={handleConnect}
      disabled={isPending}
    >
      <Globe className="h-4 w-4 mr-2" />
      {isPending ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  )
}
