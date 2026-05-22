import { builder } from "./builder.js";

builder.scalarType("DateTime", {
  serialize: (value) => value.toISOString(),
  parseValue: (value) => {
    if (typeof value === "string") {
      return new Date(value);
    }
    throw new Error("DateTime must be an ISO string");
  },
});

builder.objectType("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    email: t.exposeString("email", { nullable: true }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
  }),
});

builder.objectType("Game", {
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
  }),
});

builder.objectType("Console", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
  }),
});

builder.objectType("Genre", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
  }),
});

builder.objectType("RomRelease", {
  fields: (t) => ({
    id: t.exposeID("id"),
    fileSizeBytes: t.exposeString("fileSizeBytes"),
  }),
});

builder.objectType("Catalog", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    status: t.exposeString("status"),
  }),
});

builder.objectType("CatalogEntry", {
  fields: (t) => ({
    id: t.exposeID("id"),
    status: t.exposeString("status"),
  }),
});
