import type { Selection, Status } from "../utils/types"

type Props = {
	viewSelectionCard: boolean
	currentSelection: Selection
	setViewSelectionCard: React.Dispatch<React.SetStateAction<boolean>>
	setCurrentSelection: React.Dispatch<React.SetStateAction<Selection>>
	gameStatus: Status[]
	handleSelectionClick: React.MouseEventHandler<HTMLButtonElement>
}

export default function SelectionCard({ viewSelectionCard, currentSelection, setViewSelectionCard, setCurrentSelection, gameStatus, handleSelectionClick }: Props) {
	if (!viewSelectionCard) return null

	return (
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
						setCurrentSelection({ x: 0, xPercent: 0, y: 0, yPercent:0, character: "" })
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
						key={char.name}
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
						{char.name}
					</button>
				))}
			</div>
		</div>
	)
}
