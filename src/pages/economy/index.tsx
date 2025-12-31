import {Image, ScrollView, Text, View} from '@tarojs/components'
import Taro, {useDidShow} from '@tarojs/taro'
import {useCallback, useState} from 'react'
import {getContentsByCategory} from '@/db/api'
import type {Content} from '@/types/content'

export default function Economy() {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    const data = await getContentsByCategory('economy')
    setContents(data)
    setLoading(false)
  }, [])

  useDidShow(() => {
    loadData()
  })

  const navigateToDetail = (id: string) => {
    Taro.navigateTo({url: `/pages/detail/index?id=${id}`})
  }

  const handleBack = () => {
    Taro.navigateBack()
  }

  return (
    <View className="min-h-screen bg-background">
      <ScrollView scrollY className="h-screen" style={{background: 'transparent'}}>
        {/* 顶部介绍 */}
        <View className="bg-gradient-secondary px-6 py-8 relative">
          {/* 返回按钮 */}
          <View
            className="absolute top-4 left-4 w-10 h-10 bg-card bg-opacity-80 rounded-full flex items-center justify-center shadow-lg"
            onClick={handleBack}>
            <View className="i-mdi-arrow-left text-2xl text-foreground" />
          </View>
          <View className="flex items-center mb-3">
            <View className="i-mdi-chart-line text-5xl text-secondary-foreground mr-3" />
            <View>
              <Text className="text-2xl font-bold text-secondary-foreground block mb-1">经济发展</Text>
              <Text className="text-sm text-secondary-foreground opacity-90 block">见证发展成就 · 展望美好未来</Text>
            </View>
          </View>
        </View>

        {/* 内容列表 */}
        <View className="px-4 py-6">
          {contents.map((content) => (
            <View
              key={content.id}
              className="bg-card rounded-2xl shadow-card overflow-hidden mb-4"
              onClick={() => navigateToDetail(content.id)}>
              {/* 图片 */}
              <View className="w-full h-48">
                <Image
                  src={content.image_url || 'https://via.placeholder.com/400x300'}
                  mode="aspectFill"
                  className="w-full h-full"
                />
              </View>

              {/* 内容 */}
              <View className="p-4">
                <Text className="text-xl font-bold text-foreground block mb-2 break-keep">{content.title}</Text>
                {content.subtitle && (
                  <Text className="text-sm text-secondary block mb-3 break-keep">{content.subtitle}</Text>
                )}
                <Text className="text-sm text-muted-foreground block mb-4 line-clamp-3">{content.description}</Text>

                {/* 统计信息 */}
                <View className="flex items-center justify-between pt-3 border-t border-border">
                  <View className="flex items-center text-sm text-muted-foreground">
                    <View className="flex items-center mr-4">
                      <View className="i-mdi-thumb-up-outline text-lg mr-1" />
                      <Text>{content.likes_count}</Text>
                    </View>
                    <View className="flex items-center mr-4">
                      <View className="i-mdi-star-outline text-lg mr-1" />
                      <Text>{content.favorites_count}</Text>
                    </View>
                    <View className="flex items-center">
                      <View className="i-mdi-comment-outline text-lg mr-1" />
                      <Text>{content.comments_count}</Text>
                    </View>
                  </View>
                  <View className="flex items-center text-secondary">
                    <Text className="text-sm mr-1">查看详情</Text>
                    <View className="i-mdi-chevron-right text-lg" />
                  </View>
                </View>
              </View>
            </View>
          ))}

          {loading && (
            <View className="flex justify-center items-center py-12">
              <Text className="text-muted-foreground">加载中...</Text>
            </View>
          )}

          {!loading && contents.length === 0 && (
            <View className="flex flex-col items-center justify-center py-12">
              <View className="i-mdi-chart-box-outline text-6xl text-muted-foreground mb-4" />
              <Text className="text-muted-foreground">暂无内容</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}
