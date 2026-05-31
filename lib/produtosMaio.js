const rawProdutosMaio = [
  ["Armaf Odyssey Mandarin Sky ELIXIR 200ML", "perfume", "masculino", "Spray e body splash", 1, 79.99],
  ["Armaf Odyssey Homme White EDIT", "perfume", "masculino", "Spray e body splash", 1, 79.99],
  ["Armaf Odyssey Wild One Gold Edit 200Ml", "perfume", "unisex", "Spray e body splash", 1, 79.99],
  ["Armaf Odyssey Spectra Rainbow Edit. 200ml", "perfume", "unisex", "Spray e body splash", 1, 79.99],
  ["Armaf Odyssey Mandarin Sky 200ml", "perfume", "masculino", "Spray e body splash", 1, 79.99],
  ["Armaf Odyssey Candee 200ml", "perfume", "feminino", "Spray e body splash", 1, 79.99],
  ["Armaf Club De Nuit Woman 200ml Rosa", "perfume", "feminino", "Spray e body splash", 1, 79.99],
  ["Lattafa Deo Assad Black 200ml", "perfume", "masculino", "Spray e body splash", 1, 79.99],
  ["Lattafa Deo khamran Oahna 200ml", "perfume", "masculino", "Spray e body splash", 1, 79.99],
  ["Lattafa Deo Yara Moi Blanco 200ml", "perfume", "feminino", "Spray e body splash", 3, 79.99],
  ["Armaf Club De Nuit Iconic 200ml", "perfume", "unisex", "Spray e body splash", 1, 79.99],
  ["Lattafa Deo Yara rosa 200ml", "perfume", "feminino", "Spray e body splash", 2, 79.99],
  ["Armaf Club De Nuit Milestone Deo 200ml", "perfume", "unisex", "Spray e body splash", 2, 79.99],
  ["Armaf Club De Nuit Untold 200ml", "perfume", "unisex", "Spray e body splash", 1, 79.99],
  ["Armaf Club De Nuit Intense Man Deo 200ml", "perfume", "masculino", "Spray e body splash", 3, 79.99],
  ["Body Splash Mayar 150ml", "perfume", "feminino", "Spray e body splash", 1, 129.99],
  ["Body Splash Mayar N.Intense 150ml", "perfume", "feminino", "Spray e body splash", 1, 129.99],
  ["Body Splash Shahd 150ml", "perfume", "feminino", "Spray e body splash", 1, 129.99],
  ["Body Splash Fahkar 150ml", "perfume", "unisex", "Spray e body splash", 1, 129.99],
  ["Body Splash Haya 150ml", "perfume", "feminino", "Spray e body splash", 1, 189],
  ["Deo Risala Pure Ombre 200ml", "perfume", "unisex", "Spray e body splash", 2, 79.99],
  ["Deo Risala Sayf Almajd 200ml", "perfume", "unisex", "Spray e body splash", 1, 79.99],
  ["Mini Yara Coll.EDP 4X5ML", "perfume", "feminino", "Spray e body splash", 1, 219.99],
  ["Mini Badee Al Oud EDP 5X5ML", "perfume", "unisex", "Spray e body splash", 1, 229.99],
  ["DR Brand Lottion Attraction Men 200ml", "perfume", "masculino", "Spray e body splash", 1, 89.99],
  ["Lattafa His Confession 100ml", "perfume", "unisex", "Perfume EDP", 2, 289.99],
  ["Asdaaf Ameer Al Arab Imperium 100ml", "perfume", "unisex", "Perfume EDP", 1, 229],
  ["Ameerat Al Arab Rose 100ml", "perfume", "feminino", "Perfume EDP", 1, 229],
  ["Ameerat Al Arab 100ml", "perfume", "feminino", "Perfume EDP", 1, 349],
  ["Calvin Klein Euphoria 100ml Edp", "perfume", "unisex", "Perfume EDP", 1, 399],
  ["Arabe Al Wataniah Durrat Al Aroos EDP 85ml", "perfume", "unisex", "Perfume EDP", 1, 229.99],
  ["Arabe Delight Woody EDP 100ml", "perfume", "unisex", "Perfume EDP", 1, 189.99],
  ["Arabe Lattafa Musamam White Intense 100ml", "perfume", "unisex", "Perfume EDP", 1, 359.99],
  ["Lattafa Yara EDP 100ml", "perfume", "feminino", "Perfume EDP", 1, 259.99],
  ["Arqus Voyage Pour Homme EDP 100ML", "perfume", "masculino", "Perfume EDP", 1, 189.99],
  ["Lattafa Al Noble Safeer EDP 100ML", "perfume", "masculino", "Perfume EDP", 1, 259.99],
  ["Armaf Club De Nuit Milestone EDP 105ML", "perfume", "unisex", "Perfume EDP", 1, 329.99],
  ["Lattafa Pride Shaheen Silver EDP 100ML", "perfume", "unisex", "Perfume EDP", 1, 279.99],
  ["Coral BF Escape EDP 100ML", "perfume", "unisex", "Perfume EDP", 2, 159.99],
  ["Coral BF Escape Blaze EDP 100 ML", "perfume", "unisex", "Perfume EDP", 1, 139.99],
  ["Coral BF Escape Noir EDP 100ML", "perfume", "masculino", "Perfume EDP", 1, 139.99],
  ["BF Monte Leone Eminet EDP 100ML", "perfume", "unisex", "Perfume EDP", 1, 149.99],
  ["Acqua Royale Black EDP 100ML", "perfume", "masculino", "Perfume EDP", 1, 159.99],
  ["Lattafa Fakhar Rose EDP 100ml", "perfume", "feminino", "Perfume EDP", 1, 259.99],
  ["Perfume Maison Alhambra Glacier Pour Homme EDP", "perfume", "masculino", "Perfume EDP", 1, 219.99],
  ["Joystick Gamesir T4n Lite Nova Lite", "eletronicos", "eletronicos", "Eletrônico", 1, 329.99],
  ["Joystick Gamesir T4n Nova Switch", "eletronicos", "eletronicos", "Eletrônico", 1, 359.99],
  ["RL Black Shark (Xiaomi) GT3 Neo BS-W2407 Smart Watch Silver/Beige", "eletronicos", "eletronicos", "Eletrônico", 1, 599.99],
  ["RL Black Shark (Xiaomi) S3 BS-W2406 GPS Smart Watch Anatel Preto", "eletronicos", "eletronicos", "Eletrônico", 1, 599.99],
  ["RL Blackview R30 Max Smart Watch Preto", "eletronicos", "eletronicos", "Eletrônico", 2, 279.99],
  ["RL Blackview R50 Smart Watch Cinza", "eletronicos", "eletronicos", "Eletrônico", 1, 289.99],
  ["RL Blackview X20 Smart Watch Silver", "eletronicos", "eletronicos", "Eletrônico", 1, 379.99],
  ["RL G-TIDE R8 Amoled Smart Watch Cinza/Azul", "eletronicos", "eletronicos", "Eletrônico", 1, 499.99],
  ["RL G-TIDE R8 Pro Amoled Smart Watch Silver/Verde", "eletronicos", "eletronicos", "Eletrônico", 1, 499.99],
  ["RL Audisat X5 Pro Smart Watch Cinza", "eletronicos", "eletronicos", "Eletrônico", 1, 199.99],
  ["RL Black Shark (Xiaomi) GT3 BS-GT3 Smart Watch Silver", "eletronicos", "eletronicos", "Eletrônico", 1, 199.99],
  ["RL Black Shark (Xiaomi) GT3 BS-GT3 Smart Watch Silver/Marrom", "eletronicos", "eletronicos", "Eletrônico", 1, 389.99],
  ["RL Black Shark (Xiaomi) GT3 BS-W2407 Smart Watch Preto", "eletronicos", "eletronicos", "Eletrônico", 1, 339.99],
  ["RL Joystick Gamesir T4N Lite Nova Lite Roxo + Capa", "eletronicos", "eletronicos", "Eletrônico", 1, 339.99],
  ["RL Joystick Gamesir T4N Lite Nova Lite Verde/Transparente", "eletronicos", "eletronicos", "Eletrônico", 1, 369.99],
  ["RL G-TIDE S5 Pro Amoled Smart Watch Preto", "eletronicos", "eletronicos", "Eletrônico", 1, 429.99],
  ["Hidratante One Gold 200ml", "perfume", "unisex", "D.E.C. e hidratantes", 1, 89.99],
  ["Hidratante Corporal Lattafa Khamra", "perfume", "masculino", "D.E.C. e hidratantes", 1, 199.99],
  ["Hidratante Corporal Angel 200ml", "perfume", "unisex", "D.E.C. e hidratantes", 1, 189.99],
  ["Hidratante Club De Nuit 200ml", "perfume", "unisex", "D.E.C. e hidratantes", 1, 189.99],
  ["Hidratante ANVVAR Club", "perfume", "unisex", "D.E.C. e hidratantes", 1, 189.99],
  ["Hidratante Winner Inv. 200ml", "perfume", "masculino", "D.E.C. e hidratantes", 2, 89.99],
  ["Hidratante Ar.Code 200ml", "perfume", "unisex", "D.E.C. e hidratantes", 1, 89.99],
  ["Sorte EDP F 30ML", "perfume", "unisex", "D.E.C. e hidratantes", 1, 79.99],
  ["Narc.EDP F 30ML", "perfume", "feminino", "D.E.C. e hidratantes", 1, 79.99],
  ["Lady B", "perfume", "feminino", "D.E.C. e hidratantes", 3, 79.99],
  ["M.Diana F 30ml", "perfume", "feminino", "D.E.C. e hidratantes", 1, 79.99],
  ["Arma.Code", "perfume", "unisex", "D.E.C. e hidratantes", 1, 79.99],
  ["Amen.30ml", "perfume", "masculino", "D.E.C. e hidratantes", 1, 79.99],
  ["Show Girl EDP 30ML", "perfume", "feminino", "D.E.C. e hidratantes", 1, 79.99],
  ["Meu jeito 30ml", "perfume", "feminino", "D.E.C. e hidratantes", 1, 79.99],
  ["Sexy Lady", "perfume", "feminino", "D.E.C. e hidratantes", 1, 79.99],
  ["Super Idolo 30ML", "perfume", "unisex", "D.E.C. e hidratantes", 1, 79.99],
  ["Grama Pura 30ml", "perfume", "unisex", "D.E.C. e hidratantes", 1, 79.99],
  ["Fakhar Rose 30Ml", "perfume", "feminino", "D.E.C. e hidratantes", 1, 79.99],
  ["Royal A.EDP 30ML", "perfume", "unisex", "D.E.C. e hidratantes", 2, 79.99],
  ["Light Dream 30Ml", "perfume", "unisex", "D.E.C. e hidratantes", 2, 79.99],
  ["D.Kit Fem 25ML", "perfume", "feminino", "D.E.C. e hidratantes", 1, 259.99],
  ["Winner INV Masc 30Ml", "perfume", "masculino", "D.E.C. e hidratantes", 3, 79.99],
  ["Super Fantastic F 30ml", "perfume", "unisex", "D.E.C. e hidratantes", 1, 79.99],
  ["Yara EDP 30ML", "perfume", "feminino", "D.E.C. e hidratantes", 2, 79.99],
  ["From BY Sabah EDP 30ML", "perfume", "feminino", "D.E.C. e hidratantes", 1, 79.99],
];

