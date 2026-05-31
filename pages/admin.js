import { useEffect, useMemo, useState } from "react";
import { produtosMaio } from "../lib/produtosMaio";
import { supabase } from "../lib/supabase";

function normalizarNome(nome) {
  return String(nome || "")
    .trim()
    .toLowerCase();
}

function formatarMoeda(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
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

export default function Admin() {

  const [fotosPorNome, setFotosPorNome] =
    useState({});
  const [edicoes, setEdicoes] =
    useState({});
  const [busca, setBusca] =
    useState("");
  const [status, setStatus] =
    useState("");
  const [salvandoId, setSalvandoId] =
    useState("");

  useEffect(() => {
    async function carregarFotos() {
      const { data, error } = await supabase
        .from("produtos")
        .select("nome,img");

      if (error) {
        setStatus("Nao consegui carregar as fotos salvas.");
        return;
      }

      const fotos = {};
      const proximasEdicoes = {};

      (data || []).forEach((produto) => {
        if (produto.nome && produto.img) {
          const chave = normalizarNome(produto.nome);
          fotos[chave] = produto.img;
        }
      });

      produtosMaio.forEach((produto) => {
        proximasEdicoes[produto.id] =
          fotos[normalizarNome(produto.nome)] || "";
      });

      setFotosPorNome(fotos);
      setEdicoes(proximasEdicoes);
    }

    carregarFotos();
  }, []);

  const produtosFiltrados = useMemo(() => {
    const termo = busca
      .trim()
      .toLowerCase();

    return produtosMaio.filter((produto) =>
      correspondeBusca(produto, termo)
    );
  }, [busca]);

  function fotoAtual(produto) {
    return (
      edicoes[produto.id] ??
      fotosPorNome[normalizarNome(produto.nome)] ??
      ""
    );
  }

  function atualizarFoto(id, valor) {
    setEdicoes((atual) => ({
      ...atual,
      [id]: valor
    }));
  }

  async function salvarFoto(produto) {
    const img = String(edicoes[produto.id] || "")
      .trim();

    if (!img) {
      setStatus("Cole o link da foto antes de salvar.");
      return;
    }

    setSalvandoId(produto.id);
    setStatus("");

    const payload = {
      nome: produto.nome,
      preco: produto.preco,
      categoria: produto.categoria,
      genero: produto.genero,
      img
    };

    const { data: atualizados, error: erroUpdate } =
      await supabase
        .from("produtos")
        .update(payload)
        .eq("nome", produto.nome)
        .select("id");

    if (erroUpdate) {
      setStatus("Nao consegui salvar a foto. Confira o link e tente novamente.");
      setSalvandoId("");
      return;
    }

    if (!atualizados || atualizados.length === 0) {
      const { error: erroInsert } = await supabase
        .from("produtos")
        .insert([payload]);

      if (erroInsert) {
        setStatus("Nao consegui criar o registro da foto.");
        setSalvandoId("");
        return;
      }
    }

    setFotosPorNome((atual) => ({
      ...atual,
      [normalizarNome(produto.nome)]: img
    }));
    setStatus("Foto salva com sucesso.");
    setSalvandoId("");
  }

  async function removerFoto(produto) {
    setSalvandoId(produto.id);
    setStatus("");

    await supabase
      .from("produtos")
      .update({ img: "" })
      .eq("nome", produto.nome);

    setFotosPorNome((atual) => {
      const copia = { ...atual };
      delete copia[normalizarNome(produto.nome)];
      return copia;
    });
    atualizarFoto(produto.id, "");
    setStatus("Foto removida.");
    setSalvandoId("");
  }

  return (

    <div
      className="admin-page"
      style={styles.page}
    >

      <style jsx global>{`
        @media (max-width: 760px) {
          .admin-page {
            padding: 22px !important;
          }

          .admin-header {
            align-items: stretch !important;
            flex-direction: column !important;
          }

          .admin-title {
            font-size: 32px !important;
          }

          .admin-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <header
        className="admin-header"
        style={styles.header}
      >

        <div>

          <p style={styles.eyebrow}>
            Painel da vitrine
          </p>

          <h1
            className="admin-title"
            style={styles.title}
          >
            Fotos dos produtos
          </h1>

          <p style={styles.subtitle}>
            Cole o link da imagem no produto e salve. A foto aparece na loja automaticamente.
          </p>

        </div>

        <input
          value={busca}
          onChange={(event) =>
            setBusca(event.target.value)
          }
          placeholder="Pesquisar produto"
          style={styles.search}
        />

      </header>

      {status && (

        <div style={styles.status}>
          {status}
        </div>

      )}

      <main
        className="admin-grid"
        style={styles.grid}
      >

        {produtosFiltrados.map((produto) => {
          const foto = fotoAtual(produto);
          const salvando =
            salvandoId === produto.id;

          return (

            <article
              key={produto.id}
              style={styles.card}
            >

              <div
                style={
                  foto
                    ? {
                        ...styles.preview,
                        backgroundImage:
                          `linear-gradient(to bottom, rgba(0,0,0,0.02), rgba(0,0,0,0.48)), url("${foto.replace(/"/g, "%22")}")`
                      }
                    : styles.emptyPreview
                }
              >
                {!foto && (
                  <span style={styles.previewIcon}>
                    N
                  </span>
                )}
              </div>

              <div style={styles.cardBody}>

                <p style={styles.category}>
                  {produto.tipo}
                </p>

                <h2 style={styles.name}>
                  {produto.nome}
                </h2>

                <p style={styles.price}>
                  {formatarMoeda(produto.preco)}
                </p>

                <input
                  value={foto}
                  onChange={(event) =>
                    atualizarFoto(
                      produto.id,
                      event.target.value
                    )
                  }
                  placeholder="Link da foto"
                  style={styles.input}
                />

                <div style={styles.actions}>

                  <button
                    onClick={() =>
                      salvarFoto(produto)
                    }
                    disabled={salvando}
                    style={styles.saveButton}
                  >
                    {salvando ? "Salvando" : "Salvar foto"}
                  </button>

                  <button
                    onClick={() =>
                      removerFoto(produto)
                    }
                    disabled={salvando || !foto}
                    style={styles.removeButton}
                  >
                    Remover
                  </button>

                </div>

              </div>

            </article>

          );
        })}

      </main>

    </div>

  );
}

