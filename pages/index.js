import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseConfig'; // Usando sua configuração centralizada

export default function VendasProV2() {
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ products: [], customers: [] });

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    // Busca dados das NOVAS tabelas profissionais
    const { data: p } = await supabase.from('products').select('*').order('name');
    const { data: c } = await supabase.from('customers').select('*').order('name');
    setData({ products: p || [], customers: c || [] });
  }

  const realizarVenda = async (dadosVenda) => {
    setLoading(true);
    try {
      // 1. Cria a venda na tabela 'sales'
      const { data: venda, error: erroVenda } = await supabase
        .from('sales')
        .insert([{
          type: dadosVenda.tipo, // 'vista' ou 'fiado'
          customer_id: dadosVenda.customer_id || null,
          total_amount: dadosVenda.total,
          payment_method: dadosVenda.metodo,
          status: 'completed'
        }])
        .select();

      if (erroVenda) throw erroVenda;

      // 2. Se for fiado, atualiza o saldo do cliente (balance)
      if (dadosVenda.tipo === 'fiado') {
        const cliente = data.customers.find(c => c.id === dadosVenda.customer_id);
        await supabase.from('customers')
          .update({ balance: Number(cliente.balance || 0) + dadosVenda.total })
          .eq('id', cliente.id);
      }

      alert("Venda concluída com sucesso!");
      setView('dashboard');
      carregarDados();
    } catch (err) {
      alert("Erro na venda: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '20px' }}>
      <header style={{ borderBottom: '1px solid #222', paddingBottom: '10px' }}>
        <h1 style={{ fontSize: '22px' }}>VendasPRO <span style={{color:'#7c3aed'}}>PRO</span></h1>
      </header>

      {view === 'dashboard' ? (
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
             <div style={cardStyle}>
                <p style={{fontSize:'12px', color:'#888'}}>PRODUTOS</p>
                <h2 style={{fontSize:'28px'}}>{data.products.length}</h2>
             </div>
             <div style={cardStyle}>
                <p style={{fontSize:'12px', color:'#888'}}>CLIENTES</p>
                <h2 style={{fontSize:'28px'}}>{data.customers.length}</h2>
             </div>
          </div>
          
          <button onClick={() => setView('venda')} style={btnPrimary}>+ NOVA VENDA</button>
          <button onClick={() => setView('produtos')} style={btnSecondary}>GERENCIAR ESTOQUE</button>
        </div>
      ) : (
        <div style={{ marginTop: '20px' }}>
           <button onClick={() => setView('dashboard')} style={{background:'none', border:'none', color:'#7c3aed', cursor:'pointer'}}>← VOLTAR</button>
           {/* Aqui entram os componentes de formulário que vamos montar agora */}
           <div style={{marginTop:'20px', textAlign:'center', color:'#555'}}>
              Interface de {view} pronta para ser montada.
           </div>
        </div>
      )}
    </div>
  );
}

const cardStyle = { backgroundColor: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #222' };
const btnPrimary = { width:'100%', marginTop:'20px', backgroundColor: '#7c3aed', color: '#fff', padding: '18px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize:'16px' };
const btnSecondary = { width:'100%', marginTop:'10px', backgroundColor: '#1a1a1a', color: '#fff', padding: '15px', borderRadius: '12px', border: '1px solid #333' };
