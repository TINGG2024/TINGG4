import {ScrollView, Text, View} from '@tarojs/components'
import Taro from '@tarojs/taro'

export default function Admin() {
  const modules = [
    {
      id: 'quiz',
      title: '题库管理',
      icon: 'i-mdi-help-circle',
      description: '管理徽派文化问答题目',
      path: '/pages/admin/quiz/index'
    },
    {
      id: 'scenery',
      title: '景点管理',
      icon: 'i-mdi-image-filter-hdr',
      description: '管理安徽著名景点内容',
      path: '/pages/admin/content/index?category=scenery'
    },
    {
      id: 'food',
      title: '美食管理',
      icon: 'i-mdi-food',
      description: '管理安徽特色美食内容',
      path: '/pages/admin/content/index?category=food'
    },
    {
      id: 'culture',
      title: '文化管理',
      icon: 'i-mdi-book-open-page-variant',
      description: '管理安徽历史文化内容',
      path: '/pages/admin/content/index?category=culture'
    }
  ]

  const handleNavigate = (path: string) => {
    Taro.navigateTo({url: path})
  }

  return (
    <View className="min-h-screen bg-background">
      <ScrollView scrollY style={{height: '100vh', background: 'transparent'}}>
        {/* 徽派风格顶部 */}
        <View className="bg-gradient-secondary px-6 pt-8 pb-12">
          {/* 返回按钮 */}
          <View className="mb-4">
            <View className="flex items-center w-20" onClick={() => Taro.navigateBack()}>
              <View className="i-mdi-arrow-left text-2xl text-white mr-1" />
              <Text className="text-base text-white">返回</Text>
            </View>
          </View>

          {/* 标题区域 */}
          <View className="flex flex-col items-center">
            <View className="i-mdi-cog text-5xl text-white mb-3" />
            <Text className="text-2xl font-bold text-white mb-2">内容管理</Text>
            <Text className="text-sm text-white text-opacity-90">全员可编辑 · 实时生效</Text>
          </View>
        </View>

        {/* 管理模块列表 */}
        <View className="px-4 -mt-6">
          <View className="space-y-4">
            {modules.map((module) => (
              <View
                key={module.id}
                className="bg-card rounded-xl shadow-card p-5"
                onClick={() => handleNavigate(module.path)}>
                <View className="flex items-center">
                  {/* 图标 */}

                  {/* 内容 */}
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-foreground block mb-1 break-keep">{module.title}</Text>
                    <Text className="text-sm text-muted-foreground break-keep">{module.description}</Text>
                  </View>
                  {/* 箭头 */}
                  <View className="i-mdi-chevron-right text-2xl text-muted-foreground" />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 底部说明 */}
        <View className="px-6 py-8">
          <View className="bg-muted bg-opacity-50 rounded-xl p-4">
            <View className="flex items-start">
              <View className="i-mdi-information text-xl text-primary mr-2 mt-0.5" />
              <View className="flex-1">
                <Text className="text-sm text-muted-foreground break-keep">
                  所有用户都可以编辑内容，修改后立即生效。请谨慎操作，确保内容准确性。
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
