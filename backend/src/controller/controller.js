const prisma = require("../config/prisma");
const API_KEY = process.env.API_KEY;

const characters = {
	Aladdin: { xMin: 41, xMax: 44, yMin: 26, yMax: 37 },
	Zorro: { xMin: 4, xMax: 6, yMin: 88, yMax: 94 },
	Rapunzel: { xMin: 1, xMax: 4, yMin: 48, yMax: 57 },
	Pooh: { xMin: 62, xMax: 65, yMin: 62, yMax: 68 },
};

function checkUserInput(req, res) {
	const { xPercent, yPercent, character } = req.body;
	const apiKey = req.headers['x-api-key'];

	if (apiKey !== API_KEY) {
		return res.status(401).json({ success: false, message: "Unauthorized" });
	}

	const target = characters[character];
	if (!target) return res.status(400).json({ success: false, message: "Invalid character." });

	const isFound = xPercent >= target.xMin && xPercent <= target.xMax && yPercent >= target.yMin && yPercent <= target.yMax;

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

	const usernameExist = await prisma.leaderboard.findFirst({
		where: {
			username: username
		}
	})

	if (usernameExist) {
		return res.status(400).json({ success: false, message: "Username already exist" });
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
