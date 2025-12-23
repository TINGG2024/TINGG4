import {Button, Image, ScrollView, Text, Textarea, View} from '@tarojs/components'
import Taro, {useDidShow, useRouter, useShareAppMessage, useShareTimeline} from '@tarojs/taro'
import {useCallback, useState} from 'react'
import {
  addComment,
  checkUserFavorited,
  checkUserLiked,
  favoriteContent,
  getCommentsByContentId,
  getContentById,
  likeContent,
  unfavoriteContent,
  unlikeContent
} from '@/db/api'
import {useUserStore} from '@/store/user'
import type {Comment, Content} from '@/types/content'

export default function Detail() {
  const router = useRouter()
  const contentId = router.params.id || ''

  const [content, setContent] = useState<Content | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLiked, setIsLiked] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const userId = useUserStore((state) => state.userId)
  const nickname = useUserStore((state) => state.nickname)

  const loadData = useCallback(async () => {
    if (!contentId) return

    setLoading(true)

    // 加载内容详情
    const contentData = await getContentById(contentId)
    setContent(contentData)

    // 加载评论
    const commentsData = await getCommentsByContentId(contentId)
    setComments(commentsData)

    // 检查点赞和收藏状态
    if (userId) {
      const liked = await checkUserLiked(contentId, userId)
      const favorited = await checkUserFavorited(contentId, userId)
      setIsLiked(liked)
      setIsFavorited(favorited)
    }

    setLoading(false)
  }, [contentId, userId])

  useDidShow(() => {
    loadData()
  })

  // 分享配置
  useShareAppMessage(() => ({
    title: content ? `皖美 · ${content.title}` : '皖美',
    path: `/pages/detail/index?id=${contentId}`
  }))

  useShareTimeline(() => ({
    title: content ? `皖美 · ${content.title}` : '皖美'
  }))

  // 点赞/取消点赞
  const handleLike = async () => {
    if (!userId || !content) return

    if (isLiked) {
      const success = await unlikeContent(content.id, userId)
      if (success) {
        setIsLiked(false)
        setContent({...content, likes_count: content.likes_count - 1})
        Taro.showToast({title: '已取消点赞', icon: 'none'})
      }
    } else {
      const success = await likeContent(content.id, userId)
      if (success) {
        setIsLiked(true)
        setContent({...content, likes_count: content.likes_count + 1})
        Taro.showToast({title: '点赞成功', icon: 'success'})
      }
    }
  }

  // 收藏/取消收藏
  const handleFavorite = async () => {
    if (!userId || !content) return

    if (isFavorited) {
      const success = await unfavoriteContent(content.id, userId)
      if (success) {
        setIsFavorited(false)
        setContent({...content, favorites_count: content.favorites_count - 1})
        Taro.showToast({title: '已取消收藏', icon: 'none'})
      }
    } else {
      const success = await favoriteContent(content.id, userId)
      if (success) {
        setIsFavorited(true)
        setContent({...content, favorites_count: content.favorites_count + 1})
        Taro.showToast({title: '收藏成功', icon: 'success'})
      }
    }
  }

  // 提交评论
  const handleSubmitComment = async () => {
    if (!userId || !content) return

    if (!commentText.trim()) {
      Taro.showToast({title: '请输入评论内容', icon: 'none'})
      return
    }

    setSubmitting(true)
    const success = await addComment(content.id, userId, nickname, commentText.trim())

    if (success) {
      Taro.showToast({title: '评论成功', icon: 'success'})
      setCommentText('')
      setContent({...content, comments_count: content.comments_count + 1})
      // 重新加载评论列表
      const commentsData = await getCommentsByContentId(content.id)
      setComments(commentsData)
    } else {
      Taro.showToast({title: '评论失败', icon: 'error'})
    }

    setSubmitting(false)
  }

  // 格式化时间
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`

    return date.toLocaleDateString('zh-CN')
  }

  if (loading) {
    return (
      <View className="min-h-screen bg-background flex items-center justify-center">
        <Text className="text-muted-foreground">加载中...</Text>
      </View>
    )
  }

  if (!content) {
    return (
      <View className="min-h-screen bg-background flex flex-col items-center justify-center">
        <View className="i-mdi-alert-circle-outline text-6xl text-muted-foreground mb-4" />
        <Text className="text-muted-foreground">内容不存在</Text>
      </View>
    )
  }

  return (
    <View className="min-h-screen bg-background pb-20">
      <ScrollView scrollY className="h-screen" style={{background: 'transparent'}}>
        {/* 图片 */}
        <View className="w-full h-64">
          <Image
            src={content.image_url || 'https://via.placeholder.com/800x600'}
            mode="aspectFill"
            className="w-full h-full"
          />
        </View>

        {/* 内容详情 */}
        <View className="bg-card px-6 py-6">
          <Text className="text-2xl font-bold text-foreground block mb-3 break-keep">{content.title}</Text>
          {content.subtitle && <Text className="text-base text-primary block mb-4 break-keep">{content.subtitle}</Text>}
          <Text className="text-base text-foreground leading-relaxed block whitespace-pre-wrap">
            {content.description}
          </Text>
        </View>

        {/* 评论区 */}
        <View className="mt-4 bg-card px-6 py-6">
          <View className="flex items-center mb-4">
            <View className="i-mdi-comment-text-outline text-2xl text-primary mr-2" />
            <Text className="text-lg font-bold text-foreground">评论 ({content.comments_count})</Text>
          </View>

          {/* 评论输入框 */}
          <View className="mb-6">
            <View className="bg-input rounded-xl border border-border p-3 mb-3">
              <Textarea
                className="w-full text-foreground"
                style={{padding: 0, border: 'none', background: 'transparent', minHeight: '80px'}}
                placeholder="说说你的看法..."
                value={commentText}
                onInput={(e) => setCommentText(e.detail.value)}
                maxlength={500}
              />
            </View>
            <Button
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl break-keep text-base"
              size="default"
              onClick={submitting ? undefined : handleSubmitComment}>
              {submitting ? '发布中...' : '发布评论'}
            </Button>
          </View>

          {/* 评论列表 */}
          <View className="space-y-4">
            {comments.map((comment) => (
              <View key={comment.id} className="border-b border-border pb-4 last:border-b-0">
                <View className="flex items-center mb-2">
                  <View className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2">
                    <Text className="text-primary-foreground text-sm">{comment.nickname.charAt(0)}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-foreground block">{comment.nickname}</Text>
                    <Text className="text-xs text-muted-foreground block">{formatTime(comment.created_at)}</Text>
                  </View>
                </View>
                <Text className="text-sm text-foreground block ml-10">{comment.comment_text}</Text>
              </View>
            ))}

            {comments.length === 0 && (
              <View className="flex flex-col items-center justify-center py-8">
                <View className="i-mdi-comment-off-outline text-5xl text-muted-foreground mb-2" />
                <Text className="text-muted-foreground text-sm">暂无评论，快来抢沙发吧</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-3 flex items-center justify-around">
        <View className="flex flex-col items-center" onClick={handleLike}>
          <View
            className={`${isLiked ? 'i-mdi-thumb-up' : 'i-mdi-thumb-up-outline'} text-2xl ${isLiked ? 'text-primary' : 'text-muted-foreground'}`}
          />
          <Text className={`text-xs mt-1 ${isLiked ? 'text-primary' : 'text-muted-foreground'}`}>
            {content.likes_count}
          </Text>
        </View>

        <View className="flex flex-col items-center" onClick={handleFavorite}>
          <View
            className={`${isFavorited ? 'i-mdi-star' : 'i-mdi-star-outline'} text-2xl ${isFavorited ? 'text-primary' : 'text-muted-foreground'}`}
          />
          <Text className={`text-xs mt-1 ${isFavorited ? 'text-primary' : 'text-muted-foreground'}`}>
            {content.favorites_count}
          </Text>
        </View>

        <View className="flex flex-col items-center">
          <View className="i-mdi-comment-outline text-2xl text-muted-foreground" />
          <Text className="text-xs mt-1 text-muted-foreground">{content.comments_count}</Text>
        </View>
      </View>
    </View>
  )
}
