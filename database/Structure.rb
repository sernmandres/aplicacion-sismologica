require_relative 'Schema'
require_relative 'ValidateType'

def structure_data(data)
  new_structure = []
  generate_id = 1

  data.each do | feature |
    id = generate_id
    type = feature["type"]
    coordinates_data = feature["geometry"]
    attributes_data = feature['properties']

    coordinates = Coordinates.new(coordinates_data['coordinates'][0], coordinates_data['coordinates'][1])
    attributes = Attributes.new(feature["id"], 
    attributes_data['mag'], 
    attributes_data['place'], 
    attributes_data['time'].to_s,
    attributes_data['tsunami'],
    attributes_data['magType'],
    attributes_data['title'],
    coordinates)
    links = Links.new(attributes_data["url"])

    validate, message = validate_type_data(id, type, attributes, coordinates, links)
    if validate
      featureSchema = FeatureSchema.new(id: id, type: type, attributes: attributes, links: links)
      generate_id += 1
      new_structure << featureSchema.to_hash
    else
      puts message
    end

  end
  return new_structure
end
