/*
# 删除经济发展分类

## 变更说明
删除 contents 表中所有 category 为 'economy' 的内容，并更新表约束移除 economy 分类。

## 变更内容
1. 删除所有经济发展相关内容
2. 更新 category 字段的 CHECK 约束，移除 'economy' 选项

## 注意事项
- 此操作不可逆，删除的数据无法恢复
- 确保应用代码中已移除对 economy 分类的引用
*/

-- 删除所有经济发展分类的内容
DELETE FROM contents WHERE category = 'economy';

-- 删除旧的 CHECK 约束
ALTER TABLE contents DROP CONSTRAINT IF EXISTS contents_category_check;

-- 添加新的 CHECK 约束（不包含 economy）
ALTER TABLE contents ADD CONSTRAINT contents_category_check 
  CHECK (category IN ('food', 'scenery', 'culture'));
