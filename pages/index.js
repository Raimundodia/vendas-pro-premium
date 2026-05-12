import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Inicialização segura
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Criamos a variável dentro de uma função ou com verificação constante
const getSupabase = () => {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey);
};

export default function Home() {
  const [view, setView] = useState('dashboard');
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);
  const [countClientes, setCountClientes] = useState(0);

  // Carregar dados com segurança
  useEffect(() => {
    async function carregarDados() {
      const sb = getSupabase();
      if (!sb) return;
      
      const { count, error } = await sb
        .from('clientes')
        .select('*', { count: 'exact', head: true });
      
      if (!error && count !== null) setCountClientes(count);
    }
    carregarDados();
  }, []);

  const salvarCliente = async (e) => {
    e.preventDefault();
    const sb = getSupabase();
    
    if (!sb) {
      alert("Configuração do Supabase não encontrada nas variáveis da Vercel.");
      return;
    }

    setLoading(true);
    const { error } = await sb
      .from('clientes')
      .insert([{ nome: nome, whatsapp: whatsapp }]);

    if (error) {
      alert("Erro ao salvar: " + error.message);
    } else {
      alert("✅ Cliente cadastrado!");
      setNome(''); setWhatsapp(''); setView('dashboard');
      window.location.reload();
    }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* Topo / Header */}
      <div style={{ marginBottom: '30px' }} onClick={() => setView('dashboard')}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>VendasPRO</h1>
        <p style={{ color: '#555', fontSize: '12px' }}>{view === 'dashboard' ? 'SISTEMA ATIVO' : '← VOLTAR'}</p>
      </div>

      {view === 'dashboard' ? (
        <>
          {/* Resumo Estilo Original */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '30px' }}>
            <div style={{ backgroundColor: '#111', border: '1px solid #222', padding: '20px', borderRadius: '15px' }}>
              <p style={{ color: '#444', fontSize: '11px', fontWeight: 'bold', marginBottom: '10px' }}>CLIENTES</p>
              <h2 style={{ fontSize: '28px', margin: '0' }}>{countClientes}</h2>
            </div>
            <div style={{ backgroundColor: '#111', border: '1px solid #222', padding: '20px', borderRadius: '15px' }}>
              <p style={{ color: '#444', fontSize: '11px', fontWeight: 'bold', marginBottom: '10px' }}>ESTOQUE</p>
              <h2 style={{ fontSize: '28px', margin: '0' }}>0</h2>
            </div>
          </div>

          {/* Botões de Ação */}
          <div style={{ display: 'grid', gap: '10px' }}>
            <button 
              onClick={() => setView('novo_cliente')}
              style={{ backgroundColor: '#7c3aed', color: 'white', border: 'none', padding: '20px', borderRadius: '15px', fontWeight: 'bold', fontSize: '16px' }}>
              👤 NOVO CLIENTE
            </button>
            <button style={{ backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #333', padding: '20px', borderRadius: '15px', fontWeight: 'bold' }}>
              📦 ESTOQUE
            </button>
          </div>
        </>
      ) : (
        /* Tela de Cadastro */
        <div style={{ backgroundColor: '#111', padding: '25px', borderRadius: '20px', border: '1px solid #222' }}>
          <h3 style={{ margin: '0 0 20px 0' }}>Cadastrar Cliente</h3>
          <form onSubmit={salvarCliente}>
            <input 
              required placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)}
              style={{ width: '100%', padding: '15px', marginBottom: '10px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#000', color: '#fff', boxSizing: 'border-box' }}
            />
            <input 
              required placeholder="WhatsApp" value={whatsapp} onChange={e => setWhatsapp(e.target.value)}
              style={{ width: '100%', padding: '15px', marginBottom: '20px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#000', color: '#fff', boxSizing: 'border-box' }}
            />
            <button 
              type="submit" disabled={loading}
              style={{ width: '100%', backgroundColor: '#10b981', color: 'white', border: 'none', padding: '18px', borderRadius: '10px', fontWeight: 'bold' }}>
              {loading ? 'SALVANDO...' : 'CONFIRMAR'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
