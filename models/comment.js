var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var commentSchema = new Schema({
    unickname:String,
    comment:String,
    filter:Number
})
var filterSchema = new Schema({
    option:Number,
    keyword:String
});
var Comment =  mongodb.mongoose.model('comment',commentSchema);
var filter = mongodb.mongoose.model('filter_words',filterSchema);
var filterArr = [];
filter.find({option:{$gt:1}},function(err,filters){
    filters.forEach(function(obj){
        filterArr.push(obj.keyword);
    })
})
var Commentd = function(){}
Commentd.prototype.save = function(obj,callback){
    var instance = new Comment(obj);
    instance.save();
}
Commentd.prototype.filter = function(content){
    if(filterArr.length){
        for(var i=0,len=filterArr.length;i<len;i++){
            var filterWord = filterArr[i].replace('/\s*/g','');
            if(filterWord&&(content.indexOf(filterWord)+1)){
                return true;   
            }
        }
    }
    return false;
}
module.exports = new Commentd();
