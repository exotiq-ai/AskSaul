import { describe, it, expect } from "vitest";
import {
  createLeadInput,
  privateDiningInput,
  messageForTeamInput,
  checkAvailabilityInput,
} from "@/lib/voice/schemas";

describe("createLeadInput", () => {
  it("accepts a minimal valid payload", () => {
    const r = createLeadInput.safeParse({
      conversation_id: "conv_1",
      name: "Alice",
      phone: "+17205551234",
      date: "2026-05-01",
      party_size: 2,
    });
    expect(r.success).toBe(true);
  });

  it("flags allium/soy/citrus allergies", () => {
    const r = createLeadInput.safeParse({
      conversation_id: "conv_1",
      name: "Alice",
      phone: "+17205551234",
      date: "2026-05-01",
      party_size: 2,
      allergies: "Severe garlic allergy",
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.allergy_flag).toBe(true);
  });

  it("does not flag non-sensitive allergies", () => {
    const r = createLeadInput.safeParse({
      conversation_id: "c",
      name: "A",
      phone: "+17205551234",
      date: "2026-05-01",
      party_size: 2,
      allergies: "tree nuts",
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.allergy_flag).toBe(false);
  });

  it("rejects missing required fields", () => {
    const r = createLeadInput.safeParse({ name: "Alice" });
    expect(r.success).toBe(false);
  });
});

describe("privateDiningInput", () => {
  it("requires party_size >= 7", () => {
    const ok = privateDiningInput.safeParse({
      conversation_id: "c",
      name: "B",
      phone: "+17205551234",
      party_size: 8,
    });
    expect(ok.success).toBe(true);
    const bad = privateDiningInput.safeParse({
      conversation_id: "c",
      name: "B",
      phone: "+17205551234",
      party_size: 4,
    });
    expect(bad.success).toBe(false);
  });
});

describe("messageForTeamInput", () => {
  it("requires a valid reason enum", () => {
    const r = messageForTeamInput.safeParse({
      conversation_id: "c",
      name: "B",
      phone: "+17205551234",
      reason: "not_a_reason",
      notes: "hi",
    });
    expect(r.success).toBe(false);
  });

  it("accepts valid reasons", () => {
    for (const reason of ["refund_dispute","past_experience","media","employment","other"]) {
      const r = messageForTeamInput.safeParse({
        conversation_id: "c", name: "B", phone: "+17205551234", reason, notes: "hi",
      });
      expect(r.success, `reason=${reason}`).toBe(true);
    }
  });
});

describe("checkAvailabilityInput", () => {
  it("accepts ISO date + HH:MM time", () => {
    const r = checkAvailabilityInput.safeParse({
      conversation_id: "c",
      date: "2026-05-01",
      time: "19:30",
      party_size: 2,
    });
    expect(r.success).toBe(true);
  });

  it("rejects malformed date", () => {
    const r = checkAvailabilityInput.safeParse({
      conversation_id: "c",
      date: "May 1",
      time: "19:30",
      party_size: 2,
    });
    expect(r.success).toBe(false);
  });
});
