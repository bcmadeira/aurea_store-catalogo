'use client'

import { useCarrinho } from '@/context/CarrinhoContext'

// Número do WhatsApp da sua amiga (só números, com código do país)
const WHATSAPP_NUMERO = '5544984472117'

export default function Carrinho({ onFechar }) {
    const { itens, removerItem, limparCarrinho, total } = useCarrinho()

    function finalizarPedido() {
        if (itens.length === 0) return

        // Monta a mensagem
        const linhas = itens.map(item =>
            `• ${item.nome} (x${item.quantidade}) — R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}`
        )

        const mensagem = [
            'Olá! Gostaria de fazer um pedido:',
            '',
            ...linhas,
            '',
            `*Total: R$ ${total.toFixed(2).replace('.', ',')}*`,
            '',
            'Aguardo confirmação e prazo de entrega. Obrigado(a)! 😊'
        ].join('\n')

        // Abre o WhatsApp
        const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`
        window.open(url, '_blank')
    }

    return (
        <>
            {/* Overlay escuro atrás do carrinho */}
            <div
                className="fixed inset-0 bg-black bg-opacity-40 z-20"
                onClick={onFechar}
            />

            {/* Painel do carrinho */}
            <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-30 shadow-xl flex flex-col">
                {/* Cabeçalho */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-bold">Seu carrinho</h2>
                    <button onClick={onFechar} className="text-gray-500 hover:text-gray-800 text-xl">
                        ✕
                    </button>
                </div>

                {/* Lista de itens */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {itens.length === 0 ? (
                        <p className="text-center text-gray-400 mt-8">Seu carrinho está vazio.</p>
                    ) : (
                        itens.map(item => (
                            <div key={item.id} className="flex gap-3 items-start">
                                {item.foto_url && (
                                    <img
                                        src={item.foto_url}
                                        alt={item.nome}
                                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                    />
                                )}
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800 text-sm">{item.nome}</p>
                                    <p className="text-gray-500 text-sm">
                                        {item.quantidade}x — R$ {(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
                                    </p>
                                </div>
                                <button
                                    onClick={() => removerItem(item.id)}
                                    className="text-gray-400 hover:text-red-500 text-sm"
                                >
                                    Remover
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Rodapé com total e botão */}
                {itens.length > 0 && (
                    <div className="border-t p-4 space-y-3">
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <button
                            onClick={finalizarPedido}
                            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
                        >
                            📱 Finalizar pelo WhatsApp
                        </button>
                        <button
                            onClick={limparCarrinho}
                            className="w-full text-gray-400 text-sm hover:text-gray-600"
                        >
                            Limpar carrinho
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}