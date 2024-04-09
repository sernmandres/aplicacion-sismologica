function Table({ data }) { // <-- Aquí desestructuras la propiedad data
  
  
    return (
      <>
        <h2>asdasd:</h2>
        <ul>
          {data.map((item) => (
            <li key={item.id}>
              <p>{item.id}</p>
              <a href={item.links ? item.links.external_url : ""}>{item.attributes.title}</a>
            </li>
          ))}
        </ul>
        {data.length === 0 && (
          <p>No hay datos disponibles para el filtro seleccionado.</p>
        )}
      </>
    );
  }

  
  
  export default Table;
  