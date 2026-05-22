import { findUserById } from "../repos/user.js";
import { builder } from "./builder.js";
import "./types.js";

builder.queryField("health", (t) =>
  t.string({
    resolve: () => "ok",
  })
);

builder.queryField("me", (t) =>
  t.field({
    type: "User",
    nullable: true,
    resolve: async (_root, _args, ctx) => {
      if (!ctx.userId) {
        return null;
      }
      const row = await findUserById(ctx.pool, ctx.userId);
      if (!row) {
        return null;
      }
      return {
        id: row.id,
        email: row.email,
        createdAt: row.created_at,
      };
    },
  })
);
