<script setup>
import { ref, computed, onMounted } from 'vue';

// ========================================================
// 数据定义
// ========================================================
const total_photos = 15; 
const raw_photo_urls = []; 
const cached_photo_urls = ref([]); 
const isLoading = ref(true); 
const loadProgress = ref(0); 

// 生成原始路径
for (let i = 1; i <= total_photos; i++) {
    raw_photo_urls.push(`${import.meta.env.BASE_URL}images/${i}.jpg`);
}

// ========================================================
// 缓存逻辑 (Cache API) - 保持不变，保证流畅度
// ========================================================
const CACHE_NAME = 'azumiao-base-v1'; 

onMounted(async () => {
    try {
        const cache = await caches.open(CACHE_NAME);
        const promises = raw_photo_urls.map(async (url) => {
            try {
                let response = await cache.match(url);
                if (!response) {
                    response = await fetch(url);
                    if (response.ok) {
                        await cache.put(url, response.clone());
                    }
                }
                const blob = await response.blob();
                const objectUrl = URL.createObjectURL(blob);
                
                // 更新进度
                loadProgress.value = Math.floor((++loadProgress.value / total_photos) * 100); // 简单估算
                return objectUrl;
            } catch (err) {
                console.error(`加载失败: ${url}`, err);
                return url;
            }
        });

        cached_photo_urls.value = await Promise.all(promises);
        
        setTimeout(() => { isLoading.value = false; }, 500);
    } catch (e) {
        console.error("缓存系统初始化失败", e);
        cached_photo_urls.value = raw_photo_urls;
        isLoading.value = false;
    }
});

const duplicated_photo_list = computed(() => {
    return [...cached_photo_urls.value, ...cached_photo_urls.value];
});
</script>

<template>
    <div class="bg">
        
        <!-- Loading 遮罩 -->
        <transition name="fade">
            <div v-if="isLoading" class="loading-mask">
                <div class="loader">
                    <div class="spinner"></div>
                    <p>秘密基地资源装载中...</p>
                </div>
            </div>
        </transition>

        <div class="container" v-show="!isLoading">
            
            <div class="title-wrapper">
                <h1 class="page-title">阿祖喵的秘密基地</h1>
                <p class="subtitle">✨ Welcome to my secret base ✨</p>
            </div>

            <!-- 
               👇 修复重点：
               这里的 scroll-container 现在会强制撑满 100vw
            -->

            <!-- 第一行 -->
            <div class="scroll-container">
                <ol class="boxes boxes-forward">
                    <li class="box" v-for="(photo, i) in duplicated_photo_list" :key="'f-'+i">
                        <img :src="photo" />
                    </li>
                </ol>
            </div>
            
            <!-- 第二行 -->
            <div class="scroll-container">
                <ol class="boxes boxes-backward">
                    <li class="box" v-for="(photo, i) in duplicated_photo_list" :key="'b-'+i">
                        <img :src="photo" />
                    </li>
                </ol>
            </div>

            <!-- 第三行 -->
            <div class="scroll-container">
                <ol class="boxes boxes-forward">
                    <li class="box" v-for="(photo, i) in duplicated_photo_list" :key="'f2-'+i">
                        <img :src="photo" />
                    </li>
                </ol>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* ========================================================
   1. 布局
   ======================================================== */
.bg { 
    position: relative; 
    width: 100%; 
    min-height: 100dvh; 
    display: block; 
    padding-top: 1px; 
    padding-bottom: 50px; 
    overflow-x: hidden; /* 仅在最外层防止横向滚动条 */
}

.container { 
    width: 100%; 
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: fadeInPage 1s ease-out;
}
@keyframes fadeInPage { from { opacity: 0; } to { opacity: 1; } }

/* ========================================================
   2. 🚀 关键修复：滚动容器强制全屏
   ======================================================== */
