import { useState, useEffect } from 'react';
import IconoTime from './IconoTime';
import './Reloj.css';

function Reloj() {
  const [hora, setHora] = useState(new Date().toLocaleTimeString('es-CO', { timeZone: 'America/Bogota' }));

  useEffect(() => {
    const interval = setInterval(() => {
      setHora(new Date().toLocaleTimeString('es-CO', { timeZone: 'America/Bogota' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='ca_horario'>
      <IconoTime />
      <p className='roboto-light ca_espaceIcon'>Hora actual: <strong className='roboto-regular'>{hora}</strong></p>
    </div>
  );
}

export default Reloj;
