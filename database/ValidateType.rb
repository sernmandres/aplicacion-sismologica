require_relative 'Schema'

def validate_type_data(id, type, attributes, coordinates, link)
    # Validar que el ID sea un entero
    unless id.is_a?(Integer)
      return false, "Feature no válida #{id}"
    end

    # Validar que el tipo sea un string
    unless type.is_a?(String)
        return false, "Tipo no es una cadena válida: #{type}"
    end

    # Validar que cada atributo tenga el tipo correcto
    unless attributes.external_id.is_a?(String)
        return false, "external_id no es una cadena de texto válida: #{attributes.external_id}"
    end

    unless attributes.magnitude.is_a?(Numeric)
        return false, "magnitude no es un número válido: #{attributes.magnitude}"
    end

    unless attributes.place.is_a?(String)
        return false, "place no es una cadena de texto válida: #{attributes.place}"
    end

    unless attributes.time.is_a?(String)
        return false, "time no es una cadena de texto válida: #{attributes.time}"
    end

    unless [0, 1].include?(attributes.tsunami)
        return false, "tsunami no es un valor válido: #{attributes.tsunami}. Debe ser 0 o 1"
    end

    unless attributes.mag_type.is_a?(String)
        return false, "mag_type no es una cadena de texto válida: #{attributes.mag_type}"
    end

    unless attributes.title.is_a?(String)
        return false, "title no es una cadena de texto válida: #{attributes.title}"
    end

    unless coordinates.longitude.is_a?(Numeric)
        return false, "La longitud no es un número válido: #{coordinates.longitude}"
    end

    unless coordinates.latitude.is_a?(Numeric)
        return false, "La latitud no es un número válido: #{coordinates.latitude}"
    end

    unless link.external_url.is_a?(String)
        return false, "link no es una cadena de texto válida: #{link.external_url}"
    end

    return true, nil
    
    
  end