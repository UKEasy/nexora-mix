import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  eletronicosDestaque,
  eletronicosMaio,
  perfumesDestaque,
  perfumesMaio,
  produtosMaio
} from "../lib/produtosMaio";
import { supabase } from "../lib/supabase";

const generoOpcoes = [
  { id: "todos", label: "Todos" },
  { id: "feminino", label: "Feminino" },
  { id: "masculino", label: "Masculino" },
  { id: "unisex", label: "Unisex" }
];

function contarItensCarrinho() {
  if (typeof window === "undefined")
    return 0;

  const carrinho = JSON.parse(
    localStorage.getItem("carrinho") || "[]"
  );

  return carrinho.reduce(
    (total, item) => total + item.qtd,
    0
  );
}

function formatarMoeda(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function labelGenero(genero) {
  if (genero === "feminino") return "Feminino";
  if (genero === "masculino") return "Masculino";
  if (genero === "unisex") return "Unisex";
  return "Eletrônico";
}

function normalizarNome(nome) {
  return String(nome || "")
    .trim()
    .toLowerCase();
}

function correspondeBusca(produto, termo) {
  if (!termo) return true;

  return [
    produto.nome,
    produto.tipo,
    produto.genero,
    produto.categoria
  ]
    .filter(Boolean)
    .some((valor) =>
      normalizarNome(valor).includes(termo)
    );
}

export default function Home() {

  const router = useRouter();

  const [view, setView] = useState("destaques");
  const [genero, setGenero] = useState("todos");
  const [busca, setBusca] = useState("");
  const [carrinhoQtd, setCarrinhoQtd] =
    useState(contarItensCarrinho);
  const [alerta, setAlerta] =
    useState("");
  const [fotosProdutos, setFotosProdutos] =
    useState({});

  const termoBusca = busca
    .trim()
    .toLowerCase();

  useEffect(() => {
    async function carregarFotosProdutos() {
      const { data } = await supabase
        .from("produtos")
        .select("nome,img");

      const fotos = {};

      (data || []).forEach((produto) => {
        if (produto.nome && produto.img) {
          fotos[normalizarNome(produto.nome)] = produto.img;
        }
      });

      setFotosProdutos(fotos);
    }

    carregarFotosProdutos();
  }, []);

  const perfumesFiltrados = useMemo(() => {
    return perfumesMaio.filter((produto) => {
      const combinaGenero =
        genero === "todos" ||
        produto.genero === genero;

      return combinaGenero;
    });
  }, [genero]);

  const produtosEncontrados = useMemo(() => {
    return produtosMaio.filter((produto) =>
      correspondeBusca(produto, termoBusca)
    );
  }, [termoBusca]);

  function atualizarCarrinho() {
    setCarrinhoQtd(contarItensCarrinho());
  }

  function adicionarCarrinho(produto) {
    const carrinho = JSON.parse(
      localStorage.getItem("carrinho") || "[]"
    );

    const existe = carrinho.find(
      (item) =>
        String(item.id) === String(produto.id)
    );

    const novoCarrinho = existe
      ? carrinho.map((item) => {
          if (String(item.id) === String(produto.id)) {
            return {
              ...item,
              qtd: item.qtd + 1
            };
          }

          return item;
        })
      : [
          ...carrinho,
          {
            ...produto,
            qtd: 1
          }
        ];

    localStorage.setItem(
      "carrinho",
      JSON.stringify(novoCarrinho)
    );

    atualizarCarrinho();
    setAlerta("Produto adicionado ao carrinho");

    setTimeout(() => {
      setAlerta("");
    }, 2000);
  }

  function abrirView(novaView) {
    setView(novaView);
    setBusca("");

    if (novaView !== "perfumes") {
      setGenero("todos");
    }
  }

  function obterFotoProduto(produto) {
    return (
      fotosProdutos[normalizarNome(produto.nome)] ||
      produto.img ||
      ""
    );
  }

  function renderCard(produto) {
    const fotoProduto = obterFotoProduto(produto);

    return (

      <article
        key={produto.id}
        className="product-card"
        style={styles.card}
      >

        <div
          style={
            fotoProduto
              ? {
                  ...styles.photoArea,
                  backgroundImage:
                    `linear-gradient(to bottom, rgba(0,0,0,0.03), rgba(0,0,0,0.45)), url("${fotoProduto.replace(/"/g, "%22")}")`
                }
              : styles.visualArea
          }
        >

          <div
            style={{
              ...styles.visualOrb,
              display: fotoProduto ? "none" : "flex",
              background:
                produto.categoria === "eletronicos"
                  ? "linear-gradient(135deg,#38bdf8,#facc15)"
                  : "linear-gradient(135deg,#facc15,#f472b6)"
            }}
          >
            {produto.categoria === "eletronicos" ? "⌁" : "N"}
          </div>

        </div>

        <div style={styles.cardContent}>

          <div style={styles.metaRow}>
            <span style={styles.category}>
              {produto.tipo}
            </span>

            <span style={styles.gender}>
              {labelGenero(produto.genero)}
            </span>
          </div>

          <h2 style={styles.cardTitle}>
            {produto.nome}
          </h2>

          <div style={styles.cardBottom}>

            <div style={styles.price}>
              {formatarMoeda(produto.preco)}
            </div>

            <button
              style={styles.buyBtn}
              onClick={() =>
                adicionarCarrinho({
                  ...produto,
                  img: fotoProduto
                })
              }
              aria-label={`Adicionar ${produto.nome} ao carrinho`}
            >
              +
            </button>

          </div>

        </div>

      </article>

    );
  }

  return (

    <div
      className="home-page"
      style={styles.page}
    >

      <style jsx global>{`
        @media (max-width: 920px) {
          .home-header {
            align-items: flex-start !important;
            flex-direction: column !important;
            padding: 20px 22px !important;
          }

          .home-nav,
          .perfume-tabs {
            width: 100% !important;
            overflow-x: auto !important;
            padding-bottom: 4px !important;
          }

          .home-cart {
            position: absolute !important;
            top: 20px !important;
            right: 22px !important;
          }

          .home-hero {
            padding: 54px 22px 34px !important;
          }

          .home-title {
            font-size: 42px !important;
            line-height: 1.08 !important;
          }

          .home-section {
            padding: 0 22px !important;
          }

          .filter-row {
            align-items: stretch !important;
            flex-direction: column !important;
          }

          .search-input {
            width: 100% !important;
          }
        }

        @media (max-width: 560px) {
          .home-logo-icon {
            width: 46px !important;
            height: 46px !important;
          }

          .home-logo {
            font-size: 24px !important;
          }

          .home-cart {
            width: 48px !important;
            height: 48px !important;
            border-radius: 15px !important;
          }

          .home-nav button,
          .perfume-tabs button {
            white-space: nowrap !important;
          }

          .home-title {
            font-size: 34px !important;
          }

          .home-grid {
            grid-template-columns: 1fr !important;
            gap: 18px !important;
          }

          .product-card {
            border-radius: 20px !important;
          }
        }
      `}</style>

      {alerta && (

        <div style={styles.alertaWrapper}>

          <div style={styles.alerta}>
            ✅ {alerta}
          </div>

        </div>

      )}

      <header
        className="home-header"
        style={styles.header}
      >

        <div style={styles.logoArea}>

          <div
            className="home-logo-icon"
            style={styles.logoIcon}
          >
            N
          </div>

          <div>

            <h1
              className="home-logo"
              style={styles.logo}
            >
              NEXORA
            </h1>

            <p style={styles.logoSub}>
              maio collection
            </p>

          </div>

        </div>

        <nav
          className="home-nav"
          style={styles.navButtons}
        >

          <button
            onClick={() =>
              abrirView("destaques")
            }
            style={
              view === "destaques"
                ? styles.activeNav
                : styles.nav
            }
          >
            Destaques
          </button>

          <button
            onClick={() =>
              abrirView("perfumes")
            }
            style={
              view === "perfumes"
                ? styles.activeNav
                : styles.nav
            }
          >
            Perfumes
          </button>

          <button
            onClick={() =>
              abrirView("eletronicos")
            }
            style={
              view === "eletronicos"
                ? styles.activeNav
                : styles.nav
            }
          >
            Eletrônicos
          </button>

        </nav>

        <button
          className="home-cart"
          style={styles.cart}
          onClick={() =>
            router.push("/carrinho")
          }
          aria-label="Abrir carrinho"
        >

          🛒

          {carrinhoQtd > 0 && (

            <span style={styles.cartBadge}>
              {carrinhoQtd}
            </span>

          )}

        </button>

      </header>

      <section
        className="home-hero"
        style={styles.hero}
      >

        <div style={styles.badge}>
          PLANILHA MAIO 2026
        </div>

        <h1
          className="home-title"
          style={styles.heroTitle}
        >
          Perfumes e tecnologia selecionados
        </h1>

        <p style={styles.heroText}>
          Vitrine atualizada com os produtos de maio.
        </p>

      </section>

      <section
        className="home-section"
        style={styles.searchPanel}
      >

        <input
          className="search-input"
          value={busca}
          onChange={(event) =>
            setBusca(event.target.value)
          }
          placeholder="Pesquisar produto"
          style={styles.searchWide}
        />

        <span style={styles.searchHelp}>
          Busque por nome, categoria ou tipo
        </span>

      </section>

      {termoBusca && (

        <main
          className="home-section"
          style={styles.productsSection}
        >

          <div style={styles.sectionHeader}>

            <div>

              <p style={styles.sectionEyebrow}>
                Resultado da busca
              </p>

              <h2 style={styles.sectionTitle}>
                Produtos encontrados
              </h2>

            </div>

            <span style={styles.countPill}>
              {produtosEncontrados.length} itens
            </span>

          </div>

          {produtosEncontrados.length > 0 ? (

            <div
              className="home-grid"
              style={styles.grid}
            >
              {produtosEncontrados.map(renderCard)}
            </div>

          ) : (

            <div style={styles.emptySearch}>
              Nenhum produto encontrado.
            </div>

          )}

        </main>

      )}

      {!termoBusca && view === "destaques" && (

        <main
          className="home-section"
          style={styles.productsSection}
        >

          <section style={styles.block}>

            <div style={styles.sectionHeader}>

              <div>

                <p style={styles.sectionEyebrow}>
                  Produtos destaques
                </p>

                <h2 style={styles.sectionTitle}>
                  Perfumes
                </h2>

              </div>

              <span style={styles.countPill}>
                4 itens
              </span>

            </div>

            <div
              className="home-grid"
              style={styles.grid}
            >
              {perfumesDestaque.map(renderCard)}
            </div>

          </section>

          <section style={styles.block}>

            <div style={styles.sectionHeader}>

              <div>

                <p style={styles.sectionEyebrow}>
                  Produtos destaques
                </p>

                <h2 style={styles.sectionTitle}>
                  Eletrônicos
                </h2>

              </div>

              <span style={styles.countPill}>
                4 itens
              </span>

            </div>

            <div
              className="home-grid"
              style={styles.grid}
            >
              {eletronicosDestaque.map(renderCard)}
            </div>

          </section>

        </main>

      )}

      {!termoBusca && view === "perfumes" && (

        <main
          className="home-section"
          style={styles.productsSection}
        >

          <div style={styles.sectionHeader}>

            <div>

              <p style={styles.sectionEyebrow}>
                Perfumes de maio
              </p>

              <h2 style={styles.sectionTitle}>
                Busque e filtre por gênero
              </h2>

            </div>

            <span style={styles.countPill}>
              {perfumesFiltrados.length} itens
            </span>

          </div>

          <div
            className="filter-row"
            style={styles.filterRow}
          >

            <div
              className="perfume-tabs"
              style={styles.tabs}
            >

              {generoOpcoes.map((opcao) => (

                <button
                  key={opcao.id}
                  onClick={() =>
                    setGenero(opcao.id)
                  }
                  style={
                    genero === opcao.id
                      ? styles.activeTab
                      : styles.tab
                  }
                >
                  {opcao.label}
                </button>

              ))}

            </div>

          </div>

          <div
            className="home-grid"
            style={styles.grid}
          >
            {perfumesFiltrados.map(renderCard)}
          </div>

        </main>

      )}

      {!termoBusca && view === "eletronicos" && (

        <main
          className="home-section"
          style={styles.productsSection}
        >

          <div style={styles.sectionHeader}>

            <div>

              <p style={styles.sectionEyebrow}>
                Eletrônicos de maio
              </p>

              <h2 style={styles.sectionTitle}>
                Smartwatches e joysticks
              </h2>

            </div>

            <span style={styles.countPill}>
              {eletronicosMaio.length} itens
            </span>

          </div>

          <div
            className="home-grid"
            style={styles.grid}
          >
            {eletronicosMaio.map(renderCard)}
          </div>

        </main>

      )}

    </div>

  );
}

const styles = {

  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(to bottom,#050505,#111)",
    color: "#fff",
    fontFamily: "Arial, Helvetica, sans-serif",
    paddingBottom: 80
  },

  alertaWrapper: {
    position: "fixed",
    top: 40,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    zIndex: 9999,
    pointerEvents: "none"
  },

  alerta: {
    background:
      "linear-gradient(135deg,#facc15,#fde047)",
    color: "#000",
    padding: "16px 28px",
    borderRadius: 16,
    fontWeight: "bold",
    boxShadow:
      "0 15px 35px rgba(0,0,0,0.35)"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    padding: "22px 40px",
    position: "sticky",
    top: 0,
    zIndex: 999,
    backdropFilter: "blur(15px)",
    background: "rgba(0,0,0,0.68)",
    borderBottom:
      "1px solid rgba(255,255,255,0.06)"
  },

  logoArea: {
    display: "flex",
    alignItems: "center",
    gap: 14
  },

  logoIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    background:
      "linear-gradient(135deg,#facc15,#fde047)",
    color: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: 24
  },

  logo: {
    margin: 0,
    color: "#facc15",
    fontSize: 28
  },

  logoSub: {
    margin: 0,
    opacity: 0.5,
    fontSize: 12,
    letterSpacing: 2
  },

  navButtons: {
    display: "flex",
    gap: 12
  },

  nav: {
    minHeight: 44,
    padding: "0 18px",
    borderRadius: 14,
    border:
      "1px solid rgba(255,255,255,0.08)",
    background:
      "rgba(255,255,255,0.05)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold"
  },

  activeNav: {
    minHeight: 44,
    padding: "0 18px",
    borderRadius: 14,
    border: "none",
    background:
      "linear-gradient(135deg,#facc15,#fde047)",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer"
  },

  cart: {
    width: 56,
    height: 56,
    borderRadius: 18,
    border: "none",
    background:
      "linear-gradient(135deg,#facc15,#fde047)",
    fontSize: 22,
    cursor: "pointer",
    position: "relative"
  },

  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    background: "#fff",
    color: "#000",
    width: 28,
    height: 28,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: 12
  },

  hero: {
    padding: "76px 40px 44px",
    textAlign: "center"
  },

  badge: {
    display: "inline-block",
    padding: "10px 18px",
    borderRadius: 999,
    background:
      "rgba(250,204,21,0.1)",
    color: "#facc15",
    marginBottom: 22,
    border:
      "1px solid rgba(250,204,21,0.18)",
    fontWeight: "bold"
  },

  heroTitle: {
    maxWidth: 760,
    margin: "0 auto 18px",
    fontSize: 58,
    lineHeight: 1.03
  },

  heroText: {
    opacity: 0.65,
    fontSize: 18
  },

  productsSection: {
    padding: "0 40px",
    display: "flex",
    flexDirection: "column",
    gap: 40
  },

  searchPanel: {
    maxWidth: 760,
    margin: "0 auto 34px",
    padding: "0 40px",
    display: "flex",
    flexDirection: "column",
    gap: 10
  },

  searchWide: {
    width: "100%",
    minHeight: 54,
    borderRadius: 18,
    border:
      "1px solid rgba(255,255,255,0.1)",
    background:
      "rgba(255,255,255,0.07)",
    color: "#fff",
    padding: "0 18px",
    fontSize: 16,
    outline: "none"
  },

  searchHelp: {
    color: "#facc15",
    opacity: 0.78,
    fontSize: 13,
    textAlign: "center"
  },

  block: {
    display: "flex",
    flexDirection: "column",
    gap: 18
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    gap: 18,
    marginBottom: 18
  },

  sectionEyebrow: {
    color: "#facc15",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1.4,
    marginBottom: 6,
    textTransform: "uppercase"
  },

  sectionTitle: {
    margin: 0,
    fontSize: 32,
    lineHeight: 1.1
  },

  countPill: {
    flex: "0 0 auto",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: 999,
    color: "#facc15",
    padding: "9px 14px",
    fontSize: 13,
    fontWeight: "bold"
  },

  filterRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    marginBottom: 22
  },

  search: {
    width: 320,
    minHeight: 48,
    borderRadius: 16,
    border:
      "1px solid rgba(255,255,255,0.08)",
    background:
      "rgba(255,255,255,0.06)",
    color: "#fff",
    padding: "0 16px",
    fontSize: 15,
    outline: "none"
  },

  tabs: {
    display: "flex",
    gap: 10
  },

  tab: {
    minHeight: 44,
    padding: "0 16px",
    borderRadius: 14,
    border:
      "1px solid rgba(255,255,255,0.08)",
    background:
      "rgba(255,255,255,0.05)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold"
  },

  activeTab: {
    minHeight: 44,
    padding: "0 16px",
    borderRadius: 14,
    border: "none",
    background: "#facc15",
    color: "#000",
    cursor: "pointer",
    fontWeight: "bold"
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(230px,1fr))",
    gap: 24
  },

  emptySearch: {
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    background:
      "rgba(255,255,255,0.04)",
    padding: 28,
    textAlign: "center",
    color: "rgba(255,255,255,0.68)"
  },

  card: {
    display: "flex",
    flexDirection: "column",
    minHeight: 360,
    background:
      "rgba(255,255,255,0.04)",
    borderRadius: 24,
    overflow: "hidden",
    border:
      "1px solid rgba(255,255,255,0.06)",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.2)"
  },

  visualArea: {
    position: "relative",
    minHeight: 168,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(circle at 50% 30%, rgba(250,204,21,0.22), rgba(255,255,255,0.03) 42%, rgba(255,255,255,0.01))"
  },

  photoArea: {
    position: "relative",
    minHeight: 210,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  },

  visualOrb: {
    width: 92,
    height: 92,
    borderRadius: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#050505",
    fontWeight: "bold",
    fontSize: 36,
    boxShadow:
      "0 18px 45px rgba(0,0,0,0.35)"
  },

  cardContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: 20
  },

  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 12
  },

  category: {
    fontSize: 11,
    opacity: 0.58,
    textTransform: "uppercase",
    letterSpacing: 1.2
  },

  gender: {
    color: "#facc15",
    fontSize: 12,
    fontWeight: "bold"
  },

  cardTitle: {
    flex: 1,
    margin: 0,
    fontSize: 19,
    lineHeight: 1.32
  },

  cardBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    marginTop: 22
  },

  price: {
    color: "#facc15",
    fontWeight: "bold",
    fontSize: 25
  },

  buyBtn: {
    width: 50,
    height: 50,
    borderRadius: 17,
    border: "none",
    background:
      "linear-gradient(135deg,#facc15,#fde047)",
    color: "#000",
    fontSize: 26,
    fontWeight: "bold",
    cursor: "pointer"
  }

};
