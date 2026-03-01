type WelcomeProps = {
	setWelcomePage: React.Dispatch<React.SetStateAction<boolean>>
	setIsRunning: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Welcome({ setWelcomePage, setIsRunning }: WelcomeProps) {
	return (
		<div className="welcome">
			<section className="game-instruction">
				<h1>Where's Pooh?</h1>
				<p>In order to finish the game, you have to find Winnie the Pooh and all his friends.</p>
			</section>
            
			<button
				onClick={() => {
					setWelcomePage(false)
					setIsRunning(true)
				}}>
				Start Game
			</button>
		</div>
	)
}
