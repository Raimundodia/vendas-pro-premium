import React from 'react';

export default function Home() {
  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', color: '#ffffff', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>Gestão Pro</h1>
        <p style={{ color: '#888', fontSize: '14px', marginTop: '5px' }}>Controle de clientes e estoque</p>
      </div>

      {/* Cards de Resumo - Estilo igual ao seu index(1).html */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#111', border: '1px solid #222', padding: '20px', borderRadius: '15px' }}>
          <p style={{ color: '#888', fontSize: '14px', margin: '0 0 10px 0' }}>Total de Clientes</p>
          <h2 style={{ fontSize: '28px', margin: '0' }}>0</h2>
        </div>
        <div style={{ backgroundColor: '#111', border: '1px solid #222', padding: '20px', borderRadius: '15px' }}>
          <p style={{ color: '#888', fontSize: '14px', margin: '0 0 10px 0' }}>Itens em Estoque</p>
          <h2 style={{ fontSize: '28px', margin: '0' }}>0</h2>
        </div>
        <div style={{ backgroundColor: '#111', border: '1px solid #222', padding: '20px', borderRadius: '15px' }}>
          <p style={{ color: '#888', fontSize: '14px', margin: '0 0 10px 0' }}>Vendas Hoje</p>
          <h2 style={{ fontSize: '28px', margin: '0', color: '#10b981' }}>R$ 0,00</h2>
        </div>
      </div>

      {/* Botões de Ação */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '30px' }}>
        <button style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
          ➕ NOVA VENDA
        </button>
        <button style={{ backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #333', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
          👥 CLIENTES
        </button>
        <button style={{ backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #333', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
          📦 ESTOQUE
        </button>
      </div>

      {/* Tabela de Atividade */}
      <div style={{ backgroundColor: '#111', border: '1px solid #222', borderRadius: '15px', overflow: 'hidden' }}>
        <div style={{ padding: '15px', borderBottom: '1px solid #222' }}>
          <h3 style={{ margin: '0', fontSize: '18px' }}>Últimas Movimentações</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#1a1a1a', color: '#555', fontSize: '12px' }}>
              <tr>
                <th style={{ padding: '12px 15px' }}>DATA</th>
                <th style={{ padding: '12px 15px' }}>CLIENTE</th>
                <th style={{ padding: '12px 15px', textAlign: 'right' }}>VALOR</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="3" style={{ padding: '40px', textAlign: 'center', color: '#555', fontStyle: 'italic' }}>
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
