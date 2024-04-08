require_relative 'Schema'

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
    attributes_data['magnitude'], 
    attributes_data['place'], 
    attributes_data['time'],
    attributes_data['tsunami'],
    attributes_data['magType'],
    attributes_data['title'],
    coordinates)
    links = Links.new(attributes_data["url"])

    featureSchema = FeatureSchema.new(id: id, type: type,attributes: attributes, links: links)

    generate_id += 1
    new_structure << featureSchema.to_hash
    
  end

  return new_structure

end
