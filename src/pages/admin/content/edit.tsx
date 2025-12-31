import {Button, Image, Input, ScrollView, Text, Textarea, View} from '@tarojs/components'
import Taro, {useDidShow, useRouter} from '@tarojs/taro'
import {useState} from 'react'
import {getContentById, updateContent} from '@/db/api'

export default function ContentEdit() {
  const router = useRouter()
  const contentId = router.params.id as string
  const _category = router.params.category as string

  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)

  useDidShow(() => {
    loadData()
  })

  const loadData = async () => {
    const data = await getContentById(contentId)
    if (data) {
      setTitle(data.title)
      setSubtitle(data.subtitle || '')
      setDescription(data.description)
      setImageUrl(data.image_url || '')
    }
  }

  const handleSave = async () => {
    // 验证必填项
    if (!title.trim()) {
      Taro.showToast({
        title: '请输入标题',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (!description.trim()) {
      Taro.showToast({
        title: '请输入描述',
        icon: 'none',
        duration: 2000
      })
      return
    }

    setLoading(true)

    const data = {
      title: title.trim(),
      subtitle: subtitle.trim() || null,
      description: description.trim(),
      image_url: imageUrl.trim() || null
    }

    const success = await updateContent(contentId, data)

    setLoading(false)

    if (success) {
      Taro.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 2000
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 2000)
    } else {
      Taro.showToast({
        title: '保存失败',
        icon: 'error',
        duration: 2000
      })
    }
  }

  return (
    <View className="min-h-screen bg-background">
      <ScrollView scrollY style={{height: '100vh', background: 'transparent'}}>
        <View className="px-4 py-6">
          {/* 图片预览 */}
          {imageUrl && (
            <View className="mb-6">
              <Text className="text-sm text-foreground font-semibold mb-2 block">图片预览</Text>
              <View className="w-full h-48 rounded-lg overflow-hidden bg-muted">
                <Image src={imageUrl} mode="aspectFill" className="w-full h-full" />
              </View>
            </View>
          )}

          {/* 标题 */}
          <View className="mb-4">
            <Text className="text-sm text-foreground font-semibold mb-2 block">
              标题 <Text className="text-hui-red">*</Text>
            </Text>
            <View className="bg-input rounded-lg border border-border px-3 py-2">
              <Input
                className="w-full text-foreground"
                style={{padding: 0, border: 'none', background: 'transparent'}}
                placeholder="请输入标题"
                value={title}
                onInput={(e) => setTitle(e.detail.value)}
                maxlength={50}
              />
            </View>
          </View>

          {/* 副标题 */}
          <View className="mb-4">
            <Text className="text-sm text-foreground font-semibold mb-2 block">副标题</Text>
            <View className="bg-input rounded-lg border border-border px-3 py-2">
              <Input
                className="w-full text-foreground"
                style={{padding: 0, border: 'none', background: 'transparent'}}
                placeholder="请输入副标题（选填）"
                value={subtitle}
                onInput={(e) => setSubtitle(e.detail.value)}
                maxlength={100}
              />
            </View>
          </View>

          {/* 描述 */}
          <View className="mb-4">
            <Text className="text-sm text-foreground font-semibold mb-2 block">
              描述 <Text className="text-hui-red">*</Text>
            </Text>
            <View className="bg-input rounded-lg border border-border px-3 py-2">
              <Textarea
                className="w-full text-foreground"
                style={{padding: 0, border: 'none', background: 'transparent'}}
                placeholder="请输入描述"
                value={description}
                onInput={(e) => setDescription(e.detail.value)}
                maxlength={1000}
                autoHeight
              />
            </View>
          </View>

          {/* 图片URL */}
          <View className="mb-6">
            <Text className="text-sm text-foreground font-semibold mb-2 block">图片URL</Text>
            <View className="bg-input rounded-lg border border-border px-3 py-2">
              <Input
                className="w-full text-foreground"
                style={{padding: 0, border: 'none', background: 'transparent'}}
                placeholder="请输入图片URL（选填）"
                value={imageUrl}
                onInput={(e) => setImageUrl(e.detail.value)}
              />
            </View>
            <Text className="text-xs text-muted-foreground mt-1">提示：输入完整的图片URL地址</Text>
          </View>

          {/* 保存按钮 */}
          <Button
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-base break-keep"
            size="default"
            onClick={handleSave}
            loading={loading}>
            {loading ? '保存中...' : '保存'}
          </Button>
        </View>
      </ScrollView>
    </View>
  )
}
