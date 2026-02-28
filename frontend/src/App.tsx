import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import siteLogo from "./assets/site-icon.jpeg"
import puzzleImage from "./assets/main-img.jpg"

type Status = {
	name: string
	found: boolean
}

type Selection = {
	x: number
	y: number
	character: string
}

type TimeResult = {
	username: string
	time: number // time in seconds
}

type Leaderboard = [
	{
		username: string
		time: number
	},
]

const API_KEY = import.meta.env.VITE_API_KEY

function App() {
	const [welcomePage, setWelcomePage] = useState<boolean>(true)
	const [viewSelectionCard, setViewSelectionCard] = useState<boolean>(false)
	const [gameOver, setGameOver] = useState<boolean>(false)
	const [username, setUsername] = useState<string>("")
	const [leaderboard, setLeaderboard] = useState<Leaderboard>([
		{
			username: "dono",
			time: 12,
		},
	])

	const [time, setTime] = useState<number>(0)
	const [isRunning, setIsRunning] = useState<boolean>(false)
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

	const [gameStatus, setGameStatus] = useState<Status[]>([
		{
			name: "Aladdin",
			found: false,
		},
		{
			name: "Zorro",
			found: false,
		},
		{
			name: "Rapunzel",
			found: false,
		},
		{
			name: "Pooh",
			found: false,
		},
	])

	const [currentSelection, setCurrentSelection] = useState<Selection>({
		x: 0,
		y: 0,
		character: "",
	})

	function handleImageClick(e: React.MouseEvent<HTMLImageElement>) {
		const imageInfo = e.currentTarget.getBoundingClientRect()

		const x = e.clientX - imageInfo.left
		const y = Math.ceil(e.clientY - imageInfo.top)

		setCurrentSelection((prev) => {
			return { ...prev, x, y }
		})

		setViewSelectionCard(true)
	}

	async function handleSelectionClick(e: React.MouseEvent) {
		const selectedCharacter = e.currentTarget.id

		const updatedSelection = {
			...currentSelection,
			character: selectedCharacter,
		}

		console.log(updatedSelection)

		const result = await checkSelection(updatedSelection)

		if (result) {
			markCharacterAsFound(selectedCharacter)
		}

		setViewSelectionCard(false)
	}

	function markCharacterAsFound(characterName: string) {
		setGameStatus((prev) => prev.map((char) => (char.name === characterName ? { ...char, found: true } : char)))
	}

	async function checkSelection(selection: Selection) {
		const res = await fetch(`http://localhost:3000/api/check`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-API-Key": API_KEY,
			},
			body: JSON.stringify(selection),
		})

		if (!res.ok) throw new Error("Failed to request.")
		const data = await res.json()
		const { found } = data

		return found // true or false
	}

	// Format time function (MM:SS format)
	function formatTime(totalSeconds: number): string {
		const minutes = Math.floor(totalSeconds / 60)
		const seconds = totalSeconds % 60
		return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
	}

	// Submit score to backend
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

			const response = await fetch(`http://localhost:3000/api/new/scores`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-API-Key": API_KEY,
				},
				body: JSON.stringify(timeResult),
			})

			if (!response.ok) {
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

	function resetGame() {
		setGameStatus([
			{ name: "Aladdin", found: false },
			{ name: "Zorro", found: false },
			{ name: "Rapunzel", found: false },
			{ name: "Pooh", found: false },
		])
		setTime(0)
		setGameOver(false)
		setWelcomePage(true)
		setUsername("")
	}

	// prevtime + 1 every 1000ms
	useEffect(() => {
		let intervalId: number | undefined

		if (isRunning) {
			intervalId = setInterval(() => {
				setTime((prevTime) => prevTime + 1)
			}, 1000)
		}

		return () => {
			if (intervalId) clearInterval(intervalId)
		}
	}, [isRunning])

	// start timer when game starts
	useEffect(() => {
		if (!welcomePage && !gameOver) {
			setIsRunning(true)
		}
	}, [welcomePage, gameOver])

	// check for game completion
	useEffect(() => {
		const charFound = gameStatus.filter((item) => item.found === true)

		if (charFound.length === 4) {
			console.log("Game Over: All characters has been found")
			setIsRunning(false) // Stop the timer
			setGameOver(true)
		}
	}, [gameStatus])

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

	if (welcomePage === true)
		return (
			<div className="welcome">
				<p>Where's Pooh</p>
				<button
					onClick={() => {
						setWelcomePage(false)
					}}>
					Start Game
				</button>
			</div>
		)

	if (gameOver === true)
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

	return (
		<>
			<header>
				<div className="site-logo">
					<Link to="/">
						<img src={siteLogo} alt="Site logo" />
					</Link>
				</div>

				<div className="site-pages">
					<Link to={"/leaderboard"}>Leaderboard</Link>
				</div>

				<div className="leaderboard">
					{leaderboard.map((user, index) => (
						<div key={index}>
							<p>{user.username}</p>
							<p>{user.time}s</p>
						</div>
					))}
				</div>
			</header>

			<section className="game-instruction">
				<h1>Where's Pooh?</h1>
				<p>In order to finish the game, you have to find Winnie the Pooh and all his friends.</p>
			</section>

			{/* Timer Display */}
			<div
				className="timer-display"
				style={{
					position: "fixed",
					top: "20px",
					right: "20px",
					background: "#333",
					color: "white",
					padding: "10px 20px",
					borderRadius: "5px",
					fontSize: "24px",
					fontWeight: "bold",
				}}>
				⏱️ {formatTime(time)}
			</div>

			<div className="game-status">
				<h3>Characters to find:</h3>
				<ul>
					{gameStatus.map((char) => (
						<li key={char.name} style={{ textDecoration: char.found ? "line-through" : "none" }}>
							{char.name} {char.found ? "✓" : ""}
						</li>
					))}
				</ul>
			</div>

			<main>
				<div className="image-container" style={{ position: "relative" }}>
					<img src={puzzleImage} alt="Puzzle Image" onClick={handleImageClick} />

					{viewSelectionCard && (
						<div
							className="character-selection" // Fixed spelling
							style={{
								position: "absolute",
								left: currentSelection.x,
								top: currentSelection.y,
								backgroundColor: "white",
								border: "1px solid black",
								padding: "10px",
								zIndex: 1000,
								borderRadius: "5px",
								boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
							}}>
							<div className="close-btn" style={{ textAlign: "right" }}>
								<button
									onClick={() => {
										setViewSelectionCard(false)
										setCurrentSelection({ x: 0, y: 0, character: "" })
									}}
									style={{
										border: "none",
										background: "none",
										cursor: "pointer",
										fontSize: "16px",
										fontWeight: "bold",
									}}>
									✕
								</button>
							</div>
							<div className="options">
								{gameStatus.map((char) => (
									<button
										value={char.name}
										id={char.name}
										onClick={handleSelectionClick}
										key={char.name} // Fixed: using name as key instead of index
										disabled={char.found}
										style={{
											display: "block",
											width: "100%",
											margin: "5px 0",
											padding: "5px",
											cursor: char.found ? "not-allowed" : "pointer",
											opacity: char.found ? 0.5 : 1,
											backgroundColor: "#f0f0f0",
											border: "1px solid #ccc",
											borderRadius: "3px",
										}}>
										{char.name} {char.found ? "(Found)" : ""}
									</button>
								))}
							</div>
						</div>
					)}
				</div>
			</main>
		</>
	)
}

export default App
