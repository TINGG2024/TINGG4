import {Image, ScrollView, Text, View} from '@tarojs/components'
import Taro, {useDidShow, useRouter} from '@tarojs/taro'
import {useState} from 'react'
import {getContentsByCategory} from '@/db/api'
import type {Content, ContentCategory} from '@/types/content'

const CATEGORY_CONFIG = {
  scenery: {title: '景点管理', icon: 'i-mdi-image-filter-hdr'},
  food: {title: '美食管理', icon: 'i-mdi-food'},
  culture: {title: '文化管理', icon: 'i-mdi-book-open-page-variant'}
}

export default function ContentManagement() {
  const router = useRouter()
  const category = router.params.category as ContentCategory
  const config = CATEGORY_CONFIG[category]

  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    const data = await getContentsByCategory(category)
    setContents(data)
    setLoading(false)
  }

  useDidShow(() => {
    loadData()
  })

  const handleEdit = (id: string) => {
    Taro.navigateTo({url: `/pages/admin/content/edit?id=${id}&category=${category}`})
  }

  return (
    <View className="min-h-screen bg-background">
      <ScrollView scrollY style={{height: '100vh', background: 'transparent'}}>
        {/* 顶部说明 */}
        <View className="bg-card border-b border-border px-4 py-3">
          {/* 返回按钮 */}
          <View className="mb-3">
            <View className="flex items-center w-20" onClick={() => Taro.navigateBack()}>
              <View className="i-mdi-arrow-left text-2xl text-primary mr-1" />
              <Text className="text-base text-primary">返回</Text>
            </View>
          </View>

          {/* 说明文字 */}
          <View className="flex items-center">
            <View className={`${config.icon} text-2xl text-primary mr-2`} />
            <Text className="text-sm text-muted-foreground">点击条目进入编辑</Text>
          </View>
        </View>

        {/* 内容列表 */}
        <View className="px-4 py-4">
          {loading ? (
            <View className="flex justify-center items-center py-12">
              <Text className="text-muted-foreground">加载中...</Text>
            </View>
          ) : contents.length > 0 ? (
            <View className="space-y-3">
              {contents.map((content) => (
                <View
                  key={content.id}
                  className="bg-card rounded-xl shadow-card overflow-hidden"
                  onClick={() => handleEdit(content.id)}>
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

                    {/* 编辑图标 */}
                    <View className="flex items-center pr-4">
                      <View className="i-mdi-pencil text-xl text-primary" />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="flex flex-col items-center justify-center py-16">
              <View className={`${config.icon} text-6xl text-muted-foreground opacity-30 mb-4`} />
              <Text className="text-muted-foreground">暂无内容</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}
