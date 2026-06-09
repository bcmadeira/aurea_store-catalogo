'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import FormularioProduto from '@/components/FormularioProduto'
import Link from 'next/link'

export default function PaginaEditarProduto({ params }) {
    const [produto, setProduto] = useState(null)

    useEffect(() => {
        async function buscar() {
            const { data } = await supabase
                .from('produtos')
                .select('*')
                .eq('id', params.id)
                .single()  // Retorna um objeto ao invés de array

            setProduto(data)
        }
        buscar()
    }, [params.id])

    if (!produto) return <p className="p-8 text-center text-gray-400">Carregando...</p>

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-5xl mx-auto px-4 py-4">
                    <Link href="/admin" className="text-gray-500 hover:text-gray-800 text-sm">
                        ← Voltar
                    </Link>
                    <h1 className="text-xl font-bold text-gray-800 mt-1">Editar produto</h1>
                </div>
            </header>
            <main className="max-w-5xl mx-auto px-4 py-8">
                <FormularioProduto produtoExistente={produto} />
            </main>
        </div>
    )
}