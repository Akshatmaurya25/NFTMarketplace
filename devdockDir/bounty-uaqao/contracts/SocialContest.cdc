access(all) contract SocialContest {
    access(all) event ContestCreated(id: UInt64, creator: Address, bountyAmount: UFix64)
    access(all) event SubmissionAdded(contestId: UInt64, participant: Address, tweetUrl: String)
    access(all) event WinnerSelected(contestId: UInt64, winner: Address)

    access(all) struct Contest {
        access(all) let id: UInt64
        access(all) let creator: Address
        access(all) let bountyAmount: UFix64
        access(all) let deadline: UFix64
        access(all) let maxSubmissions: UInt64
        access(all) var submissions: {Address: String}
        access(all) var winner: Address?

        init(id: UInt64, creator: Address, bountyAmount: UFix64, deadline: UFix64, maxSubmissions: UInt64) {
            self.id = id
            self.creator = creator
            self.bountyAmount = bountyAmount
            self.deadline = deadline
            self.maxSubmissions = maxSubmissions
            self.submissions = {}
            self.winner = nil
        }
    }

    access(all) var contests: {UInt64: Contest}
    access(all) var nextContestId: UInt64

    init() {
        self.contests = {}
        self.nextContestId = 1
    }

    access(all) fun createContest(bountyAmount: UFix64, deadline: UFix64, maxSubmissions: UInt64) {
        let contest = Contest(
            id: self.nextContestId,
            creator: self.account.address,
            bountyAmount: bountyAmount,
            deadline: deadline,
            maxSubmissions: maxSubmissions
        )
        self.contests[self.nextContestId] = contest
        emit ContestCreated(id: self.nextContestId, creator: self.account.address, bountyAmount: bountyAmount)
        self.nextContestId = self.nextContestId + 1
    }

    access(all) fun submitEntry(contestId: UInt64, tweetUrl: String) {
        pre {
            self.contests[contestId] != nil: "Contest does not exist"
            getCurrentBlock().timestamp <= self.contests[contestId]!.deadline: "Contest has ended"
        }
        let contest = self.contests[contestId]!
        contest.submissions[self.account.address] = tweetUrl
        emit SubmissionAdded(contestId: contestId, participant: self.account.address, tweetUrl: tweetUrl)
    }
}