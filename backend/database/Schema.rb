class Coordinates
    attr_accessor :longitude, :latitude
  
    def initialize(longitude, latitude)
      @longitude = longitude
      @latitude = latitude
    end
  
    def to_hash
      {
        "longitude" => @longitude,
        "latitude" => @latitude
      }
    end
  end
  
  class Attributes
    attr_accessor :external_id, :magnitude, :place, :time, :tsunami, :mag_type, :title, :coordinates
  
    def initialize(external_id, magnitude, place, time, tsunami, mag_type, title, coordinates)
      @external_id = external_id
      @magnitude = magnitude
      @place = place
      @time = time
      @tsunami = tsunami
      @mag_type = mag_type
      @title = title
      @coordinates = coordinates
    end
  
    # Método para convertir la instancia a un hash
    def to_hash
      {
        "external_id" => @external_id,
        "magnitude" => @magnitude,
        "place" => @place,
        "time" => @time,
        "tsunami" => @tsunami,
        "mag_type" => @mag_type,
        "title" => @title,
        "coordinates" => @coordinates.to_hash
      }
    end
  end
  
  class Links
    attr_accessor :external_url
  
    def initialize(external_url)
      @external_url = external_url
    end
  
    # Método para convertir la instancia a un hash
    def to_hash
      {
        "external_url" => @external_url
      }
    end
  end
  
  class FeatureSchema
    attr_accessor :id, :type, :attributes, :links
  
    def initialize(id:, type:, attributes:, links:)
      @id = id
      @type = type
      @attributes = attributes
      @links = links
    end
  
    # Método para convertir la instancia a un hash
    def to_hash
      {
        "id" => @id,
        "type" => @type,
        "attributes" => @attributes.to_hash,
        "links" => @links.to_hash
      }
    end
  end
  