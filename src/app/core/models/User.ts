export interface User {
  id: number;
  role_id: number;
  name: string;
  username: string;
  password: string;
  state: boolean; // Usamos boolean porque es un `tinyint(1)` en MySQL, que es generalmente utilizado para valores booleanos
}
