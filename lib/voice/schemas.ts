import { z } from "zod";

const ALLIUM_REGEX = /\b(garlic|onion|leek|shallot|allium|soy|citrus|lemon|lime|orange|grapefruit)\b/i;

export const createLeadInput = z
  .object({
    conversation_id: z.string().min(1),
    name: z.string().min(1),
    phone: z.string().min(7),
    email: z.string().email().optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    party_size: z.number().int().min(1).max(6),
    occasion: z.string().optional(),
    allergies: z.string().optional(),
    notes: z.string().optional(),
  })
  .transform((v) => ({
    ...v,
    allergy_flag: v.allergies ? ALLIUM_REGEX.test(v.allergies) : false,
  }));

export type CreateLeadInput = z.infer<typeof createLeadInput>;

export const privateDiningInput = z.object({
  conversation_id: z.string().min(1),
  name: z.string().min(1),
  phone: z.string().min(7),
  email: z.string().email().optional(),
  party_size: z.number().int().min(7),
  requested_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  occasion: z.string().optional(),
  preferred_experience: z.enum(["tent", "wolfs_lair", "buyout", "unsure"]).optional(),
  notes: z.string().optional(),
});
export type PrivateDiningInput = z.infer<typeof privateDiningInput>;

export const messageForTeamInput = z.object({
  conversation_id: z.string().min(1),
  name: z.string().min(1),
  phone: z.string().min(7),
  reason: z.enum(["refund_dispute", "past_experience", "media", "employment", "other"]),
  notes: z.string().min(1),
});
export type MessageForTeamInput = z.infer<typeof messageForTeamInput>;

export const checkAvailabilityInput = z.object({
  conversation_id: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  party_size: z.number().int().min(1).max(6),
});
export type CheckAvailabilityInput = z.infer<typeof checkAvailabilityInput>;
