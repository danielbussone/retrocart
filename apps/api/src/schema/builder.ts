import SchemaBuilder from "@pothos/core";

export type SchemaTypes = {
  Context: import("../context.js").GraphQLContext;
  Objects: {
    User: {
      id: string;
      email: string | null;
      createdAt: Date;
    };
    Game: {
      id: string;
      title: string;
    };
    Console: {
      id: string;
      name: string;
    };
    Genre: {
      id: string;
      name: string;
    };
    RomRelease: {
      id: string;
      fileSizeBytes: string;
    };
    Catalog: {
      id: string;
      name: string;
      status: string;
    };
    CatalogEntry: {
      id: string;
      status: string;
    };
  };
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
};

export const builder = new SchemaBuilder<SchemaTypes>({});

builder.queryType({});
