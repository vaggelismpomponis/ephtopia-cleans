'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import type {
  CleaningCategory,
  CleaningStatus,
  CleaningClient,
  CleaningProperty,
  CleaningRecord,
  ActionResult,
} from '@/lib/types/cleanings';

const STORE_PATH = path.join(process.cwd(), 'data', 'cleanings_store.json');

interface FallbackStore {
  clients: CleaningClient[];
  cleanings: CleaningRecord[];
}

/** Helper to read from fallback JSON file */
async function readFallbackStore(): Promise<FallbackStore> {
  try {
    const raw = await fs.readFile(STORE_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { clients: [], cleanings: [] };
  }
}

/** Helper to write to fallback JSON file */
async function writeFallbackStore(data: FallbackStore): Promise<void> {
  try {
    await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write cleanings fallback store:', err);
  }
}

// ──────────────────────────────────────────────────────────────
// CLIENTS ACTIONS
// ──────────────────────────────────────────────────────────────

export async function getClients(category?: CleaningCategory): Promise<CleaningClient[]> {
  await requireAdmin();

  try {
    const supabase = createAdminClient();
    let query = supabase.from('cleaning_clients').select('*, properties:cleaning_properties(*)');
    if (category) {
      query = query.eq('category', category);
    }
    const { data, error } = await query.order('created_at', { ascending: false });

    if (!error && data) {
      return data as CleaningClient[];
    }
  } catch (err) {
    // Supabase table missing or connection error - fallback
  }

  // Fallback store
  const store = await readFallbackStore();
  let list = store.clients;
  if (category) {
    list = list.filter((c) => c.category === category);
  }

  // Compute total cleanings count
  return list.map((c) => ({
    ...c,
    total_cleanings: store.cleanings.filter((cl) => cl.client_id === c.id).length,
  }));
}

export async function getClient(id: string): Promise<CleaningClient | null> {
  await requireAdmin();

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('cleaning_clients')
      .select('*, properties:cleaning_properties(*)')
      .eq('id', id)
      .maybeSingle();

    if (!error && data) {
      return data as CleaningClient;
    }
  } catch (err) {
    // fallback
  }

  const store = await readFallbackStore();
  const found = store.clients.find((c) => c.id === id);
  if (!found) return null;

  return {
    ...found,
    total_cleanings: store.cleanings.filter((cl) => cl.client_id === found.id).length,
  };
}

export async function saveClient(
  data: Partial<CleaningClient> & { newProperty?: Partial<CleaningProperty> }
): Promise<ActionResult<CleaningClient>> {
  await requireAdmin();

  const isEdit = !!data.id;
  const now = new Date().toISOString();

  // Validate required fields
  if (!data.name || !data.name.trim()) {
    return { success: false, error: 'Το όνομα πελάτη είναι υποχρεωτικό' };
  }
  if (!data.phone || !data.phone.trim()) {
    return { success: false, error: 'Το τηλέφωνο είναι υποχρεωτικό' };
  }
  if (!data.category) {
    return { success: false, error: 'Η κατηγορία (Airbnb / Ξενοδοχείο) είναι υποχρεωτική' };
  }

  try {
    const supabase = createAdminClient();
    if (isEdit) {
      const { data: updated, error } = await supabase
        .from('cleaning_clients')
        .update({
          name: data.name,
          category: data.category,
          contact_person: data.contact_person ?? null,
          phone: data.phone,
          email: data.email ?? null,
          notes: data.notes ?? null,
          updated_at: now,
        })
        .eq('id', data.id!)
        .select()
        .single();

      if (!error && updated) {
        revalidatePath('/admin/cleanings');
        return { success: true, data: updated as CleaningClient };
      }
    } else {
      const { data: created, error } = await supabase
        .from('cleaning_clients')
        .insert({
          name: data.name,
          category: data.category,
          contact_person: data.contact_person ?? null,
          phone: data.phone,
          email: data.email ?? null,
          notes: data.notes ?? null,
        })
        .select()
        .single();

      if (!error && created) {
        // If a new property was attached during creation, insert it
        if (data.newProperty?.name && data.newProperty.address) {
          await supabase.from('cleaning_properties').insert({
            client_id: created.id,
            name: data.newProperty.name,
            address: data.newProperty.address,
            area: data.newProperty.area ?? null,
            floor: data.newProperty.floor ?? null,
            access_code: data.newProperty.access_code ?? null,
            entry_instructions: data.newProperty.entry_instructions ?? null,
            cleaning_instructions: data.newProperty.cleaning_instructions ?? null,
          });
        }
        revalidatePath('/admin/cleanings');
        return { success: true, data: created as CleaningClient };
      }
    }
  } catch (err) {
    // fallback
  }

  // Fallback store
  const store = await readFallbackStore();
  let clientResult: CleaningClient;

  if (isEdit) {
    const idx = store.clients.findIndex((c) => c.id === data.id);
    if (idx === -1) return { success: false, error: 'Ο πελάτης δεν βρέθηκε' };

    store.clients[idx] = {
      ...store.clients[idx],
      name: data.name,
      category: data.category,
      contact_person: data.contact_person,
      phone: data.phone,
      email: data.email,
      notes: data.notes,
      updated_at: now,
    };
    clientResult = store.clients[idx];
  } else {
    const newId = crypto.randomUUID();
    const initialProperties: CleaningProperty[] = [];

    if (data.newProperty?.name && data.newProperty.address) {
      initialProperties.push({
        id: crypto.randomUUID(),
        client_id: newId,
        name: data.newProperty.name,
        address: data.newProperty.address,
        area: data.newProperty.area || '',
        floor: data.newProperty.floor || '',
        access_code: data.newProperty.access_code || '',
        entry_instructions: data.newProperty.entry_instructions || '',
        cleaning_instructions: data.newProperty.cleaning_instructions || '',
        created_at: now,
        updated_at: now,
      });
    }

    clientResult = {
      id: newId,
      name: data.name,
      category: data.category,
      contact_person: data.contact_person,
      phone: data.phone,
      email: data.email,
      notes: data.notes,
      created_at: now,
      updated_at: now,
      properties: initialProperties,
    };
    store.clients.unshift(clientResult);
  }

  await writeFallbackStore(store);
  revalidatePath('/admin/cleanings');
  return { success: true, data: clientResult };
}

