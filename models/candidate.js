var mongoose = require('mongoose');
let date = new Date();

var createCandidateSchema = new mongoose.Schema({
    candidateName: String,
    votesCount: Number,
    created: {type: Date, default: date.toLocaleString('en-US')},
    election: {
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