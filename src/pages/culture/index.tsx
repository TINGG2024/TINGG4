import {Image, ScrollView, Text, View} from '@tarojs/components'
import Taro, {useDidShow, useShareAppMessage, useShareTimeline} from '@tarojs/taro'
import {useCallback, useState} from 'react'
import {getContentsByCategory} from '@/db/api'
import type {Content} from '@/types/content'

export default function Culture() {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    const data = await getContentsByCategory('culture')
    setContents(data)
    setLoading(false)
  }, [])

  useDidShow(() => {
    loadData()
  })

  useShareAppMessage(() => ({
    title: '皖美 · 感受文化底蕴',
    path: '/pages/culture/index'
  }))

  useShareTimeline(() => ({
    title: '皖美 · 感受文化底蕴'
  }))

  const navigateToDetail = (id: string) => {
    Taro.navigateTo({url: `/pages/detail/index?id=${id}`})
  }

  return (
    <View className="min-h-screen bg-background">
      <ScrollView scrollY className="h-screen" style={{background: 'transparent'}}>
        {/* 顶部介绍 */}
        <View className="bg-gradient-primary px-6 py-8">
          <View className="flex items-center mb-3">
            <View className="i-mdi-book-open-page-variant text-5xl text-primary-foreground mr-3" />
            <View>
              <Text className="text-2xl font-bold text-primary-foreground block mb-1">历史文化</Text>
              <Text className="text-sm text-primary-foreground opacity-90 block">感受文化底蕴 · 传承历史文明</Text>
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
                  <Text className="text-sm text-primary block mb-3 break-keep">{content.subtitle}</Text>
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
                  <View className="flex items-center text-primary">
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
              <View className="i-mdi-book-off text-6xl text-muted-foreground mb-4" />
              <Text className="text-muted-foreground">暂无内容</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}
