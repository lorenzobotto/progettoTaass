import styled from 'styled-components'
import {Link} from 'react-router-dom'

export const FooterContainer = styled.footer`
    background-color: #101522;
`

export const FooterWrap = styled.div`
    padding: 48px 24px;
    max-width: 1300px;
    margin: 0 auto;
`

export const FooterLinksContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 20px 80px;

    @media screen and (max-width: 820px) {
        padding-top: 32px;
    }
`

export const FooterLinksWrapperLeft = styled.div`
    flex: 1;
    display: flex;
    justify-content: flex-start;
    align-items: top;

    @media screen and (max-width: 820px) {

    }
`

export const FooterLinksWrapperCenter = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: top;

    @media screen and (max-width: 820px) {
        justify-content: flex-start;
    }
`

export const FooterLinksWrapperRight = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: top;

    @media screen and (max-width: 820px) {
        justify-content: flex-start;
    }
`

export const FooterLinkItems = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 16px;
    text-align: left;
    box-sizing: border-box;
    color: #fff;

    @media screen and (max-width: 420px) {
        margin: 0;
        padding: 10px;
    }
`

export const FooterLinkItemsCenter = styled.div`
    display: flex;
    flex-direction: column;
    margin: 16px;
    text-align: left;
    box-sizing: border-box;
    color: #fff;

    @media screen and (max-width: 420px) {
        margin: 0;
        padding: 10px;
    }
`

export const FooterLinkItemsRight = styled.div`
    display: flex;
    flex-direction: column;
    margin: 16px;
    text-align: left;
    box-sizing: border-box;
    color: #fff;

    @media screen and (max-width: 420px) {
        margin: 0;
        padding: 10px;
    }
`

export const FooterLinkTitle = styled.h1`
    font-size: 14px;
    margin-bottom: 16px;
    font-weight: bold;
`

export const FooterLink = styled(Link)`
    color: #fff;
    text-decoration: none;
    margin-bottom: 0.5rem;
    font-size: 14px;

    &:hover {
        color: #01bf71;
        transition: 0.3s ease-out;
    }
`

export const FooterLinkRight = styled.div`
    display: flex;
    flex-direction: row;
`

export const FooterP = styled.p`
    font-size: 14px;
`

export const SocialIconLink = styled.a`
    margin-right: 20px;
    color: #fff;
    font-size: 24px;
    cursor: pointer;

    &:hover {
        color: #01bf71;
        transition: 0.3s ease-out;
    }
`

export const Rights = styled.section`
    width: 100%;
`

export const RightsWrap = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 40px auto 0 auto;

    @media screen and (max-width: 820px) {
        flex-direction: column;
    }
`

export const Logo = styled(Link)`
    color: #fff;
    justify-self: start;
    cursor: pointer;
    text-decoration: none;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    font-weight: bold;
`

export const WebsiteRights = styled.small`
    color: #fff;
`