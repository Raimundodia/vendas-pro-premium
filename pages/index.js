import React, { useState } from 'react';

export default function Home() {
  // Lógica para controlar o que aparece na tela
  const [view, setView] = useState('dashboard');

  // Função para voltar ao início
  const irParaDashboard = () => setView('dashboard');

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', color: '#ffffff', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* Header com clique no título para voltar */}
      <div style={{ marginBottom: '30px', cursor: 'pointer' }} onClick={irParaDashboard}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>Gestão Pro</h1>
        <p style={{ color: '#888', fontSize: '14px', marginTop: '5px' }}>{view === 'dashboard' ? 'Painel de Controle' : '← Voltar ao Início'}</p>
      </div>

      {view === 'dashboard' ? (
        <>
          {/* Cards de Resumo */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '30px' }}>
            <div style={{ backgroundColor: '#111', border: '1px solid #222', padding: '20px', borderRadius: '15px' }}>
              <p style={{ color: '#888', fontSize: '12px', margin: '0' }}>CLIENTES</p>
              <h2 style={{ fontSize: '24px', margin: '5px 0' }}>0</h2>
            </div>
            <div style={{ backgroundColor: '#111', border: '1px solid #222', padding: '20px', borderRadius: '15px' }}>
              <p style={{ color: '#888', fontSize: '12px', margin: '0' }}>ESTOQUE</p>
              <h2 style={{ fontSize: '24px', margin: '5px 0' }}>0</h2>
            </div>
          </div>

          {/* Botões de Ação - AGORA COM CLIQUE */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '30px' }}>
            <button 
              onClick={() => alert('Abrir tela de Nova Venda')}
              style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '18px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
              ➕ NOVA VENDA
            </button>
            
            <button 
              onClick={() => setView('clientes')}
              style={{ backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #333', padding: '18px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
              👥 VER CLIENTES
            </button>

            <button 
              onClick={() => setView('estoque')}
              style={{ backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #333', padding: '18px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
              📦 VER ESTOQUE
            </button>
          </div>

          {/* Tabela de Atividade */}
          <div style={{ backgroundColor: '#111', border: '1px solid #222', borderRadius: '15px', overflow: 'hidden' }}>
            <div style={{ padding: '15px', borderBottom: '1px solid #222', textAlign: 'center' }}>
              <h3 style={{ margin: '0', fontSize: '16px', color: '#888' }}>Movimentações Recentes</h3>
            </div>
            <div style={{ padding: '40px', textAlign: 'center', color: '#444' }}>
              Nenhum dado registrado.
            </div>
          </div>
        </>
      ) : (
        /* Tela Simples de Visualização (Clientes ou Estoque) */
        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #333' }}>
          <h2 style={{ textTransform: 'uppercase' }}>{view}</h2>
          <p style={{ color: '#888' }}>Carregando dados do banco...</p>
          <button 
            onClick={irParaDashboard}
            style={{ marginTop: '20px', backgroundColor: 'transparent', border: '1px solid #555', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>
            Voltar
          </button>
        </div>
      )}
    </div>
  );
}
