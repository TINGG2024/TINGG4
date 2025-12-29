import {Button, Image, ScrollView, Text, View} from '@tarojs/components'
import Taro, {useShareAppMessage, useShareTimeline} from '@tarojs/taro'
import {useState} from 'react'

// 题库配置
interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number // 正确答案的索引（0-based）
  explanation: string
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: '马头墙最初的主要作用是？',
    options: ['A. 美观', 'B. 防火', 'C. 防盗'],
    correctAnswer: 1,
    explanation: '马头墙又称防火墙，是徽派建筑的防火设计，可以有效阻止火势蔓延。'
  },
  {
    id: 2,
    question: '臭鳜鱼的传统腌制时间约为？',
    options: ['A. 1天', 'B. 7天', 'C. 15天'],
    correctAnswer: 1,
    explanation: '臭鳜鱼需要腌制约7天，让鱼肉发酵产生独特的臭味，这是徽菜的经典做法。'
  },
  {
    id: 3,
    question: '黄梅戏的发源地是安徽哪个城市？',
    options: ['A. 安庆', 'B. 黄山', 'C. 合肥'],
    correctAnswer: 0,
    explanation: '黄梅戏发源于安庆市，是中国五大戏曲剧种之一，被誉为"中国的乡村音乐剧"。'
  },
  {
    id: 4,
    question: '徽州三雕指的是哪三种雕刻工艺？',
    options: ['A. 木雕、石雕、砖雕', 'B. 木雕、玉雕、竹雕', 'C. 石雕、铜雕、泥雕'],
    correctAnswer: 0,
    explanation: '徽州三雕是指木雕、石雕、砖雕，是徽派建筑装饰的重要组成部分，工艺精湛。'
  },
  {
    id: 5,
    question: '黄山四绝中不包括以下哪一项？',
    options: ['A. 奇松', 'B. 怪石', 'C. 飞瀑'],
    correctAnswer: 2,
    explanation: '黄山四绝是指奇松、怪石、云海、温泉，飞瀑虽然也是黄山的特色，但不在四绝之列。'
  }
]

