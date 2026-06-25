import React from 'react';
import { Helmet } from 'react-helmet-async';

const BASE = 'https://grease-trappers-web.onrender.com';

export default function SEO({
  title,
  description,
  keywords,
  canonical,
  ogImage = 'https://i.imgur.com/eWmvfbq.jpeg',
  type = 'website',
  service,
  city,
  schema,
}) {
  const fullTitle = title
    ? `${title} | The Grease Trappers, LLC — NJ Grease Trap Cleaning`
    : 'The Grease Trappers, LLC | NJ Grease Trap Cleaning & Pumping';
  const desc = description || 'Licensed grease trap pumping, cleaning, maintenance, installation and emergency service throughout New Jersey, New York City & Pennsylvania. NJDEP compliant. Fully insured. Call (888) 982-1989.';
  const url = canonical ? `${BASE}${canonical}` : BASE;
  const defaultKeywords = [
    'grease trap cleaning',
    'grease trap pumping',
    'NJ grease trap service',
    'New Jersey grease trap',
    'North Jersey grease trap',
    'South Jersey grease trap',
    'NYC grease trap',
    'New York grease trap',
    'Pennsylvania grease trap',
    'PA grease trap',
    'commercial grease trap',
    'restaurant grease trap',
    'FOG compliance',
    'NJDEP compliant',
    'grease interceptor',
    'grease trap maintenance',
  ];
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="keywords" content={(keywords || defaultKeywords).join(', ')} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="author" content="The Grease Trappers, LLC" />
      <meta name="geo.region" content="US-NJ" />
      <meta name="geo.placename" content="Newark, NJ" />
      <meta name="geo.position" content="40.7357;-74.1724" />
      <meta name="ICBM" content="40.7357, -74.1724" />
      <meta name="distribution" content="local" />
      <meta name="coverage" content="New Jersey, New York, Pennsylvania" />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1536" />
      <meta property="og:image:height" content="1024" />
      <meta property="og:site_name" content="The Grease Trappers, LLC" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD structured data */}
      <script type="application/ld+json">
        {JSON.stringify(
          schema || {
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            '@id': `${BASE}#business`,
            name: 'The Grease Trappers, LLC',
            image: ogImage,
            logo: `${BASE}/logo.png`,
            url: BASE,
            telephone: '+1-888-982-1989',
            email: 'service@greasetrapers.com',
            priceRange: '$$',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Newark',
              addressLocality: 'Newark',
              addressRegion: 'NJ',
              postalCode: '07102',
              addressCountry: 'US',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 40.7357,
              longitude: -74.1724,
            },
            areaServed: [
              { '@type': 'State', name: 'New Jersey' },
              { '@type': 'State', name: 'New York' },
              { '@type': 'State', name: 'Pennsylvania' },
              { '@type': 'City', name: 'Newark, NJ' },
              { '@type': 'City', name: 'Jersey City, NJ' },
              { '@type': 'City', name: 'Trenton, NJ' },
              { '@type': 'City', name: 'New York City, NY' },
              { '@type': 'City', name: 'Philadelphia, PA' },
            ],
            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                opens: '00:00',
                closes: '23:59',
              },
            ],
            sameAs: [
              'https://www.facebook.com/greasetrapers',
              'https://www.instagram.com/greasetrapers',
              'https://www.linkedin.com/company/greasetrapers',
            ],
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              reviewCount: '127',
            },
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Grease Trap Services',
              itemListElement: [
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Grease Trap Pumping' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Grease Collection' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'FOG Compliance' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Line Jetting' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '24/7 Emergency Service' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Maintenance Plans' } },
              ],
            },
          }
        )}
      </script>
    </Helmet>
  );
}