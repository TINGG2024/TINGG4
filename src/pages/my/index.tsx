import {Button, Image, Input, ScrollView, Text, View} from '@tarojs/components'
import Taro, {useDidShow, useShareAppMessage, useShareTimeline} from '@tarojs/taro'
import {useCallback, useState} from 'react'
import {getUserFavorites} from '@/db/api'
import {useUserStore} from '@/store/user'
import type {Content} from '@/types/content'

export default function My() {
  const [favorites, setFavorites] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [editingNickname, setEditingNickname] = useState(false)
  const [tempNickname, setTempNickname] = useState('')

  const userId = useUserStore((state) => state.userId)
  const nickname = useUserStore((state) => state.nickname)
  const setNickname = useUserStore((state) => state.setNickname)

  const loadData = useCallback(async () => {
    if (!userId) return

    setLoading(true)
    const data = await getUserFavorites(userId)
    setFavorites(data)
    setLoading(false)
  }, [userId])

  useDidShow(() => {
    loadData()
  })

  useShareAppMessage(() => ({
    title: '皖美 · 发现安徽之美',
    path: '/pages/home/index'
  }))

  useShareTimeline(() => ({
    title: '皖美 · 发现安徽之美'
  }))

  const navigateToDetail = (id: string) => {
    Taro.navigateTo({url: `/pages/detail/index?id=${id}`})
  }

  const handleEditNickname = () => {
    setTempNickname(nickname)
    setEditingNickname(true)
  }

  const handleSaveNickname = () => {
    if (!tempNickname.trim()) {
      Taro.showToast({title: '昵称不能为空', icon: 'none'})
      return
    }

    setNickname(tempNickname.trim())
    setEditingNickname(false)
    Taro.showToast({title: '昵称已更新', icon: 'success'})
  }

  const handleCancelEdit = () => {
    setEditingNickname(false)
    setTempNickname('')
  }

  return (
    <View className="min-h-screen bg-background">
      <ScrollView scrollY className="h-screen" style={{background: 'transparent'}}>
        {/* 用户信息卡片 */}
        <View className="bg-gradient-primary px-6 pt-8 pb-12">
          <View className="flex items-center">
            <View className="w-20 h-20 rounded-full bg-primary-foreground flex items-center justify-center mr-4">
              <Text className="text-3xl text-primary font-bold">{nickname.charAt(0)}</Text>
            </View>
            <View className="flex-1">
              {editingNickname ? (
                <View>
                  <View className="bg-primary-foreground rounded-lg px-3 py-2 mb-2">
                    <Input
                      className="text-foreground"
                      value={tempNickname}
                      onInput={(e) => setTempNickname(e.detail.value)}
                      placeholder="请输入昵称"
                      maxlength={20}
                    />
                  </View>
                  <View className="flex">
                    <Button
                      className="flex-1 bg-secondary text-secondary-foreground py-2 rounded-lg mr-2 break-keep text-sm"
                      size="default"
                      onClick={handleSaveNickname}>
                      保存
                    </Button>
                    <Button
                      className="flex-1 bg-primary-foreground text-primary py-2 rounded-lg break-keep text-sm"
                      size="default"
                      onClick={handleCancelEdit}>
                      取消
                    </Button>
                  </View>
                </View>
              ) : (
                <View>
                  <Text className="text-2xl font-bold text-primary-foreground block mb-2">{nickname}</Text>
                  <View className="flex items-center" onClick={handleEditNickname}>
                    <View className="i-mdi-pencil text-primary-foreground mr-1" />
                    <Text className="text-sm text-primary-foreground opacity-90">修改昵称</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* 统计信息 */}
        <View className="px-4 -mt-8 mb-6">
          <View className="bg-card rounded-2xl shadow-card p-6">
            <View className="flex justify-around">
              <View className="flex flex-col items-center">
                <Text className="text-2xl font-bold text-primary block mb-1">{favorites.length}</Text>
                <Text className="text-sm text-muted-foreground">收藏</Text>
              </View>
              <View className="w-px bg-border" />
              <View className="flex flex-col items-center">
                <Text className="text-2xl font-bold text-secondary block mb-1">
                  {userId ? userId.slice(-6) : '------'}
                </Text>
                <Text className="text-sm text-muted-foreground">用户ID</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 我的收藏 */}
        <View className="px-4 pb-6">
          <View className="flex items-center mb-4">
            <View className="i-mdi-star text-2xl text-primary mr-2" />
            <Text className="text-lg font-bold text-foreground">我的收藏</Text>
          </View>

          {loading ? (
            <View className="flex justify-center items-center py-12">
              <Text className="text-muted-foreground">加载中...</Text>
            </View>
          ) : favorites.length > 0 ? (
            <View className="space-y-3">
              {favorites.map((content) => (
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
          ) : (
            <View className="flex flex-col items-center justify-center py-12 bg-card rounded-2xl">
              <View className="i-mdi-star-off-outline text-6xl text-muted-foreground mb-4" />
              <Text className="text-muted-foreground mb-2">还没有收藏内容</Text>
              <Text className="text-sm text-muted-foreground">快去发现喜欢的内容吧</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}
