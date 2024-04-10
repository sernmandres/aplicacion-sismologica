function PaginationFilter({ currentPage, totalPages, onPageChange, totalRecords }) {

    const goToPage = (pageNumber) => {
        onPageChange(pageNumber);
    };

    return (
        <div className="ca_pagination">
            <div>
                <p>Página actual: <strong>{currentPage}</strong></p>
                <p>Total de páginas: <strong>{totalPages}</strong></p>
                <p>Total de registros: <strong>{totalRecords}</strong></p>
            </div>
            <div>
                <button className="ca_btn-pages" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                    Pag. anterior
                </button>
                <span className="ca_contador-pages roboto-light"> {currentPage} / {totalPages} </span>
                <button className="ca_btn-pages" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                    Pag. siguiente
                </button>
            </div>
        </div>
    );
}

export default PaginationFilter;
