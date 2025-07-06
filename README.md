# Frontend Angular – SPA de Reserva de Espacios

Este es el frontend desarrollado en Angular que consume la API RESTful construida con Symfony 7 + API Platform. Permite a los usuarios autenticar, explorar espacios, reservar, editar y cancelar reservas desde una interfaz.

---

## Tecnologías utilizadas

* Angular 19
* Angular Material 
* RxJS
* JWT (Autenticación)
* Bootstrap 5
* FullCalendar

---

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/JhovidReiber/front-reservacion-espacios.git
   cd front-reservacion-espacios
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura el archivo `src/environments/environment.ts`:

   ```ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8000/api'
   };
   ```

4. Inicia la aplicación:

   ```bash
   ng serve
   ```

5. Abre el navegador en:

   ```
   http://localhost:4200
   ```

---

## Autenticación JWT

* El token se obtiene al hacer login (`/api/login`) y se guarda en `localStorage`.
* Se usa un interceptor HTTP para adjuntar automáticamente el token en cada petición protegida.
* Se utilizan `AuthGuard` para proteger las rutas privadas.

---

## Funcionalidades principales

* Login y registro de usuarios.
* Listado de espacios disponibles con filtros (tipo, capacidad, fecha).
* Detalle de espacio con fotos, capacidad y horarios.
* Reservar un espacio con validación de superposición de horarios.
* Ver y cancelar reservas propias.
* Interfaz adaptable con Angular Material y Bootstrap.
* Calendario visual (FullCalendar).

---

## Estructura del proyecto

```
src/
├── app/
│   ├── core/             #  guards, interceptor, models, services
│   ├── shared/           # Componentes compartidos
│   ├── modules/          # home, login, register, spaces, my-reservations 
│   ├── app-routes.ts     # Rutas  
│   └── main.ts
├── environments/
```
