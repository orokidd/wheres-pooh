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
	const [submitted, setSubmitted] = useState<boolean>(false)
	const [error, setError] = useState<boolean>(false)

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

			setSubmitted(true)
		} catch (error) {
			console.error("Error submitting score:", error)
			setError(true)
		} finally {
			setIsSubmitting(false)
		}
	}

	function submitButton() {
		if (!submitted)
			return (
				<button className={styles.submitButton} onClick={handleSubmitScore} disabled={isSubmitting || !username.trim()}>
					Submit
				</button>
			)
	}

	function usernameInput() {
		if (!submitted)
			return <input type="text" className={styles.usernameInput} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" disabled={isSubmitting} required />
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
					{error ? (
						<div className="error">
							<p>Failed to submit score. Please try again.</p>
						</div>
					) : null}

					{submitted ? (
						<div className={styles.sucess}>
							<p>Your score has been sent successfully.</p>
						</div>
					) : null}
				</div>

				<div className={styles.inputContainer}>
					{usernameInput()}
					<div className={styles.buttonGroup}>
						<button className={styles.restartButton} onClick={resetGame} style={{ marginLeft: "10px" }}>
							Restart
						</button>

						{submitButton()}
					</div>
				</div>
			</div>
		</div>
	)
}
