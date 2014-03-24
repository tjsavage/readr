

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var essaySchema = new Schema({
	id: ObjectId,
	status: String,
	school: String,
	prompt: String,
	submitter_id: ObjectId,
	review_ids: Array,
	date_submitted: Date,
	date_closed: Date,
	date_due: Date,
	feedback_type: String,
	surge: Boolean,
	document_id: ObjectId
});

var Essay = mongoose.model('Essay', essaySchema);

module.exports = Essay;