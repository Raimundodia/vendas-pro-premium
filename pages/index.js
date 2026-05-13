import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

export default function Home() {
  const [view, setView] = useState('dashboard');
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ clientes: [], estoque: [] });
  
  // Estados de Venda e Pagamento
  const [tipoVenda, setTipoVenda] = useState(null); // 'avista' ou 'fiado'
  const [metodoPagamento, setMetodoPagamento] = useState(null); // 'pix', 'dinheiro', 'cartao'
  const [taxaCartao, setTaxaCartao] = useState(0);
  
  const [valorPago, setValorPago] = useState('');
  const [vendaForm, setVendaForm] = useState({ cliente_id: '', produto_id: '', qtd: 1 });
  const [fEstoque, setFEstoque] = useState({ id: null, produto: '', quantidade: '', tipo: 'Unidade', custo: '', venda: '' });

  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
    const { data: cl } = await supabase.from('clientes').select('*').order('nome');
    const { data: est } = await supabase.from('estoque').select('*').order('produto');
    setData({ clientes: cl || [], estoque: est || [] });
  }

  const finalizarVenda = async (e) => {
    e.preventDefault();
    setLoading(true);
    const prod = data.estoque.find(p => p.id === vendaForm.produto_id);
    let valorFinal = prod.preco_venda * vendaForm.qtd;

    if (tipoVenda === 'avista' && metodoPagamento === 'cartao') {
      valorFinal = valorFinal + (valorFinal * (Number(taxaCartao) / 100));
    }

    if (tipoVenda === 'fiado') {
      const cliente = data.clientes.find(c => c.id === vendaForm.cliente_id);
      await supabase.from('clientes').update({ 
        saldo_devedor: Number(cliente.saldo_devedor) + valorFinal 
      }).eq('id', cliente.id);
      alert("Venda Fiada registrada!");
    } else {
      alert(`Venda À Vista (${metodoPagamento.toUpperCase()}) finalizada: R$ ${valorFinal.toFixed(2)}`);
    }

    setTipoVenda(null);
    setMetodoPagamento(null);
    setView('dashboard');
    carregarDados();
    setLoading(false);
  };

  const salvarEstoque = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { produto: fEstoque.produto, quantidade: parseInt(fEstoque.quantidade), tipo_unidade: fEstoque.tipo, preco_venda: parseFloat(fEstoque.venda || 0) };
    await supabase.from('estoque').insert([payload]);
    setFEstoque({id:null, produto:'', quantidade:'', tipo:'Unidade', custo:'', venda:''});
    carregarDados();
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '20px', fontFamily: 'sans-serif' }}>
      
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }} onClick={() => setView('dashboard')}>VendasPRO</h1>
        {view !== 'dashboard' && <p onClick={() => {setView('dashboard'); setTipoVenda(null);}} style={{color:'#7c3aed', cursor:'pointer', marginTop:'10px'}}>← VOLTAR</p>}
      </div>

      {view === 'dashboard' ? (
        <div style={{ display: 'grid', gap: '15px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={cardStyle}><p style={labelStyle}>CLIENTES</p><h2>{data.clientes.length}</h2></div>
            <div style={cardStyle}><p style={labelStyle}>ESTOQUE</p><h2>{data.estoque.length}</h2></div>
          </div>
          <button onClick={() => setView('nova_venda')} style={btnPrimary}>+ FAZER NOVA VENDA</button>
          <button onClick={() => setView('estoque')} style={btnSecondary}>📦 ESTOQUE</button>
          <button onClick={() => setView('lista_clientes')} style={btnSecondary}>👥 CLIENTES</button>
        </div>
      ) : view === 'nova_venda' ? (
        <div style={formBox}>
          {!tipoVenda ? (
            <>
              <h3>Tipo de Venda</h3>
              <button onClick={() => setTipoVenda('avista')} style={{...btnSecondary, marginBottom:'10px', width:'100%'}}>💰 À VISTA</button>
              <button onClick={() => setTipoVenda('fiado')} style={{...btnSecondary, width:'100%'}}>📝 FIADO (CONTA)</button>
            </>
          ) : tipoVenda === 'avista' && !metodoPagamento ? (
            <>
              <h3>Forma de Pagamento</h3>
              <button onClick={() => setMetodoPagamento('pix')} style={btnPay}>💠 PIX</button>
              <button onClick={() => setMetodoPagamento('dinheiro')} style={btnPay}>💵 DINHEIRO</button>
              <button onClick={() => setMetodoPagamento('cartao')} style={btnPay}>💳 CARTÃO (DÉBITO/CRÉDITO)</button>
            </>
          ) : (
            <form onSubmit={finalizarVenda}>
              <h3>{tipoVenda === 'fiado' ? 'Venda Fiada' : `Venda no ${metodoPagamento}`}</h3>
              
              {tipoVenda === 'fiado' && (
                <select required onChange={e => setVendaForm({...vendaForm, cliente_id: e.target.value})} style={inputStyle}>
                  <option value="">Selecione o Cliente</option>
                  {data.clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              )}

              <select required onChange={e => setVendaForm({...vendaForm, produto_id: e.target.value})} style={inputStyle}>
                <option value="">Qual produto?</option>
                {data.estoque.map(p => <option key={p.id} value={p.id}>{p.produto} (R$ {p.preco_venda})</option>)}
              </select>

              <input type="number" placeholder="Quantidade" value={vendaForm.qtd} onChange={e => setVendaForm({...vendaForm, qtd: e.target.value})} style={inputStyle} />

              {metodoPagamento === 'cartao' && (
                <div style={{marginTop:'10px'}}>
                  <label style={labelStyle}>TAXA DO CARTÃO (%)</label>
                  <input type="number" placeholder="Ex: 2.5" step="0.01" onChange={e => setTaxaCartao(e.target.value)} style={inputStyle} />
                </div>
              )}

              <button type="submit" disabled={loading} style={btnSuccess}>FINALIZAR</button>
            </form>
          )}
        </div>
      ) : view === 'estoque' ? (
        <form onSubmit={salvarEstoque} style={formBox}>
          <h3>Adicionar Produto</h3>
          <input required placeholder="Nome" value={fEstoque.produto} onChange={e => setFEstoque({...fEstoque, produto: e.target.value})} style={inputStyle} />
          <input required placeholder="Preço" type="number" step="0.01" onChange={e => setFEstoque({...fEstoque, venda: e.target.value})} style={inputStyle} />
          <button type="submit" style={btnSuccess}>SALVAR</button>
        </form>
      ) : null}
    </div>
  );
}

const cardStyle = { backgroundColor: '#111', border: '1px solid #222', padding: '15px', borderRadius: '15px' };
const labelStyle = { color: '#444', fontSize: '10px', fontWeight: 'bold', margin: '0 0 5px 0', display:'block' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #222', backgroundColor: '#000', color: '#fff' };
const btnPrimary = { backgroundColor: '#7c3aed', color: '#fff', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', width:'100%' };
const btnSecondary = { backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #333', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', width:'100%', marginBottom:'10px' };
const btnSuccess = { backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', width: '100%', cursor:'pointer' };
const btnPay = { backgroundColor: '#111', color: '#fff', border: '1px solid #7c3aed', padding: '15px', borderRadius: '12px', fontWeight: 'bold', width: '100%', cursor:'pointer', marginBottom:'10px', textAlign:'left' };
const formBox = { backgroundColor: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #222' };
const itemBox = { display: 'flex', justifyContent: 'space-between', backgroundColor: '#111', padding: '15px', borderRadius: '10px', border: '1px solid #222', marginBottom: '8px' };
