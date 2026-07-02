---
title: "2026世界杯实时数据"
date: 2026-06-25T12:00:00+08:00
draft: false
author: AnfinsenYu
categories: ["足球", "世界杯"]
tags: ["世界杯", "积分榜", "射手榜", "助攻榜", "赛程"]
description: "2026美加墨世界杯实时积分榜、完整赛程、射手榜、助攻榜，数据实时更新"
showToc: false
---

> 📊 **数据更新至**：2026年7月2日 | 🏆 **赛事阶段**：1/16决赛进行中（9场已结束，3场待赛）
>
> 📱 **数据来源**：[小红书世界杯专题](https://www.xiaohongshu.com/worldcup26/fixtures) | [直播吧数据频道](https://data.zhibo8.cc/pc_main_data/)

---

<style>
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-hover: #f0f0f0;
  --text-primary: #333333;
  --text-secondary: #666666;
  --border-color: #e8e8e8;
  --shadow-color: rgba(0,0,0,0.06);
  --accent-from: #7c8cf8;
  --accent-to: #9b7eda;
  --accent-shadow: rgba(124, 140, 248, 0.25);
}
:root[data-theme="dark"] {
  --bg-primary: #1e1e2e;
  --bg-secondary: #2a2a3a;
  --bg-hover: #333344;
  --text-primary: #e0e0e0;
  --text-secondary: #aaaaaa;
  --border-color: #444466;
  --shadow-color: rgba(0,0,0,0.3);
  --accent-from: #667eea;
  --accent-to: #764ba2;
  --accent-shadow: rgba(102, 126, 234, 0.4);
}
.tab-container {
  margin: 20px 0;
}
.tab-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  position: sticky;
  top: 0;
  background: var(--bg-primary);
  padding: 10px 0;
  z-index: 100;
  border-bottom: 1px solid var(--border-color);
}
.tab-btn {
  padding: 10px 16px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s ease;
  background: var(--bg-secondary);
  color: var(--text-primary);
  white-space: nowrap;
}
.tab-btn.active {
  background: linear-gradient(135deg, var(--accent-from) 0%, var(--accent-to) 100%);
  color: white;
  box-shadow: 0 4px 15px var(--accent-shadow);
}
.tab-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.tab-content {
  display: none;
  animation: fadeIn 0.3s ease;
}
.tab-content.active {
  display: block;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 15px 0;
  border-radius: 10px;
  box-shadow: 0 2px 10px var(--shadow-color);
  background: var(--bg-primary);
}
table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-primary);
  min-width: 500px;
}
th {
  background: linear-gradient(135deg, var(--accent-from) 0%, var(--accent-to) 100%);
  color: white;
  padding: 12px 8px;
  text-align: center;
  font-weight: bold;
}
td {
  padding: 10px 8px;
  text-align: center;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
}
tr:hover {
  background: var(--bg-hover);
}
.status-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}
.status-live {
  background: #ff4444;
  color: white;
  animation: pulse 1.5s infinite;
}
.status-done {
  background: #4CAF50;
  color: white;
}
.status-upcoming {
  background: #ff9800;
  color: white;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
.group-title {
  background: linear-gradient(135deg, var(--accent-from) 0%, var(--accent-to) 100%);
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  margin: 20px 0 10px 0;
  font-weight: bold;
}
/* 移动端适配 */
@media (max-width: 768px) {
  .tab-buttons {
    position: relative;
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 10px;
    -webkit-overflow-scrolling: touch;
  }
  .tab-btn {
    padding: 8px 14px;
    font-size: 13px;
    min-width: fit-content;
  }
  .table-wrapper {
    margin: 10px -15px;
    border-radius: 0;
  }
  table {
    min-width: 450px;
  }
  th, td {
    padding: 8px 6px;
    font-size: 13px;
  }
  .group-title {
    font-size: 14px;
    padding: 8px 12px;
    margin: 15px 0 8px 0;
  }
}
</style>

<div class="tab-container">
  <div class="tab-buttons">
    <button class="tab-btn active" onclick="showTab('standings')">📊 积分榜</button>
    <button class="tab-btn" onclick="showTab('schedule')">📅 赛程</button>
    <button class="tab-btn" onclick="showTab('scorers')">⚽ 射手榜</button>
    <button class="tab-btn" onclick="showTab('assists')">🎯 助攻榜</button>
    <button class="tab-btn" onclick="showTab('teams')">🏆 32强名单</button>
  </div>

<!-- 积分榜 -->
<div id="standings" class="tab-content active">
<div class="group-title">A组（已结束）</div>
<div class="table-wrapper">
<table>
<tr><th>排名</th><th>球队</th><th>场次</th><th>胜</th><th>平</th><th>负</th><th>净胜球</th><th>积分</th></tr>
<tr><td>1</td><td>🇲🇽 墨西哥</td><td>3</td><td>3</td><td>0</td><td>0</td><td>+9</td><td><b>9</b> ✅</td></tr>
<tr><td>2</td><td>🇿🇦 南非</td><td>3</td><td>2</td><td>0</td><td>1</td><td>+1</td><td><b>6</b> ✅</td></tr>
<tr><td>3</td><td>🇰🇷 韩国</td><td>3</td><td>1</td><td>0</td><td>2</td><td>-1</td><td><b>3</b> ⏳</td></tr>
<tr><td>4</td><td>🇨🇿 捷克</td><td>3</td><td>0</td><td>1</td><td>2</td><td>-5</td><td><b>1</b> ❌</td></tr>
</table>
</div>
<div class="group-title">B组（已结束）</div>
<div class="table-wrapper">
<table>
<tr><th>排名</th><th>球队</th><th>场次</th><th>胜</th><th>平</th><th>负</th><th>净胜球</th><th>积分</th></tr>
<tr><td>1</td><td>🇨🇭 瑞士</td><td>3</td><td>2</td><td>0</td><td>1</td><td>+1</td><td><b>6</b> ✅</td></tr>
<tr><td>2</td><td>🇨🇦 加拿大</td><td>3</td><td>2</td><td>0</td><td>1</td><td>+1</td><td><b>6</b> ✅</td></tr>
<tr><td>3</td><td>🇧🇦 波黑</td><td>3</td><td>1</td><td>1</td><td>1</td><td>0</td><td><b>4</b> ⏳</td></tr>
<tr><td>4</td><td>🇶🇦 卡塔尔</td><td>3</td><td>0</td><td>0</td><td>3</td><td>-3</td><td><b>0</b> ❌</td></tr>
</table>
</div>
<div class="group-title">C组（已结束）</div>
<div class="table-wrapper">
<table>
<tr><th>排名</th><th>球队</th><th>场次</th><th>胜</th><th>平</th><th>负</th><th>净胜球</th><th>积分</th></tr>
<tr><td>1</td><td>🇧🇷 巴西</td><td>3</td><td>2</td><td>1</td><td>0</td><td>+6</td><td><b>7</b> ✅</td></tr>
<tr><td>2</td><td>🇲🇦 摩洛哥</td><td>3</td><td>2</td><td>1</td><td>0</td><td>+4</td><td><b>7</b> ✅</td></tr>
<tr><td>3</td><td>🏴󠁧󠁢󠁳󠁣󠁴󠁿 苏格兰</td><td>3</td><td>1</td><td>0</td><td>2</td><td>-3</td><td><b>3</b> ⏳</td></tr>
<tr><td>4</td><td>🇭🇹 海地</td><td>3</td><td>0</td><td>0</td><td>3</td><td>-6</td><td><b>0</b> ❌</td></tr>
</table>
</div>
<div class="group-title">D组（已结束）</div>
<div class="table-wrapper">
<table>
<tr><th>排名</th><th>球队</th><th>场次</th><th>胜</th><th>平</th><th>负</th><th>净胜球</th><th>积分</th></tr>
<tr><td>1</td><td>🇺🇸 美国</td><td>3</td><td>2</td><td>0</td><td>1</td><td>+3</td><td><b>6</b> ✅</td></tr>
<tr><td>2</td><td>🇦🇺 澳大利亚</td><td>3</td><td>1</td><td>2</td><td>0</td><td>+1</td><td><b>5</b> ✅</td></tr>
<tr><td>3</td><td>🇵🇾 巴拉圭</td><td>3</td><td>1</td><td>1</td><td>1</td><td>-1</td><td><b>4</b> ⏳</td></tr>
<tr><td>4</td><td>🇹🇷 土耳其</td><td>3</td><td>1</td><td>0</td><td>2</td><td>-3</td><td><b>3</b> ❌</td></tr>
</table>
</div>
<div class="group-title">E组（已结束）</div>
<div class="table-wrapper">
<table>
<tr><th>排名</th><th>球队</th><th>场次</th><th>胜</th><th>平</th><th>负</th><th>净胜球</th><th>积分</th></tr>
<tr><td>1</td><td>🇩🇪 德国</td><td>3</td><td>2</td><td>0</td><td>1</td><td>+6</td><td><b>6</b> ✅</td></tr>
<tr><td>2</td><td>🇨🇮 科特迪瓦</td><td>3</td><td>2</td><td>0</td><td>1</td><td>+2</td><td><b>6</b> ✅</td></tr>
<tr><td>3</td><td>🇪🇨 厄瓜多尔</td><td>3</td><td>1</td><td>1</td><td>1</td><td>0</td><td><b>4</b> ✅</td></tr>
<tr><td>4</td><td>🇨🇼 库拉索</td><td>3</td><td>0</td><td>1</td><td>2</td><td>-8</td><td><b>1</b> ❌</td></tr>
</table>
</div>
<div class="group-title">F组（已结束）</div>
<div class="table-wrapper">
<table>
<tr><th>排名</th><th>球队</th><th>场次</th><th>胜</th><th>平</th><th>负</th><th>净胜球</th><th>积分</th></tr>
<tr><td>1</td><td>🇳🇱 荷兰</td><td>3</td><td>3</td><td>0</td><td>0</td><td>+7</td><td><b>9</b> ✅</td></tr>
<tr><td>2</td><td>🇯🇵 日本</td><td>3</td><td>1</td><td>2</td><td>0</td><td>+4</td><td><b>5</b> ✅</td></tr>
<tr><td>3</td><td>🇸🇪 瑞典</td><td>3</td><td>1</td><td>1</td><td>1</td><td>0</td><td><b>4</b> ✅</td></tr>
<tr><td>4</td><td>🇹🇳 突尼斯</td><td>3</td><td>0</td><td>0</td><td>3</td><td>-11</td><td><b>0</b> ❌</td></tr>
</table>
</div>
<div class="group-title">G组（已结束）</div>
<div class="table-wrapper">
<table>
<tr><th>排名</th><th>球队</th><th>场次</th><th>胜</th><th>平</th><th>负</th><th>净胜球</th><th>积分</th></tr>
<tr><td>1</td><td>🇧🇪 比利时</td><td>3</td><td>1</td><td>2</td><td>0</td><td>+4</td><td><b>5</b> ✅</td></tr>
<tr><td>2</td><td>🇪🇬 埃及</td><td>3</td><td>1</td><td>1</td><td>1</td><td>+1</td><td><b>4</b> ✅</td></tr>
<tr><td>3</td><td>🇮🇷 伊朗</td><td>3</td><td>0</td><td>2</td><td>1</td><td>0</td><td><b>2</b> ⏳</td></tr>
<tr><td>4</td><td>🇳🇿 新西兰</td><td>3</td><td>0</td><td>1</td><td>2</td><td>-5</td><td><b>1</b> ❌</td></tr>
</table>
</div>
<div class="group-title">H组（已结束）</div>
<div class="table-wrapper">
<table>
<tr><th>排名</th><th>球队</th><th>场次</th><th>胜</th><th>平</th><th>负</th><th>净胜球</th><th>积分</th></tr>
<tr><td>1</td><td>🇪🇸 西班牙</td><td>3</td><td>2</td><td>1</td><td>0</td><td>+5</td><td><b>7</b> ✅</td></tr>
<tr><td>2</td><td>🇨🇻 佛得角</td><td>3</td><td>0</td><td>3</td><td>0</td><td>0</td><td><b>3</b> ✅</td></tr>
<tr><td>3</td><td>🇺🇾 乌拉圭</td><td>3</td><td>0</td><td>2</td><td>1</td><td>0</td><td><b>2</b> ❌</td></tr>
<tr><td>4</td><td>🇸🇦 沙特</td><td>3</td><td>0</td><td>1</td><td>2</td><td>-5</td><td><b>1</b> ❌</td></tr>
</table>
</div>
<div class="group-title">I组（已结束）</div>
<div class="table-wrapper">
<table>
<tr><th>排名</th><th>球队</th><th>场次</th><th>胜</th><th>平</th><th>负</th><th>净胜球</th><th>积分</th></tr>
<tr><td>1</td><td>🇫🇷 法国</td><td>3</td><td>3</td><td>0</td><td>0</td><td>+9</td><td><b>9</b> ✅</td></tr>
<tr><td>2</td><td>🇳🇴 挪威</td><td>3</td><td>2</td><td>0</td><td>1</td><td>+5</td><td><b>6</b> ✅</td></tr>
<tr><td>3</td><td>🇸🇳 塞内加尔</td><td>3</td><td>1</td><td>0</td><td>2</td><td>-3</td><td><b>3</b> ✅</td></tr>
<tr><td>4</td><td>🇮🇶 伊拉克</td><td>3</td><td>0</td><td>0</td><td>3</td><td>-11</td><td><b>0</b> ❌</td></tr>
</table>
</div>
<div class="group-title">J组（已结束）</div>
<div class="table-wrapper">
<table>
<tr><th>排名</th><th>球队</th><th>场次</th><th>胜</th><th>平</th><th>负</th><th>净胜球</th><th>积分</th></tr>
<tr><td>1</td><td>🇦🇷 阿根廷</td><td>3</td><td>3</td><td>0</td><td>0</td><td>+8</td><td><b>9</b> ✅</td></tr>
<tr><td>2</td><td>🇦🇹 奥地利</td><td>3</td><td>1</td><td>1</td><td>1</td><td>+1</td><td><b>4</b> ✅</td></tr>
<tr><td>3</td><td>🇩🇿 阿尔及利亚</td><td>3</td><td>1</td><td>1</td><td>1</td><td>-1</td><td><b>4</b> ✅</td></tr>
<tr><td>4</td><td>🇯🇴 约旦</td><td>3</td><td>0</td><td>0</td><td>3</td><td>-8</td><td><b>0</b> ❌</td></tr>
</table>
</div>
<div class="group-title">K组（已结束）</div>
<div class="table-wrapper">
<table>
<tr><th>排名</th><th>球队</th><th>场次</th><th>胜</th><th>平</th><th>负</th><th>净胜球</th><th>积分</th></tr>
<tr><td>1</td><td>🇨🇴 哥伦比亚</td><td>3</td><td>3</td><td>0</td><td>0</td><td>+4</td><td><b>9</b> ✅</td></tr>
<tr><td>2</td><td>🇵🇹 葡萄牙</td><td>3</td><td>2</td><td>1</td><td>0</td><td>+8</td><td><b>7</b> ✅</td></tr>
<tr><td>3</td><td>🇨🇩 刚果民主</td><td>3</td><td>0</td><td>2</td><td>1</td><td>-1</td><td><b>2</b> ⏳</td></tr>
<tr><td>4</td><td>🇺🇿 乌兹别克斯坦</td><td>3</td><td>0</td><td>1</td><td>2</td><td>-7</td><td><b>1</b> ❌</td></tr>
</table>
</div>
<div class="group-title">L组（已结束）</div>
<div class="table-wrapper">
<table>
<tr><th>排名</th><th>球队</th><th>场次</th><th>胜</th><th>平</th><th>负</th><th>净胜球</th><th>积分</th></tr>
<tr><td>1</td><td>🏴󠁧󠁢󠁥󠁮󠁧󠁿 英格兰</td><td>3</td><td>2</td><td>1</td><td>0</td><td>+3</td><td><b>7</b> ✅</td></tr>
<tr><td>2</td><td>🇬🇭 加纳</td><td>3</td><td>1</td><td>2</td><td>0</td><td>+1</td><td><b>5</b> ✅</td></tr>
<tr><td>3</td><td>🇭🇷 克罗地亚</td><td>3</td><td>1</td><td>0</td><td>2</td><td>-2</td><td><b>3</b> ⏳</td></tr>
<tr><td>4</td><td>🇵🇦 巴拿马</td><td>3</td><td>0</td><td>0</td><td>3</td><td>-3</td><td><b>0</b> ❌</td></tr>
</table>
</div>
</div>

<!-- 赛程 -->
<div id="schedule" class="tab-content">
<div class="group-title">🏆 淘汰赛赛程</div>
<div class="table-wrapper">
<table>
<tr><th>日期</th><th>时间</th><th>比赛</th><th>轮次</th><th>状态</th></tr>
<tr><td>6/30</td><td>01:00</td><td>🇧🇷 巴西 vs 🇯🇵 日本</td><td>1/16</td><td><span class="status-badge status-done">2-1</span></td></tr>
<tr><td>6/30</td><td>04:30</td><td>🇩🇪 德国 vs 🇵🇾 巴拉圭</td><td>1/16</td><td><span class="status-badge status-done">点球4-5</span></td></tr>
<tr><td>6/30</td><td>09:00</td><td>🇳🇱 荷兰 vs 🇲🇦 摩洛哥</td><td>1/16</td><td><span class="status-badge status-done">点球3-4</span></td></tr>
<tr><td>7/1</td><td>01:00</td><td>🇨🇮 科特迪瓦 vs 🇳🇴 挪威</td><td>1/16</td><td><span class="status-badge status-done">1-2</span></td></tr>
<tr><td>7/1</td><td>05:00</td><td>🇫🇷 法国 vs 🇸🇪 瑞典</td><td>1/16</td><td><span class="status-badge status-done">3-0</span></td></tr>
<tr><td>7/1</td><td>10:00</td><td>🇲🇽 墨西哥 vs 🇪🇨 厄瓜多尔</td><td>1/16</td><td><span class="status-badge status-done">2-0</span></td></tr>
<tr><td>7/2</td><td>00:00</td><td>🏴󠁧󠁢󠁥󠁮󠁧󠁿 英格兰 vs 🇨🇩 民主刚果</td><td>1/16</td><td><span class="status-badge status-done">2-1</span></td></tr>
<tr><td>7/2</td><td>04:00</td><td>🇧🇪 比利时 vs 🇸🇳 塞内加尔</td><td>1/16</td><td><span class="status-badge status-done">3-2(加时)</span></td></tr>
<tr><td>7/2</td><td>08:00</td><td>🇺🇸 美国 vs 🇧🇦 波黑</td><td>1/16</td><td><span class="status-badge status-done">2-0</span></td></tr>
</table>
</div>

<div class="group-title">🌳 ## 🌳 淘汰赛晋级树状图

### 1/16决赛

| 日期时间 | 对阵 | 比分 | 备注 |
|---------|------|------|------|
| 6/30 01:00 | 🇧🇷 巴西 vs 🇯🇵 日本 | 2-1 | |
| 6/30 04:30 | 🇩🇪 德国 vs 🇵🇾 巴拉圭 | 4(5)-(4)5 | 点球 |
| 6/30 09:00 | 🇳🇱 荷兰 vs 🇲🇦 摩洛哥 | 3(4)-(3)4 | 点球 |
| 7/1 01:00 | 🇨🇮 科特迪瓦 vs 🇳🇴 挪威 | 1-2 | |
| 7/1 05:00 | 🇫🇷 法国 vs 🇸🇪 瑞典 | 3-0 | |
| 7/1 10:00 | 🇲🇽 墨西哥 vs 🇪🇨 厄瓜多尔 | 2-0 | |
| 7/2 00:00 | 🏴󠁧󠁢󠁥󠁮󠁧󠁿 英格兰 vs 🇨🇩 民主刚果 | 2-1 | |
| 7/2 04:00 | 🇧🇪 比利时 vs 🇸🇳 塞内加尔 | 3-2 | 加时 |
| 7/2 08:00 | 🇺🇸 美国 vs 🇧🇦 波黑 | - | 待赛 |
| 7/3 03:00 | 🇪🇸 西班牙 vs 🇦🇹 奥地利 | - | 待赛 |
| 7/3 07:00 | 🇵🇹 葡萄牙 vs 🇭🇷 克罗地亚 | - | 待赛 |
| 7/3 11:00 | 🇨🇭 瑞士 vs 🇩🇿 阿尔及利亚 | - | 待赛 |
| 7/4 02:00 | 🇦🇺 澳大利亚 vs 🇪🇬 埃及 | - | 待赛 |
| 7/4 06:00 | 🇦🇷 阿根廷 vs 🇨🇻 佛得角 | - | 待赛 |
| 7/4 09:30 | 🇨🇴 哥伦比亚 vs 🇬🇭 加纳 | - | 待赛 |

### 1/8决赛（16强）

| 场次 | 日期时间 | 对阵 | 备注 |
|------|---------|------|------|
| 第89场 | 7/5 05:00 | 🇵🇾 巴拉圭 vs 🇫🇷 法国 | 待赛 |
| 第90场 | 7/5 01:00 | 🇨🇦 加拿大 vs 🇲🇦 摩洛哥 | 待赛 |
| 第91场 | 7/6 04:00 | 巴西/巴拉圭 vs 🇳🇴 挪威 | 待赛 |
| 第92场 | 7/6 08:00 | 🇲🇽 墨西哥 vs 🏴󠁧󠁢󠁥󠁮󠁧󠁿 英格兰 | 待赛 |
| 第93场 | 7/7 03:00 | 🇨🇴 哥伦比亚 vs 民主刚果/克罗地亚 | 待赛 |
| 第94场 | 7/7 08:00 | 待定 | 待赛 |
| 第95场 | 7/8 00:00 | 待定 | 待赛 |
| 第96场 | 7/8 04:00 | 待定 | 待赛 |

### 1/4决赛（8强）

| 场次 | 日期时间 | 对阵 | 备注 |
|------|---------|------|------|
| 第97场 | 7/10 04:00 | 第89场胜者 vs 第90场胜者 | 待赛 |
| 第98场 | 7/11 03:00 | 第91场胜者 vs 第92场胜者 | 待赛 |
| 第99场 | 7/12 05:00 | 第93场胜者 vs 第94场胜者 | 待赛 |
| 第100场 | 7/12 09:00 | 第95场胜者 vs 第96场胜者 | 待赛 |

### 半决赛

| 场次 | 日期时间 | 对阵 | 备注 |
|------|---------|------|------|
| 第101场 | 7/15 03:00 | 第97场胜者 vs 第98场胜者 | 待赛 |
| 第102场 | 7/16 03:00 | 第99场胜者 vs 第100场胜者 | 待赛 |

### 决赛

| 场次 | 日期时间 | 对阵 | 备注 |
|------|---------|------|------|
| 第103场（季军） | 7/19 05:00 | 第101场负者 vs 第102场负者 | 待赛 |
| 第104场（决赛） | 7/20 03:00 | 第101场胜者 vs 第102场胜者 | 待赛 |

<!-- 射手榜 -->
<div id="scorers" class="tab-content">
<div class="table-wrapper">
<table>
<tr><th>排名</th><th>球员</th><th>球队</th><th>进球</th><th>点球</th></tr>
<tr><td>🥇</td><td>梅西（Messi）</td><td>🇦🇷 阿根廷</td><td><b>7</b></td><td>1</td></tr>
<tr><td>🥈</td><td>姆巴佩（Mbappé）</td><td>🇫🇷 法国</td><td><b>6</b></td><td>0</td></tr>
<tr><td>🥉</td><td>哈兰德（Haaland）</td><td>🇳🇴 挪威</td><td><b>5</b></td><td>1</td></tr>
<tr><td>4</td><td>登贝莱（Dembélé）</td><td>🇫🇷 法国</td><td><b>4</b></td><td>0</td></tr>
<tr><td>4</td><td>维尼修斯（Vinícius Jr.）</td><td>🇧🇷 巴西</td><td><b>4</b></td><td>0</td></tr>
<tr><td>4</td><td>佩佩（Pépé）</td><td>🇨🇮 科特迪瓦</td><td><b>4</b></td><td>0</td></tr>
<tr><td>7</td><td>马赫雷斯（Mahrez）</td><td>🇩🇿 阿尔及利亚</td><td><b>3</b></td><td>0</td></tr>
<tr><td>7</td><td>翁达夫（Undav）</td><td>🇩🇪 德国</td><td><b>3</b></td><td>0</td></tr>
<tr><td>7</td><td>库尼亚（Cunha）</td><td>🇧🇷 巴西</td><td><b>3</b></td><td>0</td></tr>
<tr><td>7</td><td>J.戴维（David）</td><td>🇨🇦 加拿大</td><td><b>3</b></td><td>0</td></tr>
<tr><td>7</td><td>盖耶（Gueye）</td><td>🇸🇳 塞内加尔</td><td><b>3</b></td><td>0</td></tr>
<tr><td>7</td><td>凯恩（Kane）</td><td>🏴󠁧󠁢󠁥󠁮󠁧󠁿 英格兰</td><td><b>3</b></td><td>1</td></tr>
<tr><td>13</td><td>特罗萨德（Trossard）</td><td>🇧🇪 比利时</td><td><b>2</b></td><td>0</td></tr>
<tr><td>13</td><td>德布劳内（De Bruyne）</td><td>🇧🇪 比利时</td><td><b>2</b></td><td>0</td></tr>
<tr><td>13</td><td>萨内（Sané）</td><td>🇩🇪 德国</td><td><b>2</b></td><td>0</td></tr>
<tr><td>13</td><td>基尼奥内斯（Quiñones）</td><td>🇲🇽 墨西哥</td><td><b>2</b></td><td>0</td></tr>
<tr><td>13</td><td>维萨（Wissa）</td><td>🇨🇩 民主刚果</td><td><b>2</b></td><td>0</td></tr>
</table>
</div>
</div>
<!-- 助攻榜 -->
<div id="assists" class="tab-content">
<div class="table-wrapper">
<table>
<tr><th>排名</th><th>球员</th><th>球队</th><th>助攻</th></tr>
<tr><td>🥇</td><td>奥利塞（Olise）</td><td>🇫🇷 法国</td><td><b>5</b></td></tr>
<tr><td>🥈</td><td>姆巴佩（Mbappé）</td><td>🇫🇷 法国</td><td><b>4</b></td></tr>
<tr><td>🥉</td><td>伊萨克（Isak）</td><td>🇸🇪 瑞典</td><td><b>3</b></td></tr>
<tr><td>🥉</td><td>吉马良斯（Guimarães）</td><td>🇧🇷 巴西</td><td><b>3</b></td></tr>
<tr><td>🥉</td><td>邓弗里斯（Dumfries）</td><td>🇳🇱 荷兰</td><td><b>3</b></td></tr>
<tr><td>🥉</td><td>贝林厄姆（Bellingham）</td><td>🏴󠁧󠁢󠁥󠁮󠁧󠁿 英格兰</td><td><b>3</b></td></tr>
<tr><td>6</td><td>德布劳内（De Bruyne）</td><td>🇧🇪 比利时</td><td><b>2</b></td></tr>
<tr><td>6</td><td>迪奥曼德（Diomandé）</td><td>🇨🇮 科特迪瓦</td><td><b>2</b></td></tr>
<tr><td>6</td><td>桑加雷（Sangaré）</td><td>🇨🇮 科特迪瓦</td><td><b>2</b></td></tr>
<tr><td>6</td><td>伍德（Wood）</td><td>🇳🇿 新西兰</td><td><b>2</b></td></tr>
<tr><td>6</td><td>萨拉赫（Salah）</td><td>🇪🇬 埃及</td><td><b>2</b></td></tr>
<tr><td>6</td><td>基米希（Kimmich）</td><td>🇩🇪 德国</td><td><b>2</b></td></tr>
<tr><td>6</td><td>恩博洛（Embolo）</td><td>🇨🇭 瑞士</td><td><b>2</b></td></tr>
<tr><td>6</td><td>厄德高（Ødegaard）</td><td>🇳🇴 挪威</td><td><b>2</b></td></tr>
<tr><td>6</td><td>赖因德斯（Reijnders）</td><td>🇳🇱 荷兰</td><td><b>2</b></td></tr>
<tr><td>6</td><td>堂安律（Doan）</td><td>🇯🇵 日本</td><td><b>2</b></td></tr>
</table>
</div>
</div>

<!-- 32强名单 -->
<div id="teams" class="tab-content">
<div class="group-title">🏆 16强已出线</div>
<div class="table-wrapper">
<table>
<tr><th>排名</th><th>球队</th><th>晋级方式</th><th>淘汰赛对手</th></tr>
<tr><td>1</td><td>🇲🇽 墨西哥</td><td>A组第一</td><td>已晋级8强 ✅</td></tr>
<tr><td>2</td><td>🇿🇦 南非</td><td>A组第二</td><td>已淘汰 ❌</td></tr>
<tr><td>3</td><td>🇨🇭 瑞士</td><td>B组第一</td><td>已淘汰 ❌</td></tr>
<tr><td>4</td><td>🇨🇦 加拿大</td><td>B组第二</td><td>待战摩洛哥</td></tr>
<tr><td>5</td><td>🇧🇷 巴西</td><td>C组第一</td><td>已晋级8强 ✅</td></tr>
<tr><td>6</td><td>🇲🇦 摩洛哥</td><td>C组第二</td><td>已晋级8强 ✅</td></tr>
<tr><td>7</td><td>🇺🇸 美国</td><td>D组第一</td><td>已晋级8强 ✅</td></tr>
<tr><td>8</td><td>🇦🇺 澳大利亚</td><td>D组第二</td><td>待战埃及</td></tr>
<tr><td>9</td><td>🇩🇪 德国</td><td>E组第一</td><td>已淘汰 ❌</td></tr>
<tr><td>10</td><td>🇨🇮 科特迪瓦</td><td>E组第二</td><td>已淘汰 ❌</td></tr>
<tr><td>11</td><td>🇳🇱 荷兰</td><td>F组第一</td><td>已淘汰 ❌</td></tr>
<tr><td>12</td><td>🇯🇵 日本</td><td>F组第二</td><td>已淘汰 ❌</td></tr>
<tr><td>13</td><td>🇧🇪 比利时</td><td>G组第一</td><td>已晋级8强 ✅</td></tr>
<tr><td>14</td><td>🇪🇬 埃及</td><td>G组第二</td><td>待战澳大利亚</td></tr>
<tr><td>15</td><td>🇪🇸 西班牙</td><td>H组第一</td><td>待战佛得角</td></tr>
<tr><td>16</td><td>🇨🇻 佛得角</td><td>H组第二</td><td>待战西班牙</td></tr>
<tr><td>17</td><td>🇫🇷 法国</td><td>I组第一</td><td>已晋级8强 ✅</td></tr>
<tr><td>18</td><td>🇳🇴 挪威</td><td>I组第二</td><td>已晋级8强 ✅</td></tr>
<tr><td>19</td><td>🇦🇷 阿根廷</td><td>J组第一</td><td>待战澳大利亚/埃及胜者</td></tr>
<tr><td>20</td><td>🇦🇹 奥地利</td><td>J组第二</td><td>待战西班牙/佛得角胜者</td></tr>
<tr><td>21</td><td>🇨🇴 哥伦比亚</td><td>K组第一</td><td>已晋级8强 ✅</td></tr>
<tr><td>22</td><td>🇵🇹 葡萄牙</td><td>K组第二</td><td>已晋级8强 ✅</td></tr>
<tr><td>23</td><td>🏴󠁧󠁢󠁥󠁮󠁧󠁿 英格兰</td><td>L组第一</td><td>已晋级8强 ✅</td></tr>
<tr><td>24</td><td>🇬🇭 加纳</td><td>L组第二</td><td>已淘汰 ❌</td></tr>
<tr><td>25</td><td>🇵🇾 巴拉圭</td><td>D组第三</td><td>已晋级8强 ✅</td></tr>
<tr><td>26</td><td>🇪🇨 厄瓜多尔</td><td>E组第三</td><td>已淘汰 ❌</td></tr>
<tr><td>27</td><td>🇸🇪 瑞典</td><td>F组第三</td><td>已淘汰 ❌</td></tr>
<tr><td>28</td><td>🇮🇷 伊朗</td><td>G组第三</td><td>已淘汰 ❌</td></tr>
<tr><td>29</td><td>🇸🇳 塞内加尔</td><td>I组第三</td><td>待战比利时</td></tr>
<tr><td>30</td><td>🇩🇿 阿尔及利亚</td><td>J组第三</td><td>已淘汰 ❌</td></tr>
<tr><td>31</td><td>🇨🇩 民主刚果</td><td>K组第三</td><td>待战英格兰</td></tr>
<tr><td>32</td><td>🇭🇷 克罗地亚</td><td>L组第三</td><td>已淘汰 ❌</td></tr>
</table>
</div>
</div>
</div>

<script>
function showTab(tabName) {
  // 隐藏所有内容
  document.querySelectorAll('.tab-content').forEach(el => {
    el.classList.remove('active');
  });
  // 移除所有按钮active
  document.querySelectorAll('.tab-btn').forEach(el => {
    el.classList.remove('active');
  });
  // 显示选中内容
  document.getElementById(tabName).classList.add('active');
  // 激活对应按钮
  event.target.classList.add('active');
}
</script>

</div>

---

> 🔗 **返回专题主页**：[2026 FIFA 世界杯专题](/FIFA/)

**精算师** | 2026年7月1日
