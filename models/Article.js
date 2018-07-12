var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  
  title: {
    type: String,
    unique: true,
    trim: true,
    required: true
  },
  body: {
    type: String,
    trim: true,
    required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }

});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
