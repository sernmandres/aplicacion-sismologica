import { useState, useEffect } from 'react';
import Table from './Components/Table';
import Header from './Components/Header'

function fetchData(params) {
  let url = 'http://localhost:4567/api/features?';
  
  // Construir la URL con los parámetros de página y por página
  if (params.page) {
    url += `page=${params.page}&`;
  }
  if (params.perPage) {
    url += `per_page=${params.perPage}&`;
  }

  // Agregar mag_type si está presente
  if (params.magTypes.length > 0) {
    url += `mag_type=${params.magTypes.join(',')}&`;
  }

  // Eliminar el último '&' si está presente
  if (url.endsWith('&')) {
    url = url.slice(0, -1);
  }

  return fetch(url)
    .then((res) => res.json())
    .then((responseData) => {
      if (responseData.pagination && responseData.pagination.total) {
        return responseData;
      } else {
        // Resolvemos la promesa con un objeto vacío para indicar que no hay datos disponibles
        return { data: [] };
      }
    })
    .catch((error) => {
      // No necesitamos hacer nada aquí, ya que estamos manejando el caso de falta de datos en el .then
      console.error('Error fetching data:', error);
    });
}

function App() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchId, setSearchId] = useState('');
  const [magTypes, setMagTypes] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  
  // Valores posibles de mag_type
  const possibleMagTypes = ['md', 'ml', 'ms', 'mw', 'me', 'mi', 'mb', 'mlg'];

  useEffect(() => {
    fetchData({ page, perPage, magTypes })
      .then((responseData) => {
        if (responseData.pagination && responseData.pagination.total) {
          setData(responseData.data);
          setTotalPages(Math.ceil(responseData.pagination.total / perPage));
          setTotalRecords(responseData.pagination.total);
          setFilteredData(responseData.data); // Actualizar los datos filtrados
        } else {
          // Si la propiedad pagination o total no está definida, muestra un mensaje de error
          console.log("No se encontraron datos de paginación en la respuesta.");
        }
      })  
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [page, perPage, magTypes]);

  useEffect(() => {
    // Filtrar los datos locales cuando cambie el searchId
    const filtered = data.filter(item => {
      if (!item.id.toString().includes(searchId)) return false;
      if (magTypes.length === 0) return true; // No hay filtro de tipo, devolver verdadero
      return magTypes.includes(item.attributes.mag_type);
    });

    setFilteredData(filtered);
  }, [searchId, magTypes, data]);

  const handlePageChange = (e) => {
    const value = parseInt(e.target.value);
    setPage(isNaN(value) || value <= 0 ? 1 : value);
  };
  
  const handlePerPageChange = (e) => {
    const value = parseInt(e.target.value);
    setPerPage(isNaN(value) || value <= 0 ? 1 : value);
  };

  const handleSearchChange = (e) => {
    setSearchId(e.target.value);
  };

  const handleMagTypeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setMagTypes((prevMagTypes) => [...prevMagTypes, value]);
    } else {
      setMagTypes((prevMagTypes) => prevMagTypes.filter((type) => type !== value));
    }
  };


  return (
    <>
      <Header />
      <div>
        <label htmlFor="page">Page:</label>
        <input
          type="number"
          id="page"
          name="page"
          min="1"
          value={page}
          onChange={handlePageChange}
        />
      </div>
      <div>
        <label htmlFor="perPage">Per Page:</label>
        <input
          type="number"
          id="perPage"
          name="perPage"
          min="1"
          value={perPage}
          onChange={handlePerPageChange}
        />
      </div>

      <div>
        <label htmlFor="search">Search by ID:</label>
        <input
          type="text"
          id="search"
          name="search"
          value={searchId}
          onChange={handleSearchChange}
        />
      </div>

      <div>
        <label>Filter by Mag Type:</label>
        {possibleMagTypes.map((type) => (
          <div key={type}>
            <input
              type="checkbox"
              id={type}
              name="magType"
              value={type}
              checked={magTypes.includes(type)}
              onChange={handleMagTypeChange}
            />
            <label htmlFor={type}>{type}</label>
          </div>
        ))}
      </div>

      <div>
        <Table data={filteredData} />
        {/* <h2>Data:</h2>
        <ul>
          {filteredData.map((item) => (
            <li key={item.id}>
              <p>{item.id}</p>
              <a href={item.links ? item.links.external_url : ""}>{item.attributes.title}</a>
            </li>
          ))}
        </ul>
        {filteredData.length === 0 && (
          <p>No hay datos disponibles para el filtro seleccionado.</p>
        )} */}
      </div>
      <div>
        <p>Current Page: {page}</p>
        <p>Total Pages: {totalPages}</p>
        <p>Total Records: {totalRecords}</p>
      </div>
    </>

  );
}

export default App;
