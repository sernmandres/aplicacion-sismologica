require 'sinatra'
require 'json'
require 'httparty'
require_relative 'database/Connection'
require_relative 'database/Structure'
require 'rufus-scheduler'
require 'tzinfo/data'

# Habilitar CORS para permitir el acceso desde cualquier origen
before do
  response.headers['Access-Control-Allow-Origin'] = '*'
  response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
  response.headers['Access-Control-Allow-Headers'] = 'accept, authorization, origin, content-type'
end

options '*' do
  response.headers['Allow'] = 'HEAD,GET,PUT,DELETE,OPTIONS'
  response.headers['Access-Control-Allow-Headers'] = 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept'
  200
end


ENV['TZ'] = 'America/Bogota'
ENV['URI'] = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'

#Crear conexion a la base de datos noSQL - mongodb
# instancias de las collections
Database.connect
$data_collection = Database.collection(:datos)
$comments_collection = Database.collection(:comentarios)

post '/api/features/:id/comments' do
  begin
    #Capturar el id de /:id/
    feature_id = params[:id].to_i
    #Convertir el string a json para capturar la propiedad del body
    request_data = JSON.parse(request.body.read)
    comment_body = request_data['body']

    #validación para que no pase vacio el comentario
    if comment_body.nil? || comment_body.empty?
      status 400
      return { error: 'El cuerpo del comentario no puede estar vacío' }.to_json
    end

    #Validar que el id de /:id/ si este registrado
    unless $data_collection.find(id: feature_id).first
      status 400
      return { error: "El ID #{feature_id} no existe" }.to_json
    end

    #Insetar o actualizar la informacion de un feature_id
    $comments_collection.find_one_and_update(
      { feature_id: feature_id },
      { '$push': { comments: comment_body } },
      upsert: true
    )

    status 201
    { message: 'Comentario creado exitosamente' }.to_json
  rescue JSON::ParserError
    status 400
    { error: 'Formato JSON inválido en el cuerpo de la solicitud' }.to_json
  rescue StandardError => e
    status 500
    { error: e.message }.to_json
  end
end


# Ruta principal para el método GET
get '/api/features' do
  begin
    page, per_page = get_pagination_parameters
    query = get_mag_type_filter

    # Realizar la consulta a la base de datos con paginación y filtros
    results = get_paginated_results(query, per_page, page)

    # Formato adecuado
    content_type :json
    results.to_json
  rescue StandardError => e
    # Manejar cualquier error y devolver un mensaje de error
    status 500
    { error: e.message }.to_json
  end
end

# Método para obtener los parámetros de paginación y validarlos
def get_pagination_parameters
  page = params[:page]
  per_page = params[:per_page]

  if page && !page.match?(/^\d+$/)
    status 400
    halt({ error: "El valor proporcionado para 'page' no es válido" }.to_json)
  end

  if per_page && !per_page.match?(/^\d+$/)
    status 400
    halt({ error: "El valor proporcionado para 'per_page' no es válido" }.to_json)
  end
  
  per_page = [per_page.to_i, 1000].min unless per_page.nil?

  [page, per_page]
end
# Método para validar y obtener los filtros de mag_type
def get_mag_type_filter
  mag_types = params[:mag_type]

  if !mag_types.nil?
    mag_types = mag_types.split(',') if mag_types.is_a?(String)
    valid_mag_types = mag_types.select { |type| ['md', 'ml', 'ms', 'mw', 'me', 'mi', 'mb', 'mlg'].include?(type) }

    if valid_mag_types.length != mag_types.length
      invalid_mag_types = mag_types - valid_mag_types
      halt 400, { error: "Valores de mag_type no válidos: #{invalid_mag_types.join(', ')}" }.to_json
    end

    query = { 'attributes.mag_type': { '$in': valid_mag_types } }
  else
    query = {}
  end

  query
end

# Método para realizar la consulta a la base de datos y obtener los resultados paginados
def get_paginated_results(query, per_page, page)
  features = $data_collection.find(query).limit(per_page.to_i).skip((page.to_i - 1) * per_page.to_i)
  features_array = features.to_a

  total_records = $data_collection.count_documents(query)

  { data: features_array, pagination: { current_page: page.to_i, total: total_records, per_page: per_page} }
end

# Metodo para controlar por primera vez el inicio de la aplicación
def reset_program_local
  uri = ENV["URI"]
  # Eliminar todos los documentos existentes en la base de datos
  $data_collection.delete_many({})
  response = HTTParty.get(uri)

  if response.success?
    data = JSON.parse(response.body)
    records_without_nil = filter_data(data['features'])
    records = validate_range(records_without_nil)
    new_structure = structure_data(records)
    if new_structure.any?
      total_records = new_structure.size
      $data_collection.insert_many(new_structure)
      puts "Se insertaron #{total_records} nuevos registros en la base de datos."
    end
  else
    raise "Error al consultar la URI: #{response.code}"
  end
