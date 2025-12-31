/*
# 创建题库表

## 1. 新建表
- `quiz_questions`
  - `id` (bigserial, primary key) - 题目ID
  - `question` (text, not null) - 题干
  - `option_a` (text, not null) - 选项A
  - `option_b` (text, not null) - 选项B
  - `option_c` (text, not null) - 选项C
  - `correct_answer` (text, not null) - 正确答案（A/B/C）
  - `explanation` (text) - 解析
  - `created_at` (timestamptz, default: now()) - 创建时间
  - `updated_at` (timestamptz, default: now()) - 更新时间

## 2. 安全策略
- 不启用RLS，允许所有用户读写（满足"全员可修改"需求）

## 3. 初始数据
- 插入现有问答页面的题目数据
*/

-- 创建题库表
CREATE TABLE IF NOT EXISTS quiz_questions (
  id bigserial PRIMARY KEY,
  question text NOT NULL,
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text NOT NULL,
  correct_answer text NOT NULL CHECK (correct_answer IN ('A', 'B', 'C')),
  explanation text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 插入初始题目数据（从问答页面迁移）
INSERT INTO quiz_questions (question, option_a, option_b, option_c, correct_answer, explanation) VALUES
('黄山位于安徽哪个市？', '黄山市', '合肥市', '芜湖市', 'A', '黄山位于安徽省黄山市，是世界文化与自然双重遗产。'),
('徽州三雕指的是哪三雕？', '木雕、石雕、砖雕', '木雕、玉雕、铜雕', '石雕、泥雕、砖雕', 'A', '徽州三雕是指木雕、石雕、砖雕，是徽派建筑的重要装饰艺术。'),
('安徽的省会是哪个城市？', '合肥', '芜湖', '蚌埠', 'A', '安徽省会是合肥市，是全省政治、经济、文化中心。'),
('徽菜是中国八大菜系之一吗？', '是', '不是', '曾经是', 'A', '徽菜是中国八大菜系之一，以烹制山珍野味而闻名。'),
('安徽简称是什么？', '皖', '徽', '安', 'A', '安徽简称"皖"，因境内有皖山、皖河而得名。'),
('黄山四绝是指什么？', '奇松、怪石、云海、温泉', '奇松、怪石、云海、日出', '奇松、怪石、瀑布、温泉', 'A', '黄山四绝是指奇松、怪石、云海、温泉，是黄山最著名的四大景观。'),
('宏村位于安徽哪个市？', '黄山市', '宣城市', '池州市', 'A', '宏村位于黄山市黟县，是世界文化遗产，被誉为"中国画里的乡村"。'),
('安徽最大的淡水湖是？', '巢湖', '太平湖', '龙子湖', 'A', '巢湖是安徽省最大的淡水湖，也是中国五大淡水湖之一。'),
('徽墨产地在哪里？', '黄山市', '宣城市', '安庆市', 'A', '徽墨主要产于黄山市（古徽州），是中国四大名墨之一。'),
('安徽有几个地级市？', '16个', '15个', '17个', 'A', '安徽省共有16个地级市，包括合肥、芜湖、蚌埠等。'),
('九华山是中国四大佛教名山之一吗？', '是', '不是', '曾经是', 'A', '九华山是中国四大佛教名山之一，是地藏菩萨道场。'),
('天柱山位于安徽哪个市？', '安庆市', '池州市', '黄山市', 'A', '天柱山位于安庆市潜山市，是古南岳，道教名山。'),
('徽州古城位于哪里？', '歙县', '黟县', '休宁县', 'A', '徽州古城位于黄山市歙县，是徽州文化的发源地之一。'),
('安徽的母亲河是？', '淮河', '长江', '新安江', 'A', '淮河被称为安徽的母亲河，流经安徽北部地区。'),
('臭鳜鱼是哪里的名菜？', '徽州', '淮南', '芜湖', 'A', '臭鳜鱼是徽州名菜，是徽菜的代表菜品之一。'),
('安徽的地理位置属于？', '华东地区', '华中地区', '华北地区', 'A', '安徽省位于中国华东地区，长江三角洲腹地。'),
('黄梅戏发源于哪里？', '安庆', '合肥', '芜湖', 'A', '黄梅戏发源于安庆市，是中国五大戏曲剧种之一。'),
('宣纸产地在哪里？', '宣城市', '黄山市', '池州市', 'A', '宣纸主要产于宣城市泾县，是中国四大名纸之首。'),
('安徽的地形特点是？', '平原、丘陵、山地兼有', '以平原为主', '以山地为主', 'A', '安徽地形多样，平原、丘陵、山地兼有，地势南高北低。'),
('徽商是中国历史上的三大商帮之一吗？', '是', '不是', '曾经是', 'A', '徽商是中国历史上的三大商帮之一，与晋商、浙商齐名。');

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_quiz_questions_updated_at
  BEFORE UPDATE ON quiz_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();