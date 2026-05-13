import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conexão segura com tratamento de erro para o Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ clientes: [], estoque: [] });
  
  // Estados de controle de venda
  const [tipoVenda, setTipoVenda] = useState(null); 
  const [metodoPagamento, setMetodoPagamento] = useState(null); 
  const [vendaForm, setVendaForm] = useState({ cliente_id: '', produto_id: '', qtd: 1 });

  useEffect(() => { 
    if (supabaseUrl) carregarDados(); 
  }, []);

  async function carregarDados() {
    const { data: cl } = await supabase.from('clientes').select('*').order('nome');
    const { data: est } = await supabase.from('estoque').select('*').order('produto');
    setData({ clientes: cl || [], estoque: est || [] });
  }

  const finalizarVenda = async (e) => {
    if (e) e.preventDefault();
    
    // Validação de segurança para evitar erro de 'undefined'
    const produtoSelecionado = data.estoque.find(p => p.id === vendaForm.produto_id);
    
    if (!produtoSelecionado) {
      return alert("Erro: Selecione um produto válido da lista.");
    }

    setLoading(true);
    try {
      const preco = Number(produtoSelecionado.preco_venda || 0);
      const valorTotal = preco * Number(vendaForm.qtd);

      // Lógica de Venda (Fiado ou À Vista)
      if (tipoVenda === 'fiado') {
        const cliente = data.clientes.find(c => c.id === vendaForm.cliente_id);
        await supabase.from('clientes')
          .update({ saldo_devedor: Number(cliente.saldo_devedor || 0) + valorTotal })
          .eq('id', cliente.id);
      }

      const { error } = await supabase.from('vendas').insert([{
        cliente_id: vendaForm.cliente_id || null,
        produto_id: vendaForm.produto_id,
        quantidade: vendaForm.qtd,
        valor_total: valorTotal,
        metodo_pagamento: tipoVenda === 'fiado' ? 'fiado' : metodoPagamento
      }]);

      if (error) throw error;

      alert("✅ Venda realizada com sucesso!");
      setView('dashboard');
      carregarDados();
    } catch (err) {
      alert("Erro na operação: " + err.message);
    }
    setLoading(false);
  };

  // Renderização da Interface (Mantendo seu padrão visual)
  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>VendasPRO <span style={{color:'#7c3aed'}}>●</span></h1>
      
      {view === 'dashboard' ? (
        <div style={{ marginTop: '20px', display: 'grid', gap: '10px' }}>
           <div style={{ display: 'flex', gap: '10px' }}>
              <div style={cardStyle}><p>CLIENTES</p><h2>{data.clientes.length}</h2></div>
              <div style={cardStyle}><p>ESTOQUE</p><h2>{data.estoque.length}</h2></div>
           </div>
           <button onClick={() => setView('nova_venda')} style={btnPrimary}>NOVA VENDA</button>
           <button onClick={() => setView('estoque')} style={btnSecondary}>ESTOQUE</button>
        </div>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <p onClick={() => setView('dashboard')} style={{cursor:'pointer'}}>← VOLTAR</p>
          
          {view === 'nova_venda' && (
            <div style={formStyle}>
              <h3>Finalizar Venda</h3>
              <select 
                onChange={e => setVendaForm({...vendaForm, produto_id: e.target.value})}
                style={inputStyle}
              >
                <option value="">Selecione o Produto</option>
                {data.estoque.map(p => (
                  <option key={p.id} value={p.id}>{p.produto} - R${p.preco_venda}</option>
                ))}
              </select>
              
              <input 
                type="number" 
                placeholder="Quantidade" 
                onChange={e => setVendaForm({...vendaForm, qtd: e.target.value})}
                style={inputStyle}
              />

              <button onClick={finalizarVenda} disabled={loading} style={btnSuccess}>
                {loading ? 'PROCESSANDO...' : 'CONFIRMAR VENDA'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Estilos mantidos para consistência
const cardStyle = { backgroundColor: '#111', padding: '20px', borderRadius: '12px', flex: 1, border: '1px solid #222' };
const btnPrimary = { backgroundColor: '#7c3aed', color: '#fff', padding: '15px', borderRadius: '10px', border: 'none', fontWeight: 'bold' };
const btnSecondary = { backgroundColor: '#1a1a1a', color: '#fff', padding: '15px', borderRadius: '10px', border: '1px solid #333' };
const btnSuccess = { backgroundColor: '#10b981', color: '#fff', padding: '15px', borderRadius: '10px', border: 'none', width: '100%' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' };
const formStyle = { backgroundColor: '#111', padding: '20px', borderRadius: '15px' };
