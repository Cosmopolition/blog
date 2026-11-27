/* 作品页数据 —— 新增一款产品 = ① 在这里加一个对象 ② 放一张图到 images_webp/ ③ 若有新图形，在 index.html 里补一条 CSS
 *
 * · 中英文写在同一个对象里（zh / en），不再有平行数组，也不用再按下标对齐
 * · heroOrder 用 id 表达，新增作品插在中间也不会错位
 * · 卡片底色 / 海报底色 / 文字色由这里的 color / posterColor / text 决定，index.html 不再写死
 * · kind: app = App Store 上架，open = GitHub 开源，game = 网页可玩（各自有对应的筛选按钮与 CTA 文案）
 * · platform 省略时回落到默认文案（苹果手机 / 独立作品）
 */
window.RESUME_WORKS = [
  {
    id: 'awaken',
    image: 'images_webp/awaken.webp',
    color: '#d4dfa9',
    posterColor: '#d7e4b0',
    link: 'https://apps.apple.com/cn/app/id6756660625',
    kind: 'app',
    brand: 'AIVO AWAKEN',
    geometry: '<span class="orb" aria-hidden="true"></span>',
    zh:{
      name: '感刻', word: '多一点<br>感受。',
      tag: '感官创作 · 看见自己',
      lead: '重新连接感官，重新看见日常。',
      description: '在信息过载的日常里，给感知留一点空间。感刻从身体感受出发，探索感官创作与自我觉察，让工具成为慢下来、看见自己的入口。',
      focus: '感官体验 / 自我觉察',
    },
    en:{
      name: 'AIVO Awaken', word: 'FEEL<br>MORE.',
      tag: 'Sensory creation · Self-awareness',
      lead: 'Reconnect with your senses. Rediscover the everyday.',
      description: 'A space to slow down in a world full of information. Awaken explores sensory creation and self-awareness, starting with what you feel rather than how much you consume.',
      focus: 'Sensory experience / Self-awareness'
    }
  },
  {
    id: 'amurmur',
    image: 'images_webp/amurmur.webp',
    color: '#b9b9e7',
    link: 'https://apps.apple.com/cn/app/id6759279951',
    kind: 'app',
    brand: 'AMURMUR',
    geometry: '<span class="sound-lines" aria-hidden="true">'+Array.from({length:35},(_,n)=>'<i style="--h:'+(20+Math.sin(n*.85)**2*105)+'px"></i>').join('')+'</span>',
    zh:{
      name: '语生', word: '把想法<br>说出来。',
      tag: '语音记录 · 个人知识库',
      lead: '说出来，让碎片化的想法有处安放。',
      description: '想法往往来不及组织，就已经出现。语生从语音记录开始，借助 AI 把碎片化的声音整理成可理解、可回顾的个人知识，让表达之后还有沉淀。',
      focus: '声音 / 知识沉淀',
    },
    en:{
      name: 'Amurmur', word: 'THINK<br>OUT LOUD.',
      tag: 'Voice notes · Personal knowledge',
      lead: 'Give your scattered thoughts somewhere to land.',
      description: 'Ideas arrive before they are fully formed. Amurmur begins with your voice, using AI to turn fragments into personal knowledge you can understand, revisit, and build on.',
      focus: 'Voice / Personal knowledge'
    }
  },
  {
    id: 'ask',
    image: 'images_webp/ask.webp',
    color: '#ed522f',
    posterColor: '#f35b34',
    link: 'https://apps.apple.com/cn/app/id6767553566',
    kind: 'app',
    brand: 'STAY CURIOUS',
    geometry: '<span class="question-mark" aria-hidden="true">?</span>',
    zh:{
      name: '为啥', word: '继续<br>追问。',
      tag: '深度思考 · 找回提问能力',
      lead: '让一个问题，带你走向下一个问题。',
      description: '小时候，我们总有问不完的为什么。为啥希望帮人重新找回追问的习惯：给好奇心一点提示，让思考有继续发生的机会。',
      focus: '提问 / 思考习惯',
    },
    en:{
      name: 'Why', word: 'KEEP<br>ASKING.',
      tag: 'Deeper thinking · Better questions',
      lead: 'Let one question lead to the next.',
      description: 'We used to ask why without running out of questions. Why makes room for that habit again, offering prompts that give curiosity somewhere to go and thought a reason to continue.',
      focus: 'Questions / Thinking habits'
    }
  },
  {
    id: 'dream',
    image: 'images_webp/dream.webp',
    color: '#272d40',
    posterColor: '#292d44',
    text: '#ecdfb9',
    posterText: '#ecdfb9',
    link: 'https://apps.apple.com/cn/app/id6757799220',
    kind: 'app',
    brand: 'DREAMUR',
    geometry: '<span class="dream-orbit" aria-hidden="true"></span>',
    zh:{
      name: '梦影', word: '梦醒<br>之后。',
      tag: '梦境记录 · 潜意识探索',
      lead: '在梦消失之前，留下一点线索。',
      description: '用语音或文字留下梦境，再借助端侧 AI 探索其中的象征与关联。梦影把梦境记录、塔罗意象与长期回顾放在一起，逐渐绘制属于自己的潜意识地图。',
      focus: '端侧 AI / 梦境记录',
    },
    en:{
      name: 'Dreamur', word: 'After<br>hours.',
      heroWord: 'AFTER<br>HOURS.',
      tag: 'Dream journal · Inner exploration',
      lead: 'Leave a trace before the dream disappears.',
      description: 'Capture dreams with your voice or in writing, then explore their symbols and connections with on-device AI. Dreamur brings dream journaling, tarot imagery, and long-term reflection together.',
      focus: 'On-device AI / Dream journaling'
    }
  },
  {
    id: 'life-canvas',
    color: '#335c4b',
    text: '#e8f2ec',
    link: 'https://github.com/Cosmopolition/life-canvas-open',
    kind: 'open',
    brand: 'LIFE CANVAS',
    geometry: '<span class="canvas-grid" aria-hidden="true"></span>',
    zh:{
      name: '人生画布', word: '画一张<br>人生。',
      tag: '开源项目 · 人生地图',
      lead: '不是待办清单，是一张能看见关系的人生地图。',
      description: '把目标、阶段与想法放在同一张无限画布上，用九种带规则的关系连起来，再按时间回看。本地优先，默认加密，无账号、无服务器、无遥测，自己的人生自己存档。',
      focus: '无限画布 / 关系结构',
      platform: '开源 · 本地优先'
    },
    en:{
      name: 'Life Canvas', word: 'PAINT<br>LIFE.',
      tag: 'Open source · Life map',
      lead: 'Not a to-do list. A life map that shows relationships.',
      description: 'Place goals, phases, and ideas on one infinite canvas, connected by nine rule-based relationships, then look back over time. Local-first and encrypted by default — no accounts, no servers, no telemetry. Your life, archived by you.',
      focus: 'Infinite canvas / Structured relationships'
,
      platform: 'Open source · Local-first'
    }
  },
  {
    id: 'onperson',
    image: 'images_webp/onperson.webp',
    color: '#e3b04b',
    posterColor: '#e8b850',
    link: 'https://apps.apple.com/cn/app/id6833516186',
    kind: 'app',
    brand: 'ON PERSON',
    geometry: '<span class="ping" aria-hidden="true"></span>',
    zh:{
      name: '没落下', word: '手机<br>别落下。',
      tag: '智能防丢 · 手表提醒',
      lead: '你走了，手机没跟上。手表会叫你一声。',
      description: '出门最容易落下的就是手机。没落下只看 Apple Watch 和 iPhone 之间那条蓝牙链路。两者一分开，手表就震一下、响一声，告诉你手机最后一次在身边是多久以前。不用 GPS，也不联网。',
      focus: '蓝牙链路 / 离开检测',
      platform: 'iPhone + Apple Watch'
    },
    en:{
      name: 'On Person', word: 'DON’T<br>LEAVE IT.',
      tag: 'Anti-loss · Watch alert',
      lead: 'You left. Your phone did not follow. Your watch says so.',
      description: 'The easiest thing to leave behind is your phone. On Person watches only the Bluetooth link between your Apple Watch and iPhone — when the two drift apart, your wrist buzzes and rings, telling you how long ago your phone was still nearby. No GPS, and no network either.',
      focus: 'Bluetooth link / Separation detection'
,
      platform: 'iPhone + Apple Watch'
    }
  },
  {
    id: 'lifehand',
    image: 'images_webp/lifehand.webp',
    color: '#16372e',
    text: '#e8e3c8',
    posterText: '#e8e3c8',
    link: 'https://modelscope.cn/studios/LLMWWW/life_game',
    kind: 'game',
    brand: 'LIFE, IN YOUR HAND',
    geometry: '<span class="card-diamond" aria-hidden="true"></span>',
    zh:{
      name: '人生在手', word: '别急着<br>出 K。',
      tag: '策略卡牌 · 十三轮博弈',
      lead: '三个人都有好牌，谁能选对时机。',
      description: '一副 52 张牌，三个人打十三轮。相同点数全部作废，最大的那张赢下底池；赢来的方块既是分数，也能再投入。对面两个策略 Agent 会记住你的出牌与表态，结局从 24 个模板里，按这一局真实发生的事挑一个。',
      focus: '十三轮博弈 / 行为记忆',
      platform: '网页 · 三人牌局'
    },
    en:{
      name: 'Life, In Your Hand', word: 'HOLD<br>THE K.',
      tag: 'Card strategy · Thirteen rounds',
      lead: 'Three players, all with good cards. Who picks the right moment?',
      description: 'One deck of 52 cards, three players, thirteen rounds. Cards of the same rank cancel each other out, and the highest card still standing takes the pot. The diamonds you win are both your score and something you can put back into play. Two strategy agents across the table remember what you played and what you claimed, and the ending is picked from 24 written templates by what actually happened in your game.',
      focus: 'Thirteen rounds / Behavior memory'
,
      platform: 'Web · Three-player table'
    }
  },
  {
    id: 'photojournal',
    image: 'images_webp/photojournal.webp',
    color: '#e2c4bd',
    link: '#小程序://照片手记/ExUxH01uDt8dMam',
    kind: 'app',
    brand: 'PHOTO NOTE',
    geometry: '<span class="pages" aria-hidden="true"></span>',
    cta: { zh: '在微信中打开', en: 'Open in WeChat' },
    note: {
      zh: '微信小程序「日子成页照片手记」：在微信里点开可直接进入；其他浏览器请在微信搜索「日子成页照片手记」。',
      en: 'A WeChat mini program, “日子成页照片手记”: the link opens inside WeChat. Elsewhere, search “日子成页照片手记” in WeChat.'
    },
    zh:{
      name: '日子成页照片手记', word: '一天<br>一页。',
      tag: '微信小程序 · 照片手记',
      lead: '选张照片，写一句话，今天就成了一页。',
      description: '选一张照片，写一句话，换一种纸色和字体，就排成一张纸页卡片，导出 1080×1440 的高清 PNG，没有水印。笺集里按日历、网格或列表翻回从前，跨着日期也能搜到那一句。照片和文字只留在自己的手机里，不上传，也没有云端。',
      focus: '照片排版 / 本地笺集',
      platform: '微信小程序'
    },
    en:{
      name: 'Photo Note', word: 'ONE<br>DAY.',
      heroWord: 'ONE<br>DAY.',
      tag: 'Mini program · Photo journal',
      lead: 'Pick a photo, write a line, and the day becomes a page.',
      description: 'Pick a photo, write a line, choose a paper tone and a font, and the day lays itself out as a card you can export as a 1080×1440 PNG — no watermark. Your notes live in a calendar, a grid, or a list, searchable across every date you wrote. Photos and words stay on your phone: nothing is uploaded, and there is no cloud.',
      focus: 'Photo layout / Local journal',
      platform: 'WeChat mini program'
    }
  },
  {
    id: 'inspirebox',
    image: 'images_webp/inspirebox.webp',
    color: '#cdc4e2',
    mark: '异想盒',
    link: '',
    kind: 'experiment',
    brand: 'INSPIREBOX',
    geometry: '',
    cta: { zh: '即将上线', en: 'Coming soon' },
    note: {
      zh: '项目名与细节暂未公开。它还在开发中，等准备好了，这个位置会换成下载入口。',
      en: 'The name and the details are not public yet. It is still in development; this slot will become a download link once it is ready.'
    },
    zh:{
      name: '异想盒（未公开）', word: '跳出<br>盒子。',
      tag: '合作项目 · 多端开发中',
      lead: '和伙伴一起做的多端应用，iOS、Android、鸿蒙一起推进。',
      description: '和伙伴一起做的多端应用，iOS、Android 与鸿蒙同步推进。盒子里的东西还没到揭晓的时候，就先把它放在这儿——等打开那天，再补上细节。',
      focus: '多端协作 / 合作开发',
      platform: 'iOS · Android · 鸿蒙'
    },
    en:{
      name: 'InspireBox (Unannounced)', word: 'THINK<br>OUTSIDE.',
      tag: 'Collaboration · In development',
      lead: 'A multi-platform app built with a partner — iOS, Android, and HarmonyOS, together.',
      description: 'A multi-platform app built with a partner, shipping for iOS, Android, and HarmonyOS. What is inside the box stays inside the box for now; the details arrive when it opens.',
      focus: 'Multi-platform / Collaboration',
      platform: 'iOS · Android · HarmonyOS'
    }
  }
];

window.RESUME_HERO_ORDER = ['lifehand','onperson','amurmur','awaken','ask','dream'];
