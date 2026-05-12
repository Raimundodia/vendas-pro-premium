import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conexão segura
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Home() {
  const [view, setView] = useState('dashboard');
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);
  const [countClientes, setCountClientes] = useState(0);

  // Buscar total de clientes do banco ao carregar
  useEffect(() => {
    async function getStats() {
      const { count } = await supabase.from('clientes').select('*', { count: 'exact', head: true });
      if (count) setCountClientes(count);
    }
    getStats();
  }, []);

  const salvarCliente = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('clientes').insert([{ nome, whatsapp }]);
    
    if (error) {
      alert("Erro ao salvar: " + error.message);
    } else {
      alert("✅ Cliente salvo com sucesso!");
      setNome(''); setWhatsapp(''); setView('dashboard');
      window.location.reload(); // Atualiza os números na tela
    }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '20px', fontFamily: 'sans-serif' }}>
      
      <div style={{ marginBottom: '30px', cursor: 'pointer' }} onClick={() => setView('dashboard')}>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '-1px' }}>VendasPRO <span style={{color: '#7c3aed'}}>●</span></h1>
        <p style={{ color: '#555', fontSize: '13px' }}>{view === 'dashboard' ? 'SISTEMA DE GESTÃO' : '← VOLTAR'}</p>
      </div>

      {view === 'dashboard' ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '30px' }}>
            <div style={{ backgroundColor: '#111', border: '1px solid #222', padding: '15px', borderRadius: '15px' }}>
              <p style={{ color: '#444', fontSize: '11px', fontWeight: 'bold' }}>CLIENTES</p>
              <h2 style={{ fontSize: '24px', margin: '5px 0' }}>{countClientes}</h2>
            </div>
            <div style={{ backgroundColor: '#111', border: '1px solid #222', padding: '15px', borderRadius: '15px' }}>
              <p style={{ color: '#444', fontSize: '11px', fontWeight: 'bold' }}>ESTOQUE</p>
              <h2 style={{ fontSize: '24px', margin: '5px 0' }}>0</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '10px' }}>
            <button onClick={() => setView('novo_cliente')} style={{ backgroundColor: '#7c3aed', color: 'white', border: 'none', padding: '20px', borderRadius: '15px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
              👤 CADASTRAR NOVO CLIENTE
            </button>
            <button style={{ backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #333', padding: '18px', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
              📦 ENTRADA DE PRODUTOS
            </button>
          </div>
        </>
      ) : (
        <div style={{ backgroundColor: '#111', padding: '25px', borderRadius: '20px', border: '1px solid #222' }}>
          <h3 style={{ margin: '0 0 20px 0' }}>Novo Cliente</h3>
          <form onSubmit={salvarCliente}>
            <input required placeholder="Nome Completo" value={nome} onChange={e => setNome(e.target.value)}
              style={{ width: '100%', padding: '15px', marginBottom: '10px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#000', color: '#fff', boxSizing: 'border-box' }} 
            />
            <input required placeholder="WhatsApp" value={whatsapp} onChange={e => setWhatsapp(e.target.value)}
              style={{ width: '100%', padding: '15px', marginBottom: '20px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#000', color: '#fff', boxSizing: 'border-box' }} 
            />
            <button type="submit" disabled={loading} style={{ width: '100%', backgroundColor: '#10b981', color: 'white', border: 'none', padding: '15px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
              {loading ? 'SALVANDO...' : 'CONFIRMAR'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
