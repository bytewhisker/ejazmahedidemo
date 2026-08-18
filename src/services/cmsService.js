import { supabase } from '../lib/supabaseClient';
import { projectsData, awardsData, pressData, clientsData } from '../data/projectsData';

const CMS_STORAGE_KEY = 'ejaz_mehedi_cms_data_v1';

const defaultCmsData = {
  projects: projectsData,
  awards: awardsData,
  press: pressData,
  clients: clientsData,
  info: {
    personalEmail: "ejazmehedidop@gmail.com",
    instagramUrl: "https://www.instagram.com/ejazmehedi",
    linkedinUrl: "https://www.linkedin.com/in/ejazmehedi",
    bioEn: {
      p1: "Ejaz Mehedi is an internationally acclaimed Director & Director of Photography based between London, Paris, and Dhaka. His visual language bridges raw documentary realism with high-fashion, high-octane cinematic aesthetics.",
      p2: "Having spent over a decade crafting commercial films for global houses like Porsche, Nike, and Mercedes-AMG, Ejaz champions analog 35mm film textures [ KODAK 35MM ] alongside ultra-high-speed motion control systems. His narrative work has earned prestigious honors at Cannes Lions [ GOLD CANNES LION ], Sundance, and the British Society of Cinematographers.",
      p3: "Whether helming high-speed automotive velocity campaigns across European alpine passes [ GLOBAL CAMPAIGNS ] or shooting intimate anamorphic portraits in coastal estuaries, Ejaz brings painterly light precision and deeply atmospheric storytelling to every frame."
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
