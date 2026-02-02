import { useState } from "react";
import { Link } from "react-router-dom";
import siteLogo from "./assets/site-icon.jpeg";
import puzzleImage from "./assets/main-img.jpg"

function App() {
	type Status = {
		name: string;
		found: boolean
	}

	type Seleciton = {
		x: number;
		y: number;
		character: string;
	}

	const [welcomePage, setWelcomePage] = useState<boolean>(true);
	const [characterSelectionCard, setCharacterSelectionCard] = useState<boolean>(false)
	const [gameStatus, setGameStatus] = useState<Status[]>([
		{
			name: "Aladdin",
			found: false
		},
		{
			name: "Merlin",
			found: false
		},
		{
			name: "Rapunzel",
			found: false
		},
		{
			name: "Pooh",
			found: false
		},
	])

	const [currentSelection, setCurrentSelection] = useState<Seleciton>({
		x : 0,
		y : 0,
		character : ""
	})

	async function handleImageClick(e: React.MouseEvent<HTMLImageElement>) {
		const imageInfo = e.currentTarget.getBoundingClientRect()
		const imageLeftGap = imageInfo.left
		const imageTopGap = imageInfo.top
		const currentMouseCoordinatesX = e.clientX 
		const currentMouseCoordinatesY = e.clientY

		const x = currentMouseCoordinatesX - imageLeftGap
		const y = currentMouseCoordinatesY - imageTopGap

		setCurrentSelection((prev) => {
			return {...prev, x, y}
		})

		setCharacterSelectionCard(true)
		// const result:boolean = await checkCharacter({
		// 	x,
		// 	y,
		// 	character
		// })
	}

	if (welcomePage === true)
		return (
			<div>
				<p>Where's Pooh</p>
				<button onClick={() => { setWelcomePage(false); }}>
					Change
				</button>
			</div>
		);

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
			</header>

			<section>
				<h1>Where's Pooh?</h1>
				<p>In order to finish the game, you have to find Winnie the Pooh and all his friends.</p>
			</section>

			<main>
				<div className="image-container">
					<img src={puzzleImage} alt="Puzzle Image" onClick={handleImageClick}/>
				</div>
			</main>

			<div className="character-seleciton">
				<button value="Aladdin">Aladdin</button>
				<button value="Merlin">Merlin</button>
				<button value="Rapunzel">Rapunzel</button>
				<button value="Pooh">Pooh</button>
			</div>
		</>
	);
}

export default App;
