import FilterPage from './FilterPage'
import MagType from './MagType'
import Search from '../Search/Search'
import './Filter.css'


function Filter({ page, perPage, handlePageChange, handlePerPageChange, searchId, handleSearchChange, possibleMagTypes, magTypes, handleMagTypeChange }) {

  return (
    <div className='ca_filtros'>
      { /*Componente para filtrar por la página y el número de elementos por la página*/}
      <FilterPage
        page={page}
        perPage={perPage}
        handlePageChange={handlePageChange}
        handlePerPageChange={handlePerPageChange}
      />

    { /*Componente para filtrar por el ID del Feature, busca basado en la cantidad de elementos que tiene la página actual max limite 1000 features*/}
      <Search
        searchId={searchId}
        handleSearchChange={handleSearchChange}
      />

      { /*Componente para filtrar por el tipo de magnitud - se encarga de generar los posibles tipos en formato de checkbox*/}
      <MagType
        possibleMagTypes={possibleMagTypes}
        magTypes={magTypes}
        handleMagTypeChange={handleMagTypeChange}
      />
    </div>
  )
}

export default Filter