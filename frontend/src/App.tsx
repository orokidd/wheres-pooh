import React, { useEffect, useState } from "react"
import type { Selection, Status } from "./utils/types"

import Welcome from "./components/Welcome"
import GameOver from "./components/GameOver"
import Timer from "./components/Timer"
import Header from "./components/Header"
import GameStatus from "./components/GameStatus"
import GameImage from "./components/GameImage"
import SelectionCard from "./components/SelectionCard"
import { apiCheckSelection } from "./utils/api"

const CHARACTERS = ["Aladdin", "Zorro", "Rapunzel", "Pooh"]

function App() {
	const [welcomePage, setWelcomePage] = useState<boolean>(true)
	const [viewSelectionCard, setViewSelectionCard] = useState<boolean>(false)
	const [gameOver, setGameOver] = useState<boolean>(false)

	const [time, setTime] = useState<number>(0)
	const [isRunning, setIsRunning] = useState<boolean>(false)

	const [gameStatus, setGameStatus] = useState<Status[]>(
		CHARACTERS.map((char) => ({ name: char, found: false }))
	)

	const [currentSelection, setCurrentSelection] = useState<Selection>({
		x: 0,
		y: 0,
		character: "",
	})

	function handleImageClick(e: React.MouseEvent<HTMLImageElement>) {
		const imageInfo = e.currentTarget.getBoundingClientRect()

		const x = e.clientX - imageInfo.left
		const y = e.clientY - imageInfo.top

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

	async function checkSelection(selection: Selection) {
		const result = await apiCheckSelection(selection)

		return result // true or false
	}

	function markCharacterAsFound(characterName: string) {
		setGameStatus((prev) => prev.map((char) => (char.name === characterName ? { ...char, found: true } : char)))
	}

	function resetGame() {
		setGameStatus((prev) => prev.map((char) => ({ ...char, found: false })))
		setTime(0)
		setGameOver(false)
		setWelcomePage(true)
	}

	// increment every 1000ms
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
			setIsRunning(false)
			setGameOver(true)
		}
	}, [gameStatus])

	if (welcomePage === true) return <Welcome setWelcomePage={setWelcomePage} setIsRunning={setIsRunning} />

	if (gameOver === true) return <GameOver time={time} resetGame={resetGame} />

	return (
		<>
			<Header />
			<Timer time={time} />
			<GameStatus status={gameStatus} />
			<GameImage imageClick={handleImageClick}>
				<SelectionCard
					viewSelectionCard={viewSelectionCard}
					currentSelection={currentSelection}
					setViewSelectionCard={setViewSelectionCard}
					setCurrentSelection={setCurrentSelection}
					gameStatus={gameStatus}
					handleSelectionClick={handleSelectionClick}
				/>
			</GameImage>
		</>
	)
}

export default App
