import { useState, useEffect } from 'react';
import IconoTime from './IconoTime'
import './Reloj.css'

function Reloj() {
  const [hora, setHora] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setHora(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='ca_horario'>
    <IconoTime />
      <p>Hora: {hora}</p>
    </div>
  );
}

export default Reloj;
