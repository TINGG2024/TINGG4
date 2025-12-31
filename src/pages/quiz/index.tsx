import {Button, Image, ScrollView, Text, View} from '@tarojs/components'
import Taro, {useDidShow} from '@tarojs/taro'
import {useCallback, useState} from 'react'
import {type QuizQuestion as DBQuizQuestion, getAllQuizQuestions} from '@/db/api'

// 题库配置（适配数据库格式）
interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number // 正确答案的索引（0-based）
  explanation: string
}

// 将数据库格式转换为页面格式
function convertDBQuestionToPageFormat(dbQuestion: DBQuizQuestion): QuizQuestion {
  const options = [`A. ${dbQuestion.option_a}`, `B. ${dbQuestion.option_b}`, `C. ${dbQuestion.option_c}`]

  // 将A/B/C转换为0/1/2
  const correctAnswerMap: Record<string, number> = {A: 0, B: 1, C: 2}
  const correctAnswer = correctAnswerMap[dbQuestion.correct_answer] || 0

  return {
    id: dbQuestion.id,
    question: dbQuestion.question,
    options,
    correctAnswer,
    explanation: dbQuestion.explanation || '暂无解析'
  }
}

// 随机抽题算法：从所有题目中随机抽取5道
function getRandomQuestions(allQuestions: QuizQuestion[]): QuizQuestion[] {
  if (allQuestions.length === 0) return []

  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(5, allQuestions.length))
}

// 每日答题次数管理
interface DailyQuizRecord {
  date: string // 日期（YYYY-MM-DD）
  count: number // 当日答题次数
}

