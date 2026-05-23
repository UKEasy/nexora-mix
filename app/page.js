"use client";

import { useState } from "react";

export default function Home() {

  const [carrinho, setCarrinho] = useState([]);

  const produtos = [
    {
      nome: "Asad Bourbon",
      preco: 330,
      categoria: "Masculino",
      sku: "PERF-M-001",
      imagem: "/produtos/asad.jpg"
    },

    {
      nome: "Yara",
      preco: 299,
      categoria: "Feminino",
      sku: "PERF-F-001",
      imagem: "/produtos/yara.jpg"
    }
  ];

  function adicionarCarrinho(produto) {
    setCarrinho([...carrinho, produto]);
  }

  const total = carrinho.reduce(
    (acc, item) => acc + item.preco,
    0
  );

  function finalizarPedido() {

    let mensagem = "🛒 *NOVO PEDIDO*%0A%0A";

    carrinho.forEach((item) => {
      mensagem += `• ${item.nome} - R$ ${item.preco}%0A`;
    });

    mensagem += `%0A💰 *Total:* R$ ${total}`;

    window.open(
      `https://wa.me/5519989212646?text=${mensagem}`,
      "_blank"
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">

      <h1 className="text-5xl font-black text-yellow-400 mb-10">
        LUX STORE
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {produtos.map((produto, index) => (

          <div
            key={index}
            className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800"
          >

            <div className="h-72 bg-zinc-800">

              <img
                src={produto.imagem}
                alt={produto.nome}
                className="w-full h-full object-cover"
              />

            </div>

            <div className="p-6">

              <h2 className="text-3xl font-bold">
                {produto.nome}
              </h2>

              <p className="text-zinc-500 mt-2">
                {produto.categoria}
              </p>

              <p className="text-yellow-400 text-3xl font-black mt-5">
                R$ {produto.preco}
              </p>

              <button
                onClick={() => adicionarCarrinho(produto)}
                className="w-full bg-yellow-500 text-black py-4 rounded-2xl font-bold mt-6"
              >
                Adicionar ao Carrinho
              </button>

            </div>

          </div>

        ))}

      </div>

      <div className="bg-zinc-900 mt-14 p-8 rounded-3xl">

        <h2 className="text-4xl font-black mb-6">
          Carrinho
        </h2>

        {carrinho.map((item, index) => (

          <divgit init
            key={index}
            className="flex justify-between py-3 border-b border-zinc-800"
          >

            <span>
              {item.nome}
            </span>

            <span>
              R$ {item.preco}
            </span>

          </div>

        ))}

        <h3 className="text-3xl font-black mt-8">
          Total: R$ {total}
        </h3>

        <button
          onClick={finalizarPedido}
          className="w-full bg-green-500 py-5 rounded-2xl text-black font-black text-xl mt-8"
        >
          Fazer Pedido no WhatsApp
        </button>

      </div>

    </main>
  );
}