.scroll-container { 
    position: relative; 
    margin-top: 15px; 
    height: 220px; 
    
    /* 👇 核心修复代码：强制宽度为视口宽度 (100vw) */
    width: 100vw; 
    
    /* 👇 核心修复代码：无论父容器怎么缩进，我都强制居中并占满屏幕 */
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    
    /* 允许内容在容器内也是全宽 */
    max-width: 100vw;
    
    /* 这里保留 overflow: hidden 是为了不出现横向滚动条，但宽度已经是全屏了 */
    overflow: hidden; 
}

.boxes { 
    position: absolute; 
    display: flex; 
    height: 100%; 
    animation: scroll linear infinite; 
    animation-duration: 40s; 
    gap: 20px; 
    padding-left: 0; 
    align-items: center;
    
    /* 确保内容足够宽，不会因为宽度不够而“撞墙” */
    min-width: 100%; 
    
    will-change: transform;
}

/* ========================================================
   3. 样式细节 (保持之前的优化)
   ======================================================== */
.title-wrapper {
    text-align: center;
    margin-top: 60px; 
    margin-bottom: 30px;
    z-index: 10;
    padding: 0 15px;
    animation: float 3s ease-in-out infinite;
}

.page-title {
    font-family: "Avenir Next", "Muli", sans-serif;
    font-weight: 900;
    font-size: 2.8rem;
    color: #ffffff;
    text-shadow: 2px 2px 0px rgba(255, 154, 158, 0.8), 4px 4px 0px rgba(250, 208, 196, 0.8), 0px 5px 15px rgba(0, 0, 0, 0.15);
}

.subtitle {
    font-family: "Verdana", sans-serif;
    font-size: 0.9rem;
    color: #fff;
    margin-top: 8px;
    font-weight: bold;
    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
}

.boxes-forward { animation-name: scrollForward; }
.boxes-backward { animation-name: scrollBackward; }

@keyframes scrollForward { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
@keyframes scrollBackward { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }

.box { 
    list-style: none; 
    position: relative; 
    width: 200px; 
    height: 200px; 
    flex-shrink: 0; 
    border-radius: 15px; 
    transition: all 0.5s ease; 
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15); 
    transform: perspective(100px) rotateY(-8deg); 
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(4px);
    overflow: hidden; 
    backface-visibility: hidden;
    transform-style: preserve-3d; 
}

.box img { width: 100%; height: 100%; object-fit: cover; display: block; }
.box:hover { z-index: 100; width: 280px; transform: scale(1.1) rotateY(0); box-shadow: 0 15px 30px rgba(0,0,0,0.3); }

.boxes-backward .box { transform: perspective(100px) rotateY(8deg); }
.boxes-backward .box:hover { transform: scale(1.1) rotateY(0); }

/* Loading 样式 */
.loading-mask {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(20px);
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
}
.loader { text-align: center; color: white; font-family: sans-serif; }
.spinner {
    width: 50px; height: 50px;
    border: 5px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
    margin: 0 auto 20px;
}
@keyframes spin { to { transform: rotate(360deg); } }
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* 手机适配 */
@media (max-width: 768px) {
    .page-title { font-size: 2rem; } 
    .scroll-container { height: 160px; margin-top: 10px; }
    .boxes { gap: 10px; }
    .box { width: 130px; height: 130px; }
    .box:hover { width: 180px; }
}
</style>

<style>
/* 全局强制重置 - 依然保留 */
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 100%; min-height: 100%; overflow-x: hidden; margin: 0 !important; padding: 0 !important; }
body {
    background: linear-gradient(-45deg, #ff7d99, #ffc766, #5cb6ff, #ff6363);
    background-size: 300% 300%;
    animation: globalGradient 15s ease infinite;
    font-family: sans-serif;
}
@keyframes globalGradient { 
    0% { background-position: 0% 0%; } 
    50% { background-position: 100% 100%; } 
    100% { background-position: 0% 0%; } 
}
#app { width: 100%; min-height: 100vh; overflow-x: hidden; }
</style>
