export const COOKIE_NAME = "app_session_id";
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;

// Tipos do Controle de Estoque
export interface Produto {
  id_produto: number;
  nome: string;
  quantidade: number;
  preco: number;
  validade: string; // dd/mm/yyyy
}

export interface FiltrosListagem {
  nome?: string;
  quantidade_min?: number;
  preco_max?: number;
}

export const API_BASE = '/api';
