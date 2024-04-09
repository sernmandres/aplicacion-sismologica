import { useState, useEffect } from 'react';
import iconoManana from '../../assets/icon-manana.jpg';
import iconoTarde from '../../assets/icon-tarde.jpg';
import iconoNoche from '../../assets/icon-noche.jpg';
import './Reloj.css'

function IconoTime() {
  const [icono, setIcono] = useState('');

  useEffect(() => {
    const horaActual = new Date().getHours();

    const mananaInicio = 6;
    const tardeInicio = 12;
    const nocheInicio = 18;

    if (mananaInicio <= horaActual && horaActual < tardeInicio) {
      setIcono(iconoManana);
    } else if (tardeInicio <= horaActual && horaActual < nocheInicio) {
      setIcono(iconoTarde);
    } else {
      setIcono(iconoNoche);
    }
  }, []);

  return (
    <div>
      {icono && <img className='ca_iconoTiempo' src={icono} alt="Icono del momento del día"/>}

    </div>
  );
}

export default IconoTime;
