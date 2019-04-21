
//app action types
export const APP_NETWORK_AVAILABLE_CHANGE = 'app/networkAvailable/change'

//user action types
export const USER_LOGIN_FAIL = 'user/login/fail'
export const USER_LOGIN_SUCCESS = 'user/login/success'
export const USER_LOGIN_DOING = 'user/login/doing'
export const USER_LOGOUT = 'user/logout'
export const USER_HOME_PAGE_FETCH = 'user/homepage'
export const USER_HOME_PAGE_UPDATE =  'user/updateInfo'
export const USER_LOGIN_CAPTCHA_REFRESH='user/login/cpathca/refresh'
//message action types
export const STOMP_CONTEXT_INIT='stomp/context'
export const STOMP_CONNECT_DOING='stomp/connecting'
export const STOMP_CONNECT_FAIL='stomp/connect/fail'
export const STOMP_CONNECT_DISCONNECTED='stomp/disconnected'
export const STOMP_CONNECT_SUCCESS='stomp/connect/success'
export const STOMP_MSG_RECEIVED='stomp/msg/received'
export const STOMP_MSG_SENDDING='stomp/msg/sendding'
export const STOMP_MSG_SEND_SUCCESS='stomp/msg/send/success'
export const STOMP_MSG_SEND_FAIL='stomp/msg/send/fail'


export const MESSAGE_UPDATE = 'message/update'
export const MESSAGE_CHAT_LIST_FETCH_DOING = 'message/chatList/fetching'
export const MESSAGE_CHAT_LIST_FETCH_SUCCESS = 'message/chatList/fetchSuccess'
export const MESSAGE_CHAT_LIST_FETCH_FAIL = 'message/chatList/fetchFail'
export const MESSAGE_CHAT_LIST_REMOVE_MSG_FLAG = 'message/chatList/removeMsgFlag'
export const MESSAGE_CHAT_WITH_USER_FETCH_DOING = 'message/chatWithUser/fetching'
export const MESSAGE_CHAT_WITH_USER_FETCH_SUCCESS = 'message/chatWithUser/fetchSuccess'
export const MESSAGE_CHAT_WITH_USER_FETCH_FAIL = 'message/chatWithUser/fetchFail'
export const MESSAGE_CHAT_WITH_USER_SEND_DOING = 'message/chatWithUser/sending'
export const MESSAGE_CHAT_WITH_USER_SEND_SUCCESS = 'message/chatWithUser/sendSuccess'
export const MESSAGE_CHAT_WITH_USER_SEND_FAIL = 'message/chatWithUser/sendFail'
export const MESSAGE_CHAT_LIST_UPDATE_AFTER_CHAT = 'message/chatList/updateAfterChat'
export const MESSAGE_CHAT_WITH_USER_MSG_HANDLE_DOING = 'message/chatWithUser/msg/handling'
export const MESSAGE_CHAT_WITH_USER_MSG_HANDLE_SUCCESS = 'message/chatWithUser/msg/handleSuccess'
export const MESSAGE_CHAT_WITH_USER_MSG_HANDLE_FAIL = 'message/chatWithUser/msg/handleFail'

//work edit activity
export const WORK_SELECT='work/select'
export const WORK_CACHING='work/caching'
export const WORK_CACHED='work/cached'
export const WORK_CACHE_FAIL='work/cach/fail'
export const WORK_SCENE_ADD='work/scene/add'
export const WORK_SCENE_DEL='work/scene/del'
export const WORK_UPDATE='work/update'
export const WORK_UPDATE_SUCCESS='work/update/success'
export const WORK_UPDATE_MERGED='work/update/merged'
export const WORK_UPDATE_FAIL='work/update/fail'
export const WORK_SCENE_IMAGE_SELECT='work/scene/image/select'
export const WORK_SCENE_AUDIO_SELECT='work/scene/audio/select'


//home page event list
export const EVENT_LIST_FETCH_DOING = 'event/fetching'
export const EVENT_LIST_FETCH_SUCCESS = 'event/fetchSuccess'
export const EVENT_LIST_FETCH_FAIL = 'event/fetchFail'
export const EVENT_LIST_DELETE_ROW = 'event/deleteRow'
export const EVENT_LIST_SWITCH_INDEX = 'event/switchIndex'
export const EVENT_LIST_PRAISE_EVENT = 'event/praise'
export const EVENT_LIST_PRAISE_EVENT_DONE = 'event/praise/done'
export const EVENT_LIST_PRAISE_WORK = 'event/work/praise'

//my activity
export const MY_ACTIVITY_SWITCH_ROLE = 'myActivity/switchRole'
//my create activity list
export const MY_ACTIVITY_CREATE_LIST_FETCH_DOING = 'myActivity/createList/fetching'
export const MY_ACTIVITY_CREATE_LIST_FETCH_SUCCESS = 'myActivity/createList/fetchSuccess'
export const MY_ACTIVITY_CREATE_LIST_FETCH_FAIL = 'myActivity/createList/fetchFail'
//my join activity list
export const MY_ACTIVITY_JOIN_LIST_FETCH_DOING = 'myActivity/joinList/fetching'
export const MY_ACTIVITY_JOIN_LIST_FETCH_SUCCESS = 'myActivity/joinList/fetchSuccess'
export const MY_ACTIVITY_JOIN_LIST_FETCH_FAIL = 'myActivity/joinList/fetchFail'

//drawer
export const DRAWER_SCREEN_ACTIVITY_FETCH_DOING = 'drawer/activity/fetching'
export const DRAWER_SCREEN_ACTIVITY_FETCH_SUCCESS = 'drawer/activity/fetchSuccess'
export const DRAWER_SCREEN_ACTIVITY_FETCH_FAIL = 'drawer/activity/fetchFail'
export const DRAWER_SCREEN_ACTIVITY_CHECK_ENROLL = 'drawer/activity/checkEnroll'
export const DRAWER_SCREEN_ACTIVITY_ENROLL_SUCCESS = 'drawer/activity/enrollSuccess'
export const DRAWER_SCREEN_ACTIVITY_CLEAR_INFO = 'drawer/activity/clearInfo'
export const DRAWER_SCREEN_SEGMENT_DELETE = 'drawer/segment/delete'

//media player
export const MEDIA_AUDIO_PLAYER_PLAY = 'media/audio/play'