import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  emailTemplate: defineTable({
    email: v.string(),
    design: v.string(),
    description: v.optional(v.string()),
    sentCount: v.optional(v.number()),
    lastSent: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  user: defineTable({
    email: v.string(),
    provider: v.string(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),
});

