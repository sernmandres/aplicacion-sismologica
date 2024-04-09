function FilterPage({ page, perPage, handlePageChange, handlePerPageChange }) {
  return (
    <div className="ca-filtro-page">
      <div className="title-filter">
        <label className="roboto-light"># página</label>
        <input
          className="roboto-regular"
          type="number"
          id="page"
          name="page"
          min="1"
          value={page}
          onChange={handlePageChange}
        />
      </div>
      <div className="title-filter">
        <label className="roboto-light"># de registro por página</label>
        <input
          className="roboto-regular"
          type="number"
          id="perPage"
          name="perPage"
          min="1"
          value={perPage}
          onChange={handlePerPageChange}
        />
      </div>
    </div>
  );
}

export default FilterPage;
