import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Admin() {

  const [produtos, setProdutos] =
    useState([]);

  const [nome, setNome] =
    useState("");

  const [preco, setPreco] =
    useState("");

  const [categoria, setCategoria] =
    useState("perfume");

  const [genero, setGenero] =
    useState("Masculino");

  const [img, setImg] =
    useState("");

  useEffect(() => {

    carregarProdutos();

  }, []);

  async function carregarProdutos() {

    const { data } = await supabase
      .from("produtos")
      .select("*")
      .order("id", {
        ascending: false
      });

    setProdutos(data || []);

  }

  async function adicionarProduto() {

    if (
      !nome ||
      !preco ||
      !img
    ) {

      alert("Preencha tudo");

      return;

    }

    const { error } =
      await supabase
        .from("produtos")
        .insert([
          {
            nome,
            preco,
            categoria,
            genero,
            img
          }
        ]);

    if (!error) {

      alert("Produto criado");

      setNome("");
      setPreco("");
      setImg("");

      carregarProdutos();

    }

  }

  async function deletarProduto(id) {

    await supabase
      .from("produtos")
      .delete()
      .eq("id", id);

    carregarProdutos();

  }

  return (

    <div style={styles.page}>

      <h1 style={styles.title}>
        Painel Admin
      </h1>

      {/* FORM */}

      <div style={styles.form}>

        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) =>
            setNome(e.target.value)
          }
          style={styles.input}
        />

        <input
          placeholder="Preço"
          value={preco}
          onChange={(e) =>
            setPreco(e.target.value)
          }
          style={styles.input}
        />

        <input
          placeholder="Imagem URL"
          value={img}
          onChange={(e) =>
            setImg(e.target.value)
          }
          style={styles.input}
        />

        <select
          value={categoria}
          onChange={(e) =>
            setCategoria(
              e.target.value
            )
          }
          style={styles.input}
        >

          <option value="perfume">
            Perfume
          </option>

          <option value="eletronicos">
            Eletrônicos
          </option>

        </select>

        <select
          value={genero}
          onChange={(e) =>
            setGenero(
              e.target.value
            )
          }
          style={styles.input}
        >

          <option>
            Masculino
          </option>

          <option>
            Feminino
          </option>

          <option>
            Unissex
          </option>

        </select>

        <button
          onClick={
            adicionarProduto
          }
          style={styles.button}
        >

          Adicionar Produto

        </button>

      </div>

      {/* PRODUTOS */}

      <div style={styles.grid}>

        {produtos.map((produto) => (

          <div
            key={produto.id}
            style={styles.card}
          >

            <img
              src={produto.img}
              style={styles.image}
            />

            <h2>
              {produto.nome}
            </h2>

            <p>
              R$ {produto.preco}
            </p>

            <p>
              {produto.genero}
            </p>

            <button
              style={styles.delete}
              onClick={() =>
                deletarProduto(
                  produto.id
                )
              }
            >

              Excluir

            </button>

          </div>

        ))}

      </div>

    </div>

  );

}

const styles = {

  page: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#fff",
    padding: 40,
    fontFamily: "Arial"
  },

  title: {
    fontSize: 42,
    marginBottom: 40,
    color: "#facc15"
  },

  form: {
    display: "grid",
    gap: 18,
    marginBottom: 50,
    maxWidth: 500
  },

  input: {
    padding: 16,
    borderRadius: 14,
    border: "none",
    background: "#1a1a1a",
    color: "#fff",
    fontSize: 16
  },

  button: {
    padding: 18,
    borderRadius: 16,
    border: "none",
    background:
      "linear-gradient(135deg,#facc15,#fde047)",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: 16
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(240px,1fr))",
    gap: 24
  },

  card: {
    background: "#141414",
    padding: 18,
    borderRadius: 22
  },

  image: {
    width: "100%",
    height: 220,
    objectFit: "cover",
    borderRadius: 18
  },

  delete: {
    marginTop: 14,
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border: "none",
    background: "#ff3b30",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold"
  }

};