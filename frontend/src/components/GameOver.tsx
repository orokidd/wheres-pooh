import { useState } from "react"
import formatTime from "../utils"
import { apiSubmitScore } from "../utils/api"
import type { TimeResult } from "../utils/types"
import styles from "../styles/GameOver.module.css"

type GameOverProps = {
	gameOver: boolean
	time: number
	resetGame: () => void
}

export default function GameOver({ gameOver, time, resetGame }: GameOverProps) {
	const [username, setUsername] = useState<string>("")
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

	async function handleSubmitScore() {
		if (!username.trim()) {
			alert("Please enter a username")
			return
		}

		setIsSubmitting(true)

		try {
			const timeResult: TimeResult = {
				username: username.trim(),
				time: time,
			}

			const result = await apiSubmitScore(timeResult)

			if (!result) {
				throw new Error("Failed to submit score")
			}

			alert("Score submitted successfully!")
		} catch (error) {
			console.error("Error submitting score:", error)
			alert("Failed to submit score. Please try again.")
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div
			className={styles.container}
			style={{
				display: gameOver ? "flex" : "none",
			}}>
			<div className={styles.box}>
				<div className={styles.text}>
					<p>Game Over</p>
					<p className="final-time">Time: {formatTime(time)}</p>
				</div>

				<div className={styles.inputContainer}>
					<input type="text" className={styles.usernameInput} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" disabled={isSubmitting} />
					<div className={styles.buttonGroup}>
						<button className={styles.restartButton} onClick={resetGame} style={{ marginLeft: "10px" }}>
							Restart
						</button>

						<button className={styles.submitButton} onClick={handleSubmitScore} disabled={isSubmitting || !username.trim()}>
							Submit
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
