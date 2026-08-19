import { useEffect } from 'react';

/**
 * Dynamic SEO Head Component
 * Automatically updates page title, meta description, og:title, og:description,
 * og:image, and canonical link based on active tab or selected project detail.
 */
export function SEOHead({ activeTab, selectedProject, activeFilter }) {
  useEffect(() => {
    let title = "Ejaz Mehedi | Director of Photography & Cinematographer | MOSHARI, HULU";
    let description = "Official portfolio of Ejaz Mehedi, internationally acclaimed Bangladeshi cinematographer & DOP. Cinematographer of multi-Oscar®-qualifying short film MOSHARI (Exec Produced by Jordan Peele & Riz Ahmed), HULU's Foreigners Only (20th Digital Studio), A Thing About Kashem, and global commercial campaigns.";
    let ogImage = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop";

    if (selectedProject) {
      const projTitle = selectedProject.title || "Project";
      const category = selectedProject.category || "Film";
      const client = selectedProject.client ? ` (${selectedProject.client})` : "";
      
      title = `${projTitle} — ${category}${client} | Ejaz Mehedi DOP`;
      description = selectedProject.story?.background || selectedProject.story?.creativeProcess || `Explore ${projTitle}, a ${category} project shot by Director of Photography Ejaz Mehedi.`;
      ogImage = selectedProject.poster || selectedProject.thumbnail || ogImage;
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

  }, [activeTab, selectedProject, activeFilter]);

  return null;
}
