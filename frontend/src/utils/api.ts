const API_KEY = import.meta.env.VITE_API_KEY
const api = "http://localhost:3000/api"

import type { Selection, TimeResult } from "../utils/types"

export async function apiCheckSelection(selection: Selection) {
	const res = await fetch(`${api}/check`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-API-Key": API_KEY,
		},
		body: JSON.stringify(selection),
	})

	if (!res.ok) throw new Error("Failed to request.")
	const data = await res.json()
	const { found } = data

	return found // true or false
}

export async function apiLoadLeaderboard() {
	const res = await fetch(`${api}/scores`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"X-API-Key": API_KEY,
		},
	})

	if (!res.ok) throw new Error("Failed to request.")
	const data = await res.json()
	const { leaderboard } = data

	return leaderboard
}

export async function apiSubmitScore(result: TimeResult) {
	const res = await fetch(`${api}/new/scores`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-API-Key": API_KEY,
		},
		body: JSON.stringify(result),
	})

	if (!res.ok) throw new Error("Failed to submit score")

	const data = await res.json()
	const { success } = data

	return success
}