export default function Quiz() {
  const [showQuizModal, setShowQuizModal] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)

  // 分享配置
  useShareAppMessage(() => ({
    title: '徽派文化小问答 · 测测你对安徽文化的了解',
    path: '/pages/quiz/index'
  }))

  useShareTimeline(() => ({
    title: '徽派文化小问答 · 测测你对安徽文化的了解'
  }))

  // 开始答题
  const handleStartQuiz = () => {
    setShowQuizModal(true)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setCorrectCount(0)
    setAnsweredQuestions([])
    setShowResult(false)
  }

  // 选择答案
  const handleSelectAnswer = (answerIndex: number) => {
    if (showFeedback) return // 已经显示反馈，不允许再选择

    setSelectedAnswer(answerIndex)
    setShowFeedback(true)

    const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex]
    const isCorrect = answerIndex === currentQuestion.correctAnswer

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1)
    }

    setAnsweredQuestions((prev) => [...prev, currentQuestion.id])

    // 2秒后自动跳转到下一题或显示结果
    setTimeout(() => {
      if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
        // 跳转到下一题
        setCurrentQuestionIndex((prev) => prev + 1)
        setSelectedAnswer(null)
        setShowFeedback(false)
      } else {
        // 显示最终结果
        setShowResult(true)
        // 保存答题记录到本地缓存
        const quizRecord = {
          date: new Date().toISOString(),
          correctCount: isCorrect ? correctCount + 1 : correctCount,
          totalCount: QUIZ_QUESTIONS.length
        }
        const records = Taro.getStorageSync('quizRecords') || []
        records.push(quizRecord)
        Taro.setStorageSync('quizRecords', records)

        // 如果答对4题及以上，奖励印章
        if (quizRecord.correctCount >= 4) {
          const badges = Taro.getStorageSync('badges') || []
          if (!badges.includes('徽文化达人')) {
            badges.push('徽文化达人')
            Taro.setStorageSync('badges', badges)
            Taro.showToast({
              title: '获得"徽文化达人"印章！',
              icon: 'success',
              duration: 2000
            })
          }
        }
      }
    }, 2000)
  }

  // 关闭弹窗
  const handleCloseModal = () => {
    setShowQuizModal(false)
    setShowResult(false)
  }

  // 重新答题
  const handleRetry = () => {
    setShowResult(false)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setCorrectCount(0)
    setAnsweredQuestions([])
  }

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex]
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer

  return (
    <View className="min-h-screen bg-background">
      <ScrollView scrollY style={{height: '100vh', background: 'transparent'}}>
        {/* 宣纸纹理背景 */}
        <View className="xuan-paper-bg min-h-screen px-6 py-8">
          <View className="relative z-10">
            {/* 标题区域 */}
            <View className="flex items-center justify-between mb-6">
              <Text className="hui-calligraphy-title text-2xl">徽派文化小问答</Text>
              <Button
                className="bg-hui-red text-white px-6 py-2 rounded-lg break-keep text-sm"
                size="default"
                onClick={handleStartQuiz}>
                开始答题
              </Button>
            </View>

            {/* 说明文字 */}
            <View className="bg-card rounded-xl p-4 mb-6">
              <Text className="text-sm text-muted-foreground block mb-2">测测你对安徽文化的了解程度！</Text>
              <Text className="text-xs text-muted-foreground block mb-1">• 共5道题，涵盖徽菜、徽派建筑、徽州民俗</Text>
              <Text className="text-xs text-muted-foreground block mb-1">• 答对4题及以上可获得"徽文化达人"印章</Text>
              <Text className="text-xs text-muted-foreground block">• 每题答完后会显示正确答案和解析</Text>
            </View>

            {/* 题目预览 */}
            <View className="space-y-3">
              {QUIZ_QUESTIONS.map((q, index) => (
                <View key={q.id} className="bg-card rounded-xl p-4 flex items-center">
                  <View className="w-8 h-8 rounded-full bg-hui-gray flex items-center justify-center mr-3">
                    <Text className="text-sm font-bold text-huimo">{index + 1}</Text>
                  </View>
                  <Text className="text-sm text-foreground flex-1">{q.question}</Text>
                  {answeredQuestions.includes(q.id) && <View className="i-mdi-check-circle text-xl text-hui-green" />}
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 答题弹窗 */}
      {showQuizModal && (
        <View
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <View className="xuan-paper-bg w-full h-full flex flex-col">
            <View className="relative z-10 flex-1 flex flex-col">
              {/* 顶部装饰线 */}
              <View className="hui-pattern-line" />

              {!showResult ? (
                <>
                  {/* 题目区域 */}
                  <View className="flex-1 px-6 py-8">
                    {/* 题号 */}
                    <View className="flex items-center justify-between mb-6">
                      <Text className="text-lg font-bold text-huimo">第 {currentQuestionIndex + 1} 题</Text>
                      <Text className="text-sm text-muted-foreground">
                        剩余题目：{QUIZ_QUESTIONS.length - currentQuestionIndex - 1}/5
                      </Text>
                    </View>

                    {/* 题目 */}
                    <View className="bg-card rounded-xl p-5 mb-6">
                      <Text className="text-base text-foreground leading-relaxed">{currentQuestion.question}</Text>
                    </View>

                    {/* 选项 */}
                    <View className="space-y-3">
                      {currentQuestion.options.map((option, index) => {
                        const isSelected = selectedAnswer === index
                        const isCorrectOption = index === currentQuestion.correctAnswer
                        const showCorrect = showFeedback && isCorrectOption
                        const showWrong = showFeedback && isSelected && !isCorrect

                        return (
                          <View
                            key={index}
                            className={`quiz-option ${isSelected && !showFeedback ? 'quiz-option-selected' : ''} ${showCorrect ? 'quiz-option-correct' : ''} ${showWrong ? 'quiz-option-wrong' : ''}`}
                            onClick={() => handleSelectAnswer(index)}>
                            <Text className="text-sm flex-1">{option}</Text>
                            {showCorrect && <View className="i-mdi-check-circle text-xl" />}
                            {showWrong && <View className="i-mdi-close-circle text-xl" />}
                          </View>
                        )
                      })}
                    </View>

                    {/* 反馈和解析 */}
                    {showFeedback && (
                      <View className={`mt-6 rounded-xl p-4 ${isCorrect ? 'bg-hui-green-light' : 'bg-hui-red-light'}`}>
                        <View className="flex items-center mb-2">
                          {isCorrect ? (
                            <>
                              <View className="i-mdi-check-circle text-xl text-hui-green mr-2" />
                              <Text className="text-base font-bold text-hui-green">回答正确！</Text>
                            </>
                          ) : (
                            <>
                              <View className="i-mdi-close-circle text-xl text-hui-red mr-2" />
                              <Text className="text-base font-bold text-hui-red">回答错误</Text>
                            </>
                          )}
                        </View>
                        <Text className="text-sm text-huimo leading-relaxed">{currentQuestion.explanation}</Text>
                      </View>
                    )}
                  </View>
                </>
              ) : (
                <>
                  {/* 结果页面 */}
                  <View className="flex-1 px-6 py-8 flex flex-col items-center justify-center">
                    <Text className="hui-calligraphy-title text-3xl mb-6">答题完成！</Text>

                    {/* 正确率 */}
                    <View className="bg-card rounded-xl p-8 mb-6 w-full">
                      <View className="flex flex-col items-center">
                        <Text className="text-sm text-muted-foreground mb-2">正确率</Text>
                        <Text className="text-5xl font-bold text-hui-red mb-2">
                          {Math.round((correctCount / QUIZ_QUESTIONS.length) * 100)}%
                        </Text>
                        <Text className="text-sm text-muted-foreground">
                          答对 {correctCount} 题，共 {QUIZ_QUESTIONS.length} 题
                        </Text>
                      </View>
                    </View>

                    {/* 印章提示 */}
                    {correctCount >= 4 && (
                      <View className="bg-hui-green-light rounded-xl p-4 mb-6 w-full flex items-center">
                        <Image
                          src="https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_4acf2b63-d3ff-4a80-bd4b-7a4384b4246a.jpg"
                          mode="aspectFit"
                          className="w-16 h-16 mr-4"
                        />
                        <View className="flex-1">
                          <Text className="text-base font-bold text-hui-green block mb-1">
                            恭喜获得"徽文化达人"印章！
                          </Text>
                          <Text className="text-xs text-muted-foreground">已保存到个人中心的印章集</Text>
                        </View>
                      </View>
                    )}

                    {/* 按钮 */}
                    <View className="flex w-full space-x-3">
                      <Button
                        className="flex-1 bg-muted text-muted-foreground py-3 rounded-lg break-keep text-base"
                        size="default"
                        onClick={handleCloseModal}>
                        返回
                      </Button>
                      <Button
                        className="flex-1 bg-hui-red text-white py-3 rounded-lg break-keep text-base"
                        size="default"
                        onClick={handleRetry}>
                        再来一次
                      </Button>
                    </View>
                  </View>
                </>
              )}

              {/* 底部装饰线 */}
              <View className="hui-pattern-line" />
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
