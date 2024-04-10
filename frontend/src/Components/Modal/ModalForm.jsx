import { useState } from 'react';
import './Modal.css';

function ModalForm({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    id: '',
    body: '',
  });

  function enviarComentario(id, mensaje) {
    const url = `http://localhost:4567/api/features/${id}/comments`;
    const bodyData = { body: mensaje };
    
    console.log("bodyData " , bodyData)
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al enviar el comentario');
      }
      console.log('Comentario enviado exitosamente');
      // Manejar la respuesta del servidor si es necesario
    })
    .catch(error => {
      console.error('Error:', error);
      // Manejar errores de la solicitud
    });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    enviarComentario(formData.id, formData.body); // Llama a la función enviarComentario con los datos del formulario
    onClose();
  };

  if (!isOpen) {
    return null; // Si isOpen es false, el modal no se renderiza
  }

  return (
    <div className="modal-background" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button roboto-bold" onClick={onClose}>&times;</span>
        <h2 className='roboto-regular text-center ca_title-modal'>Generar comentario</h2>
        <p className='roboto-light'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius lorem ut velit feugiat imperdiet. 
          Cras vel auctor metus, at porta mauris. Vestibulum tincidunt commodo ante, sed posuere nunc dictum nec.</p>
        <form onSubmit={handleSubmit}>
          <label className='roboto-light'># de ID</label>
            <input
            className='roboto-regular'
              type="text"
              name="id"
              value={formData.name}
              onChange={handleChange}
              required
            />
          
          <label className='ca_sep-top-label'>Comentario</label>
            <textarea className='roboto-regular'
              name="body"
              value={formData.body}
              onChange={handleChange}
              required
            ></textarea>
          
          <button className='roboto-regular' type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
}

export default ModalForm;
