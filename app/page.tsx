import { getSlideImages } from '../lib/supabase';
import HomeClient from './HomeClient';

// On-demand revalidation only - no time-based ISR to avoid fallback generation
// This prevents FALLBACK_BODY_TOO_LARGE error on Vercel

export default async function Home() {
  // Fetch ONLY slides on the server for instant initial loading
  // Other data (organizations, scripture, facilities) will be fetched client-side
  const slides = await getSlideImages();

  return <HomeClient initialSlides={slides} />;
}