function getTodayDate(): string {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

function getDailyQuizCount(): number {
  const record: DailyQuizRecord = Taro.getStorageSync('dailyQuizRecord') || {date: '', count: 0}
  const today = getTodayDate()

  // 如果日期不是今天，重置次数
  if (record.date !== today) {
    return 0
  }

  return record.count
}

function incrementDailyQuizCount(): void {
  const today = getTodayDate()
  const record: DailyQuizRecord = Taro.getStorageSync('dailyQuizRecord') || {date: '', count: 0}

  // 如果日期不是今天，重置次数
  if (record.date !== today) {
    Taro.setStorageSync('dailyQuizRecord', {date: today, count: 1})
  } else {
    Taro.setStorageSync('dailyQuizRecord', {date: today, count: record.count + 1})
  }
}

export default function Quiz() {
  const [showQuizModal, setShowQuizModal] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [_answeredQuestions, setAnsweredQuestions] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([])
  const [dailyQuizCount, setDailyQuizCount] = useState(0)
  const [allQuestions, setAllQuestions] = useState<QuizQuestion[]>([])

  // 从数据库加载所有题目
  const loadQuestions = useCallback(async () => {
    const dbQuestions = await getAllQuizQuestions()
    const pageQuestions = dbQuestions.map(convertDBQuestionToPageFormat)
    setAllQuestions(pageQuestions)
  }, [])

  // 页面显示时刷新答题次数和题目
  useDidShow(() => {
    const count = getDailyQuizCount()
    setDailyQuizCount(count)
    loadQuestions()
  })

  // 开始答题
  const handleStartQuiz = () => {
    // 检查答题次数
    if (dailyQuizCount >= 3) {
      Taro.showToast({
        title: '今日答题次数已用完，明天再来吧',
        icon: 'none',
        duration: 2000
      })
      return
    }

    // 检查是否有题目
    if (allQuestions.length === 0) {
      Taro.showToast({
        title: '题库为空，请先添加题目',
        icon: 'none',
        duration: 2000
      })
      return
    }

    // 随机抽取5道题
    const randomQuestions = getRandomQuestions(allQuestions)
    setCurrentQuestions(randomQuestions)

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

    const currentQuestion = currentQuestions[currentQuestionIndex]
    const isCorrect = answerIndex === currentQuestion.correctAnswer

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1)
    }

    setAnsweredQuestions((prev) => [...prev, currentQuestion.id])

    // 2秒后自动跳转到下一题或显示结果
    setTimeout(() => {
      if (currentQuestionIndex < currentQuestions.length - 1) {
        // 跳转到下一题
        setCurrentQuestionIndex((prev) => prev + 1)
        setSelectedAnswer(null)
        setShowFeedback(false)
      } else {
        // 显示最终结果
        setShowResult(true)

        // 消耗1次答题机会
        incrementDailyQuizCount()
        setDailyQuizCount((prev) => prev + 1)

        // 保存答题记录到本地缓存
        const finalCorrectCount = isCorrect ? correctCount + 1 : correctCount
        const quizRecord = {
          date: new Date().toISOString(),
          correctCount: finalCorrectCount,
          totalCount: currentQuestions.length
        }
        const records = Taro.getStorageSync('quizRecords') || []
        records.push(quizRecord)
        Taro.setStorageSync('quizRecords', records)

        // 如果答对4题及以上（正确率≥80%），奖励印章
        if (finalCorrectCount >= 4) {
          const badges = Taro.getStorageSync('badges') || []
          // 每次答对都添加一枚印章（每日最多3枚）
          badges.push('徽文化达人')
          Taro.setStorageSync('badges', badges)
          Taro.showToast({
            title: '获得"徽文化达人"印章！',
            icon: 'success',
            duration: 2000
          })
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
    // 检查答题次数
    if (dailyQuizCount >= 3) {
      Taro.showToast({
        title: '今日答题次数已用完，明天再来吧',
        icon: 'none',
        duration: 2000
      })
      handleCloseModal()
      return
    }

    // 检查是否有题目
    if (allQuestions.length === 0) {
      Taro.showToast({
        title: '题库为空，请先添加题目',
        icon: 'none',
        duration: 2000
      })
      handleCloseModal()
      return
    }

    // 随机抽取新的5道题
    const randomQuestions = getRandomQuestions(allQuestions)
    setCurrentQuestions(randomQuestions)

    setShowResult(false)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setCorrectCount(0)
    setAnsweredQuestions([])
  }

  const currentQuestion = currentQuestions[currentQuestionIndex]
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer
  const remainingCount = 3 - dailyQuizCount

  return (
    <View className="min-h-screen bg-background">
      <ScrollView scrollY style={{height: '100vh', background: 'transparent'}}>
        {/* 宣纸纹理背景 */}
        <View className="xuan-paper-bg min-h-screen">
          <View className="relative z-10">
            {/* 顶部导航栏 */}
            <View className="flex items-center px-6 py-4 mb-4">
              <View
                className="w-10 h-10 rounded-full bg-card flex items-center justify-center"
                onClick={() => Taro.navigateBack()}>
                <View className="i-mdi-arrow-left text-2xl text-huimo" />
              </View>
              <Text className="hui-calligraphy-title text-xl flex-1 text-center mr-10">徽派文化小问答</Text>
            </View>

            {/* 主要内容区域 */}
            <View className="px-6">
              {/* 精美介绍卡片 */}
              <View className="bg-card rounded-2xl p-6 mb-6 shadow-lg">
                {/* 装饰性图标 */}
                <View className="flex justify-center mb-4">
                  <Image
                    src="https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_0d21dfd3-7586-4314-a3ad-578b6aac8fff.jpg"
                    mode="aspectFit"
                    className="w-24 h-24"
                  />
                </View>

                {/* 标题 */}
                <Text className="hui-calligraphy-title text-2xl text-center block mb-4 text-huimo">
                  测测你对安徽文化的了解
                </Text>

                {/* 说明文字 */}
                <View className="bg-hui-gray rounded-xl p-4 mb-6">
                  <View className="flex items-start mb-3">
                    <View className="i-mdi-book-open-variant text-xl text-hui-red mr-2 mt-0.5" />
                    <View className="flex-1">
                      <Text className="text-sm text-huimo font-bold block mb-1">题目范围</Text>
                      <Text className="text-xs text-muted-foreground">
                        每次随机抽取5道题，涵盖徽菜美食、徽派建筑、徽州民俗等安徽特色文化
                      </Text>
                    </View>
                  </View>

                  <View className="flex items-start mb-3">
                    <View className="i-mdi-trophy text-xl text-hui-red mr-2 mt-0.5" />
                    <View className="flex-1">
                      <Text className="text-sm text-huimo font-bold block mb-1">奖励机制</Text>
                      <Text className="text-xs text-muted-foreground">
                        答对4题及以上（正确率≥80%）可获得"徽文化达人"印章，每日最多3枚
                      </Text>
                    </View>
                  </View>

                  <View className="flex items-start">
                    <View className="i-mdi-calendar-clock text-xl text-hui-red mr-2 mt-0.5" />
                    <View className="flex-1">
                      <Text className="text-sm text-huimo font-bold block mb-1">答题次数</Text>
                      <Text className="text-xs text-muted-foreground">每人每天最多3次答题机会，每日0点自动重置</Text>
                    </View>
                  </View>
                </View>

                {/* 今日剩余次数提示 */}
                <View className="flex items-center justify-center mb-4">
                  <Text className="text-sm text-muted-foreground">今日剩余次数：</Text>
                  <Text className="text-xl font-bold text-hui-red mx-1">{remainingCount}</Text>
                  <Text className="text-sm text-muted-foreground">/3</Text>
                </View>

                {/* 开始答题按钮 */}
                <Button
                  className={`w-full py-4 rounded-xl break-keep text-base font-bold ${
                    dailyQuizCount >= 3 ? 'bg-muted text-muted-foreground opacity-50' : 'bg-hui-red text-white'
                  }`}
                  size="default"
                  onClick={handleStartQuiz}
                  disabled={dailyQuizCount >= 3}>
                  {dailyQuizCount >= 3 ? '今日次数已用完' : '开始答题'}
                </Button>
              </View>

              {/* 答题统计卡片 */}
              <View className="bg-card rounded-2xl p-6 mb-6">
                <View className="flex items-center justify-between mb-4">
                  <Text className="text-base font-bold text-huimo">答题记录</Text>
                  <View className="i-mdi-chart-line text-xl text-hui-red" />
                </View>

                <View className="grid grid-cols-3 gap-4">
                  <View className="bg-hui-gray rounded-xl p-4 flex flex-col items-center">
                    <Text className="text-2xl font-bold text-hui-red mb-1">
                      {Taro.getStorageSync('quizRecords')?.length || 0}
                    </Text>
                    <Text className="text-xs text-muted-foreground">答题次数</Text>
                  </View>

                  <View className="bg-hui-gray rounded-xl p-4 flex flex-col items-center">
                    <Text className="text-2xl font-bold text-hui-green mb-1">
                      {(() => {
                        const records = Taro.getStorageSync('quizRecords') || []
                        if (records.length === 0) return 0
                        const totalCorrect = records.reduce((sum: number, r: any) => sum + r.correctCount, 0)
                        const totalQuestions = records.length * 5 // 每次答题5道题
                        return Math.round((totalCorrect / totalQuestions) * 100)
                      })()}%
                    </Text>
                    <Text className="text-xs text-muted-foreground">平均正确率</Text>
                  </View>

                  <View className="bg-hui-gray rounded-xl p-4 flex flex-col items-center">
                    <Text className="text-2xl font-bold text-huimo mb-1">
                      {(Taro.getStorageSync('badges') || []).includes('徽文化达人') ? '1' : '0'}
                    </Text>
                    <Text className="text-xs text-muted-foreground">获得印章</Text>
                  </View>
                </View>
              </View>

              {/* 题库说明卡片 */}
              <View className="bg-card rounded-2xl p-6 mb-6">
                <View className="flex items-center justify-between mb-4">
                  <Text className="text-base font-bold text-huimo">题库说明</Text>
                  <View className="i-mdi-database text-xl text-hui-red" />
                </View>

                <View className="space-y-3">
                  <View className="bg-hui-gray rounded-xl p-4 flex items-center">
                    <View className="w-10 h-10 rounded-full bg-hui-red flex items-center justify-center mr-3">
                      <View className="i-mdi-home-city text-xl text-white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-huimo block mb-1">徽派建筑</Text>
                      <Text className="text-xs text-muted-foreground">马头墙、天井、三雕等7道题</Text>
                    </View>
                  </View>

                  <View className="bg-hui-gray rounded-xl p-4 flex items-center">
                    <View className="w-10 h-10 rounded-full bg-hui-red flex items-center justify-center mr-3">
                      <View className="i-mdi-food text-xl text-white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-huimo block mb-1">徽菜美食</Text>
                      <Text className="text-xs text-muted-foreground">臭鳜鱼、毛豆腐、一品锅等7道题</Text>
                    </View>
                  </View>

                  <View className="bg-hui-gray rounded-xl p-4 flex items-center">
                    <View className="w-10 h-10 rounded-full bg-hui-red flex items-center justify-center mr-3">
                      <View className="i-mdi-drama-masks text-xl text-white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-huimo block mb-1">徽州民俗</Text>
                      <Text className="text-xs text-muted-foreground">黄梅戏、晒秋、徽墨等6道题</Text>
                    </View>
                  </View>
                </View>
              </View>
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
                        剩余题目：{currentQuestions.length - currentQuestionIndex - 1}/5
                      </Text>
                    </View>

                    {/* 题目 */}
                    <View className="bg-card rounded-xl p-5 mb-6">
                      <Text className="text-base text-foreground leading-relaxed">{currentQuestion?.question}</Text>
                    </View>

                    {/* 选项 */}
                    <View className="space-y-3">
                      {currentQuestion?.options.map((option, index) => {
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
                          {Math.round((correctCount / currentQuestions.length) * 100)}%
                        </Text>
                        <Text className="text-sm text-muted-foreground">
                          答对 {correctCount} 题，共 {currentQuestions.length} 题
                        </Text>
                      </View>
                    </View>

                    {/* 印章提示 */}
                    {correctCount >= 4 && (
                      <View className="bg-hui-green-light rounded-xl p-4 mb-6 w-full flex items-center">
                        <Image
                          src="https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_c5da1e9c-b39b-4e4c-adfe-a85e3cc2455b.jpg"
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
