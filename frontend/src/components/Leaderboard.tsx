import { useEffect, useState } from "react"
import { apiLoadLeaderboard } from "../utils/api"

type Leaderboard = {
	username: string
	time: number
}

export default function Leaderboard() {
	const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false)
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
		}

		loadLeaderboard()
	}, [])

	return (
		<div className="leaderboard-container">
			<div className="show-button">
				<button onClick={showButton}>Leaderboard</button>
			</div>

			<div className={`leaderboard ${showLeaderboard ? "shown" : "hidden"}`}>
				{leaderboard.map((user, index) => (
					<div key={index}>
						<p>{user.username}</p>
						<p>{user.time}s</p>
					</div>
				))}
			</div>
		</div>
	)
}