function criarId(nome, index) {
  return `maio-${index + 1}-${nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 36)}`;
}

export const produtosMaio = rawProdutosMaio.map(
  ([nome, categoria, genero, tipo, estoque, preco], index) => ({
    id: criarId(nome, index),
    nome,
    categoria,
    genero,
    tipo,
    estoque,
    preco
  })
);

export const perfumesMaio = produtosMaio.filter(
  (produto) => produto.categoria === "perfume"
);

export const eletronicosMaio = produtosMaio.filter(
  (produto) => produto.categoria === "eletronicos"
);

const destaquePerfumes = [
  "Lattafa His Confession 100ml",
  "Ameerat Al Arab Rose 100ml",
  "Lattafa Yara EDP 100ml",
  "Perfume Maison Alhambra Glacier Pour Homme EDP"
];

const destaqueEletronicos = [
  "RL Black Shark (Xiaomi) GT3 Neo BS-W2407 Smart Watch Silver/Beige",
  "RL G-TIDE R8 Pro Amoled Smart Watch Silver/Verde",
  "Joystick Gamesir T4n Nova Switch",
  "RL Blackview X20 Smart Watch Silver"
];

function selecionarDestaques(nomes) {
  return nomes
    .map((nome) =>
      produtosMaio.find((produto) => produto.nome === nome)
    )
    .filter(Boolean);
}

export const perfumesDestaque = selecionarDestaques(destaquePerfumes);
export const eletronicosDestaque = selecionarDestaques(destaqueEletronicos);
