export type Project = {
  slug: string;
  title: string;
  category: 'fauteuil' | 'chaise' | 'canape';
  summary: string;
  description: string;
  materials: string[];
  duration: string;
  techniques: string[];
  beforeImage: {
    src: string;
    alt: string;
  };
  afterImage: {
    src: string;
    alt: string;
  };
};

export const projects: Project[] = [
  {
    slug: 'fauteuil-bergere-heritage',
    title: 'Fauteuil bergère héritage',
    category: 'fauteuil',
    summary: 'Garnissage traditionnel et velours terracotta pour une bergère de famille.',
    description:
      'Réfection complète d\'une bergère fin XIXe. Après consolidation de la structure, les sangles en lin ont été remplacées et un guindage semi-traditionnel a été réalisé. Le crin végétal a été modelé à la main avant la pose d\'un velours de coton terracotta souligné par un passepoil sur-mesure.',
    materials: [
      'Sangles en lin tressé',
      'Ressorts biconiques',
      'Crin végétal',
      'Velours de coton terracotta',
      'Passepoil contrasté'
    ],
    duration: '6 semaines',
    techniques: ['Dégarnissage complet', 'Guindage traditionnel', 'Finitions passepoilées'],
    beforeImage: {
      src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
      alt: 'Fauteuil bergère avant restauration, tissu usé et structure apparente'
    },
    afterImage: {
      src: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
      alt: 'Fauteuil bergère restauré avec velours terracotta et passepoil'
    }
  },
  {
    slug: 'canape-club-patine',
    title: 'Canapé club patiné',
    category: 'canape',
    summary:
      'Remise en confort d\'un canapé club avec mousse HR et cuir pleine fleur patiné.',
    description:
      'Ce canapé club très sollicité présentait une assise affaissée. L\'atelier a remplacé le garnissage par des mousses haute résilience tout en conservant la structure. La finition a été réalisée avec un cuir pleine fleur patiné à la main et des clous décoratifs vieillis.',
    materials: ['Mousses HR 40kg', 'Ouate hypoallergénique', 'Cuir pleine fleur', 'Clous tapissier vieillis'],
    duration: '5 semaines',
    techniques: ['Restauration contemporaine', 'Pose de cuir', 'Finition cloutée'],
    beforeImage: {
      src: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=900&q=80',
      alt: 'Canapé club en cuir avant réfection, assise affaissée'
    },
    afterImage: {
      src: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80',
      alt: 'Canapé club restauré avec cuir patiné et coussins fermes'
    }
  },
  {
    slug: 'paire-chaises-louis-xvi',
    title: 'Paire de chaises Louis XVI',
    category: 'chaise',
    summary: 'Réfection traditionnelle et damassé ivoire pour deux chaises Louis XVI.',
    description:
      'Les chaises ont été totalement dégarnies puis regarnies avec crin végétal piqué main. Un tissu damassé ivoire a été posé avec un galon double afin de souligner la structure sculptée. Les patines du bois ont été respectées.',
    materials: ['Sangles en jute', 'Crin végétal', 'Toile forte', 'Damassé ivoire', 'Galon double ivoire'],
    duration: '4 semaines',
    techniques: ['Garnissage piqué main', 'Pose de galon', 'Respect patine d\'origine'],
    beforeImage: {
      src: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=900&q=80',
      alt: 'Chaises Louis XVI avant restauration avec tissu fatigué'
    },
    afterImage: {
      src: 'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=900&q=80',
      alt: 'Chaises Louis XVI restaurées avec tissu damassé ivoire'
    }
  },
  {
    slug: 'fauteuil-voltaire-lin',
    title: 'Fauteuil Voltaire en lin lavé',
    category: 'fauteuil',
    summary: 'Nouveau confort en lin lavé naturel pour un fauteuil Voltaire.',
    description:
      'Après vérification des assemblages, le fauteuil Voltaire a reçu un sanglage neuf et une mousse HR enveloppée d\'ouate. Le lin lavé naturel a été associé à une finition passepoilée ton sur ton pour un rendu intemporel.',
    materials: ['Sangles élastiques', 'Mousse HR 38kg', 'Ouate polyester', 'Lin lavé naturel'],
    duration: '3 semaines',
    techniques: ['Technique contemporaine', 'Passepoil ton sur ton', 'Réglage dossier'],
    beforeImage: {
      src: 'https://images.unsplash.com/photo-1449247613801-ab06418e2861?auto=format&fit=crop&w=900&q=80',
      alt: 'Fauteuil Voltaire défraîchi avant réfection'
    },
    afterImage: {
      src: 'https://images.unsplash.com/photo-1549187774-b4e9b0445b06?auto=format&fit=crop&w=900&q=80',
      alt: 'Fauteuil Voltaire restauré en lin lavé naturel'
    }
  },
  {
    slug: 'chaise-suedoise-graphique',
    title: 'Chaise suédoise graphique',
    category: 'chaise',
    summary: 'Assise contemporaine avec tissu graphique pour une chaise scandinave vintage.',
    description:
      'Réfection contemporaine avec mousse haute densité et tissu graphique noir et blanc. Le piètement bois a été reverni pour un résultat lumineux et actuel.',
    materials: ['Mousse HR 35kg', 'Tissu graphique noir et blanc', 'Ouate hypoallergénique'],
    duration: '2 semaines',
    techniques: ['Garnissage collé', 'Finition invisible', 'Revernissage léger'],
    beforeImage: {
      src: 'https://images.unsplash.com/photo-1455894127589-22f75500213a?auto=format&fit=crop&w=900&q=80',
      alt: 'Chaise vintage avant restauration avec assise abîmée'
    },
    afterImage: {
      src: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=900&q=80',
      alt: 'Chaise scandinave restaurée avec tissu graphique'
    }
  },
  {
    slug: 'canape-familial-lin',
    title: 'Canapé familial en lin',
    category: 'canape',
    summary: 'Nouvelle vie pour un grand canapé familial habillé de lin stonewashed.',
    description:
      'Le canapé a été déhoussé, les coussins regarnis avec un mix plumes et mousse, puis une nouvelle housse en lin stonewashed a été confectionnée. Les coutures anglaises renforcent la tenue dans le temps.',
    materials: ['Mousse HR 30kg', 'Flocons de plumes', 'Lin stonewashed gris perle', 'Passepoil plat'],
    duration: '5 semaines',
    techniques: ['Réfection de coussins', 'Confection de housse', 'Coutures anglaises'],
    beforeImage: {
      src: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80',
      alt: 'Canapé familial avant restauration, housse froissée'
    },
    afterImage: {
      src: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
      alt: 'Canapé familial restauré avec housse en lin stonewashed'
    }
  }
];
