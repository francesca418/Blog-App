## SwaggerHub

Below is a description of the routes used in this application. In addition, we have documented our API using SwaggerHub, and that can be viewed at the following link: https://app.swaggerhub.com/apis-docs/cis557team21/Blog-App/1.0.0

Here is the link to the editor view as well:
https://app.swaggerhub.com/apis/cis557team21/Blog-App/1.0.0

## Routes for Registration / Login 

| URI | Method | Description |
|-----|--------|-------------|
|/register| POST | Submits data from the registration form page to create a new user and redirects to the login page. |
|/login| POST | Submits data from the login page, authenticates user, and redirects to the home page. |
|/logout| POST | Logs out of the user's session and redirects to the login page. |
|/refresh_token| POST | Generates a refresh token for the authorization process. |

## Routes for Other User Operations

| URI | Method | Description |
|-----|--------|-------------|
|/search| GET | Retrieves all users whose usernames begin with the given regular expression (string). |
|/user/:id| GET | Retrieves a user with the given id. |
|/user| PATCH | Updates a user's information. |
|/changePassword| PATCH | Changes a user's password securely. |

## Routes for Groups 

| URI | Method | Description |
|-----|--------|-------------|
|/groups| POST | Creates a new group. |
|/groups| GET | Retrieves all of the groups. |
|/group/:id| GET | Retrieves a specific group with the given id. |
|/group/:id| DELETE | Deletes the group with the given id. |
|/group/:id/join| PATCH | Adds a user to the group with the given id. |
|/group/:id/leave| PATCH | Removes a user from the group with the given id. |
|/suggestionsGroup| GET | Retrieves all of the suggested groups (they are randomly selected from among all public groups of which the user is not already a member). |
|/admin/:id| PATCH | Adds a user as an admin of the group with the given id. |
|/removeAdmin/:id| PATCH | Removes a user as an admin of the group with the given id. |
|/incrementDelete/:id| PATCH | Increments a tracker of the number of posts that have been deleted from the group with the given id. |
|/addRequest/:id| PATCH | Requests that a user be allowed to join the group with the given id. |
|/group/:id/add| PATCH | Adds a user to the group with the given id. |
|/group/:id/deny| PATCH | Denies a user's request to join the group with the given id. |
|/inviteUser/:id| PATCH | Invites a user to join the group with the given id. |
|/rejectInvite/:id| PATCH | Rejects a user's invite to join the group with the given id. |

## Routes for Posting 

| URI | Method | Description |
|-----|--------|-------------|
|/posts| POST | Creates a new post. |
|/posts| GET | Retrieves all of the posts. |
|/post/:id| PATCH | Updates the post with the given id. |
|/post/:id| GET | Retrieves the post with the given id. |
|/post/:id| DELETE | Deletes the post with the given id. |
|/post/:id/like| PATCH | Likes the post with the given id. |
|/post/:id/unlike| PATCH | Unlikes the post with the given id. |
|/user_posts/:id| GET | Retrieves all of the posts affiliated with that user id. |
|/hidePost/:id| PATCH | Updates a post so that it is "hidden". |
|/flagPost/:id| PATCH | Updates a post so that it is "flagged" to be deleted. |
|/unflagPost/:id| PATCH | Updates a post so that it is no longer "flagged" to be deleted. |

## Routes for Commenting

| URI | Method | Description |
|-----|--------|-------------|
|/comment| POST | Creates a new comment. |
|/comment/:id| PATCH | Updates the comment with the given id. |
|/comment/:id/like| PATCH | Likes the comment with the given id. |
|/comment/:id/unlike| PATCH | Unlikes the comment with the given id. |
|/comment/:id| DELETE | Deletes the comment with the given id. |

## Routes for Notifications

| URI | Method | Description |
|-----|--------|-------------|
|/notify| POST | Creates a new notification. |
|/notify/:id| DELETE | Deletes the notification with the given id. |
|/notifies| GET | Retrieves all of the notifications. |
|/isReadNotify/:id| PATCH | Marks the notification with the given id as read. |
|/deleteAllNotify| DELETE | Deletes all of the notifications for a given user. |

## Routes for Messaging

| URI | Method | Description |
|-----|--------|-------------|
|/message| POST | Creates a new message. |
|/conversations| GET | Retrieves all conversations between users. |
|/message/:id| GET | Retrieves the message with the given id. |
|/message/:id| DELETE | Deletes the message with the given id. |
|/conversation/:id| DELETE | Deletes the conversation with the given id. |
