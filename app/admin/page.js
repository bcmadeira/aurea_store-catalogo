'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PainelAdmin() {
    const router = useRouter()
    const [produtos, setProdutos] = useState([])
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        buscarProdutos()
    }, [])

    async function buscarProdutos() {
        const { data } = await supabase
            .from('produtos')
            .select('*, categorias(nome)')
            .order('created_at', { ascending: false })

        setProdutos(data || [])
        setCarregando(false)
    }

    async function toggleAtivo(produto) {
        await supabase
            .from('produtos')
            .update({ ativo: !produto.ativo })
            .eq('id', produto.id)

        buscarProdutos()
    }

    async function excluirProduto(id) {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return

        await supabase.from('produtos').delete().eq('id', id)
        buscarProdutos()
    }

    async function sair() {
        await supabase.auth.signOut()
        router.push('/admin/login')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Painel de produtos</h1>
                    <div className="flex gap-3">
                        <Link
                            href="/admin/produtos/novo"
                            className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition text-sm"
                        >
                            + Novo produto
                        </Link>
                        <button
                            onClick={sair}
                            className="text-gray-500 hover:text-gray-800 text-sm"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8">
                {carregando ? (
                    <p className="text-center text-gray-400">Carregando...</p>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-4 py-3 text-gray-600">Produto</th>
                                    <th className="text-left px-4 py-3 text-gray-600">Categoria</th>
                                    <th className="text-left px-4 py-3 text-gray-600">Preço</th>
                                    <th className="text-left px-4 py-3 text-gray-600">Status</th>
                                    <th className="text-left px-4 py-3 text-gray-600">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {produtos.map(produto => (
                                    <tr key={produto.id} className="border-b last:border-0 hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-800">{produto.nome}</td>
                                        <td className="px-4 py-3 text-gray-500">{produto.categorias?.nome || '—'}</td>
                                        <td className="px-4 py-3 text-gray-800">
                                            R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => toggleAtivo(produto)}
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${produto.ativo
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-500'
                                                    }`}
                                            >
                                                {produto.ativo ? 'Ativo' : 'Inativo'}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/admin/produtos/${produto.id}`}
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    Editar
                                                </Link>
                                                <button
                                                    onClick={() => excluirProduto(produto.id)}
                                                    className="text-red-400 hover:text-red-600"
                                                >
                                                    Excluir
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    )
}