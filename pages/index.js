import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

export default function Home() {
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ clientes: [], estoque: [] });
  
  // Estados para formulários
  const [fCliente, setFCliente] = useState({ nome: '', whatsapp: '', saldo_devedor: 0 });
  const [fEstoque, setFEstoque] = useState({ produto: '', quantidade: '', tipo: 'Unidade', custo: '', venda: '' });

  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
    const { data: cl } = await supabase.from('clientes').select('*').order('nome');
    const { data: est } = await supabase.from('estoque').select('*').order('produto');
    setData({ clientes: cl || [], estoque: est || [] });
  }

  const salvarCliente = async (e) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from('clientes').insert([fCliente]);
    setFCliente({ nome: '', whatsapp: '', saldo_devedor: 0 });
    await carregarDados();
    setView('dashboard');
    setLoading(false);
  };

  const salvarEstoque = async (e) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from('estoque').insert([{ 
      produto: fEstoque.produto, 
      quantidade: Number(fEstoque.quantidade),
      tipo_unidade: fEstoque.tipo,
      custo_total: Number(fEstoque.custo),
      preco_venda: Number(fEstoque.venda)
    }]);
    setFEstoque({ produto: '', quantidade: '', tipo: 'Unidade', custo: '', venda: '' });
    await carregarDados();
    setView('estoque');
    setLoading(false);
  };

  const excluirItem = async (tabela, id) => {
    if (confirm("Deseja realmente excluir?")) {
      await supabase.from(tabela).delete().eq('id', id);
      carregarDados();
    }
  };

  // Cálculo de Lucro Esperado
  const lucroUnitario = fEstoque.venda && fEstoque.custo ? (fEstoque.venda - (fEstoque.custo / (fEstoque.quantidade || 1))) : 0;
  const lucroTotal = lucroUnitario * fEstoque.quantidade;

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '20px', fontFamily: 'sans-serif' }}>
      
      <div style={{ marginBottom: '30px' }} onClick={() => setView('dashboard')}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>VendasPRO <span style={{color:'#7c3aed'}}>●</span></h1>
        <p style={{ color: '#555', fontSize: '12px' }}>{view === 'dashboard' ? 'SISTEMA DE GESTÃO' : '← VOLTAR'}</p>
      </div>

      {view === 'dashboard' ? (
        <div style={{ display: 'grid', gap: '15px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={cardStyle}><p style={labelStyle}>CLIENTES</p><h2>{data.clientes.length}</h2></div>
            <div style={cardStyle}><p style={labelStyle}>DÍVIDAS TOTAIS</p><h2 style={{color:'#ef4444'}}>R$ {data.clientes.reduce((acc, c) => acc + Number(c.saldo_devedor), 0).toFixed(2)}</h2></div>
          </div>
          <button onClick={() => setView('novo_cliente')} style={btnPrimary}>👤 NOVO CLIENTE</button>
          <button onClick={() => setView('lista_clientes')} style={btnSecondary}>👥 VER DÍVIDAS / CLIENTES</button>
          <button onClick={() => setView('estoque')} style={btnSecondary}>📦 GESTÃO DE ESTOQUE</button>
        </div>
      ) : view === 'novo_cliente' ? (
        <form onSubmit={salvarCliente} style={formBox}>
          <h3>Cadastrar Cliente</h3>
          <input required placeholder="Nome" value={fCliente.nome} onChange={e => setFCliente({...fCliente, nome: e.target.value})} style={inputStyle} />
          <input required placeholder="WhatsApp" value={fCliente.whatsapp} onChange={e => setFCliente({...fCliente, whatsapp: e.target.value})} style={inputStyle} />
          <input placeholder="Saldo Devedor Inicial (R$)" type="number" value={fCliente.saldo_devedor} onChange={e => setFCliente({...fCliente, saldo_devedor: e.target.value})} style={inputStyle} />
          <button type="submit" disabled={loading} style={btnSuccess}>{loading ? 'GRAVANDO...' : 'CONFIRMAR'}</button>
        </form>
      ) : view === 'lista_clientes' ? (
        <div style={{ display: 'grid', gap: '10px' }}>
          {data.clientes.map(c => (
            <div key={c.id} style={itemBox}>
              <div>
                <p style={{fontWeight:'bold', margin:0}}>{c.nome}</p>
                <p style={{fontSize:'12px', color:'#ef4444'}}>Deve: R$ {Number(c.saldo_devedor).toFixed(2)}</p>
              </div>
              <button onClick={() => excluirItem('clientes', c.id)} style={btnDel}>EXCLUIR</button>
            </div>
          ))}
        </div>
      ) : view === 'estoque' ? (
        <div style={{ display: 'grid', gap: '20px' }}>
          <div style={formBox}>
            <h3 style={{marginTop:0}}>Entrada de Produto</h3>
            <input required placeholder="Produto" value={fEstoque.produto} onChange={e => setFEstoque({...fEstoque, produto: e.target.value})} style={inputStyle} />
            <select value={fEstoque.tipo} onChange={e => setFEstoque({...fEstoque, tipo: e.target.value})} style={inputStyle}>
              <option>Unidade</option><option>Caixa</option><option>Pacote</option>
            </select>
            <input required placeholder="Quantidade" type="number" value={fEstoque.quantidade} onChange={e => setFEstoque({...fEstoque, quantidade: e.target.value})} style={inputStyle} />
            <input required placeholder="Custo Total (R$)" type="number" value={fEstoque.custo} onChange={e => setFEstoque({...fEstoque, custo: e.target.value})} style={inputStyle} />
            <input required placeholder="Preço de Venda Unit. (R$)" type="number" value={fEstoque.venda} onChange={e => setFEstoque({...fEstoque, venda: e.target.value})} style={inputStyle} />
            
            {fEstoque.venda && <div style={lucroBox}>📈 Lucro Esperado: <b>R$ {lucroTotal.toFixed(2)}</b></div>}
            
            <button onClick={salvarEstoque} style={btnSuccess}>ADICIONAR AO ESTOQUE</button>
          </div>
          
          <div>
            <h3>Itens em Estoque</h3>
            {data.estoque.map(item => (
              <div key={item.id} style={itemBox}>
                <span>{item.produto} ({item.quantidade} {item.tipo_unidade})</span>
                <button onClick={() => excluirItem('estoque', item.id)} style={btnDel}>X</button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

const cardStyle = { backgroundColor: '#111', border: '1px solid #222', padding: '15px', borderRadius: '15px' };
const labelStyle = { color: '#444', fontSize: '10px', fontWeight: 'bold', margin: '0 0 5px 0' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #222', backgroundColor: '#000', color: '#fff' };
const btnPrimary = { backgroundColor: '#7c3aed', color: '#fff', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold' };
const btnSecondary = { backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #333', padding: '15px', borderRadius: '12px', fontWeight: 'bold' };
const btnSuccess = { backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', width: '100%' };
const btnDel = { backgroundColor: '#311', color: '#f87171', border: 'none', padding: '5px 10px', borderRadius: '5px', fontSize: '10px' };
const formBox = { backgroundColor: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #222' };
const itemBox = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111', padding: '12px', borderRadius: '10px', border: '1px solid #222' };
const lucroBox = { backgroundColor: '#064e3b', color: '#34d399', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px', textAlign: 'center' };
                 
