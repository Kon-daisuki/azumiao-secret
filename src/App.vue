<script setup>
import { ref, computed, onMounted } from 'vue';

// ========================================================
// 图片与缓存逻辑 (保持不变)
// ========================================================
const total_photos = 15; 
const raw_photo_urls = []; 
const cached_photo_urls = ref([]); 
const isLoading = ref(true); 
const loadProgress = ref(0); 

for (let i = 1; i <= total_photos; i++) {
    raw_photo_urls.push(`${import.meta.env.BASE_URL}images/${i}.jpg`);
}

const CACHE_NAME = 'azumiao-base-v1'; 
onMounted(async () => {
    try {
        const cache = await caches.open(CACHE_NAME);
        const promises = raw_photo_urls.map(async (url) => {
            try {
                let response = await cache.match(url);
                if (!response) {
                    response = await fetch(url);
                    if (response.ok) await cache.put(url, response.clone());
                }
                const blob = await response.blob();
                loadProgress.value = Math.floor((++loadProgress.value / total_photos) * 100);
                return URL.createObjectURL(blob);
            } catch (err) { return url; }
        });
        cached_photo_urls.value = await Promise.all(promises);
        setTimeout(() => { isLoading.value = false; }, 500);
    } catch (e) {
        cached_photo_urls.value = raw_photo_urls;
        isLoading.value = false;
    }
});

const duplicated_photo_list = computed(() => {
    // 复制 3 份以确保在超宽屏幕上也不会断档
    return [...cached_photo_urls.value, ...cached_photo_urls.value, ...cached_photo_urls.value];
});
</script>

<template>
    <div class="bg">
        
        <transition name="fade">
            <div v-if="isLoading" class="loading-mask">
                <div class="loader">
                    <div class="spinner"></div>
                    <p>秘密基地资源装载中...</p>
                </div>
            </div>
        </transition>

        <!-- 
           👇 核心修改：
           移除 v-show，改用 opacity 避免布局跳动。
           container 负责垂直居中内容。
        -->
        <div class="container" :style="{ opacity: isLoading ? 0 : 1 }">
            
            <div class="title-wrapper">
                <h1 class="page-title">阿祖喵的秘密基地</h1>
                <p class="subtitle">✨ Welcome to my secret base ✨</p>
            </div>

            <!-- 第一行 -->
            <div class="scroll-wrapper">
                <ol class="boxes boxes-forward">
                    <li class="box" v-for="(photo, i) in duplicated_photo_list" :key="'f-'+i">
                        <img :src="photo" draggable="false" /> <!-- 禁止图片拖拽，优化点击体验 -->
                    </li>
                </ol>
            </div>
            
            <!-- 第二行 -->
            <div class="scroll-wrapper">
                <ol class="boxes boxes-backward">
                    <li class="box" v-for="(photo, i) in duplicated_photo_list" :key="'b-'+i">
                        <img :src="photo" draggable="false" />
                    </li>
                </ol>
            </div>

            <!-- 第三行 -->
            <div class="scroll-wrapper">
                <ol class="boxes boxes-forward">
                    <li class="box" v-for="(photo, i) in duplicated_photo_list" :key="'f2-'+i">
                        <img :src="photo" draggable="false" />
                    </li>
                </ol>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* ========================================================
   1. 布局与垂直居中
   ======================================================== */
.bg { 
    position: relative; 
    width: 100%; 
    min-height: 100vh; /* 强制占满屏幕高度 */
    display: flex;     /* 启用 Flex 布局 */
    justify-content: center; /* 水平居中 */
    align-items: center;     /* 🚀 垂直居中：解决电脑版往上飘的问题 */
    overflow-x: hidden;      /* 防止页面出现横向滚动条 */
    padding-bottom: 20px;
}

.container { 
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: opacity 0.5s ease;
    /* 加上一点 z-index 确保在背景之上 */
    z-index: 10;
}

/* ========================================================
   2. 🚀 核心修复：全屏穿透 + 点击暂停
   ======================================================== */
.scroll-wrapper { 
    position: relative; 
    height: 220px; 
    margin-top: 15px;
    
    /* 👇 暴力全屏方案：无视父容器宽度，强制撑满视口 */
    width: 100vw; 
    left: 50%; 
    margin-left: -50vw; 
    
    /* 允许子元素溢出，防止图片被切掉 (消除空气墙) */
    overflow: visible; 
}

