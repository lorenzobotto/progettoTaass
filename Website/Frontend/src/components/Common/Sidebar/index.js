import React from 'react';
import { useNavigate } from 'react-router';
import {SidebarContainer, Icon, CloseIcon, SidebarWrapper, FirstSidebarMenu, SecondSidebarMenu, SidebarLink, SideBtnWrap, SidebarRoute, SidebarLinkNoRouter} from './SidebarElements';

const logout = () => {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("roles");
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("tokenType");
    sessionStorage.removeItem("password");
}

const SidebarNoLogin = () => {
    return (
        <SecondSidebarMenu>
            <SidebarLink to='/accedi'>Accedi</SidebarLink>
            <SidebarLink to='/registrazione'>Registrati</SidebarLink>
        </SecondSidebarMenu>
    )
}

const SidebarLogin = () => {
    const navigate = useNavigate();
    return (
        <SecondSidebarMenu>
            <SidebarLink to='/profilo'>Benvenuto {sessionStorage.getItem("username")}</SidebarLink>
            <SidebarLinkNoRouter onClick={() => {
                logout();
                navigate('/');
            }}>Esci</SidebarLinkNoRouter>
        </SecondSidebarMenu>
    )
}

const Sidebar = ({isOpen, toggle}) => {
    return (
        <SidebarContainer isOpen={isOpen} onClick={toggle}>
            <Icon onClick={toggle}>
                <CloseIcon />
            </Icon>
            <SidebarWrapper>
                <FirstSidebarMenu>
                    <SidebarLink to='/chisiamo'>Chi siamo</SidebarLink>
                    <SidebarLink to='/news'>News</SidebarLink>
                    <SidebarLink to='/faq'>FAQ</SidebarLink>
                </FirstSidebarMenu>
                <SideBtnWrap>
                    <SidebarRoute to='/prenotazione'>Prenotazione</SidebarRoute>
                </SideBtnWrap>
                {sessionStorage.getItem("isLoggedIn") === 'true' ? SidebarLogin() : SidebarNoLogin()}
            </SidebarWrapper>
        </SidebarContainer>
    )
}

export default Sidebar
