import { Helmet } from "react-helmet-async";
import { useProfile } from "../hooks/useProfile";

export function SeoHead() {
  const { profile } = useProfile();

  const siteUrl = import.meta.env.VITE_SITE_URL ?? "https://anthekira.dev";
  const defaultTitle = "Anthony Bonilla — Junior Full Stack Developer";
  const defaultDescription =
    "Portfolio personal de Anthony Bonilla. Junior Full Stack Developer especializado en desarrollo web, APIs y productos digitales.";

  const title = profile ? `${profile.name} — ${profile.title}` : defaultTitle;
  const description = profile
    ? profile.description.slice(0, 160)
    : defaultDescription;
  const image = profile?.avatarUrl
    ? profile.avatarUrl
    : `${siteUrl}/og-default.jpg`;

  const jsonLd = profile
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        name: profile.name,
        jobTitle: profile.title,
        description: profile.description,
        url: siteUrl,
        image: profile.avatarUrl,
        email: profile.email,
        location: { "@type": "Place", name: profile.location },
        sameAs: profile.socialLinks.flatMap((l) =>
          l.url.startsWith("http") ? [l.url] : []
        ),
      }
    : null;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <link rel="canonical" href={siteUrl} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
