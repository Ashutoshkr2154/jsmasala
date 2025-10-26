import { Helmet } from 'react-helmet-async';

type SeoProps = {
  title: string;
  description: string;
  canonicalUrl?: string;
};

/**
 * A component to manage page-specific SEO tags (title, description).
 * It automatically appends the brand name to the title.
 */
export function Seo({ title, description, canonicalUrl }: SeoProps) {
  const pageTitle = `${title} | JSM Masala`;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    </Helmet>
  );
}