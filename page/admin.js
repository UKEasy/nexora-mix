import { useEffect, useState } from "react";

export default function Admin() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    fetch("/api/pedidos")
      .then((r) => r.json())
      .then(setPedidos);
  }, []);

  return (
    <main style={{ padding: 20 }}>

      <h1>Admin SaaS</h1>

      {pedidos.map((p) => (
        <div key={p.id} style={{ marginTop: 10 }}>
          <b>Total:</b> R$ {p.total}
          <pre>{JSON.stringify(p.itens, null, 2)}</pre>
        </div>
      ))}

    </main>
  );
}