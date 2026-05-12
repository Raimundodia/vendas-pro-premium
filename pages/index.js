import { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Plus, 
  DollarSign, 
  TrendingUp, 
  Clock 
} from 'lucide-react';

export default function App() {
  const [view, setView] = useState('dashboard');

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white font-sans">
      {/* Header Premium */}
      <header className="p-6 bg-[#1a1a2e]/80 backdrop-blur-md border-b border-gray-800 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            VendasPRO
          </h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Painel de Controle</p>
        </div>
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-purple-500/20">
          R
        </div>
      </header>

      <main className="p-6 pb-32 max-w-md mx-auto">
        
        {/* Resumo Financeiro */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#1e1e3a] p-5 rounded-3xl border border-gray-800 shadow-xl text-center">
            <p className="text-gray-400 text-[10px] font-bold uppercase mb-2">Faturamento Hoje</p>
            <h3 className="text-2xl font-black text-green-400">R$ 0,00</h3>
          </div>

          <div className="bg-[#1e1e3a] p-5 rounded-3xl border border-gray-800 shadow-xl text-center">
            <p className="text-gray-400 text-[10px] font-bold uppercase mb-2">Vendas Ativas</p>
            <h3 className="text-2xl font-black text-white">0</h3>
          </div>
        </div>

        {/* Botão de Registro */}
        <button 
          onClick={() => alert('Sistema Online!')}
          className="w-full py-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl font-black text-lg shadow-2xl shadow-purple-900/40 active:scale-[0.97] transition-all flex items-center justify-center gap-3 mb-10"
        >
          <Plus size={24} strokeWidth={3} />
          REGISTRAR VENDA
        </button>

        {/* Feed de Atividade Simbolizado */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Recentes</h2>
          <TrendingUp size={16} className="text-purple-500" />
        </div>

        <div className="bg-[#1e1e3a]/50 p-8 rounded-2xl border border-gray-800/50 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3">
             <ShoppingCart size={20} className="text-gray-500" />
          </div>
          <p className="font-bold text-sm text-gray-400">Nenhuma venda hoje</p>
          <p className="text-xs text-gray-600">Seu sistema está pronto para operar.</p>
        </div>

      </main>

      {/* Menu de Navegação */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1a2e]/95 backdrop-blur-lg border-t border-gray-800 flex justify-around py-5 px-4 rounded-t-[32px] z-50">
        <button onClick={() => setView('dashboard')} className={`flex flex-col items-center gap-1 ${view === 'dashboard' ? 'text-purple-500' : 'text-gray-500'}`}>
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-bold">Início</span>
        </button>

        <button onClick={() => setView('sales')} className={`flex flex-col items-center gap-1 ${view === 'sales' ? 'text-purple-500' : 'text-gray-500'}`}>
          <ShoppingCart size={24} />
          <span className="text-[10px] font-bold">Vendas</span>
        </button>

        <button onClick={() => setView('customers')} className={`flex flex-col items-center gap-1 ${view === 'customers' ? 'text-purple-500' : 'text-gray-500'}`}>
          <Users size={24} />
          <span className="text-[10px] font-bold">Clientes</span>
        </button>
      </nav>
    </div>
  );
}
