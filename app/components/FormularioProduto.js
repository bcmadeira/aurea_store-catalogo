'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function FormularioProduto({ produtoExistente }) {
    const router = useRouter()
    const editando = !!produtoExistente

    const [nome, setNome] = useState(produtoExistente?.nome || '')
    const [descricao, setDescricao] = useState(produtoExistente?.descricao || '')
    const [preco, setPreco] = useState(produtoExistente?.preco || '')
    const [categoriaId, setCategoriaId] = useState(produtoExistente?.categoria_id || '')
    const [fotoUrl, setFotoUrl] = useState(produtoExistente?.foto_url || '')
    const [categorias, setCategorias] = useState([])
    const [enviando, setEnviando] = useState(false)
    const [erro, setErro] = useState('')

    useEffect(() => {
        async function buscarCategorias() {
            const { data } = await supabase.from('categorias').select('*').order('nome')
            setCategorias(data || [])
        }
        buscarCategorias()
    }, [])

    async function uploadFoto(arquivo) {
        // Gera um nome único para o arquivo
        const nomeArquivo = `${Date.now()}-${arquivo.name}`

        const { data, error } = await supabase.storage
            .from('produtos')
            .upload(nomeArquivo, arquivo)

        if (error) {
            setErro('Erro ao fazer upload da foto.')
            return null
        }

        // Retorna a URL pública da foto
        const { data: urlData } = supabase.storage
            .from('produtos')
            .getPublicUrl(nomeArquivo)

        return urlData.publicUrl
    }

    async function salvar(e) {
        e.preventDefault()
        setEnviando(true)
        setErro('')

        let urlFinal = fotoUrl

        // Se tem um arquivo novo selecionado, faz o upload
        const inputFoto = document.getElementById('foto-input')
        if (inputFoto.files[0]) {
            urlFinal = await uploadFoto(inputFoto.files[0])
            if (!urlFinal) {
                setEnviando(false)
                return
            }
        }

        const dados = {
            nome,
            descricao,
            preco: parseFloat(preco),
            categoria_id: categoriaId || null,
            foto_url: urlFinal,
        }

        let error

        if (editando) {
            // Atualiza o produto existente
            const result = await supabase
                .from('produtos')
                .update(dados)
                .eq('id', produtoExistente.id)
            error = result.error
        } else {
            // Insere um produto novo
            const result = await supabase.from('produtos').insert(dados)
            error = result.error
        }

        if (error) {
            setErro('Erro ao salvar produto. Tente novamente.')
            setEnviando(false)
        } else {
            router.push('/admin')
        }
    }

    return (
        <form onSubmit={salvar} className="bg-white rounded-xl shadow-sm p-6 space-y-5 max-w-xl">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                <input
                    type="text"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                    value={descricao}
                    onChange={e => setDescricao(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$) *</label>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={preco}
                    onChange={e => setPreco(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                    value={categoriaId}
                    onChange={e => setCategoriaId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
                >
                    <option value="">Sem categoria</option>
                    {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nome}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto do produto</label>
                {fotoUrl && (
                    <img src={fotoUrl} alt="Foto atual" className="w-32 h-32 object-cover rounded-lg mb-2" />
                )}
                <input
                    id="foto-input"
                    type="file"
                    accept="image/*"
                    className="w-full text-sm text-gray-500"
                />
                <p className="text-xs text-gray-400 mt-1">Deixe em branco para manter a foto atual</p>
            </div>

            {erro && <p className="text-red-500 text-sm">{erro}</p>}

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={enviando}
                    className="bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition disabled:opacity-50"
                >
                    {enviando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Criar produto'}
                </button>
                <button
                    type="button"
                    onClick={() => router.push('/admin')}
                    className="text-gray-500 hover:text-gray-800"
                >
                    Cancelar
                </button>
            </div>
        </form>
    )
}