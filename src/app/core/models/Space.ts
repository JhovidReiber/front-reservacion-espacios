export interface Space {
  id: number;
  type_space_id?: number;
  typeSpace?: any;
  name: string;
  description: string;
  capacity: number;
  photos: string; // En la base de datos es `longtext`, pero asumimos que es una cadena en Angular
}
