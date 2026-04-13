# 视频播放器自定义控制区改动记录

## 当前布局（2026-04-11）

### HTML 结构
```
#video-custom-controls-row3     → 时间区间（开始/结束 + 输入框）
#video-custom-controls-row2     → 播放(头部) | 全屏 | -10 | +10 | 倍速(尾部)
#video-custom-controls          → 当前时间 | 分隔符 | 总时长 | 进度条 | 音量(尾部)
#video-file-info               → 文件大小 | URL
```

### 按钮样式
- 全部使用 `btn btn-primary` class
- 无 hardcoded color / background CSS
- 分隔符使用 `<span>|</span>`

### 已废弃的改动
- ❌ 栅格布局（Bootstrap row/col）— 导致按钮挤在一行，reverted
- ❌ `btn btn-primary ms-auto` — reverted to `btn btn-primary`
- ❌ `btn btn-secondary` / `btn btn-azure` — 试了一圈回到 primary
- ❌ PiP 按钮 — 移动端无效，已删除
- ❌ 文件名 `#video-file-name` — 已删除，只保留大小和 URL

## 文件
- HTML: `public/templates/modal/video-play.html`
- JS: `public/js/biz/fileCommon.js`
