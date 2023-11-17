export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/test1/index",
    "pages/test2/index",
    "pages/test3/index",
    "pages/test4/index",
    "pages/form/index",
  ],
  permission: {
    "scope.userLocation": {
      desc: "我就想找事，想看看你位置，你给不给看吧！",
    },
  },
  window: {
    //下拉loading的样式
    backgroundTextStyle: "light",
    //导航栏背景颜色
    navigationBarBackgroundColor: "#fff",
    //导航栏标题文字内容
    navigationBarTitleText: "WeChat",

    //导航栏标题颜色
    navigationBarTextStyle: "black",
  },
  tabBar: {
    custom: false, //自定义tabBar
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "assets/images/tabbar/th.jpg",
        selectedIconPath: "assets/images/tabbar/th.jpg",
      },
      {
        pagePath: "pages/test1/index",
        text: "页面1",
        iconPath: "assets/images/tabbar/th.jpg",
        selectedIconPath: "assets/images/tabbar/th.jpg",
      },

      {
        pagePath: "pages/test2/index",
        text: "页面2",
        iconPath: "assets/images/tabbar/th.jpg",
        selectedIconPath: "assets/images/tabbar/th.jpg",
      },
      {
        pagePath: "pages/test3/index",
        text: "页面3",
        iconPath: "assets/images/tabbar/th.jpg",
        selectedIconPath: "assets/images/tabbar/th.jpg",
      },
      {
        pagePath: "pages/test4/index",
        text: "页面4",
        iconPath: "assets/images/tabbar/th.jpg",
        selectedIconPath: "assets/images/tabbar/th.jpg",
      },
    ],
  },
});
