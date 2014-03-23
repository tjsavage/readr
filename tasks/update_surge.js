#! /app/bin/node

var updateSurge = function() {
	console.log("Updating surge");
};

if (require.main === module) {
	updateSurge();
}

module.exports = updateSurge;


