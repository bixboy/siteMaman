export type Product = {
  slug: string;
  name: string;
  price: string;
  description: string;
  dimensions: string;
  materials: string;
  status: 'Disponible' | 'Réservé';
  image: {
    src: string;
    alt: string;
  };
};

export const products: Product[] = [
  {
    slug: 'fauteuil-crapaud-velours',
    name: 'Fauteuil crapaud en velours safran',
    price: '780 €',
    description:
      'Pièce unique restaurée dans un velours safran lumineux, garnissage traditionnel en crin végétal et assise capitonnée.',
    dimensions: 'H 85 cm x L 70 cm x P 68 cm',
    materials: 'Velours de coton safran, crin végétal, finition passepoil',
    status: 'Disponible',
    image: {
      src: 'https://images.unsplash.com/photo-1600585154340-0ef3c08cf8a2?auto=format&fit=crop&w=900&q=80',
      alt: 'Fauteuil crapaud restauré en velours safran'
    }
  },
  {
    slug: 'fauteuil-bridge-noyer',
    name: 'Fauteuil bridge en noyer et tweed',
    price: '620 €',
    description:
      'Structure en noyer poncée et huilée, assise en mousse HR et tissu tweed gris chiné, idéal pour un bureau ou un salon.',
    dimensions: 'H 82 cm x L 60 cm x P 62 cm',
    materials: 'Tweed d\'éditeur gris, mousse HR, structure en noyer',
    status: 'Disponible',
    image: {
      src: 'https://images.unsplash.com/photo-1616628182505-4047e1c0c01d?auto=format&fit=crop&w=900&q=80',
      alt: 'Fauteuil bridge restauré avec tissu tweed gris'
    }
  },
  {
    slug: 'paire-fauteuils-scandinaves',
    name: 'Paire de fauteuils scandinaves en laine bouclée',
    price: '1 480 € la paire',
    description:
      'Réfection contemporaine et laine bouclée ivoire pour cette paire iconique des années 60, confort moelleux et lignes fluides.',
    dimensions: 'H 78 cm x L 68 cm x P 75 cm',
    materials: 'Laine bouclée ivoire, mousse HR, piètement en frêne',
    status: 'Réservé',
    image: {
      src: 'https://images.unsplash.com/photo-1567016407665-356928ac6674?auto=format&fit=crop&w=900&q=80',
      alt: 'Fauteuil scandinave restauré en laine bouclée ivoire'
    }
  }
];
