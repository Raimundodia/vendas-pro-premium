import { useState } from 'react';
import { supabase } from '../supabaseConfig';
import { LayoutDashboard, ShoppingCart, Users, Package, Plus, Search, DollarSign } from 'lucide-react';

export default function VendasPRO() {
  const [view, setView] = useState('dashboard');

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white font-sans pb-24">
      {/* Header Premium */}
      <header className="p-6 bg-[#1a1a2e] border-b border-gray-800 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">VendasPRO</h1>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Painel Administrativo</span>
        </div>
        <div className="w-10 h-10 bg-purple-600 rounded-2xl flex items-center justify-center font-bold shadow-lg shadow-purple-500/20">R</div>
      </header>

      {/* Conteúdo Principal */}
      <main className="p-4 max-w-md mx-auto">
        {view === 'dashboard' && <Dashboard />}
        {view === 'sales' && <Sales />}
        {view === 'customers' && <Customers />}
      </main>

      {/* Navegação Estilo App Nativo */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1a2e]/90 backdrop-blur-md border-t border-gray-800 flex justify-around py-3 px-2 z-20">
        <button onClick={() => setView('dashboard')} className={`flex flex-col items-center gap-1 ${view === 'dashboard' ? 'text-purple-500' : 'text-gray-500'}`}>
          <LayoutDashboard size={24} /> <span className="text-[10px] font-bold">HOME</span>
        </button>
        <button onClick={() => setView('sales')} className={`flex flex-col items-center gap-1 ${view === 'sales' ? 'text-purple-500' : 'text-gray-500'}`}>
          <ShoppingCart size={24} /> <span className="text-[10px] font-bold">VENDAS</span>
        </button>
        <button onClick={() => setView('customers')} className={`flex flex-col items-center gap-1 ${view === 'customers' ? 'text-purple-500' : 'text-gray-500'}`}>
          <Users size={24} /> <span className="text-[10px] font-bold">CLIENTES</span>
        </button>
      </nav>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#1e1e3a] p-5 rounded-[2rem] border border-gray-800">
          <DollarSign className="text-green-400 mb-2" size={20} />
          <p className="text-gray-400 text-xs font-bold uppercase">Hoje</p>
          <h3 className="text-2xl font-black">R$ 0,00</h3>
        </div>
        <div className="bg-[#1e1e3a] p-5 rounded-[2rem] border border-gray-800">
          <Users className="text-red-400 mb-2" size={20} />
          <p className="text-gray-400 text-xs font-bold uppercase">Fiado</p>
          <h3 className="text-2xl font-black">0</h3>
        </div>
      </div>
      <button className="w-full py-6 bg-gradient-to-br from-purple-600 to-purple-900 rounded-[2rem] font-black text-lg shadow-xl shadow-purple-900/40 flex items-center justify-center gap-3 active:scale-95 transition-transform">
        <Plus size={28} /> NOVA VENDA
      </button>
    </div>
  );
}

function Sales() { return <div className="text-center py-20 text-gray-500">Histórico de vendas vazio.</div>; }
function Customers() { return <div className="text-center py-20 text-gray-500">Nenhum cliente cadastrado.</div>; }
