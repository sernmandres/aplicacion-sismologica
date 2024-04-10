import { useState, useEffect } from 'react';
import Table from './Components/Table/Table';
import Header from './Components/Header/Header'
import Filter from './Components/Filter/Filter'
import PaginationFilter from './Components/Filter/PaginationFilter'
import ModalForm from './Components/Modal/ModalForm'
import './App.css'
import './Fonts.css'
import iconComentario from './assets/icon-comentario.png'

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
        return { data: [] };
      }
    })
    .catch((error) => {
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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

  const handlePageChange = (newPage) => {
    const value = newPage
    setPage(isNaN(value) || value < 1 ? 1 : value); // Se asegura de que el valor no sea menor que 1
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
      <div className='ca_contenedor'>
        <div id='ca_menu'>
        <button className='ca_generate-comment' onClick={openModal}>
          <div className='ca_content-img'>
          <img src={iconComentario} alt="" />
          </div>
          <p className='roboto-light ca_text-menu'>Generar <br/ > comentario</p>
        </button>
        </div>

        { /*Aca va todo lo relacionado a la aplicacion principal del metodo GET*/}
        <div id='ca_contenido'>

          <div className='ca_contenedor-tablero'>
            { /*Enunciado de los datos*/}
            <div className='ca-info-reporte'>
              <p className='roboto-light ca_bread'> Reportes / Sitio web / earthquake.usgs.gov </p>
              <h2 className='roboto-light ca_title-bread'>Información tomada de los <strong className='roboto-bold' >últimos 30 días</strong></h2>
            </div>

            { /*Secion de los  filtros*/}
            <div className='ca_info-tablero'>
              <Filter
                page={page}
                perPage={perPage}
                handlePageChange={handlePageChange}
                handlePerPageChange={handlePerPageChange}
                handleSearchChange={handleSearchChange}
                possibleMagTypes={possibleMagTypes}
                magTypes={magTypes}
                handleMagTypeChange={handleMagTypeChange}
              />
            </div>

            <div>
            <Table data={filteredData} />
            <PaginationFilter
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalRecords = {totalRecords}
            />
          </div>

          </div>

        </div>

        <ModalForm isOpen={isModalOpen} onClose={closeModal} />
      </div>
    </>

  );
}

export default App;
