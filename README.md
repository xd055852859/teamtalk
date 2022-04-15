### 1.1.2

> 小修改 4.15

1. 功能

   - ~~_New 编辑风格与 Notes 一致_~~
   - 非 all，增加一个 小房子回到首页
   - DarkMode 增加一个 Auto Set By Time（根据时间自动设置） 晚 8:00~早 6:00
   - 语音：补充 日文 和 中文繁体
   - 群编辑简化（自动保存）
   - ~~_群权限修改_~~
   - +收到信息发提示音
   - To 对象和过滤器联动:all 不变；private me；
   - ~~_我的卡片，始终允许编辑_~~
   - ~~_取消编辑全屏功能_~~

2. 界面
   - ~~_顶部 logo 始终靠左侧，右侧过滤器始终靠右，参考 Notes_~~
   - ~~_顶部的兴建卡片不要左右到底，保持卡片形状，参考原型_~~
   - 自动保存输入框内容
   - ~~_列表人头小一些，人头所在列加一点点阴影，正文 summary 灰色_~~
   - 列表鼠标路过当前高亮（加阴影）
   - ~~_Reply 始终在最底部（我自己不能第一个回复）_~~
   - ~~_个人资料更新为 Personal Infomation 个人信息_~~
   - ~~_userName 更新为 User Name ； email 更新为 eMail_~~
   - ~~_鼠标移上去有水波纹效果_~~
   - 系统 icon、登录的 icon 都要更新
   - ~~_Login 按钮不用用蓝色；圆角调小_~~
   - ~~_Exit 不要按钮用文字_~~
   - ~~_To 对象左侧定宽，类似菜单效果，圆角一点点_~~
   - ~~_放大 logo 用扩张效果_~~
   - logo+文字：话题 Topic
   - ~~_过滤器支持文字点击_~~

### 1.1.1

> 小修改 4.14

1. 功能

   - ~~_暗黑模式聊天字体修改为白色_~~
   - ~~_聊天框默认展开半面框体_~~
   - ~~_全屏返回保存内容_~~
   - ~~_聊天尖角变小_~~
   - ~~_消息必须要标题_~~
   - ~~_编辑器 / 功能_~~
   - ~~_输入图片，结果图标跟着浮上去了。_~~

2. 界面
   - ~~_logo 修改_~~
   - ~~_聊天尖角取消_~~
   - ~~_聊天边框取消_~~
   - ~~_头像 姓名 群组一行_~~
   - ~~_首页暗黑模式更换颜色_~~
   - ~~_更换主题色_~~

---

### 1.1.0

> 首次改版 4.12 -

1. 主页界面排版

   - ~~_左侧菜单栏改成 logo 不要用头像_~~
   - ~~_右侧使用过滤器_~~
   - ~~_聊天版式排版（头像+名字+群名+语音状态[换行]聊天框）_~~
   - ~~_其他人的头像在右，我的头像在左边_~~
   - ~~_滚动方式，最新的消息在最上面_~~
   - ~~_输入部分始终悬浮，可以点击下拉，缩小到单行。（不需要删除按钮）_~~
   - ~~_如果过滤器过滤部分消息（直连状态），会在“Topic”文字后面显示非此过滤器过滤部分的新消息条数，点击此消息后，会回到过滤是 All 的状态。_~~

2. 过滤器

   > 此类弹出菜单，都要加个半透底，让其他部分灰暗
   > 此界面不需要搜索

   - ~~_增加 Private 自白，自己发给自己的。_~~
   - ~~_favorite 需要在卡片（topic）详情中标注为收藏_~~
   - ~~_fPrivate、favorite 和 I send 要显示片条数。_~~
   - ~~_加 好友和加 Team_~~

3. 左侧边菜单

   > 点击 logo 出此菜单

   - ~~_头像、个人信息。通用界面_~~
   - Panter，用于管理好友(mates)
   - ~~_settings。目前只有语言选择（中文、繁体、英语、日语）四种语言+darkmode+BlockList(黑名单，此处会补原型)_~~
   - ~~_help(链接)_~~
   - ~~_community（链接）_~~
   - ~~_Exit 退出登录_~~

