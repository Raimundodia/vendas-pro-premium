// Definição da estrutura completa do banco de dados
export interface Cliente {
  id: string;
  nome: string;
  endereco_chave: string; // A chave integrada que você solicitou
  telefone?: string;
}

export interface Produto {
  id: string;
  nome: string;
  quantidade: number; // Reflete o "Estoque" da Screenshot_20260513-100527.png
  preco: number;
}

export interface Venda {
  id: string;
  cliente_endereco: string; // Chave vinculada
  produto_id: string;
  data: string;
}
