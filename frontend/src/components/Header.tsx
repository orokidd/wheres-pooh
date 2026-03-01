import { Link } from "react-router-dom"
import siteLogo from "../assets/site-icon.jpeg"
import Leaderboard from "../components/Leaderboard"

export default function Header() {
	return (
		<header>
			<div className="site-logo">
				<Link to="/">
					<img src={siteLogo} alt="Site logo" />
				</Link>
			</div>

			<Leaderboard />
		</header>
	)
}
