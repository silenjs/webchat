var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var commentSchema = new Schema({
    unickname:String,
    comment:String,
    filter:Number,
    refer:String,
    fip:String,
    insert_time:Number
})
var filterSchema = new Schema({
    option:Number,
    keyword:String
});
var Comment =  mongodb.mongoose.model('comments_panda_sc',commentSchema);
var filter = mongodb.mongoose.model('filter_words',filterSchema);
var filterArr = [];
filter.find({option:{$gt:1}},function(err,filters){
    filters.forEach(function(obj){
        var kw = obj.keyword.replace('/\s*/g','');
        kw&&filterArr.push(kw);
    })
})
var Commentd = function(){}
Commentd.prototype.save = function(obj,callback){
    var instance = new Comment(obj);
    instance.save();
}
Commentd.prototype.filter = function(content){
    return filterArr.some(function(kw){
        kw = kw.replace('/\s*/g','');
        return !!~content.indexOf(kw);
    })
}
module.exports = new Commentd();
