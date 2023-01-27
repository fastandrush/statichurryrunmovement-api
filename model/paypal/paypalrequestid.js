

function getMilliseconds() {

  const date = new Date();
  const milliseconds = date.getTime()
  return milliseconds
  
}


module.exports = {  getMilliseconds }