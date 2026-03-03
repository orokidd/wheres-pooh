import type { Status } from "../utils/types"
import styles from "../styles/GameStatus.module.css"
import Timer from "./Timer"
import Pooh from "../assets/pooh.png"
import Rapunzel from "../assets/rapunzel.png"
import Zorro from "../assets/zorro.png"
import Aladdin from "../assets/aladdin.png"

const characterImages = {
	Pooh,
	Rapunzel,
	Zorro,
	Aladdin,
}

export default function GameStatus({ status, time }: { status: Status[]; time: number }) {
	return (
		<div className={styles.gameStatus}>
			<ul className={styles.characterList}>
				{status.map((char) => (
					<li key={char.name} style={{ textDecoration: char.found ? "line-through" : "none" }}>
						<img src={characterImages[char.name as keyof typeof characterImages]} alt={char.name} className={styles.characterImage} />
						{char.found ? "✓" : ""}
					</li>
				))}
			</ul>
			<Timer time={time} />
		</div>
	)
}
