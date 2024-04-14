import { useState } from 'react';
import './Modal.css';
import 'react-toastify/dist/ReactToastify.css';

function ModalForm({ handleAlert, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    id: '',
    body: '',
  });

  function enviarComentario(id, mensaje) {
    const url = `http://localhost:4567/api/features/${id}/comments`;
    const bodyData = { body: mensaje };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    })
      .then(response => {
        if (!response.ok) {
          handleAlert({
            "status": "error",
            "msg": "'No se ha podido registrar el comentario, intenta nuevamente.'"
          });
          setFormData({ id: '', body: '' });
        } else {
          handleAlert({
            "status": "success",
            "msg": "Se ha registrado correctamente el comentario."
          });
          setFormData({ id: '', body: '' });
        }
      })
      .catch(error => {
        console.error('Error:', error);
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
    enviarComentario(formData.id, formData.body);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="modal-background" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <span className="close-button roboto-bold" onClick={onClose}>&times;</span>
          <h2 className='roboto-regular text-center ca_title-modal'>Generar comentario</h2>
          <p className='roboto-light'>Queremos recordarles que el formulario está diseñado específicamente para comentar sobre el sismo <strong className='roboto-bold'>utilizando su ID.</strong> 
          Asegúrense de incluir toda la información relevante para una <strong className='roboto-bold'>discusión precisa y constructiva.</strong></p>
          <form onSubmit={handleSubmit}>
            <label className='roboto-light'># de ID</label>
            <input
              className='roboto-regular'
              type="number"
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

    </>


  );
}

export default ModalForm;
