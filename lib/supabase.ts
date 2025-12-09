import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const createClientOptions = {
  auth: {
    persistSession: typeof window !== 'undefined',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, createClientOptions)

export interface Leader {
  id: number
  name: string
  role: string
  description: string
  image_url: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface Organization {
  id: number
  name: string
  description: string
  members: { name: string; role: string; image_url: string }[]
  order_index: number
  created_at: string
  updated_at: string
}

export interface Scripture {
  id: number
  verse: string
  reference: string
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SlideImage {
  id: number
  title: string
  image_url: string
  description: string
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AdminSettings {
  id: number
  password_hash: string
  created_at: string
  updated_at: string
}

export interface Facility {
  id: number
  name: string
  description: string
  image_url: string
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface WorshipGuide {
  id: number
  title: string
  image_url: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function getLeaders() {
  const { data, error } = await supabase
    .from('leaders')
    .select('*')
    .order('order_index')

  if (error) {
    console.error('Error fetching leaders:', error)
    return []
  }

  return data as Leader[]
}

export async function updateLeader(id: number, updates: Partial<Leader>) {
  const { data, error } = await supabase
    .from('leaders')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) {
    console.error('Error updating leader:', error)
    return null
  }

  return data[0] as Leader
}

export async function getOrganization() {
  const { data, error } = await supabase
    .from('organization')
    .select('*')
    .order('order_index')

  if (error) {
    console.error('Error fetching organization:', error)
    return []
  }

  return data as Organization[]
}

export async function getActiveScripture() {
  const { data, error } = await supabase
    .from('scripture')
    .select('*')
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching scripture:', error)
    return null
  }

  return data as Scripture
}

export async function getSlideImages() {
  const { data, error } = await supabase
    .from('slide_images')
    .select('*')
    .eq('is_active', true)
    .order('order_index')

  if (error) {
    console.error('Error fetching slide images:', error)
    return []
  }

  return data as SlideImage[]
}

export async function verifyAdminPassword(password: string) {
  const { data, error } = await supabase
    .from('admin_settings')
    .select('password_hash')
    .single()

  if (error) {
    console.error('Error fetching admin settings:', error)
    return false
  }

  return data.password_hash === password
}

export async function getAdminPassword() {
  const { data, error } = await supabase
    .from('admin_settings')
    .select('password_hash')
    .single()

  if (error) {
    console.error('Error fetching admin password:', error)
    throw new Error('Failed to fetch admin password')
  }

  return data.password_hash
}

export async function updateAdminPassword(newPassword: string) {
  const { data, error } = await supabase
    .from('admin_settings')
    .update({ password_hash: newPassword })
    .eq('id', 1)
    .select()

  if (error) {
    console.error('Error updating admin password:', error)
    return false
  }

  return true
}

export async function updateOrganization(id: number, updates: Partial<Organization>) {
  const { data, error } = await supabase
    .from('organization')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) {
    console.error('Error updating organization:', error)
    return null
  }

  return data[0] as Organization
}

export async function addOrganization(organization: Omit<Organization, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('organization')
    .insert(organization)
    .select()

  if (error) {
    console.error('Error adding organization:', error)
    return null
  }

  return data[0] as Organization
}

export async function deleteOrganization(id: number) {
  const { error } = await supabase
    .from('organization')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting organization:', error)
    return false
  }

  return true
}

export async function updateScripture(updates: Partial<Scripture>) {
  const { data, error } = await supabase
    .from('scripture')
    .update(updates)
    .eq('is_active', true)
    .select()

  if (error) {
    console.error('Error updating scripture:', error)
    return null
  }

  return data[0] as Scripture
}

export async function addSlideImage(slide: Omit<SlideImage, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('slide_images')
    .insert(slide)
    .select()

  if (error) {
    console.error('Error adding slide image:', error)
    return null
  }

  return data[0] as SlideImage
}

export async function updateSlideImage(id: number, updates: Partial<SlideImage>) {
  const { data, error } = await supabase
    .from('slide_images')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) {
    console.error('Error updating slide image:', error)
    return null
  }

  return data[0] as SlideImage
}

export async function deleteSlideImage(id: number) {
  const { error } = await supabase
    .from('slide_images')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting slide image:', error)
    return false
  }

  return true
}

export async function getFacilities() {
  const { data, error } = await supabase
    .from('facilities')
    .select('*')
    .eq('is_active', true)
    .order('order_index')

  if (error) {
    console.error('Error fetching facilities:', error)
    return []
  }

  return data as Facility[]
}

export async function updateFacility(id: number, updates: Partial<Facility>) {
  const { data, error } = await supabase
    .from('facilities')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) {
    console.error('Error updating facility:', error)
    return null
  }

  return data[0] as Facility
}

export async function addFacility(facility: Omit<Facility, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('facilities')
    .insert(facility)
    .select()

  if (error) {
    console.error('Error adding facility:', error)
    return null
  }

  return data[0] as Facility
}

export async function deleteFacility(id: number) {
  const { error } = await supabase
    .from('facilities')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting facility:', error)
    return false
  }

  return true
}

export async function getWorshipGuide() {
  const { data, error } = await supabase
    .from('worship_guide')
    .select('*')
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching worship guide:', error)
    return null
  }

  return data as WorshipGuide
}

export async function updateWorshipGuide(updates: Partial<WorshipGuide>) {
  const { data, error } = await supabase
    .from('worship_guide')
    .update(updates)
    .eq('is_active', true)
    .select()

  if (error) {
    console.error('Error updating worship guide:', error)
    return null
  }

  return data[0] as WorshipGuide
}

export async function updateMultipleOrganizationOrder(organizations: Organization[]) {
  try {
    const updates = organizations.map((org, index) => ({
      id: org.id,
      order_index: index + 1
    }));

    for (const update of updates) {
      const { error } = await supabase
        .from('organization')
        .update({ order_index: update.order_index })
        .eq('id', update.id);

      if (error) {
        console.error('Error updating organization order:', error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error updating multiple organization order:', error);
    return false;
  }
}

export async function updateMultipleSlideOrder(slides: SlideImage[]) {
  try {
    const updates = slides.map((slide, index) => ({
      id: slide.id,
      order_index: index + 1
    }));

    for (const update of updates) {
      const { error } = await supabase
        .from('slide_images')
        .update({ order_index: update.order_index })
        .eq('id', update.id);

      if (error) {
        console.error('Error updating slide order:', error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error updating multiple slide order:', error);
    return false;
  }
}

export async function updateMultipleFacilityOrder(facilities: Facility[]) {
  try {
    const updates = facilities.map((facility, index) => ({
      id: facility.id,
      order_index: index + 1
    }));

    for (const update of updates) {
      const { error } = await supabase
        .from('facilities')
        .update({ order_index: update.order_index })
        .eq('id', update.id);

      if (error) {
        console.error('Error updating facility order:', error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error updating multiple facility order:', error);
    return false;
  }
}