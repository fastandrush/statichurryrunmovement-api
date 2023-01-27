const mongoose = require('mongoose');
const { SupportingDocumentContext } = require('twilio/lib/rest/trusthub/v1/supportingDocument');
const Schema = mongoose.Schema;

const membership = new Schema({
  macuserscopeid: Number,
  firstname: String,
  middlename: String,
  lastname: String
})
 
const scope = new Schema({
  scopeid: Number,
  scope: [membership]
})


module.exports = { scope, membership } ;