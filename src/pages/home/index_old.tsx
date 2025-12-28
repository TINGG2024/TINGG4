import {Image, ScrollView, Text, View} from '@tarojs/components'
import Taro, {useDidShow, useShareAppMessage, useShareTimeline} from '@tarojs/taro'
import {useCallback, useEffect, useState} from 'react'
import {getAllContents} from '@/db/api'
import {useUserStore} from '@/store/user'
import type {CategoryInfo, Content} from '@/types/content'

const CATEGORIES: CategoryInfo[] = [
  {key: 'food', name: '美食文化', icon: 'i-mdi-food', description: '品味徽州美食'},
  {key: 'scenery', name: '自然风景', icon: 'i-mdi-image-filter-hdr', description: '领略山水之美'},
  {key: 'culture', name: '历史文化', icon: 'i-mdi-book-open-page-variant', description: '感受文化底蕴'},
  {key: 'economy', name: '经济发展', icon: 'i-mdi-chart-line', description: '见证发展成就'}
]

export default function Home() {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const initUser = useUserStore((state) => state.initUser)

  // 初始化用户
  useEffect(() => {
    initUser()
  }, [initUser])

  // 加载数据
  const loadData = useCallback(async () => {
    setLoading(true)
    const data = await getAllContents()
    setContents(data)
    setLoading(false)
  }, [])

  useDidShow(() => {
    loadData()
  })

  // 分享配置
  useShareAppMessage(() => ({
    title: '皖美 · 发现安徽之美',
    path: '/pages/home/index'
  }))

  useShareTimeline(() => ({
    title: '皖美 · 发现安徽之美'
  }))

  // 跳转到分类页面
  const navigateToCategory = (category: string) => {
    // 经济页面不在TabBar中，使用navigateTo
    if (category === 'economy') {
      Taro.navigateTo({url: `/pages/${category}/index`})
    } else {
      Taro.switchTab({url: `/pages/${category}/index`})
    }
  }

  // 跳转到详情页
  const navigateToDetail = (id: string) => {
    Taro.navigateTo({url: `/pages/detail/index?id=${id}`})
  }

  // 按分类获取内容
  const getContentsByCategory = (category: string) => {
    return contents.filter((item) => item.category === category).slice(0, 3)
  }

  return (
    <View className="min-h-screen bg-background">
      <ScrollView scrollY className="h-screen" style={{background: 'transparent'}}>
        {/* 顶部横幅 */}
        <View className="bg-gradient-primary px-6 pt-8 pb-12">
          <Text className="text-3xl font-bold text-primary-foreground block mb-2">皖美</Text>
          <Text className="text-base text-primary-foreground opacity-90 block">发现安徽之美 · 感受徽州魅力</Text>
        </View>

        {/* 分类导航 */}
        <View className="px-4 -mt-8 mb-6">
          <View className="bg-card rounded-2xl shadow-card p-4">
            <View className="flex flex-wrap justify-between">
              {CATEGORIES.map((cat) => (
                <View key={cat.key} className="w-[48%] mb-3" onClick={() => navigateToCategory(cat.key)}>
                  <View className="bg-gradient-subtle rounded-xl p-4 flex flex-col items-center">
                    <View className={`${cat.icon} text-4xl text-primary mb-2`} />
                    <Text className="text-base font-semibold text-foreground block mb-1">{cat.name}</Text>
                    <Text className="text-xs text-muted-foreground block text-center">{cat.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 内容展示区 */}
        <View className="px-4 pb-6">
          {CATEGORIES.map((cat) => {
            const categoryContents = getContentsByCategory(cat.key)
            if (categoryContents.length === 0) return null

            return (
              <View key={cat.key} className="mb-6">
                {/* 分类标题 */}
                <View className="flex items-center justify-between mb-3">
                  <View className="flex items-center">
                    <View className={`${cat.icon} text-2xl text-primary mr-2`} />
                    <Text className="text-lg font-bold text-foreground">{cat.name}</Text>
                  </View>
                  <View className="flex items-center" onClick={() => navigateToCategory(cat.key)}>
                    <Text className="text-sm text-muted-foreground mr-1">更多</Text>
                    <View className="i-mdi-chevron-right text-lg text-muted-foreground" />
                  </View>
                </View>

                {/* 内容卡片 */}
                <View className="space-y-3">
                  {categoryContents.map((content) => (
                    <View
                      key={content.id}
                      className="bg-card rounded-xl shadow-card overflow-hidden"
                      onClick={() => navigateToDetail(content.id)}>
                      <View className="flex">
                        {/* 图片 */}
                        <View className="w-28 h-28 flex-shrink-0">
                          <Image
                            src={content.image_url || 'https://via.placeholder.com/200'}
                            mode="aspectFill"
                            className="w-full h-full"
                          />
                        </View>

                        {/* 内容 */}
                        <View className="flex-1 p-3 flex flex-col justify-between">
                          <View>
                            <Text className="text-base font-semibold text-foreground block mb-1 break-keep">
                              {content.title}
                            </Text>
                            {content.subtitle && (
                              <Text className="text-xs text-muted-foreground block mb-2 break-keep">
                                {content.subtitle}
                              </Text>
                            )}
                          </View>

                          {/* 统计信息 */}
                          <View className="flex items-center text-xs text-muted-foreground">
                            <View className="flex items-center mr-3">
                              <View className="i-mdi-thumb-up-outline text-sm mr-1" />
                              <Text>{content.likes_count}</Text>
                            </View>
                            <View className="flex items-center mr-3">
                              <View className="i-mdi-star-outline text-sm mr-1" />
                              <Text>{content.favorites_count}</Text>
                            </View>
                            <View className="flex items-center">
                              <View className="i-mdi-comment-outline text-sm mr-1" />
                              <Text>{content.comments_count}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )
          })}
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
