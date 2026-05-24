import { useState } from "react";
import { useRouter } from "next/router";

const WHATSAPP_NUMBER = "5519989212646";

const pagamentoOpcoes = [
  "Pix",
  "Cartão",
  "Dinheiro"
];

function lerCarrinhoSalvo() {
  if (typeof window === "undefined") {
    return [];
  }

  return JSON.parse(
    localStorage.getItem("carrinho") || "[]"
  );
}

export default function Carrinho() {

  const router = useRouter();

  const [carrinho, setCarrinho] =
    useState(lerCarrinhoSalvo);
  const [pagamento, setPagamento] = useState("Pix");
  const [entrega, setEntrega] = useState("retirada");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [tipoResidencia, setTipoResidencia] = useState("casa");
  const [complemento, setComplemento] = useState("");
  const [apto, setApto] = useState("");
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [cepStatus, setCepStatus] = useState("");
  const [erroCheckout, setErroCheckout] = useState("");

  function atualizarCarrinho(novoCarrinho) {
    localStorage.setItem(
      "carrinho",
      JSON.stringify(novoCarrinho)
    );

    setCarrinho(novoCarrinho);
  }

  function aumentarQuantidade(id) {
    const novoCarrinho = carrinho.map((item) => {
      if (String(item.id) === String(id)) {
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
      if (String(item.id) === String(id)) {
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

  function limparCep(valor) {
    return valor.replace(/\D/g, "").slice(0, 8);
  }

  function atualizarCep(valor) {
    setCep(limparCep(valor));
    setCepStatus("");
  }

  async function buscarCep() {
    const cepLimpo = limparCep(cep);

    if (cepLimpo.length !== 8) {
      setCepStatus("Digite um CEP com 8 números.");
      return;
    }

    setBuscandoCep(true);
    setCepStatus("Buscando endereço...");

    try {
      const resposta = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );
      const dados = await resposta.json();

      if (dados.erro) {
        setCepStatus("CEP não encontrado. Digite o endereço manualmente.");
        return;
      }

      setEndereco(
        [
          dados.logradouro,
          dados.bairro,
          dados.localidade,
          dados.uf
        ]
          .filter(Boolean)
          .join(", ")
      );
      setCepStatus("Endereço encontrado. Complete o número.");
    } catch {
      setCepStatus("Não consegui buscar o CEP. Digite o endereço manualmente.");
    } finally {
      setBuscandoCep(false);
    }
  }

  function validarCheckout() {
    if (carrinho.length === 0) {
      return "Seu carrinho está vazio.";
    }

    if (!pagamento) {
      return "Escolha uma forma de pagamento.";
    }

    if (entrega === "tele") {
      if (!endereco.trim()) {
        return "Informe o endereço da entrega.";
      }

      if (!numero.trim()) {
        return "Informe o número da casa ou prédio.";
      }

      if (tipoResidencia === "apartamento" && !apto.trim()) {
        return "Informe o número do apartamento.";
      }
    }

    return "";
  }

  function montarResumoProdutos() {
    return carrinho
      .map((item) => {
        const quantidade =
          item.qtd > 1 ? `  x${item.qtd}` : "";

        return (
          `🛍️ *${item.nome}*${quantidade}\n` +
          `   💵 ${formatarMoeda(item.preco)} cada`
        );
      })
      .join("\n\n");
  }

  function montarResumoEntrega() {
    if (entrega === "retirada") {
      return "🏬 *Entrega:* Retirada em loja";
    }

    const linhas = [
      "🛵 *Entrega:* Tele-entrega",
      cep ? `📍 *CEP:* ${cep}` : "",
      `📌 *Endereço:* ${endereco}`,
      `🏠 *Número:* ${numero}`,
      `🏡 *Tipo:* ${tipoResidencia === "apartamento" ? "Apartamento" : "Casa"}`
    ];

    if (tipoResidencia === "apartamento") {
      linhas.push(`🚪 *Apto:* ${apto}`);
    }

    if (complemento.trim()) {
      linhas.push(`📝 *Complemento:* ${complemento}`);
    }

    return linhas.filter(Boolean).join("\n");
  }

  function finalizarPedido() {
    const erro = validarCheckout();

    if (erro) {
      setErroCheckout(erro);
      return;
    }

    setErroCheckout("");

    const mensagem = `
✨ *NEXORA | Novo pedido* ✨
━━━━━━━━━━━━━━━━━━━━

🛒 *Produtos escolhidos*
${montarResumoProdutos()}

━━━━━━━━━━━━━━━━━━━━
💰 *Total do pedido:* ${formatarMoeda(total)}
💳 *Pagamento desejado:* ${pagamento}

${montarResumoEntrega()}

✅ Aguardo a confirmação, obrigado!
`.trim();

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`,
      "_blank"
    );
  }

  return (

    <div
      className="cart-page"
      style={styles.page}
    >

      <style jsx global>{`
        @media (max-width: 980px) {
          .cart-header,
          .cart-footer {
            padding-left: 22px !important;
            padding-right: 22px !important;
          }

          .cart-content {
            grid-template-columns: 1fr !important;
            padding: 24px !important;
          }

          .cart-checkout {
            position: static !important;
          }
        }

        @media (max-width: 640px) {
          .cart-page {
            padding-bottom: 210px !important;
          }

          .cart-header {
            align-items: flex-start !important;
            flex-direction: column !important;
          }

          .cart-title {
            font-size: 30px !important;
          }

          .cart-back {
            width: 100% !important;
          }

          .cart-card {
            flex-direction: column !important;
          }

          .cart-image {
            width: 100% !important;
            height: 230px !important;
          }

          .cart-bottom {
            align-items: flex-start !important;
            flex-direction: column !important;
          }

          .cart-cep-row,
          .cart-apto-grid {
            grid-template-columns: 1fr !important;
          }

          .cart-footer {
            align-items: stretch !important;
            flex-direction: column !important;
          }

          .cart-checkout-btn {
            width: 100% !important;
          }
        }
      `}</style>

      <header
        className="cart-header"
        style={styles.header}
      >

        <div>

          <h1
            className="cart-title"
            style={styles.title}
          >
            Seu Carrinho
          </h1>

          <p style={styles.subtitle}>
            Revise seus produtos e escolha a entrega
          </p>

        </div>

        <button
          className="cart-back"
          onClick={() => router.push("/")}
          style={styles.backBtn}
        >
          ← Voltar
        </button>

      </header>

      <main
        className="cart-content"
        style={styles.content}
      >

        <section style={styles.lista}>

          {carrinho.length === 0 && (

            <div style={styles.empty}>
              🛒 Seu carrinho está vazio
            </div>

          )}

          {carrinho.map((item) => (

            <div
              className="cart-card"
              key={item.id}
              style={styles.card}
            >

              <img
                className="cart-image"
                src={item.img}
                alt={item.nome}
                style={styles.image}
              />

              <div style={styles.info}>

                <div>

                  <p style={styles.category}>
                    {item.genero}
                  </p>

                  <h2 style={styles.name}>
                    {item.nome}
                  </h2>

                </div>

                <div
                  className="cart-bottom"
                  style={styles.bottom}
                >

                  <div>

                    <p style={styles.price}>
                      {formatarMoeda(item.preco)}
                    </p>

                    <p style={styles.totalItem}>
                      Total:{" "}
                      {formatarMoeda(
                        Number(item.preco) *
                        item.qtd
                      )}
                    </p>

                  </div>

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

        </section>

        {carrinho.length > 0 && (

          <aside
            className="cart-checkout"
            style={styles.checkoutPanel}
          >

            <div>

              <p style={styles.sectionLabel}>
                Pagamento
              </p>

              <div style={styles.optionGrid}>

                {pagamentoOpcoes.map((opcao) => (

                  <button
                    key={opcao}
                    style={
                      pagamento === opcao
                        ? styles.optionActive
                        : styles.option
                    }
                    onClick={() =>
                      setPagamento(opcao)
                    }
                  >
                    {opcao}
                  </button>

                ))}

              </div>

            </div>

            <div>

              <p style={styles.sectionLabel}>
                Entrega
              </p>

              <div style={styles.optionGrid}>

                <button
                  style={
                    entrega === "retirada"
                      ? styles.optionActive
                      : styles.option
                  }
                  onClick={() =>
                    setEntrega("retirada")
                  }
                >
                  Retirada
                </button>

                <button
                  style={
                    entrega === "tele"
                      ? styles.optionActive
                      : styles.option
                  }
                  onClick={() =>
                    setEntrega("tele")
                  }
                >
                  Tele
                </button>

              </div>

            </div>

            {entrega === "tele" && (

              <div style={styles.addressBox}>

                <p style={styles.sectionLabel}>
                  Endereço
                </p>

                <div
                  className="cart-cep-row"
                  style={styles.cepRow}
                >

                  <input
                    value={cep}
                    onChange={(event) =>
                      atualizarCep(event.target.value)
                    }
                    placeholder="CEP"
                    inputMode="numeric"
                    style={styles.input}
                  />

                  <button
                    onClick={buscarCep}
                    disabled={buscandoCep}
                    style={styles.secondaryBtn}
                  >
                    {buscandoCep ? "Buscando" : "Buscar"}
                  </button>

                </div>

                {cepStatus && (

                  <p style={styles.hint}>
                    {cepStatus}
                  </p>

                )}

                <textarea
                  value={endereco}
                  onChange={(event) =>
                    setEndereco(event.target.value)
                  }
                  placeholder="Endereço completo"
                  rows={3}
                  style={styles.textarea}
                />

                <input
                  value={numero}
                  onChange={(event) =>
                    setNumero(event.target.value)
                  }
                  placeholder="Número da casa/prédio"
                  style={styles.input}
                />

                <div style={styles.optionGrid}>

                  <button
                    style={
                      tipoResidencia === "casa"
                        ? styles.optionActive
                        : styles.option
                    }
                    onClick={() =>
                      setTipoResidencia("casa")
                    }
                  >
                    Casa
                  </button>

                  <button
                    style={
                      tipoResidencia === "apartamento"
                        ? styles.optionActive
                        : styles.option
                    }
                    onClick={() =>
                      setTipoResidencia("apartamento")
                    }
                  >
                    Apartamento
                  </button>

                </div>

                {tipoResidencia === "apartamento" && (

                  <div
                    className="cart-apto-grid"
                    style={styles.aptoGrid}
                  >

                    <input
                      value={apto}
                      onChange={(event) =>
                        setApto(event.target.value)
                      }
                      placeholder="Nº do apto"
                      style={styles.input}
                    />

                    <input
                      value={complemento}
                      onChange={(event) =>
                        setComplemento(event.target.value)
                      }
                      placeholder="Complemento"
                      style={styles.input}
                    />

                  </div>

                )}

                {tipoResidencia === "casa" && (

                  <input
                    value={complemento}
                    onChange={(event) =>
                      setComplemento(event.target.value)
                    }
                    placeholder="Complemento (opcional)"
                    style={styles.input}
                  />

                )}

              </div>

            )}

            {erroCheckout && (

              <p style={styles.errorText}>
                {erroCheckout}
              </p>

            )}

          </aside>

        )}

      </main>

      {carrinho.length > 0 && (

        <div
          className="cart-footer"
          style={styles.footer}
        >

          <div>

            <p style={styles.footerText}>
              Total
            </p>

            <h2 style={styles.footerTotal}>
              {formatarMoeda(total)}
            </h2>

          </div>

          <button
            className="cart-checkout-btn"
            style={styles.checkoutBtn}
            onClick={finalizarPedido}
          >
            Finalizar no WhatsApp
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
    fontFamily: "Arial, Helvetica, sans-serif",
    paddingBottom: 150
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
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

  content: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1fr) minmax(320px, 420px)",
    gap: 28,
    padding: 40,
    alignItems: "start"
  },

  lista: {
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
    justifyContent: "space-between",
    minWidth: 0
  },

  category: {
    opacity: 0.5,
    textTransform: "uppercase",
    fontSize: 12,
    marginBottom: 10
  },

  name: {
    fontSize: 28,
    lineHeight: 1.2
  },

  bottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 18,
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

  checkoutPanel: {
    position: "sticky",
    top: 22,
    display: "flex",
    flexDirection: "column",
    gap: 24,
    background:
      "rgba(255,255,255,0.04)",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: 28,
    padding: 24,
    backdropFilter: "blur(20px)"
  },

  sectionLabel: {
    color: "#facc15",
    fontWeight: "bold",
    marginBottom: 12,
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 1
  },

  optionGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(96px, 1fr))",
    gap: 10
  },

  option: {
    minHeight: 46,
    borderRadius: 14,
    border:
      "1px solid rgba(255,255,255,0.09)",
    background:
      "rgba(255,255,255,0.05)",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer"
  },

  optionActive: {
    minHeight: 46,
    borderRadius: 14,
    border: "none",
    background: "#facc15",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer"
  },

  addressBox: {
    display: "flex",
    flexDirection: "column",
    gap: 12
  },

  cepRow: {
    display: "grid",
    gridTemplateColumns: "1fr 105px",
    gap: 10
  },

  input: {
    width: "100%",
    minHeight: 48,
    borderRadius: 14,
    border:
      "1px solid rgba(255,255,255,0.08)",
    background:
      "rgba(255,255,255,0.06)",
    color: "#fff",
    padding: "0 14px",
    fontSize: 15,
    outline: "none"
  },

  textarea: {
    width: "100%",
    borderRadius: 14,
    border:
      "1px solid rgba(255,255,255,0.08)",
    background:
      "rgba(255,255,255,0.06)",
    color: "#fff",
    padding: 14,
    fontSize: 15,
    outline: "none",
    resize: "vertical",
    fontFamily: "Arial, Helvetica, sans-serif"
  },

  secondaryBtn: {
    minHeight: 48,
    borderRadius: 14,
    border: "none",
    background:
      "rgba(250,204,21,0.16)",
    color: "#facc15",
    fontWeight: "bold",
    cursor: "pointer"
  },

  hint: {
    color: "#facc15",
    opacity: 0.85,
    fontSize: 13
  },

  aptoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10
  },

  errorText: {
    color: "#ff7a7a",
    background:
      "rgba(255,0,0,0.08)",
    border:
      "1px solid rgba(255,0,0,0.18)",
    borderRadius: 14,
    padding: 12,
    fontWeight: "bold"
  },

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
    alignItems: "center",
    gap: 20
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