end

def delete_old_data(data)
  ids_bd = $data_collection.find({}, projection: { _id: 0, id: 1 }).map { |feature| feature["id"] }

  # Capturar los ID nuevos comparando los datos de entrada con los datos locales
  ids_to_delete = ids_bd - data.map{ |feature| feature['id']}

  if ids_to_delete.empty?
    puts "No hay datos antiguos para eliminar."
  else
    ids_to_delete.each do |id|
      $data_collection.delete_one({ "id" => id })
      puts "Eliminando registro con ID: #{id}"
    end
    puts "Se eliminaron #{ids_to_delete.length} registros viejos."
  end
end

def insert_new_data(data)
  # Obtener los IDs de los elementos en la base de datos en local
  ids_bd = $data_collection.find({}, projection: { _id: 0, id: 1 }).map { |feature| feature["id"] }

  # Capturar los ID nuevos comparando los datos de entrada con los datos locales
  new_ids = data.map { |feature| feature['id'] } - ids_bd

  # Insertar los nuevos elementos en la base de datos
  new_records = data.select { |feature| new_ids.include?(feature['id']) }

  unless new_records.empty?
    new_records.each do |record|
      $data_collection.insert_one(record)
      puts "Se insertó un nuevo registro con ID: #{record['id']}"
    end
    puts "Se insertaron #{new_records.size} nuevos registros en la base de datos."
  else
    puts "No hay nuevos datos para agregar."
  end
end

# Metodo principal
# consultar el endpoint de https://earthquake.usgs.gov
# comprobar valores antes de agregar a la base de datos
# llama los metodos de eliminar y actualizar los datos
def update_data
  uri = ENV["URI"]
  response = HTTParty.get(uri)

  if response.success?
    puts "Respuesta ok del servidor earthquake.usgs.gov"
    data = JSON.parse(response.body)
    records_without_nil = filter_data(data['features'])
    records = validate_range(records_without_nil)
    new_structure = structure_data(records)
    if new_structure.any?
      delete_old_data(new_structure)
      insert_new_data(new_structure)
    else
      puts "No hay datos para cargar a la base de datos."
    end
  else
    raise "Error al consultar la URI: #{response.code}"
  end
end

#Metodo para validar rangos
def validate_range(data)
  filtered_data = data.reject do |feature|
    mag = feature['properties']['mag']
    lat = feature['geometry']['coordinates'][1]
    long = feature['geometry']['coordinates'][0]
    id = feature['id']

    if !mag.between?(-1.0, 10.0)
      puts "ID #{id}: La magnitud está fuera del rango permitido: #{mag}"
      true
    elsif !lat.between?(-90.0, 90.0)
      puts "ID #{id}: La latitud está fuera del rango permitido: #{lat}"
      true
    elsif !long.between?(-180.0, 180.0)
      puts "ID #{id}: La longitud está fuera del rango permitido: #{long}"
      true
    else
      false
    end
  end
  filtered_data
end

#Metodo para verificar con los criterios de las propiedades
# en caso de que alguna de estas condiciones no se cumpla no se agrega el registro a la base de datos
def filter_data(data)
  filtered_data = data.reject do | feature |
    if feature['properties']['title'].nil? || 
      feature['properties']['url'].nil? || 
      feature['properties']['place'].nil? || 
      feature['properties']['magType'].nil? || 
      feature['geometry']['coordinates'].nil? || 
      feature['geometry']['coordinates'].empty?
      
      puts "Registro con ID #{feature['id']} no pasa la validación:"
      puts "Title: #{feature['properties']['title']}"
      puts "URL: #{feature['properties']['url']}"
      puts "Place: #{feature['properties']['place']}"
      puts "MagType: #{feature['properties']['magType']}"
      puts "Coordinates: #{feature['geometry']['coordinates']}"
      puts "-----------------------------------"
      
      true # Si algún campo es nil, el registro no pasa la validación
    else
      false # Si todos los campos tienen datos, el registro pasa la validación
    end
  end
  filtered_data
end

# Realizar la tarea una vez al iniciar la aplicación
# En este caso de practico de pruebas en local, como se inicia y apaga el servidor constante para evitar que se dupliquen datos
# es mejor controlar que no pase, por lo cual antes de cada inicio de servidor se eliminan y se lleman los datos
# En un mundo real no debería de pasar, pero por la prueba genero este control.
reset_program_local

#Task
#Encargada de actualizar los registros para los endpoint
#Se actualizará cada 10 minutos
scheduler = Rufus::Scheduler.new

scheduler.every '10m' do
  update_data
  puts "Se ha ejecutado el Task." 
  puts "-------------------------------------------"
end


