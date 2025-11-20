<script setup>
import { ref, computed, onMounted } from 'vue';

// ========================================================
// 1. 图片与缓存逻辑 (保持不变，性能最好)
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
           container 负责垂直居中内容
        -->
        <div class="container" v-show="!isLoading">
            
            <div class="title-wrapper">
                <h1 class="page-title">阿祖喵的秘密基地</h1>
                <p class="subtitle">✨ Welcome to my secret base ✨</p>
            </div>

            <!-- 第一行 -->
            <div class="scroll-wrapper">
                <ol class="boxes boxes-forward">
                    <li class="box" v-for="(photo, i) in duplicated_photo_list" :key="'f-'+i">
                        <img :src="photo" draggable="false" />
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
    align-items: center;     /* 🚀 垂直居中：内容不再往上飘 */
    overflow-x: hidden;      /* 防止页面出现横向滚动条 */
    padding-bottom: 20px;
}

.container { 
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
}

/* ========================================================
   2. 滚动容器 (保持全屏穿透修复)
   ======================================================== */
.scroll-wrapper { 
    position: relative; 
    height: 220px; 
    margin-top: 20px;
    
    /* 👇 暴力全屏方案：无视父容器宽度，强制撑满视口 */
    width: 100vw; 
    left: 50%; 
    margin-left: -50vw; 
    
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
    animation: scroll linear infinite; 
    animation-duration: 60s; 
    will-change: transform;
}

/* 鼠标悬停/按住时暂停 */
.boxes:hover, 
.boxes:active { 
    animation-play-state: paused; 
    z-index: 100; 
}

/* 动画定义 */
.boxes-forward { animation-name: scrollForward; }
.boxes-backward { animation-name: scrollBackward; }

@keyframes scrollForward { 
    0% { transform: translate3d(0, 0, 0); } 
    100% { transform: translate3d(-33.33%, 0, 0); } 
}
@keyframes scrollBackward { 
    0% { transform: translate3d(-33.33%, 0, 0); } 
    100% { transform: translate3d(0, 0, 0); } 
}

/* ========================================================
   3. 图片卡片 - ⚠️ 已完全恢复原本的倾斜设计
   ======================================================== */
.box { 
    list-style: none; 
    position: relative; 
    width: 200px; 
    height: 200px; 
    flex-shrink: 0; 
    border-radius: 15px; 
    transition: all 0.5s ease; 
    
    /* 👇 恢复原本的强烈透视感 */
    opacity: 0.8; 
    transform: perspective(100px) rotateY(-15deg); 
    
    box-shadow: 0 0px 5px rgba(0, 0, 0, 0.5); 
}

.box img { 
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
    border-radius: 15px; 
    display: block;
    transition: all 0.8s ease;
    user-select: none; 
    pointer-events: none; 
}

/* 
   悬停/点击状态 
   恢复原本逻辑：hover 时变大、变正、置顶
*/
.box:hover, .box:active { 
    opacity: 1; 
    z-index: 200; 
    width: 300px; /* 原本的宽度变化 */
    transition: all 0.5s ease; 
    transform: scale(1.1) rotateY(0deg); /* 必须重置旋转，否则是歪的 */
    box-shadow: 0 15px 35px rgba(0,0,0,0.3); 
}

/* 
   反向滚动行的倾斜方向 
   ⚠️ 恢复原本设计 
*/
.boxes-backward .box { 
    transform: perspective(100px) rotateY(15deg); 
}
.boxes-backward .box:hover, .boxes-backward .box:active { 
    transform: scale(1.1) rotateY(0deg); 
}

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
    font-size: clamp(2rem, 5vw, 3.5rem);
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
   5. 手机适配 (恢复你原来的参数)
   ======================================================== */
@media (max-width: 768px) {
    .scroll-wrapper { height: 160px; margin-top: 10px; }
    .boxes { gap: 10px; }
    .box { width: 120px; height: 120px; } /* 恢复原本大小 */
    
    /* 手机上 hover 的效果 */
    .box:hover, .box:active { 
        width: 200px; 
        transform: scale(1.05) rotateY(0); 
    }
    .boxes-backward .box:hover, .boxes-backward .box:active { 
        transform: scale(1.05) rotateY(0); 
    }
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
