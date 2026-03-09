import { Link } from "react-router-dom"
import siteLogo from "../assets/site-icon.jpeg"
import Leaderboard from "../components/Leaderboard"
import styles from "../styles/Header.module.css"

export default function Header({returnHome} : {returnHome: () => void}) {
	return (
		<header className={styles.header}>
			<div className={styles.siteIcon}>
				<Link to="/">
					<img src={siteLogo} alt="Site logo" />
				</Link>
			</div>

			<div className={styles.headerOptions}>
				<button onClick={returnHome}>Home</button>
				<Leaderboard />
			</div>
		</header>
	)
}
