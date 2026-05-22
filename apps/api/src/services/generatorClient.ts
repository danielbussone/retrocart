export type GenerateCatalogInput = {
  catalogId: string;
};

export class GeneratorNotImplementedError extends Error {
  constructor() {
    super("Catalog generation is not implemented in the scaffold");
    this.name = "GeneratorNotImplementedError";
  }
}

export async function generateCatalog(
  _input: GenerateCatalogInput
): Promise<never> {
  const base = process.env.GENERATOR_URL ?? "http://localhost:8001";
  void base;
  throw new GeneratorNotImplementedError();
}
