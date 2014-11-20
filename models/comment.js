var mongoose    = require('mongoose');

var Schema      = mongoose.Schema;

var CommentSchema   = new Schema({
    user_id:    String,
    post_id:    String,
    text:       String,
    created_at: { type: Date,    default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);
