## Guía para levantar el servidor y probar la aplicación

### Levantar Backend

#### Dependencias
Las dependencias utilizadas son:

- gem 'sinatra'
- gem 'httparty'
- gem 'json'
- gem 'mongo'
- gem 'rufus-scheduler'
- gem 'tzinfo-data'

#### Proceso
1. **Consumir la URI** `earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson` y mostrar los datos en consola. (Completado)
2. **Crear la base de datos** con MongoDB. (Completado)
3. **Crear la tarea** para que se actualice cada 5 minutos (pasar luego para que lo haga cada 10 minutos). (Completado)
4. **Validaciones antes de guardar en la base de datos:**
   - Validar que no se repita al iniciar el programa. (Completado)
   - Insertar solo nuevos registros por ID. (Completado)
   - Eliminar el registro si el ID que está en la base de datos ya no existe en los datos. (Completado)
   - Validar que el ID del feature no esté en la base de datos. (Completado)
   - Los valores de `title`, `url`, `place`, `magType` y `coordinates` no pueden ser nulos. (Completado)
   - Validar rangos para magnitude [-1.0, 10.0], latitude [-90.0, 90.0] y longitude: [-180.0, 180.0]. (Completado)
5. **Crear endpoint GET:**
   - `curl -X GET '127.0.0.1:3000/api/features' -H 'Content-Type: application/vnd.api+json' -H 'cache-control: no-cache'`. (Completado)
   - Validar que si en la URI se pone algún valor que no corresponde no rompa el programa y se controle el error. (Completado)
6. **Crear endpoint POST:**
   - `curl --request POST --url 127.0.0.1:3000/api/features --header 'content-type: application/json' --data '{"body": "This is a comment" }'`. (Completado)

### Levantar Frontend

1. **Instalar dependencias:** comando: `npm i`.
2. Correr el servidor de mongo en el cmd: `mongod`.
3. En una terminal en la ruta del backend: comando: `ruby server.rb`.
4. En una terminal en la ruta del frontend: comando: `npm run dev`.

#### Proceso
- Crear proyecto con React.
- Crear componente Principal.
- Realizar Fetch con los endpoints de GET.
- Generar tabla con la información de los sismos.
- Generar formulario para enviar comentarios.
- Dar estilos CSS.
- Generar media queries.

## Notas

- Para validar si algún registro no pasa la validación de no estar nil, en el método `reset_program_local` agregar: `data['features'][0]['properties']['title'] = nil` después de `data = JSON.parse(response.body)`. Con esto al reiniciar y volver a subir el servidor se comprueba que el primero registro no cumple con las condiciones.
- Para validar si algún registro no pasa la validación de los valores en los rangos magnitude [-1.0, 10.0], latitude [-90.0, 90.0] y longitude: [-180.0, 180.0], en el método `reset_program_local` agregar: `data['features'][0]['geometry']['coordinates'][1] = -92.0`. Con esto al reiniciar y volver a subir el servidor se comprueba que el primero registro no cumple con las condiciones.
