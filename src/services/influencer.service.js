// Servicio del marketplace (simulado)
export async function fetchInfluencers() {
  await new Promise(r => setTimeout(r, 500));
  return [
    { id: 1, name: 'Ana Tech', niche: 'Tecnología', followers: 124000, price: 200 },
    { id: 2, name: 'Fit Carlos', niche: 'Fitness', followers: 98000, price: 150 },
    { id: 3, name: 'Foodie Lu', niche: 'Gastronomía', followers: 54000, price: 120 },
  ];
}