export async function deleteClient(id: string): Promise<ActionResult> {
  await requireAdmin();

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from('cleaning_clients').delete().eq('id', id);
    if (!error) {
      revalidatePath('/admin/cleanings');
      return { success: true };
    }
  } catch (err) {
    // fallback
  }

  const store = await readFallbackStore();
  store.clients = store.clients.filter((c) => c.id !== id);
  await writeFallbackStore(store);
  revalidatePath('/admin/cleanings');
  return { success: true };
}

// ──────────────────────────────────────────────────────────────
// PROPERTY ACTIONS
// ──────────────────────────────────────────────────────────────

export async function saveProperty(data: Partial<CleaningProperty>): Promise<ActionResult<CleaningProperty>> {
  await requireAdmin();

  if (!data.client_id) {
    return { success: false, error: 'Το ID πελάτη είναι απαραίτητο' };
  }
  if (!data.name || !data.name.trim()) {
    return { success: false, error: 'Το όνομα καταλύματος/δωματίου είναι υποχρεωτικό' };
  }
  if (!data.address || !data.address.trim()) {
    return { success: false, error: 'Η διεύθυνση είναι υποχρεωτική' };
  }

  const isEdit = !!data.id;
  const now = new Date().toISOString();

  try {
    const supabase = createAdminClient();
    if (isEdit) {
      const { data: updated, error } = await supabase
        .from('cleaning_properties')
        .update({
          name: data.name,
          address: data.address,
          area: data.area ?? null,
          floor: data.floor ?? null,
          access_code: data.access_code ?? null,
          entry_instructions: data.entry_instructions ?? null,
          cleaning_instructions: data.cleaning_instructions ?? null,
          updated_at: now,
        })
        .eq('id', data.id!)
        .select()
        .single();

      if (!error && updated) {
        revalidatePath('/admin/cleanings');
        return { success: true, data: updated as CleaningProperty };
      }
    } else {
      const { data: created, error } = await supabase
        .from('cleaning_properties')
        .insert({
          client_id: data.client_id,
          name: data.name,
          address: data.address,
          area: data.area ?? null,
          floor: data.floor ?? null,
          access_code: data.access_code ?? null,
          entry_instructions: data.entry_instructions ?? null,
          cleaning_instructions: data.cleaning_instructions ?? null,
        })
        .select()
        .single();

      if (!error && created) {
        revalidatePath('/admin/cleanings');
        return { success: true, data: created as CleaningProperty };
      }
    }
  } catch (err) {
    // fallback
  }

  // Fallback store
  const store = await readFallbackStore();
  const clientIdx = store.clients.findIndex((c) => c.id === data.client_id);
  if (clientIdx === -1) {
    return { success: false, error: 'Ο πελάτης δεν βρέθηκε' };
  }

  const client = store.clients[clientIdx];
  if (!client.properties) client.properties = [];

  let propResult: CleaningProperty;

  if (isEdit) {
    const propIdx = client.properties.findIndex((p) => p.id === data.id);
    if (propIdx === -1) return { success: false, error: 'Το ακίνητο δεν βρέθηκε' };
    client.properties[propIdx] = {
      ...client.properties[propIdx],
      name: data.name,
      address: data.address,
      area: data.area || '',
      floor: data.floor || '',
      access_code: data.access_code || '',
      entry_instructions: data.entry_instructions || '',
      cleaning_instructions: data.cleaning_instructions || '',
      updated_at: now,
    };
    propResult = client.properties[propIdx];
  } else {
    propResult = {
      id: crypto.randomUUID(),
      client_id: data.client_id,
      name: data.name,
      address: data.address,
      area: data.area || '',
      floor: data.floor || '',
      access_code: data.access_code || '',
      entry_instructions: data.entry_instructions || '',
      cleaning_instructions: data.cleaning_instructions || '',
      created_at: now,
      updated_at: now,
    };
    client.properties.push(propResult);
  }

  store.clients[clientIdx] = client;
  await writeFallbackStore(store);
  revalidatePath('/admin/cleanings');
  return { success: true, data: propResult };
}

