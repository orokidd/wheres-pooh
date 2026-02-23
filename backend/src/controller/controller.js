const prisma = require("../config/prisma");
const API_KEY = process.env.API_KEY;

const characters = {
	Aladdin: { xMin: 320, xMax: 380, yMin: 180, yMax: 260 },
	Merlin: { xMin: 500, xMax: 560, yMin: 300, yMax: 370 },
	Rapunzel: { xMin: 320, xMax: 380, yMin: 180, yMax: 260 },
	Pooh: { xMin: 500, xMax: 560, yMin: 300, yMax: 370 },
};

function checkUserInput(req, res) {
	const { x, y, character } = req.body;
	const apiKey = req.headers.apiKey;

	if (apiKey !== API_KEY) {
		return res.status(401).json({ success: false, message: "Unauthorized" });
	}

	const target = characters[character];
	if (!target) return res.status(400).json({ success: false, message: "Invalid character." });

	const isFound = x >= target.xMin && x <= target.xMax && y >= target.yMin && y <= target.yMax;

	res.json({ sucess: isFound, character });
}

async function addToLeaderboard(req, res) {
	const { username, time } = req.body;
	const apiKey = req.headers.apiKey;

	if (apiKey !== API_KEY) {
		return res.status(401).json({ success: false, message: "Unauthorized" });
	}

	if (!username || !time) {
		return res.status(400).json({ success: false, message: "Invalid username or time" });
	}

	await prisma.leaderboard.create({
		data: {
			username,
			time,
		},
	});

	return res.status(200).json({ success: true, message: "Add data success" });
}

module.exports = {
	checkUserInput,
	addToLeaderboard,
};
