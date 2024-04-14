#Guia para levantar el servidor y probar la aplicación
Levantar Backend
Dependencias:
Dependencias utilizadas
gem 'sinatra'
gem 'httparty'
gem 'json'
gem 'mongo'
gem 'rufus-scheduler'
gem 'tzinfo-data'


Levantar Frontend
Instalar dependencias -> comando: npm i

1. Correr el servidor de mongo en el cmd -> mongod
2. En una terminal en la ruta del backend -> comando: ruby server.rb
3. En una terminal en la ruta del frotend -> comando: npm run dev


Proceso
BACKEND
1. consumir la uri earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson y mostrar los datos en consola -- ok
2. crear la base de datos con mongodb --ok
3. crear el Task para que actualice cada 5min (pasar luego para que lo haga cada 10min) -- ok
4. VALIDACIONES ANTE DE GUARDAR A LA BASE DE DATOS
NOTA: validar que no se repita al iniciar el programa - ok
Insertar solo nuevos registros por ID - ok
que pasa si el id que esta en la db ya no existe en los datos: eliminarlo - ok
################################################
4.1 validar que el id del feature no este en la base de datos (No deben duplicarse registros si se lanza la task más de una vez.) - ok
4.2 valores de `title`, `url`, `place`, `magType` y coordinates no pueden ser nulos. - ok
4.3 Validar rangos para magnitude [-1.0, 10.0], latitude [-90.0, 90.0] y longitude: [-180.0, 180.0] - ok

5. crear endpoint GET 
curl -X GET \
'127.0.0.1:3000/api/features... \
-H 'Content-Type: application/vnd.api+json' \
-H 'cache-control: no-cache' -- ok

curl -X GET \
'127.0.0.1:3000/api/features... \
-H 'Content-Type: application/vnd.api+json' \
-H 'cache-control: no-cache' -- ok

validar que si en la uri se pone algun valor que no corresponde no rompa el programa y se controle el error -- ok

6. crear endpoint POST --ok
curl --request POST \
--url 127.0.0.1:3000/api/features... \
--header 'content-type: application/json' \
--data '{"body": "This is a comment" }'

exportar de postman la carpeta con todas los endpoint --ok

FRONTEND
Crear proyecto con React
Crear componente Principal
Realizar Fetch con los endpoints de get
Generar tabla con la información de los sismos
Generar formulario para enviar comentarios
Dar Estilos css
Generar medias querys


#Notas
Para validar si algún registro no pasa la validación de no estar nil:
En el metodo reset_program_local agregar:
data['features'][0]['properties']['title'] = nil
luego de: data = JSON.parse(response.body)
Con esto al reiniciar y volver a subir el servidor se comprueba que el primero registro no cumple con las condiciones.

Para validar si algún registro no pasa la validación de los valores en los rangos magnitude [-1.0, 10.0], latitude [-90.0, 90.0] y longitude: [-180.0, 180.0]:
En el metodo reset_program_local agregar:
data['features'][0]['geometry']['coordinates'][1] = -92.0
Con esto al reiniciar y volver a subir el servidor se comprueba que el primero registro no cumple con las condiciones.