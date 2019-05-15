export default config = {
    header: {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    },
    file: {
      downloadTimeout:50000,
      soundMediaType:'aac',
      maxSoundLength:15,
      cacheDir:"/temp"
    },
    websocket:{
      base: 'http://192.168.2.233/bzws',
      address:'/websocket',
      single:'/user/topic/message',
      broadcast:'/topic/message',
    },
    flags:{
      plus:'+'
    },
    api: {
      //debug server ip
      // base: 'http://192.168.1.104:3000/',
      // base: 'http://60.205.171.124:3000/',
  
      //production server
      base: 'http://192.168.2.233/bz',
      filebase:'http://192.168.2.233/bz/file',
      file:'file',
      thumb:'small',
      login: '/login',
      captcha: '/common/captcha.jpg',
      register: '/register',
      resetPassword: '/password/reset',
      storySync:'/story/sync',
      verifyCode: '/common/mobile/captcha',
      soundChannelsPrefetch:'/sound/channels/down',
      soundChannelsSync:'/sound/channels/up',
      soundMsgUp:'/sound/msg/up',
      soundMsgList:'/sound/msg/list',
      soundMsgCopy:'/sound/msg/copy',
    },
    shareUrl: {
      activity: 'http://iyababy.cn/fancyappShare/activityDetail.html',
      work: 'http://iyababy.cn/fancyappShare/workDetail.html'
    },
    qrCodeApi: {
      read: 'https://api.qrserver.com/v1/read-qr-code/',
    },

    // 路由信息配置
    routes : {
      Login: {
        name: 'Login',
        path: 'login',
        title: '登录'
      },
      Home: {
        name:'Home',
        path: '/'
      }
    },

  };