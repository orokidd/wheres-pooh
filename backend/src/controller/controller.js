const prisma = require("../config/prisma");
const API_KEY = process.env.API_KEY;

const characters = {
	Aladdin: { xMin: 782, xMax: 843, yMin: 342, yMax: 475 },
	Zorro: { xMin: 70, xMax: 116, yMin: 1131, yMax: 1209 },
	Rapunzel: { xMin: 13, xMax: 68, yMin: 618, yMax: 726 },
	Pooh: { xMin: 1190, xMax: 1236, yMin: 800, yMax: 866 },
};

function checkUserInput(req, res) {
	const { x, y, character } = req.body;
	const apiKey = req.headers['x-api-key'];

	if (apiKey !== API_KEY) {
		return res.status(401).json({ success: false, message: "Unauthorized" });
	}

	const target = characters[character];
	if (!target) return res.status(400).json({ success: false, message: "Invalid character." });

	const isFound = x >= target.xMin && x <= target.xMax && y >= target.yMin && y <= target.yMax;

	res.json({ found: isFound });
}

async function addToLeaderboard(req, res) {
	const { username, time } = req.body;
	const apiKey = req.headers['x-api-key'];

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

async function getLeaderboard(_req, res) {
	const leaderboard = await prisma.leaderboard.findMany({
		orderBy: {
			time: "asc"
		}
	})

	return res.status(200).json({ leaderboard });
}

module.exports = {
	checkUserInput,
	addToLeaderboard,
	getLeaderboard
};