export async function deleteProperty(id: string): Promise<ActionResult> {
  await requireAdmin();

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from('cleaning_properties').delete().eq('id', id);
    if (!error) {
      revalidatePath('/admin/cleanings');
      return { success: true };
    }
  } catch (err) {
    // fallback
  }

  const store = await readFallbackStore();
  for (const client of store.clients) {
    if (client.properties) {
      client.properties = client.properties.filter((p) => p.id !== id);
    }
  }
  await writeFallbackStore(store);
  revalidatePath('/admin/cleanings');
  return { success: true };
}

// ──────────────────────────────────────────────────────────────
// CLEANINGS ACTIONS
// ──────────────────────────────────────────────────────────────

export async function getCleanings(
  category?: CleaningCategory,
  date?: string,
  status?: string
): Promise<CleaningRecord[]> {
  await requireAdmin();

  try {
    const supabase = createAdminClient();
    let query = supabase.from('cleaning_records').select('*');

    if (category) query = query.eq('category', category);
    if (date) query = query.eq('scheduled_date', date);
    if (status && status !== 'all') query = query.eq('status', status);

    const { data, error } = await query.order('scheduled_date', { ascending: true }).order('created_at', { ascending: false });

    if (!error && data) {
      return data as CleaningRecord[];
    }
  } catch (err) {
    // fallback
  }

  const store = await readFallbackStore();
  let list = store.cleanings;

  if (category) list = list.filter((c) => c.category === category);
  if (date) list = list.filter((c) => c.scheduled_date === date);
  if (status && status !== 'all') list = list.filter((c) => c.status === status);

  return list.sort((a, b) => {
    if (a.scheduled_date !== b.scheduled_date) {
      return a.scheduled_date.localeCompare(b.scheduled_date);
    }
    return (a.scheduled_time || '').localeCompare(b.scheduled_time || '');
  });
}

export async function getCleaning(id: string): Promise<CleaningRecord | null> {
  await requireAdmin();

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('cleaning_records')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (!error && data) return data as CleaningRecord;
  } catch (err) {
    // fallback
  }

  const store = await readFallbackStore();
  return store.cleanings.find((c) => c.id === id) ?? null;
}

