import { useState } from 'react';
import { supabase } from '../supabaseConfig';
import { LayoutDashboard, ShoppingCart, Users, Plus, DollarSign } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('dashboard');

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white font-sans">
      <header className="p-6 bg-[#1a1a2e] border-b border-gray-800 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">VendasPRO</h1>
        <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center font-bold">R</div>
      </header>

      <main className="p-6 max-w-md mx-auto">
        {view === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1e1e3a] p-5 rounded-3xl border border-gray-800">
                <p className="text-gray-400 text-xs font-bold">HOJE</p>
                <h3 className="text-2xl font-black text-green-400">R$ 0,00</h3>
              </div>
              <div className="bg-[#1e1e3a] p-5 rounded-3xl border border-gray-800">
                <p className="text-gray-400 text-xs font-bold">FIADO</p>
                <h3 className="text-2xl font-black text-red-400">0</h3>
              </div>
            </div>
            <button className="w-full py-6 bg-purple-600 rounded-3xl font-black text-lg shadow-lg active:scale-95 transition-transform">
              NOVA VENDA
            </button>
          </div>
        )}
        {view === 'sales' && <div className="text-center py-20 text-gray-500">Histórico vazio.</div>}
        {view === 'customers' && <div className="text-center py-20 text-gray-500">Nenhum cliente.</div>}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1a2e] border-t border-gray-800 flex justify-around py-4">
        <button onClick={() => setView('dashboard')} className={view === 'dashboard' ? 'text-purple-500' : 'text-gray-500'}><LayoutDashboard /></button>
        <button onClick={() => setView('sales')} className={view === 'sales' ? 'text-purple-500' : 'text-gray-500'}><ShoppingCart /></button>
        <button onClick={() => setView('customers')} className={view === 'customers' ? 'text-purple-500' : 'text-gray-500'}><Users /></button>
      </nav>
    </div>
  );
}
