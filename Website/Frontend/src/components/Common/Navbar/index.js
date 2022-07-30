import React from 'react';
import {FaBars} from 'react-icons/fa'
import { useNavigate } from 'react-router';
import {Nav, NavbarContainer, NavLogo, MobileIcon, NavMenu, NavItem, NavLinks, NavBtnLink, NavLinkNoRouter} from './NavbarElements';

const logout = () => {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("roles");
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("tokenType");
    sessionStorage.removeItem("password");
}

const NavbarNoLogin = () => {
    return(
        <NavMenu>
            <NavLinks to="/accedi">Accedi</NavLinks>
            <NavLinks to="/registrazione">Registrati</NavLinks>
        </NavMenu> 
    )
}

const NavbarLogin = () => {
    const navigate = useNavigate();
    return(
        <NavMenu>
            <NavLinks to="/profilo">Benvenuto {sessionStorage.getItem("username")}</NavLinks>
            <NavLinkNoRouter onClick={() => {
                logout();
                navigate('/');
            }}>Esci</NavLinkNoRouter>
        </NavMenu> 
    )
}

const Navbar = ({toggle}) => {
    return (
        <>
            <Nav>
                <NavbarContainer>
                    <NavLogo to='/'>
                        <img 
                            src={require('../../../images/logo.png').default}
                            alt="PetCare Logo"
                        />
                    </NavLogo>
                    <MobileIcon onClick={toggle}>
                        <FaBars style={{verticalAlign: 'unset'}}/>
                    </MobileIcon>
                    <NavMenu>
                        <NavItem>
                            <NavLinks to="/chisiamo">Chi siamo</NavLinks>
                        </NavItem>
                        <NavItem>
                            <NavLinks to="/news">News</NavLinks>
                        </NavItem>
                        <NavItem>
                            <NavLinks to="/faq">FAQ</NavLinks>
                        </NavItem>                            
                    </NavMenu>
                    <NavMenu>
                        <NavBtnLink to="/prenotazione">Prenotazione</NavBtnLink>
                    </NavMenu>
                    {sessionStorage.getItem("isLoggedIn") === 'true' ? NavbarLogin() : NavbarNoLogin()}
                </NavbarContainer>
            </Nav>
        </>
    )
}

export default Navbar
