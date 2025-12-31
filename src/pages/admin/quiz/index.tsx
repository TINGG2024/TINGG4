import {Button, ScrollView, Text, View} from '@tarojs/components'
import Taro, {useDidShow} from '@tarojs/taro'
import {useState} from 'react'
import {deleteQuizQuestion, getAllQuizQuestions, type QuizQuestion} from '@/db/api'

export default function QuizManagement() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    const data = await getAllQuizQuestions()
    setQuestions(data)
    setLoading(false)
  }

  useDidShow(() => {
    loadData()
  })

  const handleAdd = () => {
    Taro.navigateTo({url: '/pages/admin/quiz/edit'})
  }

  const handleEdit = (id: number) => {
    Taro.navigateTo({url: `/pages/admin/quiz/edit?id=${id}`})
  }

  const handleDelete = (id: number, question: string) => {
    Taro.showModal({
      title: '确认删除',
      content: `确定要删除题目"${question}"吗？`,
      confirmText: '删除',
      confirmColor: '#E63946',
      success: async (res) => {
        if (res.confirm) {
          const success = await deleteQuizQuestion(id)
          if (success) {
            Taro.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000
            })
            loadData()
          } else {
            Taro.showToast({
              title: '删除失败',
              icon: 'error',
              duration: 2000
            })
          }
        }
      }
    })
  }

  return (
    <View className="min-h-screen bg-background">
      <ScrollView scrollY style={{height: '100vh', background: 'transparent'}}>
        {/* 顶部操作栏 */}
        <View className="bg-card border-b border-border px-4 py-3">
          <Button
            className="w-full bg-primary text-white py-3 rounded-lg break-keep text-base font-bold"
            size="default"
            onClick={handleAdd}>
            <View className="flex items-center justify-center">
              <View className="i-mdi-plus text-xl mr-2" />
              <Text>新增题目</Text>
            </View>
          </Button>
        </View>

        {/* 题目列表 */}
        <View className="px-4 py-4">
          {loading ? (
            <View className="flex justify-center items-center py-12">
              <Text className="text-muted-foreground">加载中...</Text>
            </View>
          ) : questions.length > 0 ? (
            <View className="space-y-3">
              {questions.map((q, index) => (
                <View key={q.id} className="bg-card rounded-xl shadow-card p-4">
                  {/* 题目序号和题干 */}
                  <View className="mb-3">
                    <Text className="text-sm text-primary font-bold mb-1 block">第 {index + 1} 题</Text>
                    <Text className="text-base text-foreground font-semibold break-keep">{q.question}</Text>
                  </View>

                  {/* 选项 */}
                  <View className="space-y-2 mb-3">
                    <View className="flex items-start">
                      <Text
                        className={`text-sm mr-2 ${q.correct_answer === 'A' ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                        A.
                      </Text>
                      <Text
                        className={`text-sm flex-1 break-keep ${q.correct_answer === 'A' ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                        {q.option_a}
                      </Text>
                    </View>
                    <View className="flex items-start">
                      <Text
                        className={`text-sm mr-2 ${q.correct_answer === 'B' ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                        B.
                      </Text>
                      <Text
                        className={`text-sm flex-1 break-keep ${q.correct_answer === 'B' ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                        {q.option_b}
                      </Text>
                    </View>
                    <View className="flex items-start">
                      <Text
                        className={`text-sm mr-2 ${q.correct_answer === 'C' ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                        C.
                      </Text>
                      <Text
                        className={`text-sm flex-1 break-keep ${q.correct_answer === 'C' ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                        {q.option_c}
                      </Text>
                    </View>
                  </View>

                  {/* 解析 */}
                  {q.explanation && (
                    <View className="bg-muted bg-opacity-50 rounded-lg p-3 mb-3">
                      <Text className="text-xs text-muted-foreground block mb-1">解析：</Text>
                      <Text className="text-sm text-foreground break-keep">{q.explanation}</Text>
                    </View>
                  )}

                  {/* 操作按钮 */}
                  <View className="flex space-x-2">
                    <Button
                      className="flex-1 bg-primary text-white py-2 rounded-lg break-keep text-sm"
                      size="mini"
                      onClick={() => handleEdit(q.id)}>
                      编辑
                    </Button>
                    <Button
                      className="flex-1 bg-hui-red text-white py-2 rounded-lg break-keep text-sm"
                      size="mini"
                      onClick={() => handleDelete(q.id, q.question)}>
                      删除
                    </Button>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="flex flex-col items-center justify-center py-16">
              <View className="i-mdi-help-circle-outline text-6xl text-muted-foreground opacity-30 mb-4" />
              <Text className="text-muted-foreground">暂无题目</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}
