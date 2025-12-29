import {Image, ScrollView, Text, View} from '@tarojs/components'
import Taro, {useDidShow, useShareAppMessage, useShareTimeline} from '@tarojs/taro'
import {useCallback, useEffect, useState} from 'react'
import {getAllContents} from '@/db/api'
import {useUserStore} from '@/store/user'
import type {Content} from '@/types/content'

// 分类配置 - 安徽特色图标
const CATEGORIES = [
  {
    key: 'food',
    name: '徽菜美食',
    icon: 'https://miaoda-image.cdn.bcebos.com/img/corpus/235fe99f283c4b3eb4014f6e6d9e7c5a.jpg' // 徽菜美食
  },
  {
    key: 'scenery',
    name: '自然风景',
    icon: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_6231976e-1a42-431f-a9ae-c609db47144a.jpg' // 黄山迎客松
  },
  {
    key: 'culture',
    name: '历史文化',
    icon: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_ae49543e-b595-45d7-831e-7b485d0f8a10.jpg' // 徽派马头墙
  },
  {
    key: 'quiz',
    name: '徽文化小问答',
    icon: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_0d21dfd3-7586-4314-a3ad-578b6aac8fff.jpg' // 徽派书卷
  }
]

// 地域专题轮播图
const SPECIAL_IMAGES = [
  'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_537fad72-237f-47d3-a771-91243bfeb5d5.jpg', // 宏村
  'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_27e08092-b8c3-4631-94f3-88b1201a8e57.jpg', // 西递
  'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_e16d3678-3967-4023-86a2-01aafcc2112b.jpg' // 呈坎
]

