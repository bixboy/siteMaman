import type { Project } from '@data/projects';
import type { Product } from '@data/products';
import { siteConfig } from '@data/site';

const address = {
  '@type': 'PostalAddress',
  streetAddress: siteConfig.address.streetAddress,
  postalCode: siteConfig.address.postalCode,
  addressLocality: siteConfig.address.addressLocality,
  addressRegion: siteConfig.address.addressRegion,
  addressCountry: siteConfig.address.addressCountry
};

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: siteConfig.name,
  description: siteConfig.description,
  email: `mailto:${siteConfig.email}`,
  telephone: siteConfig.phone,
  image:
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
  url: siteConfig.baseUrl,
  address,
  areaServed: siteConfig.serviceArea,
  openingHoursSpecification: siteConfig.businessHours.map((hours) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: hours.dayOfWeek,
    opens: hours.opens,
    closes: hours.closes
  })),
  identifier: siteConfig.siret
};

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }))
});

export const projectSchema = (project: Project) => ({
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: project.title,
  description: project.description,
  url: `${siteConfig.baseUrl}/realisations/${project.slug}`,
  image: [project.afterImage.src, project.beforeImage.src],
  material: project.materials,
  timeRequired: project.duration,
  keywords: project.techniques,
  creator: {
    '@type': 'Person',
    name: 'Tapissière d\'ameublement Main é merveille'
  }
});

export const imageObjectSchema = (image: { src: string; alt: string }) => ({
  '@type': 'ImageObject',
  contentUrl: image.src,
  description: image.alt
});

export const productSchema = (product: Product) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.image.src,
  brand: siteConfig.name,
  offers: {
    '@type': 'Offer',
    price: product.price.replace(/[^0-9]/g, ''),
    priceCurrency: 'EUR',
    availability:
      product.status === 'Disponible'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/PreOrder',
    url: `${siteConfig.baseUrl}/vente-fauteuils/${product.slug}`
  }
});
