function MagType({ possibleMagTypes, magTypes, handleMagTypeChange }) {
  return (
    <div className="ca_filtro-magnitudes">
        <label className="roboto-light title-search ca_types-mag">Tipos de magnitudes</label>
        <div className="ca_mag-options">
          {possibleMagTypes.map((type) => (
            <div className="ca_tipos-magnitud" key={type}>
             <div className="title-filter">
             <label htmlFor={type}>{type}</label>
              <input
                type="checkbox"
                id={type}
                name="magType"
                value={type}
                checked={magTypes.includes(type)}
                onChange={handleMagTypeChange}
              />
             </div>
            </div>
          ))}
        </div>
    </div>
  )
}

export default MagType;