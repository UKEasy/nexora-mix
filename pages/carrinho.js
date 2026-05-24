import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Carrinho() {

  const router = useRouter();

  const [carrinho, setCarrinho] = useState([]);

  useEffect(() => {

    carregarCarrinho();

  }, []);

  function carregarCarrinho() {

    const dados = JSON.parse(
      localStorage.getItem("carrinho") || "[]"
    );

    setCarrinho(dados);
  }

  function atualizarCarrinho(novoCarrinho) {

    localStorage.setItem(
      "carrinho",
      JSON.stringify(novoCarrinho)
    );

    setCarrinho(novoCarrinho);
  }

  function aumentarQuantidade(id) {

    const novoCarrinho = carrinho.map((item) => {

      if (
        String(item.id) === String(id)
      ) {

        return {
          ...item,
          qtd: item.qtd + 1
        };

      }

      return item;

    });

    atualizarCarrinho(novoCarrinho);
  }

  function diminuirQuantidade(id) {

    let novoCarrinho = carrinho.map((item) => {

      if (
        String(item.id) === String(id)
      ) {

        return {
          ...item,
          qtd: item.qtd - 1
        };

      }

      return item;

    });

    novoCarrinho = novoCarrinho.filter(
      (item) => item.qtd > 0
    );

    atualizarCarrinho(novoCarrinho);
  }

  function removerProduto(id) {

    const novoCarrinho = carrinho.filter(
      (item) =>
        String(item.id) !== String(id)
    );

    atualizarCarrinho(novoCarrinho);
  }

  const total = carrinho.reduce(
    (acc, item) =>
      acc + Number(item.preco) * item.qtd,
    0
  );

  function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function limitarTexto(texto, tamanho) {
    const textoSeguro = String(texto || "");

    if (textoSeguro.length <= tamanho) {
      return textoSeguro.padEnd(tamanho, " ");
    }

    return `${textoSeguro.slice(0, tamanho - 3)}...`;
  }

  function montarLinhaTabela(item) {
    const nome = limitarTexto(item.nome, 18);
    const qtd = String(item.qtd).padStart(3, " ");
    const subtotal = formatarMoeda(
      Number(item.preco) * item.qtd
    ).padStart(12, " ");

    return `${nome} ${qtd} ${subtotal}`;
  }

  function finalizarPedido() {

    if (carrinho.length === 0) return;

    let mensagem =
      "🛒 *NOVO PEDIDO - NEXORA*%0A%0A";

    carrinho.forEach((item) => {

      mensagem +=
        `• ${item.nome} ` +
        `(x${item.qtd}) - ` +
        `R$ ${item.preco}%0A`;

    });

    mensagem += `%0A💰 Total: R$ ${total.toFixed(2)}`;

    const linhasProdutos = carrinho
      .map((item) => {
        const quantidade =
          item.qtd > 1 ? ` x${item.qtd}` : "";

        return (
          `🛍️ *${item.nome}${quantidade}*\n` +
          `   ${formatarMoeda(item.preco)} cada`
        );
      })
      .join("\n\n");

    mensagem = `
✨ *Pedido Nexora* ✨

${linhasProdutos}

💰 *Total:* ${formatarMoeda(total)}

💳 *Forma de pagamento desejada:*
Pix / Cartao / Dinheiro
`.trim();

    window.open(
      `https://wa.me/5519996645367?text=${encodeURIComponent(mensagem)}`,
      "_blank"
    );
  }

  return (

    <div style={styles.page}>

      {/* HEADER */}

      <header style={styles.header}>

        <div>

          <h1 style={styles.title}>
            Seu Carrinho
          </h1>

          <p style={styles.subtitle}>
            Revise seus produtos
          </p>

        </div>

        <button
          onClick={() => router.push("/")}
          style={styles.backBtn}
        >
          ← Voltar
        </button>

      </header>

      {/* LISTA */}

      <div style={styles.lista}>

        {carrinho.length === 0 && (

          <div style={styles.empty}>

            🛒 Seu carrinho está vazio

          </div>

        )}

        {carrinho.map((item) => (

          <div
            key={item.id}
            style={styles.card}
          >

            {/* FOTO */}

            <img
              src={item.img}
              style={styles.image}
            />

            {/* INFO */}

            <div style={styles.info}>

              <div>

                <p style={styles.category}>
                  {item.genero}
                </p>

                <h2 style={styles.name}>
                  {item.nome}
                </h2>

              </div>

              <div style={styles.bottom}>

                <div>

                  <p style={styles.price}>
                    R$ {item.preco}
                  </p>

                  <p style={styles.totalItem}>
                    Total: R${" "}
                    {(
                      Number(item.preco) *
                      item.qtd
                    ).toFixed(2)}
                  </p>

                </div>

                {/* QUANTIDADE */}

                <div style={styles.qtdArea}>

                  <button
                    style={styles.qtdBtn}
                    onClick={() =>
                      diminuirQuantidade(
                        item.id
                      )
                    }
                  >
                    −
                  </button>

                  <span style={styles.qtd}>
                    {item.qtd}
                  </span>

                  <button
                    style={styles.qtdBtn}
                    onClick={() =>
                      aumentarQuantidade(
                        item.id
                      )
                    }
                  >
                    +
                  </button>

                </div>

              </div>

              {/* REMOVER */}

              <button
                style={styles.removeBtn}
                onClick={() =>
                  removerProduto(item.id)
                }
              >
                Remover produto
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* FOOTER */}

      {carrinho.length > 0 && (

        <div style={styles.footer}>

          <div>

            <p style={styles.footerText}>
              Total
            </p>

            <h2 style={styles.footerTotal}>
              R$ {total.toFixed(2)}
            </h2>

          </div>

          <button
            style={styles.checkoutBtn}
            onClick={finalizarPedido}
          >
            Finalizar Pedido
          </button>

        </div>

      )}

    </div>

  );
}

const styles = {

  page: {
    minHeight: "100vh",
    background: "#050505",
    color: "#fff",
    fontFamily: "Arial",
    paddingBottom: 140
  },

  /* HEADER */

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "30px 40px",
    borderBottom:
      "1px solid rgba(255,255,255,0.06)"
  },

  title: {
    fontSize: 36,
    marginBottom: 8
  },

  subtitle: {
    opacity: 0.6
  },

  backBtn: {
    padding: "14px 22px",
    borderRadius: 14,
    border: "none",
    background: "#facc15",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer"
  },

  /* LISTA */

  lista: {
    padding: 40,
    display: "flex",
    flexDirection: "column",
    gap: 24
  },

  empty: {
    background:
      "rgba(255,255,255,0.04)",
    padding: 40,
    borderRadius: 24,
    textAlign: "center",
    fontSize: 18,
    opacity: 0.7
  },

  /* CARD */

  card: {
    display: "flex",
    gap: 24,
    background:
      "rgba(255,255,255,0.04)",
    border:
      "1px solid rgba(255,255,255,0.06)",
    borderRadius: 28,
    padding: 20,
    backdropFilter: "blur(20px)"
  },

  image: {
    width: 180,
    height: 180,
    objectFit: "cover",
    borderRadius: 20
  },

  info: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },

  category: {
    opacity: 0.5,
    textTransform: "uppercase",
    fontSize: 12,
    marginBottom: 10
  },

  name: {
    fontSize: 28
  },

  bottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20
  },

  price: {
    color: "#facc15",
    fontSize: 30,
    fontWeight: "bold"
  },

  totalItem: {
    opacity: 0.6,
    marginTop: 8
  },

  /* QUANTIDADE */

  qtdArea: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    background:
      "rgba(255,255,255,0.05)",
    padding: "10px 16px",
    borderRadius: 18
  },

  qtdBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    border: "none",
    background: "#facc15",
    color: "#000",
    fontSize: 22,
    fontWeight: "bold",
    cursor: "pointer"
  },

  qtd: {
    fontSize: 20,
    fontWeight: "bold",
    minWidth: 20,
    textAlign: "center"
  },

  /* REMOVER */

  removeBtn: {
    marginTop: 20,
    background: "transparent",
    border: "1px solid rgba(255,0,0,0.3)",
    color: "#ff5c5c",
    padding: "12px 18px",
    borderRadius: 14,
    cursor: "pointer",
    width: "fit-content"
  },



  /* FOOTER */

  footer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "rgba(0,0,0,0.9)",
    backdropFilter: "blur(20px)",
    borderTop:
      "1px solid rgba(255,255,255,0.08)",
    padding: "24px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  footerText: {
    opacity: 0.6,
    marginBottom: 6
  },

  footerTotal: {
    color: "#facc15",
    fontSize: 34
  },

  checkoutBtn: {
    background: "#facc15",
    color: "#000",
    border: "none",
    padding: "18px 34px",
    borderRadius: 18,
    fontSize: 18,
    fontWeight: "bold",
    cursor: "pointer"
  }

};
