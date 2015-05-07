var mongoose = require('mongoose');
mongoose.connect('mongodb://root:sd-livechat@localhost/livechat');
exports.mongoose = mongoose;