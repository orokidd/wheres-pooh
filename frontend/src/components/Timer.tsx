import formatTime from "../utils"

export default function Timer({ time }: { time: number }) {
	return (
		<div
			className="timer-display"
			style={{
				position: "fixed",
				top: "20px",
				right: "20px",
				background: "#333",
				color: "white",
				padding: "10px 20px",
				borderRadius: "5px",
				fontSize: "24px",
				fontWeight: "bold",
			}}>
			⏱️ {formatTime(time)}
		</div>
	)
}
