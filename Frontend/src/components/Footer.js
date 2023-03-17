import {Link} from "react-router-dom"
import "../styles/componenets/Footer.css"
import Logo from "../assets/logo.PNG"

export default function Footer()
{
    return (
        <>
            <footer id="footer-container">
                <div className="footer-list">
                    <span className="footer-list-title">Main Links</span>
                    <ul className="footer-list-hyperlinks">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="vehicle">Vehicle</Link></li>
                        <li><Link to="computer">Computer</Link></li>
                        <li><Link to="security">Security</Link></li>
                        <li><Link to="apparel">Apparel</Link></li>
                        <li><Link to="cooking">Cooking</Link></li>
                        <li><Link to="outdoor">Outdoor</Link></li>
                    </ul>
                </div>

                <div className="footer-list">
                    <span className="footer-list-title">FAQ</span>
                    <ul className="footer-list-hyperlinks">
                        <li><Link to="/returns">Return policy</Link></li>
                        <li><Link to="/privacy">Privacy policy</Link></li>
                        <li><Link to="/about">About us</Link></li>
                    </ul>
                </div>

                <div className="footer-list">
                    <span className="footer-list-title">Contact</span>
                    <ul className="footer-list-hyperlinks">
                        <li id="footer-email"><a href="mailto:thegadgetvaultsupport@email.com">thegadgetvaultsupport@email.com</a></li>
                        <li><span href="www.test.com">(416) XXX-XXXX</span></li>
                        <img src={Logo}></img>
                    </ul>
                </div>
            </footer>
        </>
    )
}