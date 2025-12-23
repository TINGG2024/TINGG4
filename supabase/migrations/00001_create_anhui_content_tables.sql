/*
# 创建安徽介绍小程序数据表

## 1. 新建表

### contents表 - 内容表
存储所有展示内容（美食、风景、文化、经济）
- `id` (uuid, 主键)
- `category` (text, 分类: food/scenery/culture/economy)
- `title` (text, 标题)
- `subtitle` (text, 副标题)
- `description` (text, 详细描述)
- `image_url` (text, 图片URL)
- `likes_count` (int, 点赞数, 默认0)
- `favorites_count` (int, 收藏数, 默认0)
- `comments_count` (int, 评论数, 默认0)
- `created_at` (timestamptz, 创建时间)
- `updated_at` (timestamptz, 更新时间)

### likes表 - 点赞记录表
- `id` (uuid, 主键)
- `content_id` (uuid, 关联contents表)
- `user_id` (text, 用户标识UUID字符串)
- `created_at` (timestamptz, 创建时间)
- 唯一约束: (content_id, user_id)

### favorites表 - 收藏记录表
- `id` (uuid, 主键)
- `content_id` (uuid, 关联contents表)
- `user_id` (text, 用户标识UUID字符串)
- `created_at` (timestamptz, 创建时间)
- 唯一约束: (content_id, user_id)

### comments表 - 评论表
- `id` (uuid, 主键)
- `content_id` (uuid, 关联contents表)
- `user_id` (text, 用户标识UUID字符串)
- `nickname` (text, 用户昵称)
- `comment_text` (text, 评论内容)
- `created_at` (timestamptz, 创建时间)

## 2. 安全策略
所有表不启用RLS，允许公开访问和修改，因为：
1. 无登录系统
2. 内容为公开展示
3. 用户互动数据（点赞、收藏、评论）为公开数据

## 3. 初始数据
插入安徽美食、风景、文化、经济的示例内容（图片URL稍后通过image_search获取后更新）
*/

-- 创建内容表
CREATE TABLE IF NOT EXISTS contents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('food', 'scenery', 'culture', 'economy')),
  title text NOT NULL,
  subtitle text,
  description text NOT NULL,
  image_url text,
  likes_count int DEFAULT 0,
  favorites_count int DEFAULT 0,
  comments_count int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_contents_category ON contents(category);
CREATE INDEX idx_contents_created_at ON contents(created_at DESC);

-- 创建点赞表
CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(content_id, user_id)
);

CREATE INDEX idx_likes_content_id ON likes(content_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);

-- 创建收藏表
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(content_id, user_id)
);

CREATE INDEX idx_favorites_content_id ON favorites(content_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);

