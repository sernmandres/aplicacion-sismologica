require 'mongo'

module Database
  def self.connect
    # Crear una conexión a MongoDB y asignarla a la variable de instancia @client
    @client = Mongo::Client.new(['127.0.0.1:27017'], :database => 'registros_sismologicos')
    puts "Conexión establecida a MongoDB"
  end

  def self.collection(collection_name)
    # Verificar si la conexión a la base de datos ya está establecida
    unless @client
      connect
    end

    # Obtener la colección solicitada de la base de datos
    @client[collection_name]
  end
end