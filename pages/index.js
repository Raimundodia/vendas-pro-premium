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

  // CRUD ESTOQUE
  const salvarEstoque = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { 
      produto: fEstoque.produto, 
      quantidade: parseInt(fEstoque.quantidade),
      tipo_unidade: fEstoque.tipo,
      custo_total: parseFloat(fEstoque.custo || 0),
      preco_venda: parseFloat(fEstoque.venda || 0)
    };
    const { error } = fEstoque.id 
      ? await supabase.from('estoque').update(payload).eq('id', fEstoque.id) 
      : await supabase.from('estoque').insert([payload]);
    
    if (error) alert("Erro: " + error.message);
    else { alert("✅ Estoque Atualizado!"); setFEstoque({id:null, produto:'', quantidade:'', tipo:'Unidade', custo:'', venda:''}); carregarDados(); }
    setLoading(false);
  };

  // REGISTRAR VENDA
  const registrarVenda = async (e) => {
    e.preventDefault();
    setLoading(true);
    const prod = data.estoque.find(p => p.id === vendaForm.produto_id);
    const valorTotalVenda = prod.preco_venda * vendaForm.qtd;
    const cliente = data.clientes.find(c => c.id === vendaForm.cliente_id);

    const { error } = await supabase.from('clientes').update({ 
      saldo_devedor: Number(cliente.saldo_devedor) + valorTotalVenda 
    }).eq('id', cliente.id);

    if (error) alert(error.message);
    else { alert("Venda registrada!"); setView('dashboard'); carregarDados(); }
    setLoading(false);
  };

  const processarPagamento = async (tipo) => {
    const quantia = tipo === 'total' ? selectedClient.saldo_devedor : Number(valorPago);
    await supabase.from('clientes').update({ saldo_devedor: selectedClient.saldo_devedor - quantia }).eq('id', selectedClient.id);
    alert("Pago!"); setValorPago(''); setView('lista_clientes'); carregarDados();
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* HEADER COM BOTÃO VOLTAR */}
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }} onClick={() => setView('dashboard')}>VendasPRO</h1>
        {view !== 'dashboard' && (
          <button onClick={() => setView('dashboard')} style={{ background: 'none', border: 'none', color: '#7c3aed', padding: '10px 0', cursor: 'pointer', fontWeight: 'bold' }}>
            ← VOLTAR AO INÍCIO
          </button>
        )}
      </div>

      {view === 'dashboard' ? (
        <div style={{ display: 'grid', gap: '15px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={cardStyle}><p style={labelStyle}>CLIENTES</p><h2>{data.clientes.length}</h2></div>
            <div style={cardStyle}><p style={labelStyle}>DÍVIDAS</p><h2 style={{color:'#ef4444'}}>R$ {data.clientes.reduce((acc, c) => acc + Number(c.saldo_devedor), 0).toFixed(2)}</h2></div>
          </div>
          
          <button onClick={() => setView('nova_venda')} style={{...btnPrimary, backgroundColor: '#3b82f6'}}>+ FAZER NOVA VENDA</button>
          <button onClick={() => setView('lista_clientes')} style={btnSecondary}>👥 CLIENTES E DÍVIDAS</button>
          <button onClick={() => setView('estoque')} style={btnSecondary}>📦 GESTÃO DE ESTOQUE</button>
        </div>
      ) : view === 'nova_venda' ? (
        <form onSubmit={registrarVenda} style={formBox}>
          <h3>Registrar Venda (Fiado)</h3>
          <select required onChange={e => setVendaForm({...vendaForm, cliente_id: e.target.value})} style={inputStyle}>
            <option value="">Para qual cliente?</option>
            {data.clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          <select required onChange={e => setVendaForm({...vendaForm, produto_id: e.target.value})} style={inputStyle}>
            <option value="">Qual produto?</option>
            {data.estoque.map(p => <option key={p.id} value={p.id}>{p.produto} (R$ {p.preco_venda})</option>)}
          </select>
          <input type="number" placeholder="Quantidade" value={vendaForm.qtd} onChange={e => setVendaForm({...vendaForm, qtd: e.target.value})} style={inputStyle} />
          <button type="submit" disabled={loading} style={btnSuccess}>FINALIZAR VENDA</button>
        </form>
      ) : view === 'estoque' ? (
        <div style={{ display: 'grid', gap: '20px' }}>
          <form onSubmit={salvarEstoque} style={formBox}>
            <h3>{fEstoque.id ? 'Editar Produto' : 'Novo Produto'}</h3>
            <input required placeholder="Nome do Produto" value={fEstoque.produto} onChange={e => setFEstoque({...fEstoque, produto: e.target.value})} style={inputStyle} />
            <div style={{display:'flex', gap:'5px'}}>
              <select value={fEstoque.tipo} onChange={e => setFEstoque({...fEstoque, tipo: e.target.value})} style={inputStyle}>
                <option>Unidade</option><option>Caixa</option><option>Pacote</option>
              </select>
              <input required placeholder="Qtd" type="number" value={fEstoque.quantidade} onChange={e => setFEstoque({...fEstoque, quantidade: e.target.value})} style={inputStyle} />
            </div>
            <input required placeholder="Preço de Venda Unitário" type="number" step="0.01" value={fEstoque.venda} onChange={e => setFEstoque({...fEstoque, venda: e.target.value})} style={inputStyle} />
            <button type="submit" style={btnSuccess}>SALVAR NO ESTOQUE</button>
          </form>
          <div>
            {data.estoque.map(item => (
              <div key={item.id} style={itemBox} onClick={() => setFEstoque({id: item.id, produto: item.produto, quantidade: item.quantidade, tipo: item.tipo_unidade, venda: item.preco_venda})}>
                <span>{item.produto}</span>
                <span style={{color:'#10b981'}}>{item.quantidade} {item.tipo_unidade}</span>
              </div>
            ))}
          </div>
        </div>
      ) : view === 'lista_clientes' ? (
        <div style={{ display: 'grid', gap: '10px' }}>
          {data.clientes.map(c => (
            <div key={c.id} style={itemBox} onClick={() => { setSelectedClient(c); setView('detalhe_cliente'); }}>
              <span>{c.nome}</span>
              <span style={{color: c.saldo_devedor > 0 ? '#ef4444' : '#10b981'}}>R$ {Number(c.saldo_devedor).toFixed(2)}</span>
            </div>
          ))}
        </div>
      ) : view === 'detalhe_cliente' && selectedClient ? (
        <div style={formBox}>
          <h2>{selectedClient.nome}</h2>
          <p style={{color: '#ef4444', fontSize: '22px', fontWeight: 'bold'}}>Deve: R$ {Number(selectedClient.saldo_devedor).toFixed(2)}</p>
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
const btnSuccess = { backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', width: '100%' };
const formBox = { backgroundColor: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #222' };
const itemBox = { display: 'flex', justifyContent: 'space-between', backgroundColor: '#111', padding: '15px', borderRadius: '10px', border: '1px solid #222', marginBottom: '8px' };
