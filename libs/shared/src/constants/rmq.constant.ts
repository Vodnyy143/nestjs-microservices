export const RMQ_QUEUES = {
  AUTH: 'auth_queue',
  USERS: 'users_queue',
  CHAT: 'chat_queue',
  NOTIFICATIONS: 'notifications_queue',
} as const;

export const RMQ_EXCHANGES = {
  EVENTS: 'microservices.events',
} as const;

export const AUTH_PATTERNS = {
  REGISTER: 'auth.register',
  LOGIN: 'auth.login',
  LOGOUT: 'auth.logout',
  VALIDATE_TOKEN: 'auth.validate_token',
  REFRESH_TOKEN: 'auth.refresh_token',
} as const;

export const USERS_PATTERNS = {
  GET_USER: 'users.get_user',
  GET_USER_BY_EMAIL: 'users.get_user_by_email',
  CREATE_USER: 'users.create_user',
  UPDATE_USER: 'users.update_user',
  DELETE_USER: 'users.delete_user',
  SEARCH_USERS: 'users.search_users',
} as const;

export const CHAT_PATTERNS = {
  CREATE_CHAT: 'chat.create_chat',
  GET_CHATS: 'chat.get_chats',
  GET_CHAT: 'chat.get_chat',
  SEND_MESSAGE: 'chat.send_message',
  GET_MESSAGES: 'chat.get_messages',
  ADD_MEMBER: 'chat.add_member',
  LEAVE_CHAT: 'chat.leave_chat',
} as const;

export const EVENTS = {
  USER_CREATED: 'user.created',
  USER_DELETED: 'user.deleted',
  MESSAGE_SENT: 'message.sent',
  CHAT_CREATED: 'chat.created',
} as const;
