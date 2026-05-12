import 'styles/globals.css';
import React from 'react';
// Se o seu projeto não tiver lucide-react, me avise
import { Users, Package, ShoppingCart, Plus, ArrowUpRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white p-4 font-sans" style={{ backgroundColor: '#000000' }}>
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestão Pro</h1>
          <p className="text-gray-400 text-sm">Controle de clientes e estoque</p>
        </div>
      </div>

      {/* Cards de Resumo Estilo Original */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#111111] border border-[#222222] p-5 rounded-2xl">
          <p className="text-gray-400 text-sm font-medium mb-1">Total de Clientes</p>
          <h2 className="text-3xl font-bold text-white">0</h2>
        </div>
        <div className="bg-[#111111] border border-[#222222] p-5 rounded-2xl">
          <p className="text-gray-400 text-sm font-medium mb-1">Itens em Estoque</p>
          <h2 className="text-3xl font-bold text-white">0</h2>
        </div>
        <div className="bg-[#111111] border border-[#222222] p-5 rounded-2xl">
          <p className="text-gray-400 text-sm font-medium mb-1">Vendas Hoje</p>
          <h2 className="text-3xl font-bold text-white text-green-500">R$ 0,00</h2>
        </div>
      </div>

      {/* Botões de Ação Direta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all">
          <Plus size={20} /> NOVA VENDA
        </button>
        <button className="flex items-center justify-center gap-2 bg-[#1a1a1a] border border-[#333333] text-white py-4 px-6 rounded-xl transition-all">
          <Users size={20} /> CLIENTES
        </button>
        <button className="flex items-center justify-center gap-2 bg-[#1a1a1a] border border-[#333333] text-white py-4 px-6 rounded-xl transition-all">
          <Package size={20} /> ESTOQUE
        </button>
      </div>

      {/* Tabela de Atividade Recente */}
      <div className="bg-[#111111] border border-[#222222] rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-[#222222]">
          <h3 className="font-bold text-lg text-white text-center md:text-left">Últimas Movimentações</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1a1a1a] text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 font-medium">Data</th>
                <th className="px-6 py-3 font-medium">Cliente</th>
                <th className="px-6 py-3 font-medium text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              <tr>
                <td colSpan="3" className="px-6 py-10 text-center text-gray-500 italic">
                  Nenhuma movimentação registrada hoje.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
