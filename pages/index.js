import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

export default function Home() {
  const [view, setView] = useState('dashboard');
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ clientes: [], estoque: [] });
  
  const [valorPago, setValorPago] = useState('');
  const [vendaForm, setVendaForm] = useState({ cliente_id: '', produto_id: '', qtd: 1 });
  const [fCliente, setFCliente] = useState({ id: null, nome: '', whatsapp: '', saldo_devedor: 0 });
  const [fEstoque, setFEstoque] = useState({ id: null, produto: '', quantidade: '', tipo: 'Unidade', custo: '', venda: '' });

  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
    const { data: cl } = await supabase.from('clientes').select('*').order('nome');
    const { data: est } = await supabase.from('estoque').select('*').order('produto');
    setData({ clientes: cl || [], estoque: est || [] });
  }

  // --- CRUD ESTOQUE CORRIGIDO ---
  const salvarEstoque = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = { 
      produto: fEstoque.produto, 
      quantidade: parseInt(fEstoque.quantidade),
      tipo_unidade: fEstoque.tipo,
      custo_total: parseFloat(fEstoque.custo),
      preco_venda: parseFloat(fEstoque.venda)
    };

    const { error } = fEstoque.id 
      ? await supabase.from('estoque').update(payload).eq('id', fEstoque.id)
      : await supabase.from('estoque').insert([payload]);

    if (error) {
      console.error(error);
      alert("ERRO NO BANCO: " + error.message);
    } else {
      alert("✅ Estoque atualizado com sucesso!");
      setFEstoque({ id: null, produto: '', quantidade: '', tipo: 'Unidade', custo: '', venda: '' });
      await carregarDados();
    }
    setLoading(false);
  };

  // --- CRUD CLIENTE ---
  const salvarCliente = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { nome: fCliente.nome, whatsapp: fCliente.whatsapp, saldo_devedor: Number(fCliente.saldo_devedor) };
    const { error } = fCliente.id ? await supabase.from('clientes').update(payload).eq('id', fCliente.id) : await supabase.from('clientes').insert([payload]);
    if (!error) {
      setFCliente({ id: null, nome: '', whatsapp: '', saldo_devedor: 0 });
      await carregarDados();
      setView('lista_clientes');
    }
    setLoading(false);
  };

  const excluirItem = async (tabela, id) => {
    if (confirm("Excluir permanentemente?")) {
      const { error } = await supabase.from(tabela).delete().eq('id', id);
      if (!error) carregarDados();
    }
  };

  // --- PAGAMENTOS ---
  const processarPagamento = async (tipo) => {
    const quantia = tipo === 'total' ? selectedClient.saldo_devedor : Number(valorPago);
    await supabase.from('clientes').update({ saldo_devedor: selectedClient.saldo_devedor - quantia }).eq('id', selectedClient.id);
    alert("Pagamento registrado!");
    setValorPago('');
    setView('lista_clientes');
    carregarDados();
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '20px', fontFamily: 'sans-serif' }}>
      
      <div style={{ marginBottom: '30px' }} onClick={() => setView('dashboard')}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>VendasPRO <span style={{color:'#7c3aed'}}>●</span></h1>
      </div>

      {view === 'dashboard' ? (
        <div style={{ display: 'grid', gap: '15px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={cardStyle}><p style={labelStyle}>CLIENTES</p><h2>{data.clientes.length}</h2></div>
            <div style={cardStyle}><p style={labelStyle}>DÍVIDAS TOTAIS</p><h2 style={{color:'#ef4444'}}>R$ {data.clientes.reduce((acc, c) => acc + Number(c.saldo_devedor), 0).toFixed(2)}</h2></div>
          </div>
          <button onClick={() => setView('estoque')} style={btnPrimary}>📦 GESTÃO DE ESTOQUE</button>
          <button onClick={() => setView('lista_clientes')} style={btnSecondary}>👥 CLIENTES E DÍVIDAS</button>
        </div>
      ) : view === 'estoque' ? (
        <div style={{ display: 'grid', gap: '20px' }}>
          <div style={formBox}>
            <h3>{fEstoque.id ? 'Editar Produto' : 'Entrada de Produto'}</h3>
            <form onSubmit={salvarEstoque}>
              <input required placeholder="Produto" value={fEstoque.produto} onChange={e => setFEstoque({...fEstoque, produto: e.target.value})} style={inputStyle} />
              <select value={fEstoque.tipo} onChange={e => setFEstoque({...fEstoque, tipo: e.target.value})} style={inputStyle}>
                <option>Unidade</option><option>Caixa</option><option>Pacote</option>
              </select>
              <input required placeholder="Quantidade" type="number" value={fEstoque.quantidade} onChange={e => setFEstoque({...fEstoque, quantidade: e.target.value})} style={inputStyle} />
              <input required placeholder="Custo Total (R$)" type="number" step="0.01" value={fEstoque.custo} onChange={e => setFEstoque({...fEstoque, custo: e.target.value})} style={inputStyle} />
              <input required placeholder="Preço Venda Unit. (R$)" type="number" step="0.01" value={fEstoque.venda} onChange={e => setFEstoque({...fEstoque, venda: e.target.value})} style={inputStyle} />
              <button type="submit" disabled={loading} style={btnSuccess}>{loading ? 'PROCESSANDO...' : 'SALVAR NO ESTOQUE'}</button>
            </form>
          </div>
          <div>
            <h3>Itens em Estoque</h3>
            {data.estoque.map(item => (
              <div key={item.id} style={itemBox}>
                <div onClick={() => setFEstoque({id: item.id, produto: item.produto, quantidade: item.quantidade, tipo: item.tipo_unidade, custo: item.custo_total, venda: item.preco_venda})}>
                  <p style={{margin:0}}><b>{item.produto}</b></p>
                  <p style={{margin:0, fontSize:'12px', color:'#10b981'}}>{item.quantidade} {item.tipo_unidade} • R$ {item.preco_venda} un</p>
                </div>
                <button onClick={() => excluirItem('estoque', item.id)} style={btnDel}>X</button>
              </div>
            ))}
          </div>
        </div>
      ) : view === 'lista_clientes' ? (
        <div style={{ display: 'grid', gap: '10px' }}>
          <button onClick={() => { setFCliente({id:null, nome:'', whatsapp:'', saldo_devedor:0}); setView('novo_cliente'); }} style={btnSuccess}>+ NOVO CLIENTE</button>
          {data.clientes.map(c => (
            <div key={c.id} style={itemBox}>
              <div style={{flex:1}} onClick={() => { setSelectedClient(c); setView('detalhe_cliente'); }}>
                <p style={{margin:0}}><b>{c.nome}</b></p>
                <p style={{margin:0, color: c.saldo_devedor > 0 ? '#ef4444' : '#10b981'}}>R$ {Number(c.saldo_devedor).toFixed(2)}</p>
              </div>
              <button onClick={() => { setFCliente(c); setView('novo_cliente'); }} style={{...btnDel, color:'#3b82f6', marginRight:'10px'}}>EDITAR</button>
              <button onClick={() => excluirItem('clientes', c.id)} style={btnDel}>X</button>
            </div>
          ))}
        </div>
      ) : view === 'novo_cliente' ? (
        <form onSubmit={salvarCliente} style={formBox}>
          <h3>{fCliente.id ? 'Editar Cliente' : 'Novo Cliente'}</h3>
          <input required placeholder="Nome" value={fCliente.nome} onChange={e => setFCliente({...fCliente, nome: e.target.value})} style={inputStyle} />
          <input required placeholder="WhatsApp" value={fCliente.whatsapp} onChange={e => setFCliente({...fCliente, whatsapp: e.target.value})} style={inputStyle} />
          <button type="submit" style={btnSuccess}>SALVAR</button>
        </form>
      ) : view === 'detalhe_cliente' && selectedClient ? (
        <div style={formBox}>
          <h2>{selectedClient.nome}</h2>
          <p style={{color: '#ef4444', fontSize: '24px', fontWeight: 'bold'}}>Débito: R$ {Number(selectedClient.saldo_devedor).toFixed(2)}</p>
          <input type="number" placeholder="Valor para pagar" value={valorPago} onChange={e => setValorPago(e.target.value)} style={inputStyle} />
          <button onClick={() => processarPagamento('parcial')} style={btnSuccess}>ABATER VALOR</button>
          <button onClick={() => processarPagamento('total')} style={{...btnSecondary, width: '100%', marginTop: '10px'}}>PAGAR TUDO</button>
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
const btnDel = { backgroundColor: 'transparent', color: '#f87171', border: 'none', cursor: 'pointer', fontWeight:'bold' };
const formBox = { backgroundColor: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #222' };
const itemBox = { display: 'flex', justifyContent: 'space-between', alignItems:'center', backgroundColor: '#111', padding: '15px', borderRadius: '10px', border: '1px solid #222', marginBottom: '8px' };
