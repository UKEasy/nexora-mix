"use client";

import { useState } from "react";

export default function Home() {

  const [carrinho, setCarrinho] = useState([]);
  const [pagamento, setPagamento] = useState("PIX");

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

  function removerCarrinho(index) {
    const novoCarrinho = [...carrinho];
    novoCarrinho.splice(index, 1);
    setCarrinho(novoCarrinho);
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
    mensagem += `%0A💳 *Pagamento:* ${pagamento}`;

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

      {/* PRODUTOS */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {produtos.map((produto, index) => {

          return (

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

          );

        })}

      </div>

      {/* CARRINHO */}

      <div className="bg-zinc-900 mt-14 p-8 rounded-3xl">

        <h2 className="text-4xl font-black mb-6">
          Carrinho
        </h2>

        {carrinho.length === 0 ? (

          <p className="text-zinc-500">
            Nenhum produto no carrinho.
          </p>

        ) : (

          <>

            {carrinho.map((item, index) => {

              return (

                <div
                  key={index}
                  className="flex justify-between items-center py-4 border-b border-zinc-800"
                >

                  <div>

                    <h3 className="font-bold text-xl">
                      {item.nome}
                    </h3>

                    <p className="text-zinc-500 text-sm">
                      {item.sku}
                    </p>

                  </div>

                  <div className="flex items-center gap-4">

                    <span className="text-yellow-400 font-bold">
                      R$ {item.preco}
                    </span>

                    <button
                      onClick={() => removerCarrinho(index)}
                      className="bg-red-500 px-4 py-2 rounded-xl font-bold"
                    >
                      Remover
                    </button>

                  </div>

                </div>

              );

            })}

            {/* PAGAMENTO */}

            <div className="mt-8">

              <h3 className="text-2xl font-black mb-4">
                Forma de Pagamento
              </h3>

              <select
                value={pagamento}
                onChange={(e) => setPagamento(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4"
              >

                <option value="PIX">
                  PIX
                </option>

                <option value="Dinheiro">
                  Dinheiro
                </option>

                <option value="Cartão">
                  Cartão
                </option>

              </select>

            </div>

            {/* TOTAL */}

            <h3 className="text-3xl font-black mt-8">
              Total: R$ {total}
            </h3>

            {/* BOTÃO */}

            <button
              onClick={finalizarPedido}
              className="w-full bg-green-500 py-5 rounded-2xl text-black font-black text-xl mt-8"
            >
              Fazer Pedido no WhatsApp
            </button>

          </>

        )}

      </div>

    </main>
  );
}