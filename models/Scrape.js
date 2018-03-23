var mongoose = require("mongoose");


var Schema = mongoose.Schema;


var ScrapeSchema = new Schema({

  title: {
    type: String,
    required: true
  },

  link: {
    type: String,
    required: true
  },

  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});


var Scrape = mongoose.model("Scrape", ScrapeSchema);


module.exports = Scrape;