export default function Home() {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [specialImageIndex, setSpecialImageIndex] = useState(0)
  const initUser = useUserStore((state) => state.initUser)

  // 初始化用户
  useDidShow(() => {
    initUser()
  })

  // 加载内容数据
  const loadContents = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getAllContents()
      setContents(data || [])
    } catch (error) {
      console.error('加载内容失败:', error)
      Taro.showToast({title: '加载失败', icon: 'none'})
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadContents()
  }, [loadContents])

  // 专题区轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setSpecialImageIndex((prev) => (prev + 1) % SPECIAL_IMAGES.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  // 分享配置
  useShareAppMessage(() => ({
    title: '皖美视界 · 一脚踏进徽州，一眼看尽江淮',
    path: '/pages/home/index'
  }))

  useShareTimeline(() => ({
    title: '皖美视界 · 一脚踏进徽州，一眼看尽江淮'
  }))

  // 跳转到详情页
  const navigateToDetail = (id: string) => {
    Taro.navigateTo({url: `/pages/detail/index?id=${id}`})
  }

  // 跳转到分类页面
  const navigateToCategory = (category: string) => {
    if (category === 'quiz') {
      Taro.navigateTo({url: '/pages/quiz/index'})
    } else {
      Taro.switchTab({url: `/pages/${category}/index`})
    }
  }

  // 按分类分组内容
  const foodContents = contents.filter((c) => c.category === 'food')
  const sceneryContents = contents.filter((c) => c.category === 'scenery')
  const cultureContents = contents.filter((c) => c.category === 'culture')
  const economyContents = contents.filter((c) => c.category === 'economy')

  return (
    <View className="min-h-screen bg-background">
      <ScrollView scrollY style={{height: '100vh', background: 'transparent'}}>
        {/* 1. 顶部沉浸式通栏Banner（40%屏幕高度） */}
        <View className="relative" style={{height: '40vh'}}>
          {/* 背景图 */}
          <Image
            src="https://miaoda-image.cdn.bcebos.com/img/corpus/daf01f65366a47c783357742afd52553.jpg"
            mode="aspectFill"
            className="w-full h-full"
          />
          {/* 10%黑蒙版 */}
          <View className="absolute inset-0 bg-black opacity-10" />

          {/* 内容 */}
          <View className="absolute inset-0 flex flex-col items-center justify-center">
            <Text className="text-4xl font-bold text-white block mb-3" style={{fontWeight: 'bold'}}>
              皖美视界
            </Text>
            <Text className="text-sm text-white block opacity-90">一脚踏进徽州，一眼看尽江淮</Text>
          </View>
          {/* 向下滑动箭头 */}
          <View className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <View className="i-mdi-chevron-down text-3xl text-white animate-bounce" />
          </View>
        </View>

        {/* 2. 安徽特色图标分类导航（一排横向） */}
        <View className="bg-card py-5">
          <View className="flex items-center justify-between px-4">
            {CATEGORIES.map((cat, index) => (
              <View key={index} className="anhui-icon-btn" onClick={() => navigateToCategory(cat.key)}>
                {/* 安徽特色图标 */}
                <Image src={cat.icon} mode="aspectFit" className="anhui-icon-image" />
                {/* 文字 */}
                <Text className="anhui-icon-text text-huimo">{cat.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 3. 核心推荐区（双列卡片布局） */}
        <View className="px-4 py-5">
          {/* 美食文化 */}
          {foodContents.length > 0 && (
            <View className="mb-6">
              <View className="flex items-center justify-between mb-4">
                <Text className="text-lg font-bold text-huimo">徽菜美食</Text>
                <View className="flex items-center text-xs text-hui-red" onClick={() => navigateToCategory('food')}>
                  <Text className="mr-1">查看更多</Text>
                  <View className="i-mdi-chevron-right text-sm" />
                </View>
              </View>
              <View className="grid grid-cols-2 gap-3">
                {foodContents.map((content) => (
                  <View
                    key={content.id}
                    className="bg-card rounded-xl shadow-card overflow-hidden card-scale"
                    onClick={() => navigateToDetail(content.id)}>
                    <View className="w-full" style={{paddingTop: '66.67%', position: 'relative'}}>
                      <Image
                        src={content.image_url || 'https://via.placeholder.com/300x200'}
                        mode="aspectFill"
                        className="absolute inset-0 w-full h-full"
                      />
                    </View>
                    <View className="p-3">
                      <Text className="text-sm font-bold text-foreground block mb-1 break-keep line-clamp-1">
                        {content.title}
                      </Text>
                      <Text
                        className="text-xs text-muted-foreground block mb-2 line-clamp-2"
                        style={{lineHeight: '1.5'}}>
                        {content.description.slice(0, 30)}...
                      </Text>
                      <View className="flex items-center justify-between">
                        <View className="flex items-center text-xs text-muted-foreground">
                          <View className="i-mdi-thumb-up-outline text-sm mr-1" />
                          <Text>{content.likes_count}</Text>
                        </View>
                        <View className="flex items-center text-xs text-hui-red">
                          <Text className="mr-1">查看详情</Text>
                          <View className="i-mdi-chevron-right text-sm" />
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 自然风景 */}
          {sceneryContents.length > 0 && (
            <View className="mb-6">
              <View className="flex items-center justify-between mb-4">
                <Text className="text-lg font-bold text-huimo">自然风景</Text>
                <View className="flex items-center text-xs text-hui-red" onClick={() => navigateToCategory('scenery')}>
                  <Text className="mr-1">查看更多</Text>
                  <View className="i-mdi-chevron-right text-sm" />
                </View>
              </View>
              <View className="grid grid-cols-2 gap-3">
                {sceneryContents.map((content) => (
                  <View
                    key={content.id}
                    className="bg-card rounded-xl shadow-card overflow-hidden card-scale"
                    onClick={() => navigateToDetail(content.id)}>
                    <View className="w-full" style={{paddingTop: '66.67%', position: 'relative'}}>
                      <Image
                        src={content.image_url || 'https://via.placeholder.com/300x200'}
                        mode="aspectFill"
                        className="absolute inset-0 w-full h-full"
                      />
                    </View>
                    <View className="p-3">
                      <Text className="text-sm font-bold text-foreground block mb-1 break-keep line-clamp-1">
                        {content.title}
                      </Text>
                      <Text
                        className="text-xs text-muted-foreground block mb-2 line-clamp-2"
                        style={{lineHeight: '1.5'}}>
                        {content.description.slice(0, 30)}...
                      </Text>
                      <View className="flex items-center justify-between">
                        <View className="flex items-center text-xs text-muted-foreground">
                          <View className="i-mdi-thumb-up-outline text-sm mr-1" />
                          <Text>{content.likes_count}</Text>
                        </View>
                        <View className="flex items-center text-xs text-hui-red">
                          <Text className="mr-1">查看详情</Text>
                          <View className="i-mdi-chevron-right text-sm" />
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 历史文化 */}
          {cultureContents.length > 0 && (
            <View className="mb-6">
              <View className="flex items-center justify-between mb-4">
                <Text className="text-lg font-bold text-huimo">历史文化</Text>
                <View className="flex items-center text-xs text-hui-red" onClick={() => navigateToCategory('culture')}>
                  <Text className="mr-1">查看更多</Text>
                  <View className="i-mdi-chevron-right text-sm" />
                </View>
              </View>
              <View className="grid grid-cols-2 gap-3">
                {cultureContents.map((content) => (
                  <View
                    key={content.id}
                    className="bg-card rounded-xl shadow-card overflow-hidden card-scale"
                    onClick={() => navigateToDetail(content.id)}>
                    <View className="w-full" style={{paddingTop: '66.67%', position: 'relative'}}>
                      <Image
                        src={content.image_url || 'https://via.placeholder.com/300x200'}
                        mode="aspectFill"
                        className="absolute inset-0 w-full h-full"
                      />
                    </View>
                    <View className="p-3">
                      <Text className="text-sm font-bold text-foreground block mb-1 break-keep line-clamp-1">
                        {content.title}
                      </Text>
                      <Text
                        className="text-xs text-muted-foreground block mb-2 line-clamp-2"
                        style={{lineHeight: '1.5'}}>
                        {content.description.slice(0, 30)}...
                      </Text>
                      <View className="flex items-center justify-between">
                        <View className="flex items-center text-xs text-muted-foreground">
                          <View className="i-mdi-thumb-up-outline text-sm mr-1" />
                          <Text>{content.likes_count}</Text>
                        </View>
                        <View className="flex items-center text-xs text-hui-red">
                          <Text className="mr-1">查看详情</Text>
                          <View className="i-mdi-chevron-right text-sm" />
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 经济发展 */}
          {economyContents.length > 0 && (
            <View className="mb-6">
              <View className="flex items-center justify-between mb-4">
                <Text className="text-lg font-bold text-huimo">经济发展</Text>
                <Text className="text-xs text-huimo-light">见证发展成就</Text>
              </View>
              <View className="flex flex-wrap justify-between">
                {economyContents.map((content) => (
                  <View
                    key={content.id}
                    className="w-[48%] mb-3 bg-card rounded-xl shadow-card overflow-hidden card-scale"
                    onClick={() => navigateToDetail(content.id)}>
                    <View className="w-full" style={{paddingTop: '66.67%', position: 'relative'}}>
                      <Image
                        src={content.image_url || 'https://via.placeholder.com/300x200'}
                        mode="aspectFill"
                        className="absolute inset-0 w-full h-full"
                      />
                    </View>
                    <View className="p-3">
                      <Text className="text-sm font-bold text-foreground block mb-1 break-keep line-clamp-1">
                        {content.title}
                      </Text>
                      <Text
                        className="text-xs text-muted-foreground block mb-2 line-clamp-2"
                        style={{lineHeight: '1.5'}}>
                        {content.description.slice(0, 30)}...
                      </Text>
                      <View className="flex items-center justify-between">
                        <View className="flex items-center text-xs text-muted-foreground">
                          <View className="i-mdi-thumb-up-outline text-sm mr-1" />
                          <Text>{content.likes_count}</Text>
                        </View>
                        <View className="flex items-center text-xs text-hui-red">
                          <Text className="mr-1">查看详情</Text>
                          <View className="i-mdi-chevron-right text-sm" />
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* 4. 地域专题区（通栏模块） */}
        <View className="mx-4 mb-5 bg-card rounded-xl shadow-card overflow-hidden">
          <View className="flex">
            {/* 左侧文字区（40%） */}
            <View className="w-[40%] p-4 flex flex-col justify-center bg-gradient-subtle">
              <Text className="text-base font-bold text-huimo block mb-2">徽州古村专题</Text>
              <Text className="text-xs text-huimo-light block mb-3" style={{lineHeight: '1.5'}}>
                探访宏村、西递、呈坎，感受徽派建筑的独特魅力
              </Text>
              <View
                className="inline-flex items-center text-xs text-hui-red"
                onClick={() => navigateToCategory('culture')}>
                <Text className="mr-1">进入专题</Text>
                <View className="i-mdi-arrow-right text-sm" />
              </View>
            </View>
            {/* 右侧轮播图（60%） */}
            <View className="w-[60%] relative" style={{height: '150px'}}>
              {SPECIAL_IMAGES.map((img, index) => (
                <View
                  key={index}
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{opacity: index === specialImageIndex ? 1 : 0}}>
                  <Image src={img} mode="aspectFill" className="w-full h-full" />
                </View>
              ))}
              {/* 轮播指示器 */}
              <View className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center">
                {SPECIAL_IMAGES.map((_, index) => (
                  <View
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full mx-1 ${index === specialImageIndex ? 'bg-white' : 'bg-white opacity-50'}`}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* 5. 底部轻量推荐区 */}
        <View className="px-4 pb-6">
          <View className="flex justify-between"></View>
        </View>

        {loading && (
          <View className="flex justify-center items-center py-12">
            <Text className="text-muted-foreground">加载中...</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}
