import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Home() {
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ clientes: [], estoque: [] });
  
  const [tipoVenda, setTipoVenda] = useState(null); 
  const [metodoPagamento, setMetodoPagamento] = useState(null); 
  const [taxaCartao, setTaxaCartao] = useState(0);
  
  // Estado do formulário unificado para garantir captura dos IDs
  const [vendaForm, setVendaForm] = useState({ cliente_id: '', produto_id: '', qtd: 1 });
  const [fEstoque, setFEstoque] = useState({ id: null, produto: '', quantidade: '', tipo: 'Unidade', venda: '' });

  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
    const { data: cl } = await supabase.from('clientes').select('*').order('nome');
    const { data: est } = await supabase.from('estoque').select('*').order('produto');
    setData({ clientes: cl || [], estoque: est || [] });
  }

  const finalizarVenda = async (e) => {
    if (e) e.preventDefault();
    
    // CORREÇÃO: Verificação rigorosa dos campos antes de processar
    if (!vendaForm.produto_id) return alert("Selecione um produto");
    if (tipoVenda === 'fiado' && !vendaForm.cliente_id) return alert("Selecione um cliente");

    setLoading(true);
    try {
      const prod = data.estoque.find(p => p.id === vendaForm.produto_id);
      let valorFinal = Number(prod.preco_venda) * Number(vendaForm.qtd);

      if (tipoVenda === 'avista' && metodoPagamento === 'cartao') {
        valorFinal += (valorFinal * (Number(taxaCartao) / 100));
      }

      if (tipoVenda === 'fiado') {
        const cliente = data.clientes.find(c => c.id === vendaForm.cliente_id);
        await supabase.from('clientes').update({ 
          saldo_devedor: Number(cliente.saldo_devedor || 0) + valorFinal 
        }).eq('id', cliente.id);
      }

      const { error } = await supabase.from('vendas').insert([{
        cliente_id: vendaForm.cliente_id || null,
        produto_id: vendaForm.produto_id,
        quantidade: vendaForm.qtd,
        valor_total: valorFinal,
        metodo_pagamento: tipoVenda === 'fiado' ? 'fiado' : metodoPagamento,
        taxa_cartao: taxaCartao
      }]);

      if (error) throw error;

      alert("✅ Venda concluída!");
      setVendaForm({ cliente_id: '', produto_id: '', qtd: 1 });
      setTipoVenda(null);
      setMetodoPagamento(null);
      setView('dashboard');
      carregarDados();
    } catch (err) {
      alert("Erro ao salvar: " + err.message);
    }
    setLoading(false);
  };

  const salvarEstoque = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { 
      produto: fEstoque.produto, 
      quantidade: parseInt(fEstoque.quantidade), 
      tipo_unidade: fEstoque.tipo || 'Unidade', 
      preco_venda: parseFloat(fEstoque.venda || 0) 
    };
    
    const { error } = fEstoque.id 
      ? await supabase.from('estoque').update(payload).eq('id', fEstoque.id)
      : await supabase.from('estoque').insert([payload]);

    if (error) alert("ERRO NO BANCO: " + error.message);
    else {
      alert("✅ Estoque atualizado!");
      setFEstoque({id:null, produto:'', quantidade:'', tipo:'Unidade', venda:''});
      carregarDados();
    }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '20px', fontFamily: 'sans-serif' }}>
      
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>VendasPRO <span style={{color:'#7c3aed'}}>●</span></h1>
        {view !== 'dashboard' && (
          <p onClick={() => {setView('dashboard'); setTipoVenda(null);}} style={{color:'#7c3aed', cursor:'pointer', fontWeight:'bold'}}>← VOLTAR</p>
        )}
      </div>

      {view === 'dashboard' ? (
        <div style={{ display: 'grid', gap: '15px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={cardStyle}><p style={labelStyle}>CLIENTES</p><h2>{data.clientes.length}</h2></div>
            <div style={cardStyle}><p style={labelStyle}>DÍVIDAS TOTAIS</p><h2 style={{color:'#ef4444'}}>R$ {data.clientes.reduce((acc, c) => acc + Number(c.saldo_devedor || 0), 0).toFixed(2)}</h2></div>
          </div>
          <button onClick={() => setView('nova_venda')} style={btnPrimary}>+ FAZER NOVA VENDA</button>
          <button onClick={() => setView('estoque')} style={btnSecondary}>📦 GESTÃO DE ESTOQUE</button>
          <button onClick={() => setView('lista_clientes')} style={btnSecondary}>👥 VER DÍVIDAS / CLIENTES</button>
        </div>
      ) : view === 'nova_venda' ? (
        <div style={formBox}>
          {!tipoVenda ? (
            <>
              <h3>Tipo de Venda</h3>
              <button onClick={() => setTipoVenda('avista')} style={btnOption}>💰 À VISTA</button>
              <button onClick={() => setTipoVenda('fiado')} style={btnOption}>📝 FIADO</button>
            </>
          ) : tipoVenda === 'avista' && !metodoPagamento ? (
            <>
              <h3>Forma de Recebimento</h3>
              <button onClick={() => setMetodoPagamento('pix')} style={btnPay}>💠 PIX</button>
              <button onClick={() => setMetodoPagamento('dinheiro')} style={btnPay}>💵 DINHEIRO</button>
              <button onClick={() => setMetodoPagamento('cartao')} style={btnPay}>💳 CARTÃO</button>
            </>
          ) : (
            <form onSubmit={finalizarVenda}>
              <h3>{tipoVenda === 'fiado' ? 'Venda Fiada' : `Pagamento: ${metodoPagamento.toUpperCase()}`}</h3>
              
              {tipoVenda === 'fiado' && (
                <select required value={vendaForm.cliente_id} onChange={e => setVendaForm({...vendaForm, cliente_id: e.target.value})} style={inputStyle}>
                  <option value="">Selecione o Cliente</option>
                  {data.clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              )}

              <select required value={vendaForm.produto_id} onChange={e => setVendaForm({...vendaForm, produto_id: e.target.value})} style={inputStyle}>
                <option value="">Selecione o Produto</option>
                {data.estoque.map(p => <option key={p.id} value={p.id}>{p.produto} (R$ {p.preco_venda})</option>)}
              </select>

              <input type="number" placeholder="Quantidade" value={vendaForm.qtd} onChange={e => setVendaForm({...vendaForm, qtd: e.target.value})} style={inputStyle} />

              {metodoPagamento === 'cartao' && (
                <input type="number" placeholder="Taxa do Cartão %" onChange={e => setTaxaCartao(e.target.value)} style={inputStyle} />
              )}

              <button type="submit" disabled={loading} style={btnSuccess}>
                {loading ? 'SALVANDO...' : 'FINALIZAR VENDA'}
              </button>
            </form>
          )}
        </div>
      ) : view === 'estoque' ? (
        <div style={{ display: 'grid', gap: '20px' }}>
          <form onSubmit={salvarEstoque} style={formBox}>
            <h3>Entrada de Produto</h3>
            <input required placeholder="Nome" value={fEstoque.produto} onChange={e => setFEstoque({...fEstoque, produto: e.target.value})} style={inputStyle} />
            <input required placeholder="Quantidade" type="number" value={fEstoque.quantidade} onChange={e => setFEstoque({...fEstoque, quantidade: e.target.value})} style={inputStyle} />
            <input required placeholder="Preço de Venda" type="number" step="0.01" value={fEstoque.venda} onChange={e => setFEstoque({...fEstoque, venda: e.target.value})} style={inputStyle} />
            <button type="submit" disabled={loading} style={btnSuccess}>SALVAR NO ESTOQUE</button>
          </form>
          <div>
            {data.estoque.map(item => (
              <div key={item.id} style={itemBox} onClick={() => setFEstoque({id: item.id, produto: item.produto, quantidade: item.quantidade, tipo: item.tipo_unidade, venda: item.preco_venda})}>
                <span>{item.produto}</span>
                <span>{item.quantidade} un.</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

const cardStyle = { backgroundColor: '#111', padding: '15px', borderRadius: '15px', border: '1px solid #222' };
const labelStyle = { color: '#666', fontSize: '10px', fontWeight: 'bold' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #222', backgroundColor: '#000', color: '#fff' };
const btnPrimary = { backgroundColor: '#7c3aed', color: '#fff', border: 'none', padding: '18px', borderRadius: '12px', fontWeight: 'bold', width:'100%', cursor:'pointer' };
const btnSecondary = { backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #333', padding: '15px', borderRadius: '12px', fontWeight: 'bold', width:'100%', marginTop: '10px', cursor:'pointer' };
const btnOption = { backgroundColor: '#222', color: '#fff', border: '1px solid #444', padding: '20px', borderRadius: '12px', width:'100%', marginBottom:'10px', cursor:'pointer' };
const btnPay = { backgroundColor: '#111', color: '#fff', border: '1px solid #7c3aed', padding: '15px', borderRadius: '12px', width:'100%', marginBottom:'10px', cursor:'pointer' };
const btnSuccess = { backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '18px', borderRadius: '12px', fontWeight: 'bold', width: '100%', cursor:'pointer' };
const formBox = { backgroundColor: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #222' };
const itemBox = { display: 'flex', justifyContent: 'space-between', backgroundColor: '#111', padding: '15px', borderRadius: '10px', border: '1px solid #222', marginBottom: '8px' };
