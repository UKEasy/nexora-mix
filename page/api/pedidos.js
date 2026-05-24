import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { itens, total } = req.body;

    const { data, error } = await supabase
      .from("pedidos")
      .insert([
        {
          itens,
          total,
          status: "novo"
        }
      ]);

    if (error) return res.status(500).json(error);

    return res.status(200).json(data);
  }

  if (req.method === "GET") {
    const { data } = await supabase
      .from("pedidos")
      .select("*")
      .order("created_at", { ascending: false });

    return res.status(200).json(data);
  }
}