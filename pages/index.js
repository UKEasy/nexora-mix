import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

function contarItensCarrinho() {
  if (typeof window === "undefined")
    return 0;

  if (typeof window === "undefined")
  return;

const carrinho = JSON.parse(
  localStorage.getItem("carrinho") || "[]"
);

  return carrinho.reduce(
    (total, item) => total + item.qtd,
    0
  );
}

export default function Home({
  produtosIniciais = []
}) {

  const router = useRouter();

  const produtos = produtosIniciais;
  const [categoria, setCategoria] =
    useState("todos");

  const [carrinhoQtd, setCarrinhoQtd] =
    useState(contarItensCarrinho);

  const [alerta, setAlerta] =
    useState("");

  /* =========================
     CARRINHO
  ========================== */

  function atualizarCarrinho() {
    setCarrinhoQtd(contarItensCarrinho());

  }

  function adicionarCarrinho(produto) {

    const carrinho = JSON.parse(
      localStorage.getItem("carrinho") || "[]"
    );

    const existe = carrinho.find(
      (item) =>
        item.id === produto.id
    );

    let novoCarrinho = [];

    if (existe) {

      novoCarrinho = carrinho.map((item) => {

        if (item.id === produto.id) {

          return {
            ...item,
            qtd: item.qtd + 1
          };

        }

        return item;

      });

    } else {

      novoCarrinho = [
        ...carrinho,
        {
          ...produto,
          qtd: 1
        }
      ];

    }

    localStorage.setItem(
      "carrinho",
      JSON.stringify(novoCarrinho)
    );

    atualizarCarrinho();

    setAlerta(
      "Produto adicionado ao carrinho"
    );

    setTimeout(() => {

      setAlerta("");

    }, 2000);

  }

  /* =========================
     FILTRO
  ========================== */

  const produtosFiltrados =
    categoria === "todos"
      ? produtos
      : produtos.filter(
          (item) =>
            item.categoria ===
            categoria
        );

  return (

    <div
      className="home-page"
      style={styles.page}
    >

      <style jsx global>{`
        @media (max-width: 860px) {
          .home-header {
            align-items: flex-start !important;
            flex-direction: column !important;
            padding: 20px 22px !important;
          }

          .home-nav {
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
            padding: 60px 22px 36px !important;
          }

          .home-title {
            font-size: 42px !important;
            line-height: 1.08 !important;
          }

          .home-products {
            padding: 0 22px !important;
          }
        }

        @media (max-width: 520px) {
          .home-page {
            padding-bottom: 48px !important;
          }

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

          .home-nav button {
            white-space: nowrap !important;
            padding-left: 14px !important;
            padding-right: 14px !important;
          }

          .home-title {
            font-size: 34px !important;
          }

          .home-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* ALERTA */}

      {alerta && (

        <div style={styles.alertaWrapper}>

          <div style={styles.alerta}>

            ✅ {alerta}

          </div>

        </div>

      )}

      {/* HEADER */}

      <header
        className="home-header"
        style={styles.header}
      >

        {/* LOGO */}

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
              luxury experience
            </p>

          </div>

        </div>

        {/* MENU */}

        <div
          className="home-nav"
          style={styles.navButtons}
        >

          <button
            onClick={() =>
              setCategoria("todos")
            }
            style={
              categoria === "todos"
                ? styles.activeNav
                : styles.nav
            }
          >
            Todos
          </button>

          <button
            onClick={() =>
              setCategoria("perfume")
            }
            style={
              categoria === "perfume"
                ? styles.activeNav
                : styles.nav
            }
          >
            Perfumes
          </button>

          <button
            onClick={() =>
              setCategoria(
                "eletronicos"
              )
            }
            style={
              categoria ===
              "eletronicos"
                ? styles.activeNav
                : styles.nav
            }
          >
            Eletrônicos
          </button>

        </div>

        {/* CARRINHO */}

        <button
          className="home-cart"
          style={styles.cart}
          onClick={() =>
            router.push("/carrinho")
          }
        >

          🛒

          {carrinhoQtd > 0 && (

            <span style={styles.cartBadge}>

              {carrinhoQtd}

            </span>

          )}

        </button>

      </header>

      {/* HERO */}

      <section
        className="home-hero"
        style={styles.hero}
      >

        <div style={styles.badge}>
          PREMIUM STORE
        </div>

        <h1
          className="home-title"
          style={styles.heroTitle}
        >
          Perfumes & Tecnologia
        </h1>

        <p style={styles.heroText}>
          Produtos premium selecionados.
        </p>

      </section>

      {/* PRODUTOS */}

      <section
        className="home-products"
        style={styles.productsSection}
      >

        <div
          className="home-grid"
          style={styles.grid}
        >

          {produtosFiltrados.map(
            (produto) => (

              <div
                key={produto.id}
                style={styles.card}
              >

                {/* FOTO */}

                <div
                  style={styles.imageArea}
                >

                  <img
                    src={produto.img}
                    alt={produto.nome}
                    style={styles.image}
                  />

                </div>

                {/* CONTEÚDO */}

                <div
                  style={styles.cardContent}
                >

                  <div
                    style={styles.category}
                  >

                    {produto.genero}

                  </div>

                  <h2
                    style={styles.cardTitle}
                  >

                    {produto.nome}

                  </h2>

                  <div
                    style={styles.cardBottom}
                  >

                    <div
                      style={styles.price}
                    >

                      R$ {produto.preco}

                    </div>

                    <button
                      style={
                        styles.buyBtn
                      }
                      onClick={() =>
                        adicionarCarrinho(
                          produto
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      </section>

    </div>

  );

}

const styles = {

  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(to bottom,#050505,#111)",
    color: "#fff",
    fontFamily: "Arial",
    paddingBottom: 80
  },

  /* ALERTA */

  alertaWrapper: {
    position: "fixed",
    top: 40,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    zIndex: 9999
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

  /* HEADER */

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "22px 40px",
    position: "sticky",
    top: 0,
    zIndex: 999,
    backdropFilter: "blur(15px)",
    background: "rgba(0,0,0,0.55)"
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
    gap: 14
  },

  nav: {
    padding: "12px 18px",
    borderRadius: 14,
    border: "none",
    background:
      "rgba(255,255,255,0.05)",
    color: "#fff",
    cursor: "pointer"
  },

  activeNav: {
    padding: "12px 18px",
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
    padding: "80px 40px 50px",
    textAlign: "center"
  },

  badge: {
    display: "inline-block",
    padding: "10px 18px",
    borderRadius: 999,
    background:
      "rgba(250,204,21,0.1)",
    color: "#facc15",
    marginBottom: 22
  },

  heroTitle: {
    fontSize: 62,
    marginBottom: 18
  },

  heroText: {
    opacity: 0.65,
    fontSize: 18
  },

  productsSection: {
    padding: "0 40px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(240px,1fr))",
    gap: 28
  },

  card: {
    background:
      "rgba(255,255,255,0.04)",
    borderRadius: 28,
    overflow: "hidden",
    border:
      "1px solid rgba(255,255,255,0.06)",
    transition: "0.35s ease",
    cursor: "pointer",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.2)"
  },

  imageArea: {
    height: 260,
    overflow: "hidden"
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition:
      "transform 0.5s ease"
  },

  cardContent: {
    padding: 22
  },

  category: {
    fontSize: 11,
    opacity: 0.5,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 2
  },

  cardTitle: {
    margin: 0,
    fontSize: 20,
    minHeight: 55
  },

  cardBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24
  },

  price: {
    color: "#facc15",
    fontWeight: "bold",
    fontSize: 28
  },

  buyBtn: {
    width: 52,
    height: 52,
    borderRadius: 18,
    border: "none",
    background:
      "linear-gradient(135deg,#facc15,#fde047)",
    color: "#000",
    fontSize: 28,
    fontWeight: "bold",
    cursor: "pointer"
  }

};

export async function getServerSideProps() {
  const { data, error } =
    await supabase
      .from("produtos")
      .select("*");

  return {
    props: {
      produtosIniciais: error ? [] : data || []
    }
  };
}
