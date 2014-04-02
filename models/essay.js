

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var essaySchema = new Schema({
	id: Schema.ObjectId,
	status: String,
	school: String,
	prompt: String,
	submitter_id: Schema.ObjectId,
	review_ids: Array,
	date_submitted: Date,
	date_closed: Date,
	date_due: Date,
	feedback_type: String,
	surge: Boolean,
	document_id: Schema.ObjectId
});

var Essay = mongoose.model('Essay', essaySchema);



essaySchema.methods.setStatus = function(status) {
	var statusOptions = ['submitted','claimed','reviewed','returned','closed']
	if (statusOptions.contains(status)){
		return;
	}
	else {
		throw "invalid status";
		return;
	}

}

mongoose.model('Essay', essaySchema)
module.exports = mongoose.model('Essay', essaySchema);