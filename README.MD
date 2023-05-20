# **Home Assistant Whatsapp web api rest**
_A WhatsApp Http API Rest for NodeJS and integrated with Home Assistant_

![Supports aarch64 Architecture][aarch64-shield]
![Supports amd64 Architecture][amd64-shield]
![Supports armhf Architecture][armhf-shield]
![Supports armv7 Architecture][armv7-shield]
![Supports i386 Architecture][i386-shield]

## Content Table
- [What is this app?](#what-is-this-app)
- [Installation for Supervisor users](#installation-for-supervisor-users)
- [Installation for Docker users](#installation-for-docker-users)
- [How to get a User ID](#how-to-get-a-user-id)
- [Api documentation](#api-documentation)
  - [Chats](#chats)
    - [Get Chats](#get-chats)
    - [Delete Chat](#delete-chat)
    - [Archive Chat](#archive-chat)
    - [Unarchive Chat](#unarchive-chat)
    - [Pin Chat](#pin-chat)
    - [Unpin Chat](#unpin-chat)
    - [Mark Chat as Read](#mark-chat-as-read)
    - [Mark Chat as Unread](#mark-chat-as-unread)
    - [Send typing status](#send-typing-status)
    - [Send recording status](#send-recording-status)
    - [Clear typing or recording status](#clear-typing-or-recording-status)

  - [Messages](#messages)
    - [Get Messages](#get-messages)
    - [Send Message](#send-message)
      - [Send text message](#send-text-message)
      - [Send media message](#send-media-message)
    - [Star Message](#star-message)
    - [Unstar Message](#unstar-message)
    - [React to Message](#react-to-message)
    - [Unreact to Message](#unreact-to-message)
    - [Download Message Media](#download-message-media)
    - [Delete Message](#delete-message)

  - [Groups](#groups)
    - [Create a group](#create-a-group)
    - [Get Group Info](#get-group-info)
    - [Update Group Info](#update-group-info)
    - [Get invite code](#get-invite-code)
    - [Revoke invite code](#revoke-invite-code)
    - [Accept invite code](#accept-invite-code)
    - [Add participants to group](#add-participants-to-group)
    - [Remove participants from group](#remove-participants-from-group)
    - [Promote participants](#promote-participants)
    - [Demote participants](#demote-participants)
    - [Leave group](#leave-group)

  - [Contacts](#contacts)
    - [Get Contacts](#get-contacts)
    - [Get contact](#get-contact)
    - [Block contact](#block-contact)
    - [Unblock contact](#unblock-contact)
    - [Get common groups](#get-common-groups)

  - [User](#user)
    - [Send Available Presence](#send-available-presence)
    - [Send Unavailable Presence](#send-unavailable-presence)
    - [Update Display Name](#update-display-name)
    - [Update Text Status](#update-text-status)

  - [WhatsApp Status](#whatsapp-status)
    - [Get Status](#get-status)

- [Reciving messages in HA](#reciving-messages-in-ha)
  - [Events](#events)

- [Schemas](#schemas)
- [More details](#more-details)
- [Support](#support)
- [Contributing](#contributing)
- [Credits](#credits)
- [Disclaimer](#disclaimer)
- [License](#license)

<br>

## **What is this app?**

This app is a wrapper for the [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) library. It allows you to send and receive messages from WhatsApp using a REST API.

<br>


## **Installation for Supervisor users**

You can install this add-on from the Supervisor Add-on Store.

<img align="left" height="100px" width="100px" src="https://user-images.githubusercontent.com/7738048/40914297-49e6e560-6800-11e8-8904-36cce896e5a8.png">

### [Home Assistant](https://www.home-assistant.io/)
- [Home Assistant](https://www.home-assistant.io/hassio/): Using [the Whatsapp web HA add-on](https://github.com/gajosu/whatsapp-ha-addon/tree/master/whatsapp#whatsapp-web-ha-add-on)
- installation instructions: [here](https://github.com/gajosu/whatsapp-ha-addon/tree/master/whatsapp#whatsapp-web-ha-add-on)

<br/>
<br/>


## **Installation for Docker users**

You can run this add-on on your own Docker host. You need to have Docker installed on your host.

You need define the following environment variables:

- `HA_BASE_URL`: The base url of your Home Assistant instance
- `SUPERVISOR_TOKEN`: Long lived access token of your Home Assistant instance (Instructions [here](https://developers.home-assistant.io/docs/en/auth_api.html#long-lived-access-token))

Docker-compose example:

```yaml
whatsapp: 
    container_name: whatsapp 
    hostname: whatsapp 
    image: ghcr.io/gajosu/ha-whatsapp-web-rest-api:latest 
    environment: 
        - HA_BASE_URL=http://<ip>:8123 
        - SUPERVISOR_TOKEN=<long-lived-access-token>
    restart: always 
    volumes: 
        # define volume for the session file
        - ./data:/data
    ports: 
        - "3000:3000"
```


<br>

## **How to get a User ID**

The user id is made from three parts:

- Country code (Example `34` for Spain)
- Phone number (Example `123456789`)
- And a static part: @c.us (for users) @g.us (for groups)

So, if you want to send a message to a user with number `123456789` and country code `34`, the user id will be `34123456789@c.us` (the `@c.us` part is static)
<br>

## **Api documentation**

<br>

# Endpoints


## Chats

### **Get Chats**

Return a list of chats

`GET` `/api/chats`

Response: `200`
```json
[
  {
    "id": {
      "server": "c.us",
      "user": "123456789",
      "_serialized": "123456789@c.us"
    },
    "name": "Jhon",
    "isGroup": false,
    "isReadOnly": false,
    "unreadCount": 0,
    "timestamp": 1669914773,
    "pinned": false,
    "isMuted": false,
    "muteExpiration": 0
  },

  ...
]
```

### **Delete Chat**

`DELETE` `/api/chats/{id}`

Response: `204` No Content

### **Archive Chat**

`PUT` `/api/chats/{id}/archive`

Response: `204` No Content

### **Unarchive Chat**

`PUT` `/api/chats/{id}/archive`

Response: `204` No Content

### **Pin Chat**

`PUT` `/api/chats/{id}/pin`

Response: `204` No Content

### **Unpin Chat**

`PUT` `/api/chats/{id}/unpin`

Response: `204` No Content

### **Mark Chat as Read**

`PUT` `/api/chats/{id}/read`

Response: `204` No Content

### **Mark Chat as Unread**

`PUT` `/api/chats/{id}/unread`

Response: `204` No Content

### **Send typing status**

`PUT` `/api/chats/{id}/send-typing`

Response: `204` No Content

### **Send recording status**

`PUT` `/api/chats/{id}/send-recording`

Response: `204` No Content

### **Clear typing or recording status**

`PUT` `/api/chats/{id}/clear-status`

Response: `204` No Content

## Messages

### **Get Messages**

`GET` `/api/chats/{id}/messages`
Params:

- `limit`: Number of messages to return (default: 100) [optional]
Response: `200`
```json
[
  {
    "id": {
      "fromMe": true,
      "remote": "123456789@c.us",
      "id": "132E527E5E536E",
      "_serialized": "true_123456789@c.us_132E527E5E536E"
    },
    "ack": 3,
    "hasMedia": false,
    "body": "Hello",
    "type": "chat",
    "timestamp": 1669914773,
    "from": "123456789@c.us",
    "to": "987654321@c.us",
    "deviceType": "web",
    "isForwarded": false,
    "forwardingScore": 0,
    "isStatus": false,
    "isStarred": false,
    "fromMe": true,
    "hasQuotedMsg": false,
    "vCards": [],
    "mentionedIds": [],
    "isGif": false,
    "isEphemeral": false,
    "links": []
  }

  ...
]
```
### **Send Message**
You can send a message to a user or a group

you can also send additional options, see the all options in the official documentation [here](https://docs.wwebjs.dev/global.html#MessageSendOptions)
<br>


#### **Send text message**

`POST /api/chat/{id}/messages`

Request Body:
```json
{
    "msg": "Hello world",
}
```

#### **Send media message**

You can send images, audios and documents.

`POST /api/chat/{id}/messages`

Request Body:
```json
{
    "url": "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
    "options": {
        "caption": "Google logo",
        "sendMediaAsDocument": true
    }
}
```
### **Star Message**

`PUT` `/api/chats/{id}/messages/{messageId}/star`

Response: `204` No Content

### **Unstar Message**

`PUT` `/api/chats/{id}/messages/{messageId}/unstar`

Response: `204` No Content

### **React to Message**

`PUT` `/api/chats/{id}/messages/{messageId}/react`

Request Body:
```json
{
  "reaction": "❤️"
}
```

Response: `204` No Content

### **Unreact to Message**

`PUT` `/api/chats/{id}/messages/{messageId}/unreact`

Response: `204` No Content

### **Download Message Media**

`GET` `/api/chats/{id}/messages/{messageId}/download-media`

Response: `200` with the media file as attachment

### **Delete Message**
Delete a message for everyone in the chat

`DELETE` `/api/chats/{id}/messages/{messageId}`
Response: `204` No Content


## Groups

### **Create a group**

`POST` `/api/chats/groups`

Request Body:
```json
{
  "name": "Group Name",
  "participants": [
    "123456789@c.us",
    "987654321@c.us"
  ]
}
```

Response: `201` Created
```json
{
  "gid" : "12345678899@g.us",
   /** participants that were not added to the group. 
    * Keys represent the ID for participant that was not added and its value is a status code
    * that represents the reason why participant could not be added. */
  "missingParticipants": []
}
```

### **Get Group Info**

`GET` `/api/chats/groups/{id}`

Response: `200`
```json
{
  "groupMetadata": {
    "id": {
      "server": "g.us",
      "user": "123456789",
      "_serialized": "123456789@g.us"
    },
    "creation": 1669762493,
    "owner": {
      "server": "c.us",
      "user": "123456789",
      "_serialized": "123456789@c.us"
    },
    "subject": "My group",
    "subjectTime": 1669762493,
    "descTime": 0,
    "restrict": false,
    "announce": false,
    "noFrequentlyForwarded": false,
    "ephemeralDuration": 0,
    "membershipApprovalMode": false,
    "size": 2,
    "support": false,
    "suspended": false,
    "terminated": false,
    "uniqueShortNameMap": {},
    "isParentGroup": false,
    "isParentGroupClosed": false,
    "defaultSubgroup": false,
    "lastActivityTimestamp": 0,
    "lastSeenActivityTimestamp": 0,
    "incognito": false,
    "participants": [
      {
        "id": {
          "server": "c.us",
          "user": "123456789",
          "_serialized": "123456789@c.us"
        },
        "isAdmin": true,
        "isSuperAdmin": false
      },
      {
        "id": {
          "server": "c.us",
          "user": "987654321",
          "_serialized": "987654321@c.us"
        },
        "isAdmin": false,
        "isSuperAdmin": false
      }
    ],
    "pendingParticipants": [],
    "pastParticipants": [
      {
        "id": {
          "server": "c.us",
          "user": "1234",
          "_serialized": "1234@c.us"
        },
        "leaveTs": 1669765815,
        "leaveReason": "Left"
      }
    ],
    "membershipApprovalRequests": []
  },
  "id": {
    "server": "g.us",
    "user": "123456789",
    "_serialized": "123456789@g.us"
  },
  "name": "My Group",
  "isGroup": true,
  "isReadOnly": false,
  "unreadCount": 0,
  "timestamp": 1669762493,
  "pinned": false,
  "isMuted": false,
  "muteExpiration": 0
}

```

### **Update Group Info**

`PUT` `/api/chats/groups/{id}`

Request Body:
```json
{
  "name": "New Group Name",
  "description": "New Group Description",
}
```

Response: `204` No Content

### **Get invite code**

`GET` `/api/chats/groups/{id}/invite-code`

Response: `200`
```json
{
  "code": "1d243d3d3d3",
  "url": "https://chat.whatsapp.com/1d243d3d3d3"
}
```

### **Revoke invite code**
Revoke the invite code for the group, so that it can't be used anymore

`DELETE` `/api/chats/groups/{id}/invite-code`

Response: `204` No Content

### **Accept invite code**
Accept an invite code for a group

`POST` `/api/chats/groups/accept-invite/{code}`

Response: `200`
```json
{
  "groupId": "121122121@g.us"
}
```

### **Add participants to group**
Add 1 or more participants to a group

`POST` `/api/chats/groups/{id}/participants`

Request Body:
```json
{
  "participants": [
    "123456789@c.us",
  ]
}
```

Response: `204` No Content

### **Remove participants from group**
Remove 1 or more participants from a group

`DELETE` `/api/chats/groups/{id}/participants`

Request Body:
```json
{
  "participants": [
    "123456789@c.us",
  ]
}
```

Response: `204` No Content


## **Promote participants**
Promote 1 or more participants to admin in a group

`PUT` `/api/chats/groups/{id}/promote`

Request Body:
```json
{
  "participants": [
    "123456789@c.us",
  ]
}
```

Response: `204` No Content


## **Demote participants**
Demote 1 or more participants from admin in a group

`PUT` `/api/chats/groups/{id}/demote`

Request Body:
```json
{
  "participants": [
    "123456789@c.us",
  ]
}
```

Response: `204` No Content

### **Leave group**

`DELETE` `/api/chats/groups/{id}`

Response: `204` No Content


## **Contacts**

### **Get contacts**

`GET` `/api/contacts`

Response: `200`
```json
[
  {
    "id": {
      "server": "g.us",
      "user": "123456789",
      "_serialized": "123456789@g.us"
    },
    "number": null,
    "isBusiness": false,
    "isEnterprise": false,
    "labels": [],
    "name": "Jhon",
    "type": "in",
    "isMe": false,
    "isUser": false,
    "isGroup": true,
    "isWAContact": false,
    "isMyContact": false,
    "isBlocked": false
  },
  {
    "id": {
      "server": "c.us",
      "user": "11111111",
      "_serialized": "11111111@c.us"
    },
    "number": "11111111",
    "isBusiness": false,
    "isEnterprise": false,
    "labels": [],
    "name": "Jhon Doe",
    "shortName": "Jhon",
    "type": "in",
    "verifiedLevel": 0,
    "verifiedName": "Jhon Doe",
    "isMe": false,
    "isUser": true,
    "isGroup": false,
    "isWAContact": true,
    "isMyContact": true,
    "isBlocked": false
  },
  ...
]
```

### **Get contact**

`GET` `/api/contacts/{id}`

```json
{
  "id": {
    "server": "g.us",
    "user": "123456789",
    "_serialized": "123456789@g.us"
  },
  "number": null,
  "isBusiness": false,
  "isEnterprise": false,
  "labels": [],
  "name": "Jhon",
  "type": "in",
  "isMe": false,
  "isUser": false,
  "isGroup": true,
  "isWAContact": false,
  "isMyContact": false,
  "isBlocked": false
}
```

### **Block contact**

`POST` `/api/contacts/{id}/block`

Response: `204` No Content

### **Unblock contact**

`PUT` `/api/contacts/{id}/unblock`

Response: `204` No Content

### **Get common groups**

`GET` `/api/contacts/{id}/common-groups`

Response: `200`
```json
[
  {
    "id": {
      "server": "g.us",
      "user": "123456789",
      "_serialized": "123456789@g.us"
    },
  },
]
```

## User

### **Send Available Presence**
send available presence to all contacts

`PUT` `/api/me/available`

Response: `204` No Content


## **Send unavailable presence**
send unavailable presence to all contacts

`PUT` `/api/me/unavailable`

Response: `204` No Content


## **Update Display Name**

`PUT` `/api/me/display-name`

Request Body:
```json
{
  "name": "New Display Name"
}
```

Response: `204` No Content


## **Update Text Status**

`PUT` `/api/me/text-status`

Request Body:
```json
{
  "text": "New Text Status"
}
```

Response: `204` No Content

## **WhatsApp Status**

### **Get Status**
Returns the whatsapp status of the user

`GET` `/api/status`

Response: `200`
```json
{
  "status": "CONNECTED",
}
```


## **Reciving messages in HA**
The add-on will send events to Home Assistant when a message is received.

### Events
<!-- Table -->
| Event | Description | Data |
| --- | --- | --- |
| `whatsapp_authenticated` | Triggered when the connection is authenticated. | None |
| `whatsapp_disconnected` | Triggered when the connection is disconnected. | None |
| `whatsapp_message_received` | Triggered when a message is received. | { [Message Schema](#message-schema) } |
| `whatsapp_message_sent` | Triggered when a message is sent. | { [Message Schema](#message-schema) } |
| `whatsapp_message_ack` | Triggered when a message is acknowledged. | { message: [Message Schema](#message-schema), ack : [Ack Schema](#ack-schema-enum) } |
| `whatsapp_message_revoke_for_everyone` | Triggered when a message is revoked for everyone. | { message: [Message Schema](#message-schema), revokedMessage:  [Message Schema](#message-schema)} |
| `whatsapp_message_revoke_for_me` | Triggered when a message is revoked for you. | { message: [Message Schema](#message-schema)} |
| `whatsapp_message_group_join` | Triggered when a user joins a group. | { [GroupNotification Schema](#groupnotification-schema) } |
| `whatsapp_message_group_leave` | Triggered when a user leaves a group. | { [GroupNotification Schema](#groupnotification-schema) } |
| `whatsapp_message_group_update` | Triggered when a group is updated, such as subject, description or picture. | { [GroupNotification Schema](#groupnotification-schema) } |
| `whatsapp_message_call` | Triggered when a call is received. | { [Call Schema](#call-schema) } |
| `whatsapp_state` | Triggered when the state of the connection changes. | { state : [WA State Schema Schema](#wa-state-schema-enum) } |


## Schemas
### Message Schema
<!-- Table -->
| Key | Description | Type |
| --- | --- | --- |
| `ack` | Acknowledgement of the message. | `number` |
| `author` | Author of the message. | `string` |
| `body` | Body of the message. | `string` |
| `broadcast` | Whether the message is a broadcast. | `boolean` |
| `deviceType` | Device type of the message. | `string` |
| `duration` | Duration of the message in seconds. | `number` |
| `forwardingScore` | Indicates how many times the message was forwarded. The maximum value is 127.. | `number` |
| `from` | Sender of the message. | `string` |
| `fromMe` | Whether the message was sent by the user. | `boolean` |
| `hasMedia` | Whether the message has media. | `boolean` |
| `hasQuotedMsg` | Whether the message has a quoted message. | `boolean` |
| `id` | ID of the message. | `object` |
| `inviteV4` | Invite V4 of the message. | `string` |
| `isEphemeral` | Whether the message is ephemeral. | `boolean` |
| `isForwarded` | Whether the message is forwarded. | `boolean` |
| `isGif` | Whether the message is a GIF. | `boolean` |
| `isStarred` | Whether the message is starred. | `boolean` |
| `isStatus` | Whether the message is a status. | `boolean` |
| `links` | Links in the message. | `Array of {link: string, isSuspicious: boolean}` |
| `to` | Recipient of the message. | `string` |
| `type` | Type of the message. | `MessageTypes` |

For more information about the message schema, see the [Message class](https://docs.wwebjs.dev/Message.html).

<br />

### Ack Schema (ENUM)
<!-- Table -->
| Name | Description | Type |
| --- | --- | --- |
| `ACK_ERROR` | Error. | `string` |
| `ACK_PENDING` | Pending. | `string` |
| `ACK_SERVER` | Message received by the server. | `string` |
| `ACK_DEVICE` | Message received by the device. | `string` |
| `ACK_READ` | Message read by the recipient. | `string` |
| `ACK_PLAYED` | Message played by the recipient. | `string` |

<br />

## WA State Schema (ENUM)
<!-- Table -->
| Name | Description | Type |
| --- | --- | --- |
| `CONFLICT` | Connection conflict. | `string` |
| `CONNECTED` | Connected to WA servers. | `string` |
| `DEPRECATED_VERSION` | Deprecated version. | `string` |
| `OPENING` | Opening connection. | `string` |
| `PAIRING` | Pairing. | `string` |
| `SMB_TOS_BLOCK` | SMB TOS block. | `string` |
| `TIMEOUT` | Connection timeout. | `string` |
| `TOS_BLOCK` | TOS block. | `string` |
| `UNLAUNCHED` | Unlaunched. | `string` |
| `UNPAIRED` | Unpaired. | `string` |
| `UNPAIRED_IDLE` | Unpaired idle. | `string` |

### GroupNotification Schema
<!-- Table -->
| Field | Type | Description |
| --- | --- | --- |
| `id` | `object` | The id of the group. |
| `author` | `string` | The ContactId of the author. |
| `body` | `string` | The body of the message. |
| `chatId` | `string` | The id of the chat. |
| `recipientIds` | `string[]` | The ContactIds of the recipients. |
| `timestamp` | `number` | The timestamp of the message. |
| `type` | `enum('add', 'invite',, 'remove', 'leave', 'subject', 'description', 'picture', 'announce', 'restrict')` | The type of the group notification. |

### Call Schema
<!-- Table -->
| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | The id of the call. |
| `from` | `string` | The ContactId of the caller. |
| `timestamp` | `number` | The timestamp of the call. |
| `isVideo` | `boolean` | Whether the call is a video call. |
| `isGroup` | `boolean` | Whether the call is a group call. |
| `canHandleLocally` | `boolean` | Whether the call can be handled in waweb |
| `webClientShouldHandle` | `boolean` | Whether the call should be handled in waweb |
| `participants` | `object` | The participants of the call. |



## More details
For more details about the API, see the [documentation](https://docs.wwebjs.dev/) of the underlying library.

## Support
If you have any questions, please open an issue on the [gajosu/whatsapp-web-rest-api](https://github.com/gajosu/whatsapp-web-rest-api) repository.

## Contributing
If you want to contribute to this add-on, please open a pull request on the [gajosu/whatsapp-web-rest-api](https://github.com/gajosu/whatsapp-web-rest-api)


## Credits
- Pedro S Lopez ([@pedroslopez](https://github.com/pedroslopez)) for the [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)
- Gabriel González ([@gajosu](https://github.com/gajosu?)) for the [whatsapp-web-rest-api](https://github.com/gajosu/whatsapp-web-rest-api)

## Disclaimer
This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with WhatsApp or any of its subsidiaries or its affiliates. The official WhatsApp website can be found at https://whatsapp.com. "WhatsApp" as well as related names, marks, emblems and images are registered trademarks of their respective owners.

## License

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this project except in compliance with the License.
You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

[aarch64-shield]: https://img.shields.io/badge/aarch64-yes-green.svg
[amd64-shield]: https://img.shields.io/badge/amd64-yes-green.svg
[armhf-shield]: https://img.shields.io/badge/armhf-yes-green.svg
[armv7-shield]: https://img.shields.io/badge/armv7-yes-green.svg
[i386-shield]: https://img.shields.io/badge/i386-yes-green.svg