-- 创建评论表
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  nickname text NOT NULL,
  comment_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_comments_content_id ON comments(content_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- 插入初始内容数据（美食）
INSERT INTO contents (category, title, subtitle, description, image_url) VALUES
('food', '徽州毛豆腐', '舌尖上的中国推荐', '毛豆腐是徽州传统名菜，因豆腐表面长有寸许白色茸毛（白色菌丝）而得名。这种毛是经过发酵霉制而成，使豆腐中的植物蛋白转化成多种氨基酸，味道鲜美。毛豆腐可红烧、清蒸、油炸，其中以油煎最为常见。煎好的毛豆腐外酥里嫩，蘸上辣椒酱食用，别有风味。', 'placeholder'),
('food', '臭鳜鱼', '徽菜代表作', '臭鳜鱼又称臭桂鱼、桶鲜鱼，是徽州传统名菜，也是徽菜的代表之一。制作臭鳜鱼选用新鲜鳜鱼，用淡盐水腌渍在室温25℃左右的环境中，用木桶腌制六七天，使其散发出似臭非臭的特殊气味。然后入油锅略煎，配以猪肉片、笋片，小火红烧而成。成菜后鱼肉酥烂，味道鲜美，闻起来臭，吃起来香。', 'placeholder'),
('food', '黄山烧饼', '徽州特色小吃', '黄山烧饼又名"蟹壳黄烧饼"、"救驾烧饼"，是安徽徽州传统名吃。刚出炉的黄山烧饼色泽金黄，外酥里嫩，油而不腻，回味无穷。其馅料有咸、甜两种，咸的以肉丁、梅干菜为主，甜的则以白糖、芝麻为主。烧饼层层起酥，香气四溢，是徽州人最爱的早点之一。', 'placeholder'),
('food', '绩溪挞馃', '徽州传统糕点', '绩溪挞馃是安徽绩溪县的传统特色小吃，有着悠久的历史。挞馃外形似饺子，但比饺子大，馅料丰富多样，有豆腐馅、萝卜丝馅、南瓜馅等。制作时将馅料包入面皮中，放入平底锅中煎至两面金黄。挞馃外皮酥脆，内馅鲜美，是绩溪人逢年过节必备的美食。', 'placeholder');

-- 插入初始内容数据（风景）
INSERT INTO contents (category, title, subtitle, description, image_url) VALUES
('scenery', '黄山', '天下第一奇山', '黄山位于安徽省南部，是中国著名的风景名胜区，世界文化与自然双重遗产。黄山以"奇松、怪石、云海、温泉、冬雪"五绝著称于世。黄山有72峰，主峰莲花峰海拔1864米。明代旅行家徐霞客登临黄山时赞叹："薄海内外之名山，无如徽之黄山。登黄山，天下无山，观止矣！"后人引申为"五岳归来不看山，黄山归来不看岳"。', 'placeholder'),
('scenery', '宏村', '中国画里的乡村', '宏村位于安徽省黄山市黟县，是徽派古村落的代表。整个村落依山傍水，村中明清古建筑保存完好，被誉为"中国画里的乡村"。宏村最具代表性的建筑是承志堂，被誉为"民间故宫"。村中的月沼和南湖是宏村的标志性景观，清晨时分，白墙黛瓦倒映在水中，如诗如画。2000年，宏村被列入世界文化遗产名录。', 'placeholder'),
('scenery', '九华山', '中国四大佛教名山', '九华山位于安徽省池州市，是中国四大佛教名山之一，地藏菩萨道场。九华山有99座山峰，以天台、莲花、天柱、十王等九峰最为雄伟。山中寺庙众多，香火鼎盛，有"东南第一山"之称。九华山不仅是佛教圣地，也是风景名胜区，山峰秀丽，云雾缭绕，四季景色各异。', 'placeholder'),
('scenery', '天柱山', '古南岳', '天柱山位于安徽省安庆市潜山市，因主峰如"擎天一柱"而得名。天柱山曾被汉武帝封为"南岳"，后改封衡山，但"古南岳"的称号一直流传至今。天柱山以雄、奇、灵、秀著称，有42座山峰，主峰海拔1489.8米。山中奇峰怪石遍布，飞瀑流泉众多，是国家5A级旅游景区。', 'placeholder');

-- 插入初始内容数据（文化）
INSERT INTO contents (category, title, subtitle, description, image_url) VALUES
('culture', '徽文化', '中国三大地域文化之一', '徽文化是中国三大地域文化之一，指古徽州一府六县（歙县、黟县、休宁、祁门、绩溪、婺源）的物质文明和精神文明的总和。徽文化内涵丰富，包括徽商文化、徽派建筑、徽州三雕（木雕、石雕、砖雕）、徽菜、徽剧、徽州版画、徽州篆刻等。徽商曾称雄中国商界300余年，有"无徽不成镇"之说。徽文化对中国文化产生了深远影响。', 'placeholder'),
('culture', '黄梅戏', '中国五大戏曲剧种', '黄梅戏是中国五大戏曲剧种之一，原名黄梅调、采茶戏，起源于湖北黄梅，发展壮大于安徽安庆。黄梅戏唱腔淳朴流畅，以明快抒情见长，具有丰富的表现力。代表作有《天仙配》《女驸马》《牛郎织女》等。黄梅戏表演质朴细腻，真实活泼，深受广大观众喜爱，是安徽最具代表性的文化符号之一。', 'placeholder'),
('culture', '宣纸', '纸中之王', '宣纸产于安徽省宣城市泾县，因古时属宣州府管辖而得名。宣纸始于唐代，距今已有1500多年历史。宣纸选用青檀树皮和沙田稻草为原料，经过108道工序精制而成。宣纸具有"韧而能润、光而不滑、洁白稠密、纹理纯净、搓折无损、润墨性强"等特点，有"纸寿千年"之誉，被誉为"纸中之王"。2009年，宣纸制作技艺被列入人类非物质文化遗产代表作名录。', 'placeholder'),
('culture', '徽墨', '墨中之宝', '徽墨产于安徽省黄山市徽州区、歙县一带，因古属徽州府而得名。徽墨始于南唐，距今已有千余年历史。徽墨以松烟、桐油烟、漆烟为主要原料，加入20多种其他原料，经过点烟、和料、压磨、晾干、描金等11道工序制成。徽墨具有"拈来轻、磨来清、嗅来馨、坚如玉、研无声、一点如漆、万载存真"的特点，是中国文房四宝之一。', 'placeholder');

-- 插入初始内容数据（经济）
INSERT INTO contents (category, title, subtitle, description, image_url) VALUES
('economy', '合肥综合性国家科学中心', '科技创新高地', '合肥综合性国家科学中心是继上海之后国家批准建设的第二个综合性国家科学中心。中心依托中国科学技术大学、中科院合肥物质科学研究院等科研机构，在量子信息、聚变能源、深空探测等领域取得重大突破。合肥已建成全超导托卡马克、同步辐射光源、稳态强磁场等大科学装置，成为中国重要的科技创新策源地。', 'placeholder'),
('economy', '新能源汽车产业', '安徽制造新名片', '安徽是中国重要的新能源汽车生产基地。合肥拥有蔚来汽车、江淮汽车、大众安徽等整车企业，以及众多新能源汽车零部件企业。芜湖的奇瑞汽车也在新能源领域积极布局。安徽新能源汽车产业链完整，从电池、电机、电控到整车制造，形成了完整的产业生态。2023年，安徽新能源汽车产量突破86万辆，成为全国重要的新能源汽车产业集群。', 'placeholder'),
('economy', '集成电路产业', '中国芯安徽造', '安徽正在打造具有国际竞争力的集成电路产业集群。合肥拥有长鑫存储、晶合集成等龙头企业，在存储芯片、显示驱动芯片等领域具有较强竞争力。长鑫存储是中国大陆首家自主研发DRAM芯片的企业，打破了国外垄断。安徽集成电路产业涵盖设计、制造、封装测试等全产业链，是中国集成电路产业的重要一极。', 'placeholder'),
('economy', '人工智能产业', '智能语音领跑者', '安徽在人工智能领域具有独特优势，特别是在智能语音领域处于全国领先地位。科大讯飞是中国智能语音与人工智能产业的领军企业，其语音合成、语音识别技术达到国际先进水平。合肥已形成以科大讯飞为龙头，涵盖智能语音、机器视觉、智能机器人等领域的人工智能产业集群。中国声谷是全国首个定位于人工智能领域的国家级产业基地。', 'placeholder');

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为contents表添加更新时间触发器
CREATE TRIGGER update_contents_updated_at
  BEFORE UPDATE ON contents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();