import { useEffect, useState, useRef } from "react"
import { apiLoadLeaderboard } from "../utils/api"
import styles from "../styles/Leaderboard.module.css"
import formatTime from "../utils"

import { Tailspin } from "ldrs/react"
import "ldrs/react/Tailspin.css"

type Leaderboard = {
	username: string
	time: number
}

export default function Leaderboard() {
	const leaderboardRef = useRef<HTMLDivElement>(null)
	const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(true)
	const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([
		{
			username: "",
			time: 0,
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

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (leaderboardRef.current && !leaderboardRef.current.contains(e.target as Node)) {
				setShowLeaderboard(false)
			}
		}

		if (showLeaderboard) {
			document.addEventListener("mousedown", handleClickOutside)
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [showLeaderboard, setShowLeaderboard])

	return (
		<div className={styles.container} ref={leaderboardRef}>
			<div>
				<button onClick={showButton} className={styles.showButton}>
					Leaderboard
				</button>
			</div>

			<div className={`${styles.leaderboard} ${showLeaderboard ? styles.shown : styles.hidden}`}>
				{loading ? (
					<div className={styles.loadingIcon}>
						<Tailspin size="40" stroke="5" speed="0.9" color="white" />
					</div>
				) : (
					<div className="leaderboardContent">
						<div className={styles.leaderboardHeader}>
							<p>Rank</p>
							<p>Name</p>
							<p>Time</p>
						</div>
						{leaderboard.map((user, index) => (
							<div key={index} className={styles.player}>
								<p>{index + 1}</p>
								<p>{user.username}</p>
								<p>{formatTime(user.time)}</p>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
