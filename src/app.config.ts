const pages = [
  'pages/home/index',
  'pages/food/index',
  'pages/scenery/index',
  'pages/culture/index',
  'pages/economy/index',
  'pages/detail/index',
  'pages/my/index'
]

//  To fully leverage TypeScript's type safety and ensure its correctness, always enclose the configuration object within the global defineAppConfig helper function.
export default defineAppConfig({
  pages,
  tabBar: {
    color: '#666666',
    selectedColor: '#4A90E2',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        iconPath: './assets/images/unselected/home.png',
        selectedIconPath: './assets/images/selected/home.png'
      },
      {
        pagePath: 'pages/food/index',
        text: '美食',
        iconPath: './assets/images/unselected/food.png',
        selectedIconPath: './assets/images/selected/food.png'
      },
      {
        pagePath: 'pages/scenery/index',
        text: '风景',
        iconPath: './assets/images/unselected/scenery.png',
        selectedIconPath: './assets/images/selected/scenery.png'
      },
      {
        pagePath: 'pages/culture/index',
        text: '文化',
        iconPath: './assets/images/unselected/culture.png',
        selectedIconPath: './assets/images/selected/culture.png'
      },
      {
        pagePath: 'pages/my/index',
        text: '我的',
        iconPath: './assets/images/unselected/my.png',
        selectedIconPath: './assets/images/selected/my.png'
      }
    ]
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#4A90E2',
    navigationBarTitleText: '皖美',
    navigationBarTextStyle: 'white'
  }
})
