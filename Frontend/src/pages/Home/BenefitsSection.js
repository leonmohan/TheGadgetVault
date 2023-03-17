import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faGlobe, faCreditCard, faComment} from "@fortawesome/free-solid-svg-icons"
import "../../styles/Home/BenefitsSection.css"

export default function BenefitsSection()
{
    return(
        <section id="home-benefits-container">
            <ul id="home-benefits-list">
                <li className="home-benefit">
                    <FontAwesomeIcon icon={faGlobe} />
                    <span>Shipping</span>
                    <p>We ship all of our products internationally</p>
                </li>
                <li className="home-benefit">
                    <FontAwesomeIcon icon={faCreditCard} />
                    <span>Payment</span>
                    <p>We accept payment from major credit card providers and PayPal</p>
                </li>
                <li className="home-benefit">
                    <FontAwesomeIcon icon={faComment} />
                    <span>Contact</span>
                    <p>Have any questions? Feel free to contact us by <a href="mailto:mailto:gadgetvaultsupport@email.com">email</a> or phone</p>
                </li>
            </ul>
        </section>
    )
}