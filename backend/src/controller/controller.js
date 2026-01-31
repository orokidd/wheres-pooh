const characters = {
  "waldo": { "xMin": 320, "xMax": 380, "yMin": 180, "yMax": 260 },
  "wizard": { "xMin": 500, "xMax": 560, "yMin": 300, "yMax": 370 }
}

function checkUserInput(req, res) {
    const { x, y, character } = req.body;

    const target = characters[character]
    if (!target) return res.status(400).json({ success: false , message: "Invalid character."})
    
    const isFound = x >= target.xMin && x <= target.xMax && y >= target.yMin && y <= target.yMax;

    res.json({ sucess: isFound })
}

module.exports = {
    checkUserInput
}