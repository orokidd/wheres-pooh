type Status = {
	name: string
	found: boolean
}

export default function GameStatus({ status }: { status: Status[] }) {
	return (
		<div className="game-status">
			<h3>Characters to find:</h3>
			<ul>
				{status.map((char) => (
					<li key={char.name} style={{ textDecoration: char.found ? "line-through" : "none" }}>
						{char.name} {char.found ? "✓" : ""}
					</li>
				))}
			</ul>
		</div>
	)
}
