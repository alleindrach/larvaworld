export default config = {
    header: {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    },
    OSS: {
      //debug oss
      // photo: 'http://oxqwow36h.bkt.clouddn.com/',
      // video: 'http://oxquzy4gt.bkt.clouddn.com/',
      // audio: 'http://oxquzki2i.bkt.clouddn.com/',
  
      //production oss
      photo: 'http://image.iyababy.cn/',
      video: 'http://video.iyababy.cn/',
      audio: 'http://audio.iyababy.cn/',
      source: 'http://ow9txy6ol.bkt.clouddn.com/',
  
      //oss api
      videoThumb: '?vframe/jpg/offset/1',
      avvod: '',//'?avvod/m3u8/s/960x640/vb/1250k',
      photoThumb: '?imageView2/2/w/960/h/600/format/jpg/q/100'
    },
    api: {
      //debug server ip
      // base: 'http://192.168.1.104:3000/',
      // base: 'http://60.205.171.124:3000/',
  
      //production server
      base: 'http://192.168.2.149:8762/',
  
      login: 'user/login',
      captcha: 'common/captcha.jpg',
      register: 'user/register',
      authentication: 'user/authentication',
      resetPassword: 'user/resetPassword',
      homepage: 'user/homepage',
      userInfo: 'user/userInfo',
      kidInfo: 'user/kidInfo',
      verifyCode: 'user/verifyCode',
      modifyUserInfo: 'user/modifyUserInfo',
      modifyKidInfo: 'user/modifyKidInfo',
      modifyAvatar: 'user/modifyAvatar',
      modifyNickName: 'user/modifyNickName',
      myActivities: 'activity/myActivities',
      myEnrollActivities: 'user/myEnrollActivities',
      myCreateActivities: 'user/myCreateActivities',
      myWorks: 'user/myWorks',
  
      discuss: 'activity/discuss',
      message: 'userMsg/new',
      event: 'event/get',
      praiseEvent: 'event/praise',
      followEvent: 'event/getFollow',
      getEvent: 'event/getOne',
      qnSignature: 'user/qnSignature',
      addTheme: 'activity/add',
      addTopic: 'activityTopic/add',
      addSignIn: 'activitySignIn/add',
      addNotice: 'activityNotice/add',
      addUpload: 'activityUploading/add',
      addElect: 'activityElect/add',
      addElectList: 'activityElect/result',
      addCourse: 'activityCourse/add',
      showTheme: 'activity/get',
      showTopic: 'activityTopic/get',
      showSignIn: 'activitySignIn/get',
      showNotice: 'activityNotice/get',
      showUpload: 'activityUploading/get',
      showElect: 'activityElect/get',
      showCourse: 'activityCourse/get',
      publishActivity: 'activity/publish',
      customEnrollInfo: 'activity/customEnrollInfo',
      deleteSegment: 'activity/delSegment',
  
      enroll: 'activity/enroll',
      enrollUser: 'activity/enrollUser',
      workList: 'activityUploading/workList',
      awardList: 'activityElect/awardList',
      uploadWorks: 'activityUploading/upload',
      signIn: 'activitySignIn/signIn',
      signedUser: 'activitySignIn/signedUser',
      getWork: 'activityUploading/getWork',
      getOngoingActivities: 'activity/ongoing',
      isEnroll: 'activity/isEnroll',
      workPostAdd: 'work/postAdd',
      workPostGet: 'work/postGet',
      workPostCommentGet: 'workPostComment/get',
      workPostCommentAdd: 'workPostComment/add',
      workDelete: 'work/del',
      praiseWork: 'work/praise',
  
      searchUser: 'search/user',
      searchActivity: 'search/activity',
      searchWork: 'search/work',
  
      recentChat: 'userMsg/recentChat',
  
      postList: 'post/postList',
      addPost: 'post/add',
      sendChatMsg: 'chatMsg/send',
      recvChatMsg: 'chatMsg/get',
      handleChatMsg: 'chatMsg/handle',
  
      report: 'service/report',
      shieldUser: 'user/shield',
      undoShieldUser: 'user/undoShield',
      shieldEvent: 'event/shield',
      isShieldEach: 'user/isShieldEach',
      followUser: 'user/followers',
      follow: 'user/follow',
      followMsg: 'userMsg/followMsg',
      leaveMsg: 'v2.5.6/userMsg/leaveMsg',
      noticeMsg: 'userMsg/noticeMsg',
      praiseMsg: 'userMsg/praiseMsg',
      userPoint:'user/point',
  
      getVersion: 'version/get'
    },
    shareUrl: {
      activity: 'http://iyababy.cn/fancyappShare/activityDetail.html',
      work: 'http://iyababy.cn/fancyappShare/workDetail.html'
    },
    qrCodeApi: {
      read: 'https://api.qrserver.com/v1/read-qr-code/',
    }
  };