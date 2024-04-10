import './Modal.css';

function Modal({ item, onClose }) {
  return (
    <div className="modal-background" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2>Detalles del elemento</h2>
        <p>ID: {item.id}</p>
        <p>Tipo: {item.type}</p>
        <p>ID Externo: {item.attributes.external_id}</p>
      </div>
    </div>
  );
}

export default Modal