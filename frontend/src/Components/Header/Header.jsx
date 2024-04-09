import './Header.css'
import Reloj from '../Reloj/Reloj'
import logo from '../../assets/logo.png'

function Header(){

    return (
        <div className='header'>
            <div className='ca_logo'>
            <img id='logoSismo' src={logo} alt="logo"/>
            </div>

            <div className='ca_nombre-hora'>
                <Reloj />
            </div>
        </div>
    )
}

export default Header;