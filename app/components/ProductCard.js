'use client'

import { useCarrinho } from '@/context/CarrinhoContext'

export default function ProdutoCard({ produto }) {
    const { adicionarItem } = useCarrinho()

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
            {/* Foto do produto */}
            {produto.foto_url ? (
                <img
                    src={produto.foto_url}
                    alt={produto.nome}
                    className="w-full h-48 object-cover"
                />
            ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                    Sem foto
                </div>
            )}

            {/* Informações */}
            <div className="p-4">
                <span className="text-xs text-rose-500 font-medium uppercase tracking-wide">
                    {produto.categorias?.nome}
                </span>
                <h3 className="font-semibold text-gray-800 mt-1">{produto.nome}</h3>
                {produto.descricao && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{produto.descricao}</p>
                )}
                <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold text-gray-800">
                        R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
                    </span>
                    <button
                        onClick={() => adicionarItem(produto)}
                        className="bg-rose-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-rose-700 transition"
                    >
                        Adicionar
                    </button>
                </div>
            </div>
        </div>
    )
}