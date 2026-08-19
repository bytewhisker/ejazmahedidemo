import { supabase } from '../lib/supabaseClient';
import { projectsData, awardsData, pressData, clientsData } from '../data/projectsData';

const CMS_STORAGE_KEY = 'ejaz_mehedi_cms_data_v3';

const defaultCmsData = {
  projects: projectsData,
  awards: awardsData,
  press: pressData,
  clients: clientsData,
  info: {
    personalEmail: "contact@ejazmehedi.com",
    instagramUrl: "https://www.instagram.com/ejazmehedi",
    linkedinUrl: "https://www.linkedin.com/in/ejazmehedi",
    bioEn: {
      p1: "Born and raised in the cradle of Dhaka, Bangladesh, Ejaz is a self-taught cinematographer and filmmaker working on narratives, commercials, and music videos.",
      p2: "Deeply moved by Rob Reiner's \"Stand By Me\" and Morshedul Islam's \"Dipu Number Two\", the two films perhaps sparked an artistic curiosity and passion for story in his childhood. While pursuing a photography degree in his early twenties with a deep-rooted interest in the art form, Ejaz became heavily invested in motion pictures after working on a series of documentary films.",
      p3: "Recently Ejaz was behind the camera on Jordan Peele and Riz Ahmed's executive produced short film \"MOSHARI\" [ MOSHARI ]. The multi-OSCAR®-qualifying, groundbreaking, genre-bending horror short won 11 awards from 20+ festivals around the world in 2022.",
      p4: "One of Ejaz's other recent films \"FOREIGNERS ONLY\" [ FOREIGNERS ONLY ] is the first Bangladeshi film commissioned for any US streaming platform by 20th Digital Studio. The film recently aired on US streaming giant HULU's Bite Size Halloween Season 3 - Episode 9.",
      p5: "Currently based in Oman and Bangladesh, Ejaz actively seeks stories and projects that resonate with his South Asian roots and identity. He has also shot several commercials and branded content for a variety of clients including Vodafone, Yamaha, Uber, Majid-Al-Futtaim, Muscat Bay, BBC Storyworks, The Global Fund, Omran Group, and more [ GLOBAL CLIENTS ]."
    }
  }
};

/**
 * Get initial CMS data synchronously from localStorage or fallback defaults
 */
export function getInitialCmsData() {
  try {
    const saved = localStorage.getItem(CMS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.projects) && parsed.projects.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to load local CMS cache:", err);
  }
  return defaultCmsData;
}

/**
 * Save CMS data to localStorage and sync to Supabase table
 */
export async function saveCmsData(newData) {
  try {
    // 1. Instantly persist to localStorage
    localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(newData));

    // 2. Sync to Supabase `cms_data` table
    const { data, error } = await supabase
      .from('cms_data')
      .upsert([{ id: 1, payload: newData, updated_at: new Date().toISOString() }], { onConflict: 'id' });

    if (error) {
      console.log("Supabase sync info (table create fallback):", error.message);
    } else {
      console.log("Successfully synced CMS payload to Supabase cloud!");
    }
  } catch (err) {
    console.warn("CMS Save Error:", err);
  }
}

/**
 * Fetch latest CMS payload from Supabase cloud on initial load
 */
export async function fetchCmsDataFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('cms_data')
      .select('payload')
      .eq('id', 1)
      .single();

    if (data && data.payload) {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(data.payload));
      return data.payload;
    }
  } catch (err) {
    console.warn("Supabase fetch fallback:", err.message);
  }
  return null;
}
