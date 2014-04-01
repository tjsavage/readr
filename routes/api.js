
exports.schools = function(req, res) {
	res.json(SCHOOLS);
};

exports.school = function(req, res) {
	var schoolID = parseInt(req.params.schoolID);
	for (var i = 0; i < SCHOOLS.length; i++) {
		var school = SCHOOLS[i];
		console.log(school.id == schoolID);
		if (school.id == schoolID) {
			res.json(school);
		}
	}
};

exports.school_prompts = function(req, res) {
	res.json([
	{
		"prompt": "Some students have a background or story that is so central to their identity that they believe their application would be incomplete without it. If this sounds like you, then please share your story.",
		"id": 1
	},
	{
		"prompt": "Recount an incident or time when you experienced failure.  How did it affect you, and what lessons did you learn?",
		"id": 2
	},
	{
		"prompt": "Reflect on a time when you challenged a belief or idea.  What prompted you to act? Would you make the same decision again?",
		"id": 3
	},
	{
		"prompt": "Describe a place or environment where you are perfectly content.  What do you do or experience there, and why is it meaningful to you?",
		"id": 4
	},
	{
		"prompt": "Discuss an accomplishment or event, formal or informal, that marked your transition from childhood to adulthood within your culture, community, or family.",
		"id": 5
	}]);
};

var SCHOOLS = [
	{
		"name": "Stanford",
		"id": 1
	},
	{
		"name": "Santa Clara",
		"id": 2
	},
	{
		"name": "Swathmore",
		"id": 3
	},
	{
		"name": "Harvard",
		"id": 4
	}
];

