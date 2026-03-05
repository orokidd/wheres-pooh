type WelcomeProps = {
	setWelcomePage: React.Dispatch<React.SetStateAction<boolean>>
	setIsRunning: React.Dispatch<React.SetStateAction<boolean>>
}

import styles from "../styles/Welcome.module.css"

export default function Welcome({ setWelcomePage, setIsRunning }: WelcomeProps) {
	return (
		<div className={styles.container}>
			<section className="game-instruction">
				<h1 className={styles.gameName}>Where's Pooh?</h1>
				<p className={styles.gameDesc}>Find Winnie the Pooh and his friends!</p>
			</section>

			<button
				className={styles.startButton}
				onClick={() => {
					setWelcomePage(false)
					setIsRunning(true)
				}}>
				Start Game
			</button>
		</div>
	)
}
