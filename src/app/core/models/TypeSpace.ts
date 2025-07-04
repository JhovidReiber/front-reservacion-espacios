export interface TypeSpace {
  '@id'?: string;
  id: number;
  name: string;
  description: string;
  spaces?: any[]; // Puedes definir un tipo más específico si lo conoces
}
