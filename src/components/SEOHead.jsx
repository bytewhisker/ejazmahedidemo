import { useEffect } from 'react';

const BASE_URL = "https://www.ejazmehedi.com";

/**
 * Dynamic SEO Head Component
 * Automatically updates page title, meta description, canonical, og:title,
 * og:description, og:image, og:url, twitter:url, and JSON-LD schema based on
 * the active tab or the selected project detail (using its SEO slug).
 */
export function SEOHead({ activeTab, selectedProject, activeFilter }) {
  useEffect(() => {
    let title = "Ejaz Mehedi | Director of Photography & Cinematographer | MOSHARI, HULU";
    let description = "Official portfolio of Ejaz Mehedi, internationally acclaimed Bangladeshi cinematographer & DOP. Cinematographer of multi-Oscar®-qualifying short film MOSHARI (Exec Produced by Jordan Peele & Riz Ahmed), HULU's Foreigners Only (20th Digital Studio), A Thing About Kashem, and global commercial campaigns.";
    let ogImage = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop";
    let canonicalUrl = `${BASE_URL}/`;
    let jsonLd = null;

    if (selectedProject) {
      const projTitle = selectedProject.title || "Project";
      const category = selectedProject.category || "Film";
      const client = selectedProject.client ? ` (${selectedProject.client})` : "";
      const slug = selectedProject.slug || selectedProject.id;
      const projectUrl = `${BASE_URL}/projects/${slug}`;

      title = `${projTitle} — ${category}${client} | Ejaz Mehedi DOP`;
      description = selectedProject.story?.background || selectedProject.story?.creativeProcess || `Explore ${projTitle}, a ${category} project shot by Director of Photography Ejaz Mehedi.`;
      ogImage = selectedProject.poster || selectedProject.thumbnail || ogImage;
      canonicalUrl = projectUrl;

      jsonLd = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "@id": `${projectUrl}#creativework`,
        "url": projectUrl,
        "name": projTitle,
        "alternativeHeadline": `${category}${client} by Ejaz Mehedi`,
        "description": description,
        "image": ogImage,
        "genre": category,
        "dateCreated": selectedProject.year || undefined,
        "creator": {
          "@type": "Person",
          "@id": `${BASE_URL}/#person`,
          "name": "Ejaz Mehedi",
          "jobTitle": "Director of Photography & Cinematographer"
        },
        "productionCompany": selectedProject.crew?.productionCompany || undefined,
        "director": selectedProject.crew?.director || undefined,
        "inLanguage": "en"
      };
    } else if (activeTab === 'about') {
      title = "Biography, Awards & Press Archive | Ejaz Mehedi - Cinematographer";
      description = "Biography, award listings, press coverage, and direct contact details for Ejaz Mehedi, Director of Photography based in Oman and Bangladesh.";
      ogImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop";
    } else if (activeTab === 'stills') {
      title = "Still Photography Gallery | Ejaz Mehedi - Cinematographer";
      description = "Still photography portfolio capturing fleeting cinematic moments in 35mm and anamorphic formats by DOP Ejaz Mehedi.";
      ogImage = "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=1000&auto=format&fit=crop";
    } else if (activeFilter === 'films') {
      title = "Narrative Films & Shorts | Ejaz Mehedi - Director of Photography";
      description = "Narrative film portfolio of DOP Ejaz Mehedi including Oscar®-qualifying short MOSHARI, HULU's Foreigners Only, and A Thing About Kashem.";
    } else if (activeFilter === 'commercial') {
      title = "Commercials & Music Videos | Ejaz Mehedi - Cinematographer";
      description = "Commercial cinematography portfolio featuring global brand campaigns for Yamaha, Uber, Vodafone, Omran Group, and Al Mouj.";
    }

    // 1. Update Document Title
    document.title = title;

    // 2. Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    // 3. Update OG Title
    let ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) {
      ogTitleMeta.setAttribute('content', title);
    }

    // 4. Update OG Description
    let ogDescMeta = document.querySelector('meta[property="og:description"]');
    if (ogDescMeta) {
      ogDescMeta.setAttribute('content', description);
    }

    // 5. Update OG Image
    let ogImageMeta = document.querySelector('meta[property="og:image"]');
    if (ogImageMeta) {
      ogImageMeta.setAttribute('content', ogImage);
    }

    // 6. Update Canonical
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', canonicalUrl);
    }

    // 7. Update OG URL
    let ogUrlMeta = document.querySelector('meta[property="og:url"]');
    if (ogUrlMeta) {
      ogUrlMeta.setAttribute('content', canonicalUrl);
    }

    // 8. Update Twitter URL
    let twitterUrlMeta = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrlMeta) {
      twitterUrlMeta.setAttribute('content', canonicalUrl);
    }

    // 9. Update JSON-LD schema
    let jsonLdScript = document.getElementById('seo-jsonld');
    if (jsonLd) {
      if (!jsonLdScript) {
        jsonLdScript = document.createElement('script');
        jsonLdScript.type = 'application/ld+json';
        jsonLdScript.id = 'seo-jsonld';
        document.head.appendChild(jsonLdScript);
      }
      jsonLdScript.textContent = JSON.stringify(jsonLd);
    } else if (jsonLdScript) {
      jsonLdScript.remove();
    }

  }, [activeTab, selectedProject, activeFilter]);

  return null;
}