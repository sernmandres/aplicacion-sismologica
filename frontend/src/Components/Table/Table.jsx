import './Table.css'

function Table({ data }) {

  const formatDate = (timeInMillis) => {
    const date = new Date(parseInt(timeInMillis));
    console.log("date " , date)
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  };

  return (
    <div className="ca_sep-table table-responsive ca_size-table ">
      <table className="table">
        <thead>
          <tr>
            <th className='roboto-bold align-middle text-center' scope="col">ID</th>
            <th className='roboto-bold align-middle text-center'  scope="col">Tipo</th>
            <th className='roboto-bold align-middle text-center' scope="col">ID externo</th>
            <th className='roboto-bold align-middle text-center' scope="col">Magnitud</th>
            <th className='roboto-bold align-middle text-center' scope="col">Lugar</th>
            <th className='roboto-bold align-middle text-center' scope="col">Tiempo</th>
            <th className='roboto-bold align-middle text-center' scope="col">Tsunami</th>
            <th className='roboto-bold magnitudes align-middle text-center' scope="col" >Tipo de magnitud</th>
            <th className='roboto-bold align-middle text-center' scope="col">Titulo</th>
            <th className='roboto-bold align-middle text-center' scope="col">Coordenadas</th>
            <th className='roboto-bold align-middle text-center' scope="col">Enlace</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td className='roboto-light align-middle text-center'>{item.id}</td>
              <td className='roboto-light align-middle text-center'>{item.type}</td>
              <td className='roboto-light align-middle text-center'>{item.attributes.external_id}</td>
              <td className='roboto-light align-middle text-center'>{item.attributes.magnitude}</td>
              <td className='roboto-light align-middle text-center'>{item.attributes.place}</td>
              <td className='roboto-light align-middle text-center'>{formatDate(item.attributes.time)}</td>
              <td className='roboto-light align-middle text-center'>{item.attributes.tsunami}</td>
              <td className='roboto-light align-middle text-center'>{item.attributes.mag_type}</td>
              <td className='roboto-light align-middle text-center'>{item.attributes.title}</td>
              <td className='roboto-light align-middle text-center'>
                <div>
                  <p className='ca-coordenadas-text'>Longitud</p> <p>{item.attributes.coordinates.longitude}</p>
                </div>
                <div>
                  <p className='ca-coordenadas-text'>Latitud</p>  <p>{item.attributes.coordinates.latitude}</p>
                </div>
              </td>
              <td className='align-middle text-center'>
                <a href={item.links ? item.links.external_url : ""}>
                  {item.links ? item.links.external_url : "N/A"}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <p>No hay datos disponibles para el filtro seleccionado.</p>
      )}
    </div>
  );
}

export default Table;
