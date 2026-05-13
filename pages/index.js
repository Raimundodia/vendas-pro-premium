import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

export default function Home() {
  const [view, setView] = useState('dashboard');
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ clientes: [], estoque: [], vendas: [] });
  
  const [valorPago, setValorPago] = useState('');
  const [vendaForm, setVendaForm] = useState({ cliente_id: '', produto_id: '', qtd: 1 });

  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
    const { data: cl } = await supabase.from('clientes').select('*').order('nome');
    const { data: est } = await supabase.from('estoque').select('*').order('produto');
    setData(prev => ({ ...prev, clientes: cl || [], estoque: est || [] }));
  }

  const registrarVenda = async (e) => {
    e.preventDefault();
    setLoading(true);
    const prod = data.estoque.find(p => p.id === vendaForm.produto_id);
    const valorTotalVenda = prod.preco_venda * vendaForm.qtd;

    // 1. Registra a venda
    await supabase.from('vendas').insert([{
      cliente_id: vendaForm.cliente_id,
      produto_name: prod.produto,
      quantidade: vendaForm.qtd,
      valor_total: valorTotalVenda
    }]);

    // 2. Atualiza saldo do cliente
    const cliente = data.clientes.find(c => c.id === vendaForm.cliente_id);
    await supabase.from('clientes').update({ 
      saldo_devedor: Number(cliente.saldo_devedor) + valorTotalVenda 
    }).eq('id', cliente.id);

    alert("Venda realizada!");
    setView('dashboard');
    carregarDados();
    setLoading(false);
  };

  const processarPagamento = async (tipo) => {
    const quantia = tipo === 'total' ? selectedClient.saldo_devedor : Number(valorPago);
    const novoSaldo = selectedClient.saldo_devedor - quantia;

    await supabase.from('clientes').update({ saldo_devedor: novoSaldo }).eq('id', selectedClient.id);
    alert("Pagamento registrado!");
    setValorPago('');
    setView('lista_clientes');
    carregarDados();
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '20px', fontFamily: 'sans-serif' }}>
      
      <div style={{ marginBottom: '30px' }} onClick={() => setView('dashboard')}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>VendasPRO</h1>
      </div>

      {view === 'dashboard' ? (
        <div style={{ display: 'grid', gap: '15px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={cardStyle}><p style={labelStyle}>CLIENTES</p><h2>{data.clientes.length}</h2></div>
            <div style={cardStyle}><p style={labelStyle}>DÍVIDAS</p><h2 style={{color:'#ef4444'}}>R$ {data.clientes.reduce((acc, c) => acc + Number(c.saldo_devedor), 0).toFixed(2)}</h2></div>
          </div>
          <button onClick={() => setView('nova_venda')} style={{...btnPrimary, backgroundColor: '#3b82f6'}}>+ NOVA VENDA</button>
          <button onClick={() => setView('lista_clientes')} style={btnSecondary}>👥 VER DÍVIDAS / CLIENTES</button>
          <button onClick={() => setView('estoque')} style={btnSecondary}>📦 GESTÃO DE ESTOQUE</button>
        </div>
      ) : view === 'nova_venda' ? (
        <form onSubmit={registrarVenda} style={formBox}>
          <h3>Nova Venda</h3>
          <select required onChange={e => setVendaForm({...vendaForm, cliente_id: e.target.value})} style={inputStyle}>
            <option value="">Selecione o Cliente</option>
            {data.clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          <select required onChange={e => setVendaForm({...vendaForm, produto_id: e.target.value})} style={inputStyle}>
            <option value="">Selecione o Produto</option>
            {data.estoque.map(p => <option key={p.id} value={p.id}>{p.produto} - R${p.preco_venda}</option>)}
          </select>
          <input type="number" placeholder="Quantidade" onChange={e => setVendaForm({...vendaForm, qtd: e.target.value})} style={inputStyle} />
          <button type="submit" style={btnSuccess}>CONFIRMAR VENDA</button>
        </form>
      ) : view === 'lista_clientes' ? (
        <div style={{ display: 'grid', gap: '10px' }}>
          <button onClick={() => setView('novo_cliente')} style={btnSuccess}>+ ADICIONAR NOVO CLIENTE</button>
          {data.clientes.map(c => (
            <div key={c.id} onClick={() => { setSelectedClient(c); setView('detalhe_cliente'); }} style={itemBox}>
              <span>{c.nome}</span>
              <span style={{color: c.saldo_devedor > 0 ? '#ef4444' : '#10b981', fontWeight: 'bold'}}>R$ {Number(c.saldo_devedor).toFixed(2)}</span>
            </div>
          ))}
        </div>
      ) : view === 'detalhe_cliente' && selectedClient ? (
        <div style={formBox}>
          <h3>{selectedClient.nome}</h3>
          <p style={{color: '#ef4444', fontSize: '20px', fontWeight: 'bold'}}>Débito: R$ {Number(selectedClient.saldo_devedor).toFixed(2)}</p>
          <hr style={{borderColor: '#222', margin: '20px 0'}} />
          
          <p>Pagamento Parcial:</p>
          <input type="number" placeholder="R$ 0,00" value={valorPago} onChange={e => setValorPago(e.target.value)} style={inputStyle} />
          <button onClick={() => processarPagamento('parcial')} style={{...btnSuccess, marginBottom: '10px'}}>PAGAR QUANTIA</button>
          <button onClick={() => processarPagamento('total')} style={{...btnSecondary, width: '100%'}}>PAGAR TUDO</button>
        </div>
      ) : null}
    </div>
  );
}

const cardStyle = { backgroundColor: '#111', border: '1px solid #222', padding: '15px', borderRadius: '15px' };
const labelStyle = { color: '#444', fontSize: '10px', fontWeight: 'bold', margin: '0 0 5px 0' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #222', backgroundColor: '#000', color: '#fff' };
const btnPrimary = { backgroundColor: '#7c3aed', color: '#fff', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };
const btnSecondary = { backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #333', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };
const btnSuccess = { backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', width: '100%' };
const formBox = { backgroundColor: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #222' };
const itemBox = { display: 'flex', justifyContent: 'space-between', backgroundColor: '#111', padding: '15px', borderRadius: '10px', border: '1px solid #222', cursor: 'pointer' };
