import {Button, Input, ScrollView, Text, Textarea, View} from '@tarojs/components'
import Taro, {useDidShow, useRouter} from '@tarojs/taro'
import {useState} from 'react'
import {createQuizQuestion, getQuizQuestionById, updateQuizQuestion} from '@/db/api'

export default function QuizEdit() {
  const router = useRouter()
  const questionId = router.params.id ? Number.parseInt(router.params.id, 10) : null

  const [question, setQuestion] = useState('')
  const [optionA, setOptionA] = useState('')
  const [optionB, setOptionB] = useState('')
  const [optionC, setOptionC] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C'>('A')
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading] = useState(false)

  useDidShow(() => {
    if (questionId) {
      loadData()
    }
  })

  const loadData = async () => {
    if (!questionId) return

    const data = await getQuizQuestionById(questionId)
    if (data) {
      setQuestion(data.question)
      setOptionA(data.option_a)
      setOptionB(data.option_b)
      setOptionC(data.option_c)
      setCorrectAnswer(data.correct_answer as 'A' | 'B' | 'C')
      setExplanation(data.explanation || '')
    }
  }

  const handleSave = async () => {
    // 验证必填项
    if (!question.trim()) {
      Taro.showToast({
        title: '请输入题干',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (!optionA.trim() || !optionB.trim() || !optionC.trim()) {
      Taro.showToast({
        title: '请输入所有选项',
        icon: 'none',
        duration: 2000
      })
      return
    }

    setLoading(true)

    const data = {
      question: question.trim(),
      option_a: optionA.trim(),
      option_b: optionB.trim(),
      option_c: optionC.trim(),
      correct_answer: correctAnswer,
      explanation: explanation.trim() || null
    }

    let success = false

    if (questionId) {
      // 更新
      success = await updateQuizQuestion(questionId, data)
    } else {
      // 新增
      const result = await createQuizQuestion(data)
      success = !!result
    }

    setLoading(false)

    if (success) {
      Taro.showToast({
        title: questionId ? '修改成功' : '新增成功',
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
          {/* 返回按钮 */}
          <View className="mb-6">
            <View className="flex items-center w-20" onClick={() => Taro.navigateBack()}>
              <View className="i-mdi-arrow-left text-2xl text-primary mr-1" />
              <Text className="text-base text-primary">返回</Text>
            </View>
          </View>

          {/* 题干 */}
          <View className="mb-6">
            <Text className="text-sm text-foreground font-semibold mb-2 block">
              题干 <Text className="text-hui-red">*</Text>
            </Text>
            <View className="bg-input rounded-lg border border-border px-3 py-2">
              <Textarea
                className="w-full text-foreground"
                style={{padding: 0, border: 'none', background: 'transparent'}}
                placeholder="请输入题干"
                value={question}
                onInput={(e) => setQuestion(e.detail.value)}
                maxlength={200}
                autoHeight
              />
            </View>
          </View>

          {/* 选项A */}
          <View className="mb-4">
            <Text className="text-sm text-foreground font-semibold mb-2 block">
              选项A <Text className="text-hui-red">*</Text>
            </Text>
            <View className="bg-input rounded-lg border border-border px-3 py-2">
              <Input
                className="w-full text-foreground"
                style={{padding: 0, border: 'none', background: 'transparent'}}
                placeholder="请输入选项A"
                value={optionA}
                onInput={(e) => setOptionA(e.detail.value)}
                maxlength={100}
              />
            </View>
          </View>

          {/* 选项B */}
          <View className="mb-4">
            <Text className="text-sm text-foreground font-semibold mb-2 block">
              选项B <Text className="text-hui-red">*</Text>
            </Text>
            <View className="bg-input rounded-lg border border-border px-3 py-2">
              <Input
                className="w-full text-foreground"
                style={{padding: 0, border: 'none', background: 'transparent'}}
                placeholder="请输入选项B"
                value={optionB}
                onInput={(e) => setOptionB(e.detail.value)}
                maxlength={100}
              />
            </View>
          </View>

          {/* 选项C */}
          <View className="mb-4">
            <Text className="text-sm text-foreground font-semibold mb-2 block">
              选项C <Text className="text-hui-red">*</Text>
            </Text>
            <View className="bg-input rounded-lg border border-border px-3 py-2">
              <Input
                className="w-full text-foreground"
                style={{padding: 0, border: 'none', background: 'transparent'}}
                placeholder="请输入选项C"
                value={optionC}
                onInput={(e) => setOptionC(e.detail.value)}
                maxlength={100}
              />
            </View>
          </View>

          {/* 正确答案 */}
          <View className="mb-6">
            <Text className="text-sm text-foreground font-semibold mb-2 block">
              正确答案 <Text className="text-hui-red">*</Text>
            </Text>
            <View className="flex space-x-3">
              {(['A', 'B', 'C'] as const).map((option) => (
                <View
                  key={option}
                  className={`flex-1 py-3 rounded-lg border-2 flex items-center justify-center ${
                    correctAnswer === option ? 'border-primary bg-primary' : 'border-border bg-card'
                  }`}
                  onClick={() => setCorrectAnswer(option)}>
                  <Text
                    className={`text-base font-bold ${correctAnswer === option ? 'text-white' : 'text-muted-foreground'}`}>
                    {option}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* 解析 */}
          <View className="mb-6">
            <Text className="text-sm text-foreground font-semibold mb-2 block">解析</Text>
            <View className="bg-input rounded-lg border border-border px-3 py-2">
              <Textarea
                className="w-full text-foreground"
                style={{padding: 0, border: 'none', background: 'transparent'}}
                placeholder="请输入解析（选填）"
                value={explanation}
                onInput={(e) => setExplanation(e.detail.value)}
                maxlength={300}
                autoHeight
              />
            </View>
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
