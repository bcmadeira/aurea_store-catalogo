import { CarrinhoProvider } from '../context/CarrinhoContext'
import './globals.css'

export const metadata = {
  title: 'Auera — Artesanatos',
  description: 'Catálogo de artesanatos feitos à mão sob demanda',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <CarrinhoProvider>
          {children}
        </CarrinhoProvider>
      </body>
    </html>
  )
}