4. 卡片详情（最重大修改）

   - ~~_发送时显示群组或者接收人名称，接收时显示群组或者发送人名称_~~
     > 发送：to xxxx
     > 接收：in [teamName]或者 from [senderName]
   - 收藏按钮，点击收藏，再点击取消收藏
   - Update/Post
     > 只有卡片的发送者可以进行此操作。每当 Update 或者 post 时，此卡片会重新排到收件人卡片列表的首位。
   - Reply
     > 通过首页发的卡片，都是认为是 topic，对此 topic 发的回复
     > 在消息列表中，是单独的消息。但是下方会出现一条“@+topic”名字
     > 在卡详情中 reply 都会显示到此 topic 下
     > 点击 reply 的卡片，进入的是对应的 topic
     > 且 reply 的卡片，无法再被 reply

5. Mate 和 Teams 的选择和修改

   > 如果从主界面进入，则显示 partner 列表和操作按钮“...”如果从侧边的 partner 管理入口进入，则不需要“…”
   > 当作为选择时，点击 partner，选择此 partner。点击后面的“…”,进入 Mate 或者 team 的页面。
   > 当作为管理时，直接点击，即可进入此 partner 或者 team 的页面
   > 创建群组按钮，点击后，进入创建群组页面，输入群组名字并选择我的 mate 作为群成员即可创建群组。创建后，自动选择此群作为发送对象。

6. Mate 页面

   > 显示 mate 头像、个性签名

   - sendMessage 按钮，点击后，直接进入 card 详情编辑。且发送人设为此 mate,同时，过滤器也要把此人的消息过滤出来（进入对此人的直连模式）。
   - Mute。控制此人的消息是否静音
   - Block。勾选之后，不再接受此人消息。但是此人再给我发消息，会对他提示，消息发送不成功。
   - Delete。删除此人的好友关系（可以重新加）

7. Team 页面（管理和 readOnly）

   - 如果有管理权限，则可以编辑 team 的名字。编辑保存后，可修改 team 名字。
   - 增加群成员，此时会出现自己的 mate 列表，只能在其中勾选还没有加入群的 mate 进入群。保存后依然返回群页面。
   - 群成员列表是 owner，可以下拉成员权限按钮，有以下选项（admin,member,delete）。如果是 admin，则非 admin 会出现 delete 选项
   - 每个群成员，如果还不是我的 mate，则后方会出现“+mate”选项，添加后，直接成为我的 mate

---

### 1.0.0

> 基础功能 4.1 - 4.12

1. 欢迎页
   - ~~_登录功能_~~
2. 首页
   - ~~_消息过滤_~~
   - ~~_消息列表_~~
   - ~~_消息体_~~
   - ~~_暗黑模式适配_~~
   - ~~_滚动加载_~~
3. 发送窗口
   - ~~_选择接收者_~~
   - ~~_消息编辑器_~~
4. 个人中心
   - ~~_头像设置_~~
   - ~~_名称设置_~~
   - ~~_设置、帮助、社交、退出_~~
   - ~~_暗黑模式切换_~~
5. 消息详情
   - ~~_预览模式_~~
   - ~~_消息编辑器_~~
   - ~~_小组对象显示_~~
   - ~~_消息回复功能_~~
6. 语音会议
   - 语音会议
7. 邀请队友
   - ~~_邀请页面_~~
   - ~~_添加好友_~~
   - ~~_平台内搜索_~~
   - ~~_二维码_~~
   - ~~_分享到微信、微博、QQ、QQ 空间、贴吧_~~
8. 小组详情
   - ~~_创建小组_~~
   - ~~_编辑小组_~~
   - ~~_退出小组_~~
   - ~~_编辑权限_~~
   - ~~_成员添加_~~
   - ~~_成员删除_~~
9. 消息通信
   - ~~_socket 通信_~~
   - ~~_socket 接收人筛选_~~
