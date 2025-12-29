import {Button, Image, ScrollView, Text, View} from '@tarojs/components'
import Taro, {useDidShow, useShareAppMessage, useShareTimeline} from '@tarojs/taro'
import {useState} from 'react'

// 题库配置
interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number // 正确答案的索引（0-based）
  explanation: string
  category: 'architecture' | 'food' | 'culture' // 题目分类
}

// 20道徽派文化题库
const QUIZ_QUESTIONS: QuizQuestion[] = [
  // 建筑类题目（7道）
  {
    id: 1,
    question: '马头墙最初的主要作用是？',
    options: ['A. 美观', 'B. 防火', 'C. 防盗'],
    correctAnswer: 1,
    explanation: '马头墙又称防火墙，是徽派建筑的防火设计，可以有效阻止火势蔓延。',
    category: 'architecture'
  },
  {
    id: 2,
    question: '徽州三雕指的是哪三种雕刻工艺？',
    options: ['A. 木雕、石雕、砖雕', 'B. 木雕、玉雕、竹雕', 'C. 石雕、铜雕、泥雕'],
    correctAnswer: 0,
    explanation: '徽州三雕是指木雕、石雕、砖雕，是徽派建筑装饰的重要组成部分，工艺精湛。',
    category: 'architecture'
  },
  {
    id: 3,
    question: '徽派建筑的典型特征"三间两厢"中的"厢"指的是？',
    options: ['A. 厢房', 'B. 走廊', 'C. 天井'],
    correctAnswer: 0,
    explanation: '徽派建筑"三间两厢"指正房三间，两侧各有一间厢房，形成对称布局。',
    category: 'architecture'
  },
  {
    id: 4,
    question: '徽派建筑中的"天井"主要作用是？',
    options: ['A. 采光通风', 'B. 种植花草', 'C. 储存雨水'],
    correctAnswer: 0,
    explanation: '天井是徽派建筑的核心空间，主要用于采光、通风和排水，体现"四水归堂"的理念。',
    category: 'architecture'
  },
  {
    id: 5,
    question: '宏村被誉为"中国画里的乡村"，其水系设计灵感来源于？',
    options: ['A. 牛形', 'B. 龙形', 'C. 凤形'],
    correctAnswer: 0,
    explanation: '宏村水系按照牛的形态设计，月沼为牛胃，南湖为牛肚，水圳为牛肠，体现了徽州人的智慧。',
    category: 'architecture'
  },
  {
    id: 6,
    question: '徽派建筑的门楼上常见的"八字门"寓意是？',
    options: ['A. 招财进宝', 'B. 开门迎客', 'C. 福寿双全'],
    correctAnswer: 1,
    explanation: '八字门向外敞开，寓意开门迎客、广纳四方来客，体现徽商的开放胸怀。',
    category: 'architecture'
  },
  {
    id: 7,
    question: '西递村的标志性建筑"胡文光刺史牌坊"建于哪个朝代？',
    options: ['A. 明朝', 'B. 清朝', 'C. 宋朝'],
    correctAnswer: 0,
    explanation: '胡文光刺史牌坊建于明朝万历年间，是徽州石雕艺术的代表作。',
    category: 'architecture'
  },

  // 美食类题目（7道）
  {
    id: 8,
    question: '臭鳜鱼的传统腌制时间约为？',
    options: ['A. 1天', 'B. 7天', 'C. 15天'],
    correctAnswer: 1,
    explanation: '臭鳜鱼需要腌制约7天，让鱼肉发酵产生独特的臭味，这是徽菜的经典做法。',
    category: 'food'
  },
  {
    id: 9,
    question: '徽菜"毛豆腐"的制作关键是？',
    options: ['A. 发酵长毛', 'B. 油炸金黄', 'C. 蒸煮软烂'],
    correctAnswer: 0,
    explanation: '毛豆腐的制作关键是让豆腐表面长出白色绒毛（霉菌），再经过煎炸，形成独特风味。',
    category: 'food'
  },
  {
    id: 10,
    question: '徽菜"一品锅"的名称来源于？',
    options: ['A. 官职品级', 'B. 食材品质', 'C. 烹饪工艺'],
    correctAnswer: 0,
    explanation: '一品锅因其分层摆放食材，寓意官居一品而得名，是徽州传统宴席名菜。',
    category: 'food'
  },
  {
    id: 11,
    question: '徽州传统糕点"黄山烧饼"的特点是？',
    options: ['A. 外酥里嫩', 'B. 香甜软糯', 'C. 酥脆爽口'],
    correctAnswer: 0,
    explanation: '黄山烧饼外皮酥脆，内馅鲜美，是徽州传统小吃的代表。',
    category: 'food'
  },
  {
    id: 12,
    question: '徽菜"刀板香"的主要食材是？',
    options: ['A. 腊肉', 'B. 咸鱼', 'C. 豆腐干'],
    correctAnswer: 0,
    explanation: '刀板香是用腊肉在木板上烤制而成，肉香四溢，是徽州传统美食。',
    category: 'food'
  },
  {
    id: 13,
    question: '徽州传统饮品"黄山毛峰"属于哪类茶？',
    options: ['A. 绿茶', 'B. 红茶', 'C. 乌龙茶'],
    correctAnswer: 0,
    explanation: '黄山毛峰是中国十大名茶之一，属于绿茶类，以其鲜爽回甘著称。',
    category: 'food'
  },
  {
    id: 14,
    question: '徽菜"问政山笋"的名称来源于？',
    options: ['A. 产地山名', 'B. 烹饪方法', 'C. 历史典故'],
    correctAnswer: 0,
    explanation: '问政山笋产自黄山问政山，笋质鲜嫩，是徽菜中的珍品。',
    category: 'food'
  },

  // 民俗文化类题目（6道）
  {
    id: 15,
    question: '黄梅戏的发源地是安徽哪个城市？',
    options: ['A. 安庆', 'B. 黄山', 'C. 合肥'],
    correctAnswer: 0,
    explanation: '黄梅戏发源于安庆市，是中国五大戏曲剧种之一，被誉为"中国的乡村音乐剧"。',
    category: 'culture'
  },
  {
    id: 16,
    question: '徽州传统节日"晒秋"通常在哪个季节举行？',
    options: ['A. 春季', 'B. 夏季', 'C. 秋季'],
    correctAnswer: 2,
    explanation: '晒秋是徽州传统民俗，每年秋季村民将收获的农作物晾晒在屋顶、晒场，形成独特景观。',
    category: 'culture'
  },
  {
    id: 17,
    question: '徽州传统婚俗中，新娘出嫁时要跨过什么？',
    options: ['A. 火盆', 'B. 门槛', 'C. 红毯'],
    correctAnswer: 0,
    explanation: '徽州传统婚俗中，新娘出嫁时要跨火盆，寓意驱邪避灾、红红火火。',
    category: 'culture'
  },
  {
    id: 18,
    question: '徽州传统戏曲"徽剧"是哪个剧种的前身？',
    options: ['A. 京剧', 'B. 越剧', 'C. 黄梅戏'],
    correctAnswer: 0,
    explanation: '徽剧是京剧的重要源流之一，徽班进京后与其他剧种融合，逐渐形成京剧。',
    category: 'culture'
  },
  {
    id: 19,
    question: '徽州传统手工艺"徽墨"的主要原料是？',
    options: ['A. 松烟', 'B. 煤炭', 'C. 木炭'],
    correctAnswer: 0,
    explanation: '徽墨以松烟为主要原料，配以动物胶等材料制成，是中国四大名墨之首。',
    category: 'culture'
  },
  {
    id: 20,
    question: '徽州传统民居中的"商"字门寓意是？',
    options: ['A. 经商致富', 'B. 高尚品德', 'C. 商议大事'],
    correctAnswer: 0,
    explanation: '徽州民居中的"商"字门体现了徽商文化，寓意经商致富、生意兴隆。',
    category: 'culture'
  }
]

