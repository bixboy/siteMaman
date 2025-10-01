export const siteConfig = {
  name: 'Main é merveille',
  baseUrl: 'https://main-e-merveille.fr',
  description:
    "Atelier artisanal de tapisserie d'ameublement. Réfection de fauteuils, chaises et canapés, garnissage traditionnel et tissus d'éditeur.",
  email: 'mainemerveille@gmail.com',
  phone: 'À compléter',
  address: {
    streetAddress: 'Adresse de l\'atelier à compléter',
    postalCode: '00000',
    addressLocality: 'Ville à préciser',
    addressRegion: 'Région à préciser',
    addressCountry: 'FR'
  },
  businessHours: [
    {
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00'
    }
  ],
  serviceArea: 'Secteur d\'intervention à préciser',
  siret: 'SIRET à compléter',
  whatsapp: '',
  analytics: {
    plausibleDomain: 'https://plausible.io',
    enabled: false
  }
} as const;
