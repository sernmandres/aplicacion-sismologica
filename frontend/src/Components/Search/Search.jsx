function Search({ searchId, handleSearchChange }) {

  return (
    <div className="ca_filtro-search">
      <div className="title-filter">
        <label className="roboto-light title-search">Buscar por # de ID</label>
        <input
          className="roboto-regular"
          type="text"
          id="search"
          name="search"
          value={searchId}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  )
}

export default Search;