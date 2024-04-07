require 'sinatra'
require 'json'
require 'httparty'
require_relative 'database'
require 'rufus-scheduler'
require 'tzinfo/data'


ENV['TZ'] = 'America/Bogota'
ENV['URI'] = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'

#Crear conexion a la base de datos noSQL - mongodb
Database.connect

get '/test' do
  begin
    id = params[:id] # Obtener el ID de los parámetros de la URL
    result = Database.collection.find({"id" => id}).to_a
    puts "resultado test"
    puts result
    json_result = result.map { |doc| doc.to_json }
    puts json_result
    content_type :json
    result.to_json
  rescue StandardError => e
    # Manejar cualquier error y devolver un mensaje de error
    status 500
    { error: e.message }.to_json
  end
end

# Metodo para controlar por primera vez el inicio de la aplicación
def reset_program_local
  uri = ENV["URI"]
  # Eliminar todos los documentos existentes en la base de datos
  Database.collection.delete_many({})

  response = HTTParty.get(uri)
  if response.code == 200
    json_data = JSON.parse(response.body)
    inserted_count = json_data['features'].size
    Database.collection.insert_many(json_data['features'])
    puts "Se insertaron #{inserted_count} nuevos registros en la base de datos."
  end
end

def delete_old_data(datos)
  ids_bd = Database.collection.find({}, projection: { _id: 0, id: 1 }).map { |doc| doc["id"] }

  # Capturar los ID nuevos comparando los datos de entrada con los datos locales
  ids_a_eliminar = ids_bd - datos.map{ |feature| feature['id']}

  if ids_a_eliminar.empty?
    puts "No hay datos antiguos para eliminar."
  else
    ids_a_eliminar.each do |id|
      Database.collection.delete_one({ "id" => id })
      puts "Eliminando registro con ID: #{id}"
    end

    puts "Se eliminaron #{ids_a_eliminar.length} registros viejos."
  end
end

def insert_new_data(datos)
  # Obtener los IDs de los elementos en la base de datos en local
  ids_bd = Database.collection.find({}, projection: { _id: 0, id: 1 }).map { |doc| doc["id"] }

  # Capturar los ID nuevos comparando los datos de entrada con los datos locales
  nuevos_ids = datos.map { |feature| feature['id'] } - ids_bd

  # Insertar los nuevos elementos en la base de datos
  nuevos_registros = datos.select { |feature| nuevos_ids.include?(feature['id']) }

  unless nuevos_registros.empty?
    nuevos_registros.each do |registro|
      Database.collection.insert_one(registro)
      puts "Se insertó un nuevo registro con ID: #{registro['id']}"
    end
    puts "Se insertaron #{nuevos_registros.size} nuevos registros en la base de datos."
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
    if data['features'].any?
      #ids_actuales = data['features'].map{ |feature| feature['id'] }
      delete_old_data(data['features'])
      insert_new_data(data['features'])
    else
      puts "No hay datos para cargar a la base de datos."
    end
  else
    raise "Error al consultar la URI: #{response.code}"
  end
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

scheduler.every '15s' do
  update_data
  puts "Se ha ejecutado el Task." 
  puts "-------------------------------------------"
end


