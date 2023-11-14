export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/test1/index",
    "pages/test2/index",
    "pages/test3/index",
    "pages/form/index",
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "assets/images/tabbar/th.jpg",
        selectedIconPath: "assets/images/tabbar/th.jpg",
      },
      {
        pagePath: "pages/test1/index",
        text: "测试1",
        iconPath: "assets/images/tabbar/th.jpg",
        selectedIconPath: "assets/images/tabbar/th.jpg",
      },
      {
        pagePath: "pages/test2/index",
        text: "测试2",
        iconPath: "assets/images/tabbar/th.jpg",
        selectedIconPath: "assets/images/tabbar/th.jpg",
      },
      {
        pagePath: "pages/test3/index",
        text: "测试3",
        iconPath: "assets/images/tabbar/th.jpg",
        selectedIconPath: "assets/images/tabbar/th.jpg",
      },
    ],
  },
});