.boxes { 
    position: absolute; 
    display: flex; 
    left: 0;
    height: 100%; 
    align-items: center;
    padding-left: 0; 
    gap: 20px; 
    
    /* 动画设置 */
    animation: scroll linear infinite; 
    animation-duration: 60s; /* 稍微调慢一点，看起来更优雅 */
    will-change: transform;
}

/* 🚀 交互修复：鼠标悬停 OR 手指按住时，停止动画 */
.boxes:hover, 
.boxes:active { 
    animation-play-state: paused; 
    z-index: 100; /* 按住时层级提高 */
}

/* 动画定义 */
.boxes-forward { animation-name: scrollForward; }
.boxes-backward { animation-name: scrollBackward; }

/* 使用 transform 确保平滑 */
@keyframes scrollForward { 
    0% { transform: translate3d(0, 0, 0); } 
    100% { transform: translate3d(-33.33%, 0, 0); } /* 移动 1/3 (因为复制了3份) */
}
@keyframes scrollBackward { 
    0% { transform: translate3d(-33.33%, 0, 0); } 
    100% { transform: translate3d(0, 0, 0); } 
}

/* ========================================================
   3. 图片与卡片样式
   ======================================================== */
.box { 
    list-style: none; 
    position: relative; 
    width: 200px; 
    height: 200px; 
    flex-shrink: 0; 
    border-radius: 15px; 
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); /* 优化回弹效果 */
    
    /* 初始状态：轻微 3D 倾斜 */
    transform: perspective(500px) rotateY(-15deg) scale(0.9);
    opacity: 0.85;
    
    box-shadow: 5px 5px 15px rgba(0,0,0,0.1);
}

.box img { 
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
    border-radius: 15px; 
    display: block;
    /* 防止手机上长按选中图片 */
    user-select: none; 
    pointer-events: none; 
}

/* 选中/悬停状态 */
.box:hover, .box:active { 
    opacity: 1; 
    z-index: 200; 
    /* 放大并摆正 */
    transform: perspective(500px) rotateY(0deg) scale(1.15); 
    box-shadow: 0 15px 35px rgba(0,0,0,0.3); 
    border: 2px solid rgba(255,255,255,0.8); /* 加个白边框更醒目 */
}

/* 反向滚动的行，初始角度相反 */
.boxes-backward .box { transform: perspective(500px) rotateY(15deg) scale(0.9); }
.boxes-backward .box:hover, .boxes-backward .box:active { transform: perspective(500px) rotateY(0deg) scale(1.15); }

/* ========================================================
   4. 标题与其他
   ======================================================== */
.title-wrapper {
    text-align: center;
    margin-bottom: 40px; 
    padding: 0 15px;
    animation: float 3s ease-in-out infinite;
}

.page-title {
    font-family: system-ui, -apple-system, sans-serif;
    font-weight: 900;
    font-size: clamp(2rem, 5vw, 3.5rem); /* 响应式字体大小 */
    color: #ffffff;
    text-shadow: 3px 3px 0px #ff9a9e, 6px 6px 0px #fad0c4;
    margin: 0;
}

.subtitle {
    font-family: monospace;
    font-size: 1rem;
    color: #fff;
    margin-top: 10px;
    font-weight: bold;
    opacity: 0.9;
    background: rgba(0,0,0,0.1);
    padding: 5px 15px;
    border-radius: 20px;
    display: inline-block;
}

@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

/* Loading */
.loading-mask {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(25px);
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
}
.loader { text-align: center; color: white; }
.spinner {
    width: 40px; height: 40px;
    border: 4px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 15px;
}
@keyframes spin { to { transform: rotate(360deg); } }
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ========================================================
   5. 手机适配微调
   ======================================================== */
@media (max-width: 768px) {
    .scroll-wrapper { height: 160px; margin-top: 10px; }
    .boxes { gap: 10px; }
    .box { width: 130px; height: 130px; }
    .box:hover, .box:active { transform: scale(1.1) rotateY(0); width: 160px; }
}
</style>

<style>
/* 全局设置 - 保持不变 */
* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
html, body { width: 100%; height: 100%; overflow-x: hidden; margin: 0 !important; padding: 0 !important; }
body {
    background: linear-gradient(-45deg, #ff9a9e, #fad0c4, #fad0c4, #a18cd1);
    background-size: 400% 400%;
    animation: globalGradient 15s ease infinite;
    font-family: sans-serif;
}
@keyframes globalGradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
#app { width: 100%; min-height: 100vh; }
</style>
