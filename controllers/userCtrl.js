const Users = require('../models/userModel')
const bcrypt = require('bcrypt')

const validation = (password) => {
    let pattern = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/);
    if (!pattern.test(password)) {
        return false;
      }
    return true;
  }; 

const userCtrl = {
    searchUser: async (req, res) => {
        try {
            const users = await Users.find({username: {$regex: req.query.username}})
            .limit(10).select("fullname username avatar")
            
            res.json({users})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.params.id).select('-password')
            if(!user) return res.status(400).json({msg: "User does not exist."})
            
            res.json({user})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateUserPassword: async (req, res) => {
        try {
            const { email, username, password } = req.body

            if(!email) return res.status(400).json({msg: "Please add your email."})

            if(!username) return res.status(400).json({msg: "Please add your username."})

            if(!password) return res.status(400).json({msg: "Please add your new password."})
            if(!validation(password))
            return res.status(400).json({msg: "Password must be at least 6 characters, and contain at least one uppercase letter, one lowercase letter, and one number."})
            const passwordHash = await bcrypt.hash(password, 12)

            await Users.findOneAndUpdate({_id: req.user._id}, {
                password: passwordHash
            })

            res.json({msg: "Update Success!"})

        } catch {
            return res.status(500).json({msg: err.message})
        }
    },
    updateUser: async (req, res) => {
        try {
            const { avatar, fullname, mobile, address, gender, isActive, password } = req.body
            if(!fullname) return res.status(400).json({msg: "Please add your full name."})
            if (password === '' || !password) {
                await Users.findOneAndUpdate({_id: req.user._id}, {
                    avatar, fullname, mobile, address, gender, isActive
                })
            } else {
                if(!validation(password))
                return res.status(400).json({msg: "Password must be at least 6 characters, and contain at least one uppercase letter, one lowercase letter, and one number."})

                const passwordHash = await bcrypt.hash(password, 12)

                await Users.findOneAndUpdate({_id: req.user._id}, {
                    avatar, fullname, mobile, address, gender, isActive, password: passwordHash
                })
            }

            res.json({msg: "Update Success!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}


module.exports = userCtrl