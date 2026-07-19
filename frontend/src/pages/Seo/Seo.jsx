import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Գրատուն';
const SITE_URL = 'https://www.gratunhub.am';
const DEFAULT_IMAGE = `${SITE_URL}/logo.jpg`;
const DEFAULT_DESCRIPTION =
          'Գրատուն — առցանց գրախանութ, որտեղ կարող եք գտնել և պատվիրել գրքեր տարբեր ժանրերով, ինչպես նաև կարդալ հոդվածներ գրականության, փիլիսոփայության և հոգևոր թեմաներով։';

/**
 * Seo — դնում է per-page title / description / Open Graph / Twitter card tags,
 * և ըստ ցանկության՝ JSON-LD structured data (օր․՝ Book/Article schema)։
 *
 * Օգտագործում.
 * <Seo
 *   title="Գրքի անունը — Հեղինակ"
 *   description="Գրքի կարճ նկարագրություն..."
 *   image="https://ik.imagekit.io/.../cover.jpg"
 *   url={`${SITE_URL}/shop/${book._id}`}
 *   type="product" // կամ "article", "website"
 *   jsonLd={{ ... }} // ցանկության դեպքում
 * />
 */
const Seo = ({
          title,
          description = DEFAULT_DESCRIPTION,
          image = DEFAULT_IMAGE,
          url = SITE_URL,
          type = 'website',
          jsonLd = null,
}) => {
          const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Գրախանութ Online`;
          const trimmedDescription =
                    description && description.length > 160 ? `${description.slice(0, 157)}...` : description;

          return (
                    <Helmet>
                              <title>{fullTitle}</title>
                              <meta name="description" content={trimmedDescription} />
                              <link rel="canonical" href={url} />

                              {/* Open Graph */}
                              <meta property="og:type" content={type} />
                              <meta property="og:title" content={fullTitle} />
                              <meta property="og:description" content={trimmedDescription} />
                              <meta property="og:url" content={url} />
                              <meta property="og:image" content={image} />
                              <meta property="og:locale" content="hy_AM" />
                              <meta property="og:site_name" content={SITE_NAME} />

                              {/* Twitter card */}
                              <meta name="twitter:card" content="summary_large_image" />
                              <meta name="twitter:title" content={fullTitle} />
                              <meta name="twitter:description" content={trimmedDescription} />
                              <meta name="twitter:image" content={image} />

                              {jsonLd && (
                                        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
                              )}
                    </Helmet>
          );
};

export default Seo;