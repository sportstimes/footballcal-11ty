module.exports = url => `http://${url.replace(/https?:\/\//, '').replace(/\/$/, '.ics')}`
