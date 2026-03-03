import formatTime from "../utils"
import styles from "../styles/Timer.module.css"

export default function Timer({ time }: { time: number }) {
	return <div className={styles.timer}>{formatTime(time)}</div>
}
