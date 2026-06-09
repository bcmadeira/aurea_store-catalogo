'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import ProdutoCard from '@/components/ProdutoCard'
import Carrinho from '@/components/Carrinho'

export default function PaginaCatalogo() {
  const [produtos, setProdutos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [carrinhoAberto, setCarrinhoAberto] = useState(false)

  // Busca os dados quando a página carrega
  useEffect(() => {
    buscarDados()
  }, [])

  async function buscarDados() {
    setCarregando(true)

    // Busca categorias
    const { data: cats } = await supabase
      .from('categorias')
      .select('*')
      .order('nome')

    // Busca produtos ativos
    const { data: prods } = await supabase
      .from('produtos')
      .select('*, categorias(nome)')   // Faz JOIN com a tabela categorias
      .eq('ativo', true)               // Só produtos ativos
      .order('nome')

    setCategorias(cats || [])
    setProdutos(prods || [])
    setCarregando(false)
  }

  // Filtra os produtos pela categoria selecionada
  const produtosFiltrados = categoriaSelecionada
    ? produtos.filter(p => p.categoria_id === categoriaSelecionada)
    : produtos

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-rose-600">🧶 Aurea - Artesanatos</h1>
          <button
            onClick={() => setCarrinhoAberto(true)}
            className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition"
          >
            🛒 Ver carrinho
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Filtro de categorias */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button
            onClick={() => setCategoriaSelecionada(null)}
            className={`px-4 py-2 rounded-full border transition ${
              !categoriaSelecionada
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-rose-400'
            }`}
          >
            Todos
          </button>
          {categorias.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoriaSelecionada(cat.id)}
              className={`px-4 py-2 rounded-full border transition ${
                categoriaSelecionada === cat.id
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-rose-400'
              }`}
            >
              {cat.nome}
            </button>
          ))}
        </div>

        {/* Grade de produtos */}
        {carregando ? (
          <p className="text-center text-gray-400 py-16">Carregando produtos...</p>
        ) : produtosFiltrados.length === 0 ? (
          <p className="text-center text-gray-400 py-16">Nenhum produto encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {produtosFiltrados.map(produto => (
              <ProdutoCard key={produto.id} produto={produto} />
            ))}
          </div>
        )}
      </main>

      {/* Carrinho lateral */}
      {carrinhoAberto && (
        <Carrinho onFechar={() => setCarrinhoAberto(false)} />
      )}
    </div>
  )
}