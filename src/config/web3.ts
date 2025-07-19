
import { createConfig, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
  ],
  transports: {
    [sepolia.id]: http('https://sepolia.infura.io/v3/c4ba20edc8b44e02b5373378419ee963'),
  },
})

export const CONTRACT_ADDRESS = '0x0ff6f2Bfd57F6Fb8f24c83699C4a5f5678F8ac97' as const
