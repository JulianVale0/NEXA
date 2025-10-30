import {
  ConnectionProvider,
  WalletProvider,
  useConnection,
  useWallet
} from '@solana/wallet-adapter-react'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { BarChart3, TrendingUp, ArrowUpRight } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const queryClient = new QueryClient()

// Mock 7-day SOL price data
const chartData = [
  { day: 'Mon', price: 188 },
  { day: 'Tue', price: 190 },
  { day: 'Wed', price: 187 },
  { day: 'Thu', price: 192 },
  { day: 'Fri', price: 193 },
  { day: 'Sat', price: 191 },
  { day: 'Sun', price: 194.5 }
]

const AppContent = () => {
  const { connection } = useConnection()
  const { publicKey } = useWallet()

  const { data: balance } = useQuery({
    queryKey: ['balance', publicKey?.toBase58()],
    queryFn: async () => {
      if (!publicKey) return 0
      const lamports = await connection.getBalance(publicKey)
      return lamports / 1e9
    },
    enabled: !!publicKey
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white via-purple-300 to-cyan-300 bg-clip-text text-transparent">
            NEXA
          </h1>
          <WalletMultiButton className="!bg-white/10 !backdrop-blur-xl !border !border-white/20 !text-white !rounded-2xl !px-6 !py-3 !text-lg hover:!bg-white/20 transition-all" />
        </div>

        {/* SOL Chart */}
        <div className="glass rounded-3xl p-6 mb-8 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-3xl font-bold text-white">$194.5</div>
              <div className="flex items-center gap-2 text-green-400">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-sm">+2.1%</span>
              </div>
            </div>
            <div className="text-sm opacity-75">7D Performance</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <XAxis dataKey="day" stroke="#666" />
              <YAxis stroke="#666" domain={['dataMin - 5', 'dataMax + 5']} />
              <Tooltip 
                contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pulse Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {[
            { label: 'MC', value: '$106.8B' },
            { label: 'TVL', value: '$11.37B' },
            { label: 'Vol', value: '$3.1B' },
            { label: 'Fees', value: '$5.5M' },
            { label: 'Active', value: '2.48M' },
            { label: 'TPS', value: '3.2K', highlight: true }
          ].map((item, i) => (
            <div 
              key={i}
              className={`glass p-4 rounded-2xl text-center transition-all hover:scale-105 ${
                item.highlight ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-purple-500/50' : ''
              }`}
            >
              <div className="text-xs opacity-75">{item.label}</div>
              <div className="text-xl font-bold text-white">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-sm opacity-75 mb-1">Balance</div>
            <div className="text-3xl font-bold text-white">
              {balance !== undefined ? `${balance.toFixed(4)} SOL` : '—'}
            </div>
          </div>
          <button className="glass p-6 rounded-2xl text-center hover:scale-105 transition-all flex items-center justify-center gap-3 group">
            <BarChart3 className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            <span className="text-xl font-semibold">Portfolio</span>
          </button>
          <button className="glass p-6 rounded-2xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-purple-500/50 text-center hover:scale-105 transition-all flex items-center justify-center gap-3 group">
            <TrendingUp className="w-8 h-8 group-hover:translate-y-[-4px] transition-transform" />
            <span className="text-xl font-semibold">Swap</span>
          </button>
        </div>

        <div className="text-center mt-12 text-sm opacity-50">
          400ms • &lt;$0.0001 • Glass
        </div>
      </div>
    </div>
  )
}

const App = () => (
  <ConnectionProvider endpoint="https://mainnet.helius-rpc.com/?api-key=free">
    <WalletProvider
      wallets={[new SolflareWalletAdapter()]}
      autoConnect
    >
      <QueryClientProvider client={queryClient}>
        <WalletModalProvider>
          <AppContent />
        </WalletModalProvider>
      </QueryClientProvider>
    </WalletProvider>
  </ConnectionProvider>
)

export default App