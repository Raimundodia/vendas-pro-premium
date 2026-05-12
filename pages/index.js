import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configuração do Banco de Dados
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [view, setView] = useState('dashboard');
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);

  // Função para salvar no Banco de Dados
  const salvarCliente = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('clientes')
        .insert([{ nome, whatsapp }]);

      if (error) throw error;

      alert("✅ Cliente cadastrado com sucesso!");
      setNome('');
      setWhatsapp('');
      setView('dashboard');
    } catch (error) {
      alert("❌ Erro ao salvar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', color: '#ffffff', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* Cabeçalho */}
      <div style={{ marginBottom: '30px', cursor: 'pointer' }} onClick={() => setView('dashboard')}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>VendasPRO</h1>
        <p style={{ color: '#888', fontSize: '14px', marginTop: '5px' }}>
          {view === 'dashboard' ? 'Painel de Gestão' : '← Voltar para o Início'}
        </p>
      </div>

      {view === 'dashboard' ? (
        <>
          {/* Resumo Rápido */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
            <div style={{ backgroundColor: '#111', border: '1px solid #222', padding: '20px', borderRadius: '15px' }}>
              <p style={{ color: '#888', fontSize: '12px', margin: '0' }}>CLIENTES</p>
              <h2 style={{ fontSize: '24px', margin: '5px 0' }}>Ativo</h2>
            </div>
            <div style={{ backgroundColor: '#111', border: '1px solid #222', padding: '20px', borderRadius: '15px' }}>
              <p style={{ color: '#888', fontSize: '12px', margin: '0' }}>ESTOQUE</p>
              <h2 style={{ fontSize: '24px', margin: '5px 0' }}>OK</h2>
            </div>
          </div>

          {/* Botões de Ação Principal */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '30px' }}>
            <button 
              onClick={() => setView('novo_cliente')}
              style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '18px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
              👤 NOVO CLIENTE
            </button>
            
            <button 
              style={{ backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #333', padding: '18px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
              📦 GESTÃO DE ESTOQUE
            </button>
            
            <button 
              style={{ backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #333', padding: '18px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
              📊 RELATÓRIOS
            </button>
          </div>

          {/* Tabela de Atividade Recente */}
          <div style={{ backgroundColor: '#111', border: '1px solid #222', borderRadius: '15px', overflow: 'hidden' }}>
            <div style={{ padding: '15px', borderBottom: '1px solid #222', textAlign: 'center' }}>
              <h3 style={{ margin: '0', fontSize: '14px', color: '#555', textTransform: 'uppercase' }}>Últimos Registros</h3>
            </div>
            <div style={{ padding: '40px', textAlign: 'center', color: '#333', fontSize: '14px' }}>
              Sistema pronto para uso.
            </div>
          </div>
        </>
      ) : view === 'novo_cliente' ? (
        /* Tela de Cadastro de Cliente */
        <div style={{ backgroundColor: '#111', padding: '25px', borderRadius: '20px', border: '1px solid #333' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>👤 Cadastro de Cliente</h2>
          
          <form onSubmit={salvarCliente}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#888', display: 'block', marginBottom: '8px', fontSize: '14px' }}>Nome Completo</label>
              <input 
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome do cliente"
                style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#000', color: '#fff', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ color: '#888', display: 'block', marginBottom: '8px', fontSize: '14px' }}>WhatsApp</label>
              <input 
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="(00) 00000-0000"
                style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#000', color: '#fff', boxSizing: 'border-box' }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ width: '100%', backgroundColor: '#10b981', color: 'white', border: 'none', padding: '18px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
              {loading ? 'GRAVANDO...' : 'CONFIRMAR CADASTRO'}
            </button>
            
            <button 
              type="button"
              onClick={() => setView('dashboard')}
              style={{ width: '100%', backgroundColor: 'transparent', color: '#555', border: 'none', marginTop: '15px', cursor: 'pointer' }}>
              Cancelar
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
