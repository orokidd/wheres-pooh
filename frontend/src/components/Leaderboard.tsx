import { useEffect, useState } from "react"
import { apiLoadLeaderboard } from "../utils/api"
import styles from "../styles/Leaderboard.module.css"

type Leaderboard = {
	username: string
	time: number
}

export default function Leaderboard() {
	const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(true)
	const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([
		{
			username: "dono",
			time: 12,
		},
	])

	function showButton() {
		setShowLeaderboard((prev) => !prev)
	}

	useEffect(() => {
		async function loadLeaderboard() {
			const leaderboard = await apiLoadLeaderboard()

			setLeaderboard(leaderboard)
			setLoading(false)
		}

		loadLeaderboard()
	}, [])

	return (
		<div className={styles.container}>
			<div>
				<button onClick={showButton} className={styles.showButton}>
					Leaderboard
				</button>
			</div>

			<div className={`${styles.leaderboard} ${showLeaderboard ? styles.shown : styles.hidden}`}>
				{loading ? (
					<p>loading...</p>
				) : (
					leaderboard.map((user, index) => (
						<div key={index} className={styles.player}>
							<p>{user.username}</p>
							<p>{user.time}s</p>
						</div>
					))
				)}
			</div>
		</div>
	)
}
