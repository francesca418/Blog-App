const Groups = require('../models/groupModel')
const Posts = require('../models/postModel')
const Comments = require('../models/commentModel')
const Users = require('../models/userModel')

class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = 1000000
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const groupCtrl = {
    createGroup: async (req, res) => {
        try {
            const { name, privacy, tags } = req.body

            const newGroup = new Groups({
                name, privacy, tags, creator: req.user._id, admins: [req.user._id], users: [req.user._id], deletedPosts: []
            })
            await newGroup.save() 

            res.json({
                msg: 'Created Group!',
                newGroup: {
                    ...newGroup._doc,
                    creator: req.user
                }
            })

            await Users.findOneAndUpdate({_id: req.user._id}, {
                $push: {groups: newGroup}
            }, {new: true})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    suggestionsGroup: async (req, res) => {
        try {
            const num  = req.query.num || 10
            const groups = await Groups.aggregate([
                { $match: { _id: { $nin: req.user.groups }, privacy: true } },
                { $sample: { size: Number(num) } },
            ])

            return res.json({
                groups,
                result: groups.length
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    searchGroupName: async (req, res) => {
        try {
            const groups = await Groups.find({name: {$regex: req.query.name}})
            .limit(10).select("name tags")
            
            res.json({groups})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    searchGroupTags: async (req, res) => {
        try {
            const groups = await Groups.find({tags: req.query.name})
            .limit(10).select("name tags")
            
            res.json({groups})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getGroups: async (req, res) => {
        
        try {
            const features =  new APIfeatures(Groups.find({
            }), req.query)
            
            const groups = await features.query.sort('-createdAt')
            .populate("creator", "avatar username fullname")
            .populate({
                path: "posts",
                select: "content images likes comments user",
                populate: {
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                }
            })


            res.json({
                msg: 'Success!',
                result: groups.length,
                groups: groups
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    addAdmin: async (req, res) => {
        try {
            const group = await Groups.findOneAndUpdate({_id: req.params.id}, {
                $push: {admins: req.body.userId}
            }, {new: true})

            res.json({
                msg: "Added Admin!",
                newGroup: {
                    ...group._doc,
                    admins: group.admins
                }
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    removeAdmin: async (req, res) => {

        try {
            const group = await Groups.findOneAndUpdate({_id: req.params.id}, {
                $pull: {admins: req.body.userId}
            }, {new: true})

            res.json({
                msg: "Removed Admin!",
                newGroup: {
                    ...group._doc,
                    admins: group.admins
                }
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateGroup: async (req, res) => {

        try {
            const { groupData, groupId } = req.body
            await Groups.findOneAndUpdate({_id: groupId}, {
                $push: {group: groupData}
            }, {new: true})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
        
        try {
            const group = await Groups.findOneAndUpdate({_id: req.params.id}, {
                $push: {admins: req.body.userId}
            }, {new: true})

           
            res.json({
                msg: "Added Admin!",
                newGroup: {
                    ...group._doc,
                    admins
                }
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    joinGroup: async (req, res) => {
        try {
            const group = await Groups.find({_id: req.params.id, users: req.user._id})
            if(group.length > 0) return res.status(400).json({msg: "You joined this group."})

            const join = await Groups.findOneAndUpdate({_id: req.params.id}, {
                $push: {users: req.user._id}
            }, {new: true})

            if(!join) return res.status(400).json({msg: 'This group does not exist.'})

            res.json({
                msg: "Joined Group!",
                newGroup: {
                    ...group._doc,
                    users: group.users
                }
            })

            await Users.findOneAndUpdate({_id: req.user._id}, {
                $push: {groups: group}
            }, {new: true})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    leaveGroup: async (req, res) => {
        try {

            const group = await Groups.find({_id: req.params.id, users: req.user._id})

            const leave = await Groups.findOneAndUpdate({_id: req.params.id}, {
                $pull: {users: req.user._id, admins: req.user._id},
            }, {new: true})

            if(!leave) return res.status(400).json({msg: 'This group does not exist.'})

            res.json({
                msg: "Left Group!",
                newGroup: {
                    ...group._doc,
                    users: group.users
                }
            })

            await Users.findOneAndUpdate({_id: req.user._id}, {
                $pull: {groups: group}
            }, {new: true})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getUserGroups: async (req, res) => {
        try {
            const features = new APIfeatures(Groups.find({users: req.params.id}), req.query)
           
            const groups = await features.query.sort("-createdAt")

            res.json({
                groups,
                result: groups.length
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getGroup: async (req, res) => {
        try {
            const group = await Groups.findById(req.params.id)
            .populate("user likes", "avatar username fullname")
            .populate({
                path: "comments",
                populate: {
                    path: "user likes",
                    select: "-password"
                }
            })

            if(!group) return res.status(400).json({msg: 'This group does not exist.'})

            res.json({
                group
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteGroup: async (req, res) => {
        try {
            const group = await Groups.findOneAndDelete({_id: req.params.id, admins: req.user._id})
            await Posts.deleteMany({_id: {$in: group.posts }})

            res.json({
                msg: 'Deleted Post!',
                newGroup: {
                    ...group,
                    user: req.user
                }
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    addRequest: async (req, res) => {
        try {
            const group = await Groups.findOneAndUpdate({_id: req.params.id}, {
                $push: {joinRequests: req.body.userId},
                $pull: {invitedUsers: req.body.userId},
            }, {new: true})

            res.json({
                msg: "Added Request!",
                newGroup: {
                    ...group._doc,
                    joinRequests: group.joinRequests
                }
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    inviteUser: async (req, res) => {
        try {
            const group = await Groups.findOneAndUpdate({_id: req.params.id}, {
                $push: {invitedUsers: req.body.id}
            }, {new: true})

            res.json({
                msg: "Added Request!",
                newGroup: {
                    ...group._doc,
                    invitedUsers: group.invitedUsers
                }
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    rejectInvite: async (req, res) => {
        try {
            console.log(req.body)
            console.log(req.body.id)
            const group = await Groups.findOneAndUpdate({_id: req.params.id}, {
                $pull: {invitedUsers: req.body.id}
            }, {new: true})

            res.json({
                msg: "Rejected Invite!",
                newGroup: {
                    ...group._doc,
                    invitedUsers: group.invitedUsers
                }
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    addToGroup: async (req, res) => {
        try {
            const group = await Groups.find({_id: req.params.id, users: req.body.user._id})
            if(group.length > 0) return res.status(400).json({msg: "User already joined this group."})

            const join = await Groups.findOneAndUpdate({_id: req.params.id}, {
                $push: {users: req.body.user._id}
            }, {new: true})

            const leave = await Groups.findOneAndUpdate({_id: req.params.id}, {
                $pull: {joinRequests: req.body.user._id}
            }, {new: true})

            if(!join) return res.status(400).json({msg: 'This group does not exist.'})

            res.json({
                msg: "Joined Group!",
                newGroup: {
                    ...group._doc,
                    users: group.users
                }
            })

            await Users.findOneAndUpdate({_id: req.body.user._id}, {
                $push: {groups: group}
            }, {new: true})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    denyRequest: async (req, res) => {
        try {

            const leave = await Groups.findOneAndUpdate({_id: req.params.id}, {
                $pull: {joinRequests: req.body.user._id}
            }, {new: true})

            res.json({
                msg: "Denied Entry!",
                newGroup: {
                    ...group._doc,
                    users: group.users
                }
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    incrementDelete: async (req, res) => {
        try {
            const group = await Groups.findOneAndUpdate({_id: req.params.id}, {
                $push: {deletedPosts: "x"}
            }, {new: true})

            res.json({
                msg: "Incremented delete count -- no regrets!",
                newGroup: {
                    ...group._doc,
                    deletedPosts: group.deletedPosts
                }
            })
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}

module.exports = groupCtrl