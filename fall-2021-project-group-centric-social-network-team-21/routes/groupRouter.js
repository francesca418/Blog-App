const router = require('express').Router()
const groupCtrl = require('../controllers/groupCtrl')
const auth = require('../middleware/auth')

router.route('/groups')
    .post(auth, groupCtrl.createGroup)
    .get(auth, groupCtrl.getGroups)

router.route('/group/:id')
    //.patch(auth, groupCtrl.updateGroup)
    .get(auth, groupCtrl.getGroup)
    .delete(auth, groupCtrl.deleteGroup)

router.patch('/group/:id/join', auth, groupCtrl.joinGroup)

router.patch('/group/:id/leave', auth, groupCtrl.leaveGroup)

router.get('/user_groups/:id', auth, groupCtrl.getUserGroups)

router.get('/suggestionsGroup', auth, groupCtrl.suggestionsGroup)

router.patch('/admin/:id', auth, groupCtrl.addAdmin)

router.patch('/removeAdmin/:id', auth, groupCtrl.removeAdmin)

router.patch('/incrementDelete/:id', groupCtrl.incrementDelete)

router.patch('/addRequest/:id', groupCtrl.addRequest)

router.patch('/group/:id/add', groupCtrl.addToGroup)

router.patch('/group/:id/deny', groupCtrl.denyRequest)

router.patch('/inviteUser/:id', groupCtrl.inviteUser)

router.patch('/rejectInvite/:id', groupCtrl.rejectInvite)

module.exports = router