export async function saveCleaning(data: Partial<CleaningRecord>): Promise<ActionResult<CleaningRecord>> {
  await requireAdmin();

  if (!data.property_name || !data.property_name.trim()) {
    return { success: false, error: 'Το όνομα καταλύματος/δωματίου είναι υποχρεωτικό' };
  }
  if (!data.address || !data.address.trim()) {
    return { success: false, error: 'Η διεύθυνση είναι υποχρεωτική' };
  }
  if (!data.scheduled_date) {
    return { success: false, error: 'Η ημερομηνία καθαρισμού είναι υποχρεωτική' };
  }
  if (!data.category) {
    return { success: false, error: 'Η κατηγορία είναι υποχρεωτική' };
  }

  const isEdit = !!data.id;
  const now = new Date().toISOString();

  try {
    const supabase = createAdminClient();
    const payload = {
      category: data.category,
      client_id: data.client_id || null,
      property_id: data.property_id || null,
      client_name: data.client_name || 'Πελάτης Χωρίς Όνομα',
      client_phone: data.client_phone || null,
      property_name: data.property_name,
      address: data.address,
      area: data.area || null,
      floor: data.floor || null,
      access_code: data.access_code || null,
      entry_instructions: data.entry_instructions || null,
      cleaning_instructions: data.cleaning_instructions || null,
      scheduled_date: data.scheduled_date,
      scheduled_time: data.scheduled_time || null,
      status: data.status || 'scheduled',
      priority: data.priority || 'normal',
      cleaner_name: data.cleaner_name || null,
      driver_name: data.driver_name || null,
      linen_requirements: data.linen_requirements || null,
      special_notes: data.special_notes || null,
      price: data.price != null && !isNaN(Number(data.price)) ? Number(data.price) : null,
      updated_at: now,
    };

    if (isEdit) {
      const { data: updated, error } = await supabase
        .from('cleaning_records')
        .update(payload)
        .eq('id', data.id!)
        .select()
        .single();

      if (!error && updated) {
        revalidatePath('/admin/cleanings');
        return { success: true, data: updated as CleaningRecord };
      }
    } else {
      const { data: created, error } = await supabase
        .from('cleaning_records')
        .insert(payload)
        .select()
        .single();

      if (!error && created) {
        revalidatePath('/admin/cleanings');
        return { success: true, data: created as CleaningRecord };
      }
    }
  } catch (err) {
    // fallback
  }

  // Fallback store
  const store = await readFallbackStore();
  let result: CleaningRecord;

  if (isEdit) {
    const idx = store.cleanings.findIndex((c) => c.id === data.id);
    if (idx === -1) return { success: false, error: 'Ο καθαρισμός δεν βρέθηκε' };

    store.cleanings[idx] = {
      ...store.cleanings[idx],
      category: data.category!,
      client_id: data.client_id,
      property_id: data.property_id,
      client_name: data.client_name || 'Πελάτης Χωρίς Όνομα',
      client_phone: data.client_phone,
      property_name: data.property_name!,
      address: data.address!,
      area: data.area,
      floor: data.floor,
      access_code: data.access_code,
      entry_instructions: data.entry_instructions,
      cleaning_instructions: data.cleaning_instructions,
      scheduled_date: data.scheduled_date!,
      scheduled_time: data.scheduled_time,
      status: data.status || 'scheduled',
      priority: data.priority || 'normal',
      cleaner_name: data.cleaner_name,
      driver_name: data.driver_name,
      linen_requirements: data.linen_requirements,
      special_notes: data.special_notes,
      price: data.price != null ? Number(data.price) : null,
      updated_at: now,
    };
    result = store.cleanings[idx];
  } else {
    result = {
      id: crypto.randomUUID(),
      category: data.category!,
      client_id: data.client_id,
      property_id: data.property_id,
      client_name: data.client_name || 'Πελάτης Χωρίς Όνομα',
      client_phone: data.client_phone,
      property_name: data.property_name!,
      address: data.address!,
      area: data.area,
      floor: data.floor,
      access_code: data.access_code,
      entry_instructions: data.entry_instructions,
      cleaning_instructions: data.cleaning_instructions,
      scheduled_date: data.scheduled_date!,
      scheduled_time: data.scheduled_time,
      status: data.status || 'scheduled',
      priority: data.priority || 'normal',
      cleaner_name: data.cleaner_name,
      driver_name: data.driver_name,
      linen_requirements: data.linen_requirements,
      special_notes: data.special_notes,
      price: data.price != null ? Number(data.price) : null,
      created_at: now,
      updated_at: now,
    };
    store.cleanings.unshift(result);
  }

  await writeFallbackStore(store);
  revalidatePath('/admin/cleanings');
  return { success: true, data: result };
}

export async function updateCleaningStatus(id: string, status: CleaningStatus): Promise<ActionResult> {
  await requireAdmin();

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('cleaning_records')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (!error) {
      revalidatePath('/admin/cleanings');
      return { success: true };
    }
  } catch (err) {
    // fallback
  }

  const store = await readFallbackStore();
  const idx = store.cleanings.findIndex((c) => c.id === id);
  if (idx !== -1) {
    store.cleanings[idx].status = status;
    store.cleanings[idx].updated_at = new Date().toISOString();
    await writeFallbackStore(store);
  }

  revalidatePath('/admin/cleanings');
  return { success: true };
}

export async function deleteCleaning(id: string): Promise<ActionResult> {
  await requireAdmin();

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from('cleaning_records').delete().eq('id', id);
    if (!error) {
      revalidatePath('/admin/cleanings');
      return { success: true };
    }
  } catch (err) {
    // fallback
  }

  const store = await readFallbackStore();
  store.cleanings = store.cleanings.filter((c) => c.id !== id);
  await writeFallbackStore(store);
  revalidatePath('/admin/cleanings');
  return { success: true };
}

export async function getCleaningStats(): Promise<{
  airbnbToday: number;
  hotelsToday: number;
  totalUpcoming: number;
  completedToday: number;
}> {
  await requireAdmin();

  const todayStr = new Date().toISOString().split('T')[0];
  const all = await getCleanings();

  return {
    airbnbToday: all.filter((c) => c.category === 'airbnb' && c.scheduled_date === todayStr).length,
    hotelsToday: all.filter((c) => c.category === 'hotel' && c.scheduled_date === todayStr).length,
    totalUpcoming: all.filter((c) => c.scheduled_date >= todayStr && c.status !== 'completed' && c.status !== 'cancelled').length,
    completedToday: all.filter((c) => c.scheduled_date === todayStr && c.status === 'completed').length,
  };
}
