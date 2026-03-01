import { useEffect, useState } from "react"

const API_KEY = import.meta.env.VITE_API_KEY

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
			const res = await fetch(`http://localhost:3000/api/scores`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"X-API-Key": API_KEY,
				},
			})

			if (!res.ok) throw new Error("Failed to request.")
			const data = await res.json()
			const { leaderboard } = data

			setLeaderboard(leaderboard)
		}

		loadLeaderboard()
	})

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
