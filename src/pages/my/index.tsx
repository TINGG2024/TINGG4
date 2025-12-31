import {Button, Image, Input, ScrollView, Text, View} from '@tarojs/components'
import Taro, {useDidShow} from '@tarojs/taro'
import {useCallback, useState} from 'react'
import {getUserFavorites} from '@/db/api'
import {useUserStore} from '@/store/user'
import type {Content} from '@/types/content'

export default function My() {
  const [favorites, setFavorites] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [editingNickname, setEditingNickname] = useState(false)
  const [tempNickname, setTempNickname] = useState('')
  const [badges, setBadges] = useState<string[]>([])

  const userId = useUserStore((state) => state.userId)
  const nickname = useUserStore((state) => state.nickname)
  const setNickname = useUserStore((state) => state.setNickname)

  const loadData = useCallback(async () => {
    if (!userId) return

    setLoading(true)
    const data = await getUserFavorites(userId)
    setFavorites(data)

    // 加载印章数据
    const badgesData = Taro.getStorageSync('badges') || []
    setBadges(badgesData)

    setLoading(false)
  }, [userId])

  useDidShow(() => {
    loadData()
  })

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
      <ScrollView scrollY style={{height: '100vh', background: 'transparent'}}>
        {/* 徽派风格顶部 */}
        <View className="my-header-hui px-6 pt-8 pb-6">
          <View className="relative z-10">
            <View className="flex items-center mb-6">
              {/* 徽派印章头像 */}
              <View className="hui-seal-avatar mr-4">
                <Image
                  src="https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_4acf2b63-d3ff-4a80-bd4b-7a4384b4246a.jpg"
                  mode="aspectFit"
                  className="hui-seal-avatar-image"
                />
              </View>
              <View className="flex-1">
                {editingNickname ? (
                  <View>
                    <View className="bg-card rounded-lg px-3 py-2 mb-2 border border-border">
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
                        className="flex-1 bg-hui-red text-white py-2 rounded-lg mr-2 break-keep text-sm"
                        size="default"
                        onClick={handleSaveNickname}>
                        保存
                      </Button>
                      <Button
                        className="flex-1 bg-muted text-muted-foreground py-2 rounded-lg break-keep text-sm"
                        size="default"
                        onClick={handleCancelEdit}>
                        取消
                      </Button>
                    </View>
                  </View>
                ) : (
                  <View>
                    {/* 徽派书法体昵称 */}
                    <Text className="hui-nickname block mb-2">{nickname}</Text>
                    {/* 小尺寸浅灰色修改按钮 */}
                    <Text className="text-xs text-muted-foreground" onClick={handleEditNickname}>
                      修改昵称
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* 徽派信息卡片（并排） */}
            <View className="grid grid-cols-2 gap-3">
              {/* 收藏卡片 */}
              <View className="hui-info-card">
                <Text className="text-muted-foreground block mb-2 text-[12px]">收藏</Text>
                <Text className="hui-red-number">{favorites.length}</Text>
              </View>
              {/* 用户ID卡片 */}
              <View className="hui-info-card">
                <Text className="text-muted-foreground block mb-2 text-[12px]">用户ID</Text>
                <Text className="text-huimo font-mono break-all text-[11px]">{userId.slice(0, 8)}...</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 我的印章 - 宣纸纹理背景 */}
        <View className="xuan-paper-bg px-4 py-6">
          <View className="relative z-10">
            <View className="flex items-center justify-center mb-4">
              <Text className="text-lg font-bold text-huimo">我的印章</Text>
            </View>

            {badges.length > 0 ? (
              <View className="grid grid-cols-2 gap-4">
                {badges.map((badge, index) => (
                  <View key={index} className="bg-card rounded-xl p-4 flex flex-col items-center shadow-card">
                    {/* 印章图标 */}
                    <Image
                      src="https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_c5da1e9c-b39b-4e4c-adfe-a85e3cc2455b.jpg"
                      mode="aspectFit"
                      className="w-20 h-20 mb-3"
                    />
                    {/* 印章名称 */}
                    <Text className="text-sm font-bold text-huimo text-center mb-1">{badge}</Text>
                    {/* 获得时间 */}
                    <Text className="text-xs text-muted-foreground text-center">
                      {(() => {
                        const records = Taro.getStorageSync('quizRecords') || []
                        const lastRecord = records[records.length - 1]
                        if (lastRecord?.date) {
                          const date = new Date(lastRecord.date)
                          return `${date.getMonth() + 1}月${date.getDate()}日获得`
                        }
                        return '已获得'
                      })()}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View className="flex flex-col items-center justify-center py-16">
                {/* 徽派空星图标 */}
                <Image
                  src="https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_036b4c00-f71e-496c-be55-ac396c548f3c.jpg"
                  mode="aspectFit"
                  className="w-24 h-24 mb-4 opacity-30"
                />
                {/* 徽派行书提示文字 */}
                <Text className="hui-xingshu-text text-center mb-2">暂无印章</Text>
                <Text className="text-xs text-muted-foreground text-center">完成徽文化小问答可获得印章</Text>
              </View>
            )}
          </View>
        </View>

        {/* 我的收藏 - 宣纸纹理背景 */}
        <View className="xuan-paper-bg px-4 py-6">
          <View className="relative z-10">
            <View className="flex items-center justify-center mb-4">
              <Text className="text-lg font-bold text-huimo">我的收藏</Text>
            </View>

            {loading ? (
              <View className="flex justify-center items-center py-12">
                <Text className="hui-xingshu-text">加载中...</Text>
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
              <View className="flex flex-col items-center justify-center py-16">
                {/* 徽派空星图标 */}
                <Image
                  src="https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_036b4c00-f71e-496c-be55-ac396c548f3c.jpg"
                  mode="aspectFit"
                  className="w-24 h-24 mb-4 opacity-30"
                />
                {/* 徽派行书提示文字 */}
                <Text className="hui-xingshu-text text-center">暂无收藏内容</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
