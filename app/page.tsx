import {
  getOrganization,
  getActiveScripture,
  getSlideImages,
  getFacilities
} from '../lib/supabase';
import HomeClient from './HomeClient';

// Ensure content is not cached for too long to keep updates fresh
export const revalidate = 60; // revalidate every 60 seconds

export default async function Home() {
  // Fetch ALL data on the server to prevent client-side waterfals and layout shifts.
  const [organizations, scripture, slides, facilities] = await Promise.all([
    getOrganization(),
    getActiveScripture(),
    getSlideImages(),
    getFacilities()
  ]);

  return (
    <HomeClient
      initialOrganizations={organizations}
      initialScripture={scripture}
      initialSlides={slides}
      initialFacilities={facilities}
    />
  );
}
