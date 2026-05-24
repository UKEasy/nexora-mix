import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";

export default function Home() {

  const router = useRouter();

  const [produtos, setProdutos] = useState([]);
  const [categoria, setCategoria] =
    useState("todos");

  const [carrinhoQtd, setCarrinhoQtd] =
    useState(0);

  const [alerta, setAlerta] =
    useState("");

  useEffect(() => {

    carregarProdutos();

    atualizarCarrinho();

  }, []);

  /* =========================
     PRODUTOS
  ========================== */

  async function carregarProdutos() {

    const { data } = await supabase
      .from("produtos")
      .select("*");

    setProdutos(data || []);
  }

  /* =========================
     CARRINHO
  ========================== */

  function atualizarCarrinho() {

    const carrinho = JSON.parse(
      localStorage.getItem("carrinho") || "[]"
    );

    let total = 0;

    carrinho.forEach((item) => {

      total += item.qtd;

    });

    setCarrinhoQtd(total);
  }

  function adicionarCarrinho(produto) {

    const carrinho = JSON.parse(
      localStorage.getItem("carrinho") || "[]"
    );

    const existe = carrinho.find(
      (item) =>
        String(item.id) ===
        String(produto.id)
    );

    let novoCarrinho = [];

    if (existe) {

      novoCarrinho = carrinho.map((item) => {

        if (
          String(item.id) ===
          String(produto.id)
        ) {

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

    }, 2200);
  }

  /* =========================
     FILTRO
  ========================== */

  const produtosFiltrados =
    categoria === "todos"
      ? produtos
      : produtos.filter(
          (item) =>
            item.categoria?.toLowerCase() ===
            categoria
        );

  return (

    <div style={styles.page}>

      {/* ALERTA */}

      {alerta && (

        <div style={styles.alertaWrapper}>

          <div style={styles.alerta}>

            ✅ {alerta}

          </div>

        </div>

      )}

      {/* HEADER */}

      <header style={styles.header}>

        {/* LOGO */}

        <div style={styles.logoArea}>

          <div style={styles.logoIcon}>
            N
          </div>

          <div>

            <h1 style={styles.logo}>
              NEXORA
            </h1>

            <p style={styles.logoSub}>
              luxury experience
            </p>

          </div>

        </div>

        {/* MENU */}

        <div style={styles.navButtons}>

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
              setCategoria("eletronicos")
            }
            style={
              categoria === "eletronicos"
                ? styles.activeNav
                : styles.nav
            }
          >
            Eletrônicos
          </button>

        </div>

        {/* CARRINHO */}

        <button
          onClick={() =>
            router.push("/carrinho")
          }
          style={styles.cart}
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

      <section style={styles.hero}>

        <div style={styles.badge}>
          PREMIUM STORE
        </div>

        <h1 style={styles.heroTitle}>
          Perfumes & Tecnologia
          <br />
          em outro nível
        </h1>

        <p style={styles.heroText}>
          Produtos premium selecionados.
        </p>

      </section>

      {/* PRODUTOS */}

      <section style={styles.productsSection}>

        <div style={styles.grid}>

          {produtosFiltrados.map((produto) => (

            <div
              key={produto.id}
              style={styles.card}
            >

              {/* FOTO */}

              <div style={styles.imageArea}>

                <img
                  src={produto.img}
                  style={styles.image}
                />

              </div>

              {/* CONTEÚDO */}

              <div style={styles.cardContent}>

                <div style={styles.category}>

                  {produto.genero}

                </div>

                <h2 style={styles.cardTitle}>

                  {produto.nome}

                </h2>

                <div style={styles.cardBottom}>

                  <div>

                    <div style={styles.price}>
                      R$ {produto.preco}
                    </div>

                  </div>

                  {/* BOTÃO */}

                  <button
                    style={styles.buyBtn}
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

          ))}

        </div>

      </section>

    </div>

  );
}

const styles = {

  /* PAGE */

  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(to bottom, #050505, #0d0d0d)",
    color: "#fff",
    fontFamily: "Arial",
    paddingBottom: 60
  },

  /* ALERTA */

  alertaWrapper: {
    position: "fixed",
    top: 40,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    zIndex: 99999,
    pointerEvents: "none"
  },

  alerta: {
    background:
      "linear-gradient(135deg,#facc15,#fde047)",
    color: "#000",
    padding: "18px 30px",
    borderRadius: 18,
    fontWeight: "bold",
    fontSize: 16,
    boxShadow:
      "0 20px 40px rgba(0,0,0,0.35)"
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
    backdropFilter: "blur(18px)",
    background: "rgba(0,0,0,0.55)",
    borderBottom:
      "1px solid rgba(255,255,255,0.05)"
  },

  logoArea: {
    display: "flex",
    alignItems: "center",
    gap: 14
  },

  logoIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    background:
      "linear-gradient(135deg,#facc15,#fde047)",
    color: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: 22,
    boxShadow:
      "0 10px 30px rgba(250,204,21,0.35)"
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

  /* MENU */

  navButtons: {
    display: "flex",
    gap: 14
  },

  nav: {
    padding: "12px 18px",
    borderRadius: 14,
    background:
      "rgba(255,255,255,0.04)",
    border:
      "1px solid rgba(255,255,255,0.06)",
    color: "#fff",
    cursor: "pointer",
    transition: "0.3s"
  },

  activeNav: {
    padding: "12px 18px",
    borderRadius: 14,
    background:
      "linear-gradient(135deg,#facc15,#fde047)",
    border: "none",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow:
      "0 10px 30px rgba(250,204,21,0.35)"
  },

  /* CARRINHO */

  cart: {
    width: 56,
    height: 56,
    borderRadius: 18,
    border: "none",
    background:
      "linear-gradient(135deg,#facc15,#fde047)",
    cursor: "pointer",
    fontSize: 20,
    position: "relative",
    boxShadow:
      "0 10px 30px rgba(250,204,21,0.35)",
    transition: "0.3s"
  },

  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    background:
      "linear-gradient(135deg,#ffffff,#f3f4f6)",
    color: "#000",
    width: 28,
    height: 28,
    borderRadius: "50%",
    fontSize: 12,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow:
      "0 8px 20px rgba(0,0,0,0.35)"
  },

  /* HERO */

  hero: {
    padding: "90px 40px 50px",
    textAlign: "center"
  },

  badge: {
    display: "inline-block",
    padding: "10px 18px",
    borderRadius: 999,
    background:
      "rgba(250,204,21,0.1)",
    color: "#facc15",
    marginBottom: 24,
    border:
      "1px solid rgba(250,204,21,0.2)"
  },

  heroTitle: {
    fontSize: 64,
    lineHeight: 1,
    marginBottom: 24
  },

  heroText: {
    opacity: 0.65,
    fontSize: 18
  },

  /* PRODUTOS */

  productsSection: {
    padding: "0 40px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 28
  },

  /* CARD */

  card: {
    background:
      "rgba(255,255,255,0.04)",
    borderRadius: 28,
    overflow: "hidden",
    border:
      "1px solid rgba(255,255,255,0.06)",
    backdropFilter: "blur(20px)",
    transition: "all 0.35s ease",
    cursor: "pointer"
  },

  imageArea: {
    height: 270,
    overflow: "hidden"
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s ease"
  },

  cardContent: {
    padding: 22
  },

  category: {
    fontSize: 11,
    opacity: 0.5,
    textTransform: "uppercase",
    marginBottom: 12,
    letterSpacing: 2
  },

  cardTitle: {
    margin: 0,
    fontSize: 20,
    lineHeight: 1.4,
    minHeight: 56
  },

  cardBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 26
  },

  price: {
    color: "#facc15",
    fontSize: 28,
    fontWeight: "bold"
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
    cursor: "pointer",
    transition: "0.25s",
    boxShadow:
      "0 10px 25px rgba(250,204,21,0.25)"
  }

};