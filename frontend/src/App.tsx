import React, { useEffect, useState } from "react"
import puzzleImage from "./assets/main-img.jpg"
import Welcome from "./components/Welcome"
import GameOver from "./components/GameOver"
import Timer from "./components/Timer"
import Header from "./components/Header"

type Status = {
	name: string
	found: boolean
}

type Selection = {
	x: number
	y: number
	character: string
}

const API_KEY = import.meta.env.VITE_API_KEY

function App() {
	const [welcomePage, setWelcomePage] = useState<boolean>(true)
	const [viewSelectionCard, setViewSelectionCard] = useState<boolean>(false)
	const [gameOver, setGameOver] = useState<boolean>(false)

	const [time, setTime] = useState<number>(0)
	const [isRunning, setIsRunning] = useState<boolean>(false)

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
	

	function resetGame() {
		setGameStatus((prev) => prev.map((char) => ({ ...char, found: false })))
		setTime(0)
		setGameOver(false)
		setWelcomePage(true)
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

	// check for game completion
	useEffect(() => {
		const charFound = gameStatus.filter((item) => item.found === true)

		if (charFound.length === 4) {
			console.log("Game Over: All characters has been found")
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setIsRunning(false) // Stop the timer
			setGameOver(true)
		}
	}, [gameStatus])

	if (welcomePage === true)
		return (
			<Welcome setWelcomePage={setWelcomePage} setIsRunning={setIsRunning} />
		)

	if (gameOver === true)
		return (
			<GameOver time={time} resetGame={resetGame}/>
		)

	return (
		<>
			<Header />
			<Timer time={time}/>

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
