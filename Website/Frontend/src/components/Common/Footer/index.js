import React from 'react'
import {FooterContainer, FooterWrap, FooterLinksContainer, FooterLinksWrapperLeft, FooterLinksWrapperCenter, FooterLinksWrapperRight, FooterLinkItems, FooterLinkItemsCenter, FooterLinkItemsRight, FooterLinkTitle, FooterLink, FooterLinkRight, FooterP, SocialIconLink, Rights, RightsWrap, Logo, WebsiteRights} from './FooterElements'
import {FaFacebook, FaTwitter, FaInstagram} from 'react-icons/fa';

const Footer = () => {
    return (
        <FooterContainer>
            <FooterWrap>
                <FooterLinksContainer>
                    <FooterLinksWrapperLeft>
                        <FooterLinkItems style={{marginRight: "auto"}}>
                            <FooterLinkTitle>Informazioni</FooterLinkTitle>
                            <FooterP>PetCare è una piattaforma che permette agli utenti di trovare una sistemazione per il proprio amico a 4 zampe quando non è a casa.</FooterP>
                        </FooterLinkItems>
                    </FooterLinksWrapperLeft>
                    <FooterLinksWrapperCenter>
                        <FooterLinkItemsCenter>
                            <FooterLinkTitle>Link utili</FooterLinkTitle>
                            <FooterLink to="/chisiamo">Chi siamo</FooterLink>
                            <FooterLink to="/news">News</FooterLink>
                            <FooterLink to="/faq">FAQ</FooterLink>
                            <FooterLink to="/prenotazione">Prenotazione</FooterLink>
                            <FooterLink to="/accedi">Accedi</FooterLink>
                            <FooterLink to="/registrazione">Registrati</FooterLink>
                        </FooterLinkItemsCenter>
                    </FooterLinksWrapperCenter>
                    <FooterLinksWrapperRight>
                        <FooterLinkItemsRight>
                            <FooterLinkTitle>Social</FooterLinkTitle>
                            <FooterLinkRight>
                                <SocialIconLink href="//www.facebook.com" target="_blank" aria-label="Facebook"><FaFacebook /></SocialIconLink>
                                <SocialIconLink href="//www.twitter.com" target="_blank" aria-label="Twitter"><FaTwitter /></SocialIconLink>
                                <SocialIconLink href="//www.instagram.com" target="_blank" aria-label="Instagram"><FaInstagram /></SocialIconLink>
                            </FooterLinkRight>
                        </FooterLinkItemsRight>
                    </FooterLinksWrapperRight>
                </FooterLinksContainer>
                <Rights>
                    <RightsWrap>
                        <Logo to='/'>
                        <img 
                            src={require('../../../images/logo.png').default}
                            alt="PetCare Logo"
                        />
                        </Logo>
                        <WebsiteRights>
                            PetCare © {new Date().getFullYear()} All Rights reserved.
                        </WebsiteRights>
                    </RightsWrap>
                </Rights>
            </FooterWrap>
        </FooterContainer>
    )
}

export default Footer
