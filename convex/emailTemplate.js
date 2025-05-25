// import { v } from 'convex/values'
// import { mutation, query } from './_generated/server'

// export const saveTemplate = mutation({
//   args: {
//     tId: v.string(),
//     design: v.any(),
//     email: v.string(),
//     description: v.string()
//   },
//   handler: async (ctx, args) => {
//     try {
//       const result = await ctx.db.insert('emailTemplates', {
//         tId: args.tId,
//         design: args.design,
//         email: args.email,
//         description: args.description
//       })
//       return result
//     } catch (e) {
//       console.error('Error saving template:', e)
//       throw new Error('Failed to save template')
//     }
//   }
// })

// export const GetTemplateDesign = query({
//   args: {
//     email: v.string(),
//     tId: v.string()
//   },
//   handler: async (ctx, args) => {
//     try {
//       const result = await ctx.db
//         .query('emailTemplates')
//         .filter(q =>
//           q.and(
//             q.eq(q.field('tId'), args.tId),
//             q.eq(q.field('email'), args.email)
//           )
//         )
//         .collect()

//       return result[0]
//     } catch (error) {
//       return {}
//     }
//   }
// })

// // On the server-side (Convex)
// export const updatedTemplateDesign = mutation({
//   args: {
//     tId: v.string(),
//     design: v.any() // Assuming 'design' can be any type
//   },
//   handler: async (ctx, args) => {
//     try {
//       const result = await ctx.db
//         .query('emailTemplates')
//         .filter(q => q.eq(q.field('tId'), args.tId))
//         .collect()

//       if (result.length === 0) {
//         throw new Error(`Template with tId ${args.tId} not found.`)
//       }

//       const docId = result[0]._id // Get the document ID
//       console.log(`Template found, updating docId: ${docId}`)

//       // Update the design of the template
//       await ctx.db.patch(docId, { design: args.design })

//       console.log(`Template ${docId} updated successfully.`)
//     } catch (error) {
//       console.error('Error updating template design:', error)
//       throw new Error('Error updating template design.')
//     }
//   }
// })

// export const GetalluserTemplate = query({
//   args: {
//     email: v.string()
//   },
//   handler: async (ctx, args) => {
//     const result = await ctx.db
//       .query('emailTemplates')
//       .filter(q => q.eq(q.field('email'), args.email))
//       .collect()

//     return result
//   }
// })


// export const GetLatestTemplate = query({
//   args: { email: v.string() },
//   handler: async (ctx, { email }) => {
//     const templates = await ctx.db
//       .query("emailTemplates")
//       .filter(q => q.eq(q.field("email"), email))
//       // sort by creation time descending
//       .sort(q.desc(q.field("_creationTime")))
//       .collect();
//     return templates[0] || null;
//   },
// });




// export const DeleteTemplate = mutation ({
//   args: {
//     email: v.string(),
//     tId: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const templates = await ctx.db
//       .query("emailTemplates")
//       .filter((q) =>
//         q.and(
//           q.eq(q.field("tId"), args.tId),
//           q.eq(q.field("email"), args.email)
//         )
//       )
//       .collect();

//     if (templates.length === 0) {
//       throw new Error("Template not found");
//     }

//     await ctx.db.delete(templates[0]._id);

//     return { success: true };
//   },
// });



import { v } from 'convex/values'
import { mutation, query } from './_generated/server'


export const saveOrUpdateTemplate = mutation({
  args: {
    tId: v.string(),
    design: v.any(),
    email: v.string(),
    description: v.string()
  },
  handler: async (ctx, args) => {
    try {
      // Try to find an existing template with this tId and email
      const existing = await ctx.db
        .query('emailTemplates')
        .filter(q =>
          q.and(
            q.eq(q.field('tId'), args.tId),
            q.eq(q.field('email'), args.email)
          )
        )
        .collect();

      if (existing.length > 0) {
        // Update if it exists
        const docId = existing[0]._id;
        await ctx.db.patch(docId, {
          design: args.design,
          description: args.description
        });
        return { success: true, updated: true, message: 'Template updated' };
      } else {
        // Create new if not found
        const newDocId = await ctx.db.insert('emailTemplates', {
          tId: args.tId,
          design: args.design,
          email: args.email,
          description: args.description
        });
        return { success: true, created: true, message: 'Template created' };
      }
    } catch (error) {
      console.error('Error saving or updating template:', error);
      throw new Error('Failed to save or update template');
    }
  }
});


// Get a specific template by email and tId
export const GetTemplateDesign = query({
  args: {
    email: v.string(),
    tId: v.string()
  },
  handler: async (ctx, args) => {
    try {
      const result = await ctx.db
        .query('emailTemplates')
        .filter(q =>
          q.and(
            q.eq(q.field('tId'), args.tId),
            q.eq(q.field('email'), args.email)
          )
        )
        .collect()

      return result[0]
    } catch (error) {
      return {}
    }
  }
})

// Update template design (if template already exists)



// Get all templates for a specific user
export const GetalluserTemplate = query({
  args: {
    email: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    if (!args.email || args.email === "guest@demo.com") {
      // Return all templates for guests
      return await ctx.db.query('emailTemplates').collect();
    }
    // Return only the user's templates
    return await ctx.db
      .query('emailTemplates')
      .filter(q => q.eq(q.field('email'), args.email))
      .collect();
  }
});

// Get the latest template based on creation time
export const GetLatestTemplate = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const templates = await ctx.db
      .query("emailTemplates")
      .filter(q => q.eq(q.field("email"), email))
      // sort by creation time descending
      .sort(q.desc(q.field("_creationTime")))
      .collect();
    return templates[0] || null;
  },
});

// Delete a template by email and tId
export const DeleteTemplate = mutation({
  args: {
    email: v.string(),
    tId: v.string(),
  },
  handler: async (ctx, args) => {
    const templates = await ctx.db
      .query("emailTemplates")
      .filter((q) =>
        q.and(
          q.eq(q.field("tId"), args.tId),
          q.eq(q.field("email"), args.email)
        )
      )
      .collect();

    if (templates.length === 0) {
      throw new Error("Template not found");
    }

    await ctx.db.delete(templates[0]._id);

    return { success: true };
  },
});

export const updateTemplateStats = mutation({
  args: {
    tId: v.string(),
    email: v.string(),
    sentCount: v.number(),
    lastSent: v.number(),
    lastEdited: v.optional(v.number()),
    isActive: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    try {
      const templates = await ctx.db
        .query("emailTemplates")
        .filter((q) =>
          q.and(
            q.eq(q.field("tId"), args.tId),
            q.eq(q.field("email"), args.email)
          )
        )
        .collect();

      if (templates.length === 0) {
        throw new Error("Template not found");
      }

      const docId = templates[0]._id;
      await ctx.db.patch(docId, {
        sentCount: args.sentCount,
        lastSent: args.lastSent,
        ...(args.lastEdited && { lastEdited: args.lastEdited }),
        ...(args.isActive !== undefined && { isActive: args.isActive })
      });

      return { success: true };
    } catch (error) {
      console.error("Error updating template stats:", error);
      throw new Error("Failed to update template statistics");
    }
  }
});
