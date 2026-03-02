import puzzleImage from "../assets/main-img.jpg"

type Props = {
	imageClick: React.MouseEventHandler<HTMLImageElement>
	children: React.ReactNode
}

export default function GameImage({ imageClick, children }: Props) {
	return (
		<main>
			<div className="image-container" style={{ position: "relative" }}>
				<img src={puzzleImage} alt="Puzzle Image" onClick={imageClick} />
				{children}
			</div>
		</main>
	)
}
