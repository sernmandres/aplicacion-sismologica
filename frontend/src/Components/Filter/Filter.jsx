import FilterPage from './FilterPage'
import MagType from './MagType'
import Search from '../Search/Search'
import './Filter.css'


function Filter({ page, perPage, handlePageChange, handlePerPageChange, searchId, handleSearchChange, possibleMagTypes, magTypes, handleMagTypeChange }) {

  return (
    <div className='ca_filtros'>
      <FilterPage
        page={page}
        perPage={perPage}
        handlePageChange={handlePageChange}
        handlePerPageChange={handlePerPageChange}
      />
      <Search
        searchId={searchId}
        handleSearchChange={handleSearchChange}
      />

      <MagType
        possibleMagTypes={possibleMagTypes}
        magTypes={magTypes}
        handleMagTypeChange={handleMagTypeChange}
      />
    </div>
  )
}

export default Filter