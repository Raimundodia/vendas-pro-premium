import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conexão automática com seu Supabase (usando suas variáveis de ambiente)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [view, setView] = useState('dashboard');
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);

  // Função para Salvar o Cliente no Banco
  const salvarCliente = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('clientes')
      .insert([{ nome: nome, whatsapp: whatsapp }]);

    if (error) {
      alert("Erro ao salvar: " + error.message);
    } else {
      alert("Cliente cadastrado com sucesso!");
      setNome('');
      setWhatsapp('');
      setView('dashboard');
    }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', color: '#ffffff', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '30px' }} onClick={() => setView('dashboard')}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>Gestão Pro</h1>
        <p style={{ color: '#888', fontSize: '14px' }}>{view === 'dashboard' ? 'Painel de Controle' : '← Voltar'}</p>
      </div>

      {view === 'dashboard' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
          <button onClick={() => setView('novo_cliente')} style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '18px', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px' }}>
            👤 CADASTRAR CLIENTE
          </button>
          
          <button onClick={() => setView('estoque')} style={{ backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #333', padding: '18px', borderRadius: '12px', fontWeight: 'bold' }}>
            📦 VER ESTOQUE
          </button>
        </div>
      ) : view === 'novo_cliente' ? (
        /* FORMULÁRIO DE CADASTRO - ESTILO SEU INDEX.HTML */
        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #333' }}>
          <h2 style={{ marginBottom: '20px' }}>Novo Cliente</h2>
          
          <form onSubmit={salvarCliente}>
            <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Nome do Cliente</label>
            <input 
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: João Silva"
              style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#000', color: '#fff' }}
            />

            <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>WhatsApp / Telefone</label>
            <input 
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="(00) 00000-0000"
              style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#000', color: '#fff' }}
            />

            <button 
              type="submit" 
              disabled={loading}
              style={{ width: '100%', backgroundColor: '#10b981', color: 'white', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold' }}>
              {loading ? 'Salvando...' : 'CONFIRMAR CADASTRO'}
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