// 随机抽题算法：确保建筑、美食、民俗各至少1道
function getRandomQuestions(): QuizQuestion[] {
  const architectureQuestions = QUIZ_QUESTIONS.filter((q) => q.category === 'architecture')
  const foodQuestions = QUIZ_QUESTIONS.filter((q) => q.category === 'food')
  const cultureQuestions = QUIZ_QUESTIONS.filter((q) => q.category === 'culture')

  // 从每个分类中随机抽取至少1道
  const selectedQuestions: QuizQuestion[] = []

  // 随机抽取1道建筑题
  const randomArchitecture = architectureQuestions[Math.floor(Math.random() * architectureQuestions.length)]
  selectedQuestions.push(randomArchitecture)

  // 随机抽取1道美食题
  const randomFood = foodQuestions[Math.floor(Math.random() * foodQuestions.length)]
  selectedQuestions.push(randomFood)

  // 随机抽取1道民俗题
  const randomCulture = cultureQuestions[Math.floor(Math.random() * cultureQuestions.length)]
  selectedQuestions.push(randomCulture)

  // 从剩余题目中随机抽取2道
  const remainingQuestions = QUIZ_QUESTIONS.filter((q) => !selectedQuestions.find((sq) => sq.id === q.id))

  for (let i = 0; i < 2; i++) {
    if (remainingQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingQuestions.length)
      selectedQuestions.push(remainingQuestions[randomIndex])
      remainingQuestions.splice(randomIndex, 1)
    }
  }

  // 打乱顺序
  return selectedQuestions.sort(() => Math.random() - 0.5)
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

  // 页面显示时刷新答题次数
  useDidShow(() => {
    const count = getDailyQuizCount()
    setDailyQuizCount(count)
  })

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
    // 检查答题次数
    if (dailyQuizCount >= 3) {
      Taro.showToast({
        title: '今日答题次数已用完，明天再来吧',
        icon: 'none',
        duration: 2000
      })
      return
    }

    // 随机抽取5道题
    const randomQuestions = getRandomQuestions()
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

    // 随机抽取新的5道题
    const randomQuestions = getRandomQuestions()
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
                        const totalQuestions = records.length * QUIZ_QUESTIONS.length
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
