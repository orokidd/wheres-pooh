import { useState } from "react"
import formatTime from "../utils"
import { apiSubmitScore } from "../utils/api"

type TimeResult = {
	username: string
	time: number // time in seconds
}

type GameOverProps = {
	time: number
	resetGame: () => void
}

export default function GameOver({ time, resetGame }: GameOverProps) {
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
		<div className="game-over">
			<div className="text">
				<p>Game Over</p>
				<p>You have found all the characters!</p>
				<p className="final-time">Your time: {formatTime(time)}</p>
			</div>

			<div className="username-input">
				<p>Enter your username to save your score</p>
				<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" disabled={isSubmitting} />
				<button onClick={handleSubmitScore} disabled={isSubmitting || !username.trim()}>
					{isSubmitting ? "Submitting..." : "Submit Score"}
				</button>
                
				<button onClick={resetGame} style={{ marginLeft: "10px" }}>
					Play Again
				</button>
			</div>
		</div>
	)
}
