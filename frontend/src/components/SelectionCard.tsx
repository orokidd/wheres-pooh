import type { Selection, Status } from "../utils/types"
import styles from "../styles/SelectionCard.module.css"

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
			className={styles.selectionContainer} // Fixed spelling
			style={{
				left: currentSelection.x,
				top: currentSelection.y,
			}}>
			<div className="close-btn">
				<button
					onClick={() => {
						setViewSelectionCard(false)
						setCurrentSelection({ x: 0, xPercent: 0, y: 0, yPercent: 0, character: "" })
					}}
					className={styles.closeButton}>
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
						className={styles.selectionButton}
						style={{
							cursor: char.found ? "not-allowed" : "pointer",
							opacity: char.found ? 0.5 : 1,
						}}>
						{char.name}
					</button>
				))}
			</div>
		</div>
	)
}
