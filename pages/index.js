import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function Home() {
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ clientes: [], estoque: [] });
  
  // Estados para formulários
  const [formCliente, setFormCliente] = useState({ nome: '', whatsapp: '' });
  const [formEstoque, setFormEstoque] = useState({ produto: '', quantidade: '' });

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    if (!supabase) return;
    const { data: clientes } = await supabase.from('clientes').select('*').order('created_at', { ascending: false });
    const { data: estoque } = await supabase.from('estoque').select('*').order('produto');
    setData({ clientes: clientes || [], estoque: estoque || [] });
  }

  const salvarCliente = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('clientes').insert([formCliente]);
    if (!error) {
      alert("✅ Cliente salvo!");
      setFormCliente({ nome: '', whatsapp: '' });
      await carregarDados();
      setView('dashboard');
    }
    setLoading(false);
  };

  const salvarEstoque = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('estoque').insert([{ 
      produto: formEstoque.produto, 
      quantidade: parseInt(formEstoque.quantidade) 
    }]);
    if (!error) {
      alert("✅ Item adicionado ao estoque!");
      setFormEstoque({ produto: '', quantidade: '' });
      await carregarDados();
      setView('estoque');
    }
    setLoading(false);
  };

  const Card = ({ title, value, color }) => (
    <div style={{ backgroundColor: '#111', border: '1px solid #222', padding: '20px', borderRadius: '15px' }}>
      <p style={{ color: '#444', fontSize: '11px', fontWeight: 'bold', marginBottom: '10px' }}>{title}</p>
      <h2 style={{ fontSize: '28px', margin: '0', color: color || '#fff' }}>{value}</h2>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '20px', fontFamily: 'sans-serif' }}>
      
      <div style={{ marginBottom: '30px' }} onClick={() => setView('dashboard')}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>VendasPRO</h1>
        <p style={{ color: '#555', fontSize: '12px' }}>{view === 'dashboard' ? 'SISTEMA ATIVO' : '← VOLTAR'}</p>
      </div>

      {view === 'dashboard' ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '30px' }}>
            <Card title="CLIENTES" value={data.clientes.length} />
            <Card title="ESTOQUE" value={data.estoque.reduce((acc, curr) => acc + curr.quantidade, 0)} color="#10b981" />
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            <button onClick={() => setView('novo_cliente')} style={{ backgroundColor: '#7c3aed', color: 'white', border: 'none', padding: '20px', borderRadius: '15px', fontWeight: 'bold', fontSize: '16px' }}>👤 NOVO CLIENTE</button>
            <button onClick={() => setView('lista_clientes')} style={{ backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #333', padding: '18px', borderRadius: '15px', fontWeight: 'bold' }}>👥 LISTA DE CLIENTES</button>
            <button onClick={() => setView('estoque')} style={{ backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #333', padding: '18px', borderRadius: '15px', fontWeight: 'bold' }}>📦 GESTÃO DE ESTOQUE</button>
          </div>
        </>
      ) : view === 'novo_cliente' ? (
        <div style={{ backgroundColor: '#111', padding: '25px', borderRadius: '20px', border: '1px solid #222' }}>
          <h3 style={{ margin: '0 0 20px 0' }}>Cadastrar Cliente</h3>
          <form onSubmit={salvarCliente}>
            <input required placeholder="Nome" value={formCliente.nome} onChange={e => setFormCliente({...formCliente, nome: e.target.value})} style={inputStyle} />
            <input required placeholder="WhatsApp" value={formCliente.whatsapp} onChange={e => setFormCliente({...formCliente, whatsapp: e.target.value})} style={inputStyle} />
            <button type="submit" disabled={loading} style={btnSubmitStyle}>{loading ? 'SALVANDO...' : 'CONFIRMAR'}</button>
          </form>
        </div>
      ) : view === 'lista_clientes' ? (
        <div style={{ display: 'grid', gap: '10px' }}>
          <h3 style={{ marginBottom: '10px' }}>Clientes Cadastrados</h3>
          {data.clientes.map(c => (
            <div key={c.id} style={{ backgroundColor: '#111', padding: '15px', borderRadius: '12px', border: '1px solid #222' }}>
              <p style={{ margin: '0', fontWeight: 'bold' }}>{c.nome}</p>
              <p style={{ margin: '5px 0 0 0', color: '#10b981', fontSize: '14px' }}>{c.whatsapp}</p>
            </div>
          ))}
        </div>
      ) : view === 'estoque' ? (
        <div style={{ display: 'grid', gap: '20px' }}>
          <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '15px' }}>
            <h3 style={{ marginTop: '0' }}>Adicionar Produto</h3>
            <form onSubmit={salvarEstoque}>
              <input required placeholder="Nome do Produto" value={formEstoque.produto} onChange={e => setFormEstoque({...formEstoque, produto: e.target.value})} style={inputStyle} />
              <input required type="number" placeholder="Quantidade" value={formEstoque.quantidade} onChange={e => setFormEstoque({...formEstoque, quantidade: e.target.value})} style={inputStyle} />
              <button type="submit" disabled={loading} style={btnSubmitStyle}>ADICIONAR</button>
            </form>
          </div>
          <div>
            <h3>Itens em Estoque</h3>
            {data.estoque.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #222' }}>
                <span>{item.produto}</span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>{item.quantidade} un</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

const inputStyle = { width: '100%', padding: '15px', marginBottom: '10px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#000', color: '#fff', boxSizing: 'border-box' };
const btnSubmitStyle = { width: '100%', backgroundColor: '#10b981', color: 'white', border: 'none', padding: '18px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' };
      
