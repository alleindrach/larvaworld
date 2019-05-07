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
      maxSoundLength:100,
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
  
      login: '/login',
      captcha: '/common/captcha.jpg',
      register: '/register',
      resetPassword: '/password/reset',
      storySync:'/story/sync',
      verifyCode: '/common/mobile/captcha',
      soundChannelsPrefetch:'/story/sound/channels',
      soundChannelsSync:'/story/sound/channels',

    },
    shareUrl: {
      activity: 'http://iyababy.cn/fancyappShare/activityDetail.html',
      work: 'http://iyababy.cn/fancyappShare/workDetail.html'
    },
    qrCodeApi: {
      read: 'https://api.qrserver.com/v1/read-qr-code/',
    }
  };