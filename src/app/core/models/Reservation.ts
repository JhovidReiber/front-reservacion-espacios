export interface Reservation {
  id: number;
  space_id: number;
  users_id: number;
  name_event: string;
  date_start: string;  // Usamos string porque en JavaScript se maneja como cadena
  date_end: string;    // Usamos string porque en JavaScript se maneja como cadena
}