const styles = {

  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(to bottom,#050505,#101010)",
    color: "#fff",
    padding: 40,
    fontFamily: "Arial, Helvetica, sans-serif"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    gap: 24,
    marginBottom: 28
  },

  eyebrow: {
    color: "#facc15",
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 8
  },

  title: {
    margin: 0,
    color: "#fff",
    fontSize: 42,
    lineHeight: 1.04
  },

  subtitle: {
    maxWidth: 620,
    marginTop: 12,
    opacity: 0.65,
    lineHeight: 1.5
  },

  search: {
    width: "min(100%, 360px)",
    minHeight: 50,
    borderRadius: 16,
    border:
      "1px solid rgba(255,255,255,0.1)",
    background:
      "rgba(255,255,255,0.06)",
    color: "#fff",
    padding: "0 16px",
    fontSize: 15,
    outline: "none"
  },

  status: {
    marginBottom: 24,
    border:
      "1px solid rgba(250,204,21,0.22)",
    borderRadius: 16,
    background:
      "rgba(250,204,21,0.1)",
    color: "#facc15",
    padding: 14,
    fontWeight: "bold"
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(260px,1fr))",
    gap: 22
  },

  card: {
    overflow: "hidden",
    borderRadius: 22,
    border:
      "1px solid rgba(255,255,255,0.08)",
    background:
      "rgba(255,255,255,0.04)",
    boxShadow:
      "0 18px 45px rgba(0,0,0,0.22)"
  },

  preview: {
    minHeight: 220,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  },

  emptyPreview: {
    minHeight: 220,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(circle at 50% 25%, rgba(250,204,21,0.24), rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.01))"
  },

  previewIcon: {
    width: 74,
    height: 74,
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg,#facc15,#fde047)",
    color: "#050505",
    fontSize: 34,
    fontWeight: "bold"
  },

  cardBody: {
    padding: 18
  },

  category: {
    margin: 0,
    color: "#facc15",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1
  },

  name: {
    minHeight: 58,
    margin: "10px 0",
    fontSize: 20,
    lineHeight: 1.25
  },

  price: {
    marginBottom: 14,
    color: "#facc15",
    fontSize: 22,
    fontWeight: "bold"
  },

  input: {
    width: "100%",
    minHeight: 46,
    borderRadius: 14,
    border:
      "1px solid rgba(255,255,255,0.08)",
    background:
      "rgba(255,255,255,0.06)",
    color: "#fff",
    padding: "0 14px",
    fontSize: 14,
    outline: "none"
  },

  actions: {
    display: "grid",
    gridTemplateColumns: "1fr 105px",
    gap: 10,
    marginTop: 12
  },

  saveButton: {
    minHeight: 46,
    borderRadius: 14,
    border: "none",
    background:
      "linear-gradient(135deg,#facc15,#fde047)",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer"
  },

  removeButton: {
    minHeight: 46,
    borderRadius: 14,
    border:
      "1px solid rgba(255,255,255,0.08)",
    background:
      "rgba(255,255,255,0.05)",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer"
  }

};
