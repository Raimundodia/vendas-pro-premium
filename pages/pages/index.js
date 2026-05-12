import { useState, useEffect } from 'react';
import { supabase } from '../supabaseConfig';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Plus, 
  DollarSign, 
  TrendingUp, 
  Clock,
  ChevronRight
} from 'lucide-react';

export default function App() {
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white font-sans selection:bg-purple-500/30">
      {/* Header Fixo */}
      <header className="p-6 bg-[#1a1a2e]/80 backdrop-blur-md border-b border-gray-800 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            VendasPRO
          </h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Premium Edition</p>
        </div>
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-purple-500/20">
          R
        </div>
      </header>

      <main className="p-6 pb-32 max-w-md mx-auto">
        
        {/* Cards de Resumo */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#1e1e3a] p-5 rounded-3xl border border-gray-800 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-green-500/10 rounded-lg">
                <DollarSign size={14} className="text-green-400" />
              </div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-tight">Faturamento Hoje</p>
            </div>
            <h3 className="text-2xl font-black text-white">R$ 0,00</h3>
          </div>

          <div className="bg-[#1e1e3a] p-5 rounded-3xl border border-gray-800 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-purple-500/10 rounded-lg">
                <Clock size={14} className="text-purple-400" />
              </div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-tight">Pendentes</p>
            </div>
            <h3 className="text-2xl font-black text-white">0</h3>
          </div>
        </div>

        {/* Botão de Ação Principal */}
        <button 
          onClick={() => alert('Abrindo formulário de venda...')}
          className="w-full py-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl font-black text-lg shadow-2xl shadow-purple-900/40 active:scale-[0.97] transition-all flex items-center justify-center gap-3 mb-10"
        >
          <Plus size={24} strokeWidth={3} />
          NOVA VENDA
        </button>

        {/* Seção de Atividade Recente */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Últimas Movimentações</h2>
          <TrendingUp size={16} className="text-purple-500" />
        </div>

        <div className="space-y-3">
          <div className="bg-[#1e1e3a]/50 p-4 rounded-2xl border border-gray-800/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                <Users size={18} className="text-gray-400" />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-200">Nenhuma venda ainda</p>
                <p className="text-xs text-gray-500">Aguardando dados...</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-700" />
          </div>
        </div>

      </main>

      {/* Menu de Navegação Inferior */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1a2e]/90 backdrop-blur-lg border-t border-gray-800 flex justify-around py-5 px-4 rounded-t-[32px]">
        <button 
          onClick={() => setView('dashboard')} 
          className={`flex flex-col items-center gap-1 transition-all ${view === 'dashboard' ? 'text-purple-500 scale-110' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <LayoutDashboard size={24} strokeWidth={view === 'dashboard' ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Painel</span>
        </button>

        <button 
          onClick={() => setView('sales')} 
          className={`flex flex-col items-center gap-1 transition-all ${view === 'sales' ? 'text-purple-500 scale-110' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <ShoppingCart size={24} strokeWidth={view === 'sales' ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Vendas</span>
        </button>

        <button 
          onClick={() => setView('customers')} 
          className={`flex flex-col items-center gap-1 transition-all ${view === 'customers' ? 'text-purple-500 scale-110' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Users size={24} strokeWidth={view === 'customers' ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Clientes</span>
        </button>
      </nav>
    </div>
  );
}
