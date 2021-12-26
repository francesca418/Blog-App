## ER Diagram

[[https://github.com/cis557/fall-2021-project-group-centric-social-network-team-21/blob/development/ER%20Diagram.jpg|alt=er_diagram]]

## NoSQL Schemas

### User Schema
```
{
    fullname: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25
    },
    username: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isActive: { // whether or not the account is activated
        type: Boolean,
        // required: true
    },
    avatar:{
        type: String,
        default: 'https://res.cloudinary.com/cis557/image/upload/v1639598269/maple_avatar_mmgm2l.png'
    },
    role: {type: String, default: 'user'},
    gender: {type: String, default: 'male'},
    mobile: {type: String, default: ''},
    address: {type: String, default: ''},
    groups: [{type: mongoose.Types.ObjectId, ref: 'group'}]
}, {
    timestamps: true
}
```

### Group Schema

```
{
    name: {
        type: String,
        required: true,
        unique: true
    },
    tags: {
        type: [String]
    },
    privacy: {
        type: Boolean,
        required: true
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    admins: {
        type: [{type: mongoose.Types.ObjectId, ref: 'user'}]
    },
    users: {
        type: [{type: mongoose.Types.ObjectId, ref: 'user'}]
    },
    posts: {
        type: [{type: mongoose.Types.ObjectId, ref: 'post'}]
    },
    deletedPosts: {
        type: [String],
        default: [],
        required: true
    },
    joinRequests: {
        type: [{type: mongoose.Types.ObjectId, ref: 'user'}],
        default: [],
        //required: true
    },
    invitedUsers: {
        type: [{type: mongoose.Types.ObjectId, ref: 'user'}],
        default: [],
        //required: true
    },

}, {
    timestamps: true
}
```

### Post Schema

```
{
    content: {
        type: String,
        required: true
    },
    images: {
        type: Array,
        required: false
    },
    groupId: { 
        type: mongoose.Types.ObjectId, 
        ref: 'group',
        required: true
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    comments: [{ type: mongoose.Types.ObjectId, ref: 'comment' }],
    user: {type: mongoose.Types.ObjectId, ref: 'user'},
    isHidden: {
        type: Boolean,
        default: false,
        required: true
    },
    isFlagged: {
        type: Boolean,
        default: false,
        required: true
    }
}, {
    timestamps: true
}
```

### Comment Schema

```
{
    content: {
        type: String,
        required: true
    },
    likes: [{type: mongoose.Types.ObjectId, ref: 'user'}],
    user: {type: mongoose.Types.ObjectId, ref: 'user'},
    postId: mongoose.Types.ObjectId,
    postUserId: mongoose.Types.ObjectId
}, {
    timestamps: true
}
```

### Notify Schema

```
{
    id: mongoose.Types.ObjectId,
    user: {type: mongoose.Types.ObjectId, ref: 'user'},
    recipients: [mongoose.Types.ObjectId],
    url: String,
    text: String,
    content: String,
    image: String,
    isRead: {type: Boolean, default: false}
}, {
    timestamps: true
}
```

### Conversation Schema

```
{
    recipients: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    text: String,
    media: Array
}, {
    timestamps: true
}
```

### Message Schema

```
{
    conversation: { type: mongoose.Types.ObjectId, ref: 'conversation' },
    sender: { type: mongoose.Types.ObjectId, ref: 'user' },
    recipient: { type: mongoose.Types.ObjectId, ref: 'user' },
    text: String,
    media: Array
}, {
    timestamps: true
}
```

## Description of Controller Functions

Below are lists and descriptions of all of our controller functions. 

### Authorization Controller
- register: registers a new user.
- login: logs a current user into the application.
- logout: logs a current user out of the application.
- generateAccessToken: generates a new access token based on the refresh token.

### User Controller
- searchUser: search for particular users by username by regex search key.
- getUser: get a particular user based on id.
- updateUserPassword: update the user's password to a new validated and encrypted password.
- updateUser: updates a user's field information.

### Group Controller (TO EDIT)
- createGroup: creates a new group.
- suggestionsGroup: retrieves a random suggestion of public groups for a user to join, of which the user is not already a part.
- getGroups: retrieve all of the groups.
- addAdmin: promote a user to admin.
- removeAdmin: revoke a user's admin status.
- updateGroup: update a group.
- leaveGroup: a user leaves a group.
- getGroup: retrieve a group.
- incrementDelete: increment a counter that tracks the number of posts associated with that group which have been deleted.
- addRequest: requests that a user can join a group.
- addToGroup: adds a pending user to the group.
- denyRequest: denies a user's request to join the group.
- inviteUser: invites a user to join a group.
- rejectInvite: rejects an invite to join a group.

### Post Controller
- createPost: creates a new post.
- getPosts: retrieves all of the posts in the entire application.
- hidePost: hides a post (this is an irreversible action).
- flagPost: flags a post to be deleted.
- unflagPost: unflags a post to be deleted.
- updatePost: updates the content of a post.
- likePost: likes a post.
- unlikePost: unlikes a post.
- getUserPosts: retrieves all of the posts associated with a particular user.
- getPost: retrieves a particular post.
- deletePost: deleted a post. 

### Comment Controller
- createComment: creates a new comment on a post.
- updateComment: updates a comment.
- likeComment: likes a comment.
- unlikeComment: unlikes a comment.
- deleteComment: deletes a comment.

### Notify Controller
- createNotify: creates a new notification.
- removeNotify: deletes a notification.
- getNotifies: get all notifications.
- isReadNotify: marks a notification as read.
- deleteAllNotifies: deletes all of a user's notifications.

### Message Controller
- createMessage: creates a new message.
- getConversations: retrieves all conversations between users.
- getMessages: retrieves all messages.
- deleteMessages: deletes a message.
- deleteConversation: deletes a conversation between users.