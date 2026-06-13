'use client'

import { createContext, useContext, useState, useEffect } from 'react'

// 1. Cria o contexto
const CarrinhoContext = createContext()

// 2. Cria o Provider (envolve a aplicação e disponibiliza o carrinho)
export function CarrinhoProvider({ children }) {
    const [itens, setItens] = useState([])

    // Carrega o carrinho do localStorage quando a página abre
    useEffect(() => {
        const salvo = localStorage.getItem('carrinho')
        if (salvo) {
            setItens(JSON.parse(salvo))
        }
    }, [])

    // Salva no localStorage sempre que o carrinho muda
    useEffect(() => {
        localStorage.setItem('carrinho', JSON.stringify(itens))
    }, [itens])

    // Adiciona produto (ou aumenta quantidade se já existe)
    function adicionarItem(produto) {
        setItens(prev => {
            const existe = prev.find(i => i.id === produto.id)
            if (existe) {
                return prev.map(i =>
                    i.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i
                )
            }
            return [...prev, { ...produto, quantidade: 1 }]
        })
    }

    // Remove um produto completamente
    function removerItem(id) {
        setItens(prev => prev.filter(i => i.id !== id))
    }

    // Limpa o carrinho todo
    function limparCarrinho() {
        setItens([])
    }

    // Calcula o total
    const total = itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0)

    return (
        <CarrinhoContext.Provider value={{ itens, adicionarItem, removerItem, limparCarrinho, total }}>
            {children}
        </CarrinhoContext.Provider>
    )
}

// 3. Hook personalizado para usar o carrinho facilmente
export function useCarrinho() {
    return useContext(CarrinhoContext)
}