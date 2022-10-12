var mongoose = require('mongoose');
let date = new Date();

var createElectionSchema = new mongoose.Schema({
    electionName: String,
    totalVotes: Number,
    status: String,
    pollNo: Number,
    created: {type: Date, default: date.toLocaleString('en-US')},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    info: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model('createElection', createElectionSchema);