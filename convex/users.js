import { v } from 'convex/values'
import { mutation } from './_generated/server'

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string()
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('email'), args.email))
      .collect()

    // If user exists, return the existing user
    if (existingUser.length > 0) {
      return existingUser[0]
    }

    // Otherwise, create a new user
    const newUser = await ctx.db.insert('users', {
      name: args.name,
      email: args.email,
      picture: args.picture,
      credits: 3
    })

    return newUser
  }
})

