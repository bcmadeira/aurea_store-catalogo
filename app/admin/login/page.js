'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function PaginaLogin() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [erro, setErro] = useState('')
    const [carregando, setCarregando] = useState(false)

    async function fazerLogin(e) {
        e.preventDefault()  // Impede o comportamento padrão do formulário
        setCarregando(true)
        setErro('')

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password: senha,
        })

        if (error) {
            setErro('E-mail ou senha incorretos.')
            setCarregando(false)
        } else {
            router.push('/admin')  // Redireciona para o painel
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-sm">
                <h1 className="text-2xl font-bold text-center mb-6">Painel Admin</h1>

                <form onSubmit={fazerLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            E-mail
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Senha
                        </label>
                        <input
                            type="password"
                            value={senha}
                            onChange={e => setSenha(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
                        />
                    </div>

                    {erro && (
                        <p className="text-red-500 text-sm">{erro}</p>
                    )}

                    <button
                        type="submit"
                        disabled={carregando}
                        className="w-full bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700 transition disabled:opacity-50"
                    >
                        {carregando ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    )
}