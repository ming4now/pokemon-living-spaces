// Add a room here to include it in the gallery and room switcher.
// Paths are relative to outputs/index.html. `video` and `readyGlobal` are optional.
window.ROOM_CATALOG = [
  {
    id: 'ice',
    title: '雪境暖居',
    theme: '冰系宝可梦',
    english: 'ICE TYPE',
    accent: '#456e88',
    tint: '#e9f1f7',
    description: '九尾的柔软尾羽、冰晶茶几与雪花地毯，围成一间窗外落雪的安静居所。',
    features: ['昼夜光照', '窗外风雪', '独立灯光'],
    cover: 'showroom/ice-cover.webp',
    coverAlt: '冰蓝色房间里的阿罗拉九尾沙发、冰伊布座椅、双倍多多冰吊灯与雪花地毯',
    viewer: 'v2/model_viewer.html?v=ice-snow-20260916',
    readyGlobal: '__iceViewer',
    video: 'v2/video/index.html?v=final'
  },
  {
    id: 'fairy',
    title: '梦幻花语',
    theme: '妖精系宝可梦',
    english: 'FAIRY TYPE',
    accent: '#945567',
    tint: '#f8ebef',
    description: '仙子伊布的缎带、胖丁软椅与花园窗景，在奶油色和暖灯中轻轻相遇。',
    features: ['昼夜光照', '花园窗景', '温柔星光'],
    cover: 'showroom/fairy-cover.webp',
    coverAlt: '粉色奶油色房间里的仙子伊布沙发、胖丁座椅、波克基斯吊灯与星月地毯',
    viewer: 'fairy/model_viewer.html?v=refined-gallery-20260916',
    readyGlobal: '__fairyViewer'
  },
  // THREE NEW COLLECTIONS
{
  "id": "poison",
  "title": "暮紫秘境",
  "theme": "毒系宝可梦",
  "english": "POISON TYPE",
  "accent": "#765478",
  "tint": "#ede6f0",
  "description": "耿鬼的弯月笑容、盘蛇座椅与花瓣茶几，围成一间薄雾窗景中的暮紫居所。",
  "features": [
    "昼夜光照",
    "薄雾药草园",
    "独立灯光"
  ],
  "coverAlt": "耿鬼紫色沙发、阿柏怪座椅、双弹瓦斯吊灯与花瓣茶几的真实三维室内渲染",
  "cover": "showroom/poison-cover.webp",
  "viewer": "poison/model_viewer.html?v=three-rooms-20260923",
  "readyGlobal": "__roomViewer"
},
{
  "id": "bug",
  "title": "森间微光",
  "theme": "虫系宝可梦",
  "english": "BUG TYPE",
  "accent": "#73804e",
  "tint": "#edf0df",
  "description": "展开的蝶翼、蜂巢暖灯与绿毛虫软椅，在藤蔓与蝴蝶花园之间轻轻相遇。",
  "features": [
    "昼夜光照",
    "蝴蝶花园",
    "蜂巢暖灯"
  ],
  "coverAlt": "蝶翼沙发、绿毛虫座椅、蜂巢吊灯与植物纹地毯的真实三维室内渲染",
  "cover": "showroom/bug-cover.webp",
  "viewer": "bug/model_viewer.html?v=three-rooms-20260923",
  "readyGlobal": "__roomViewer"
},
{
  "id": "fire",
  "title": "熠火暖居",
  "theme": "火系宝可梦",
  "english": "FIRE TYPE",
  "accent": "#b76a3c",
  "tint": "#faecdb",
  "description": "龙翼沙发、九尾扶手椅与熔岩茶几，在秋叶窗景和柔暖焰光中围成一个家。",
  "features": [
    "昼夜光照",
    "秋叶窗景",
    "可调焰光"
  ],
  "coverAlt": "喷火龙沙发、九尾座椅、熔岩茶几与火球鼠地毯的真实三维室内渲染",
  "cover": "showroom/fire-cover.webp",
  "viewer": "fire/model_viewer.html?v=three-rooms-20260923",
  "readyGlobal": "__roomViewer"
}
];
