<script setup>
import { computed } from 'vue';

// ========================================================
// 图片逻辑 (完全保留)
// ========================================================
const photo_filenames = [];
const total_photos = 15; 

for (let i = 1; i <= total_photos; i++) {
    photo_filenames.push(`${i}.jpg`);
}

const photo_list = photo_filenames.map(name => `${import.meta.env.BASE_URL}images/${name}`);

const duplicated_photo_list = computed(() => {
    return [...photo_list, ...photo_list];
});
</script>

<template>
    <!-- 
      ⚠️ 移除了 .bg 上的 flex 居中，改为内部 padding 控制
      这样内容多的时候自然向下延伸，不会被切掉或留白 
    -->
    <div class="bg">
        <div class="container">
            
            <!-- 标题部分 -->
            <div class="title-wrapper">
                <h1 class="page-title">阿祖喵的秘密基地</h1>
                <p class="subtitle">✨ Welcome to my secret base ✨</p>
            </div>

            <!-- 第一行 -->
            <div class="scroll-container">
                <ol class="boxes boxes-forward">
                    <li class="box" v-for="(photo, i) in duplicated_photo_list" :key="'forward-'+i">
                        <img :src="photo" loading="lazy" />
                    </li>
                </ol>
            </div>
            
            <!-- 第二行 -->
            <div class="scroll-container">
                <ol class="boxes boxes-backward">
                    <li class="box" v-for="(photo, i) in duplicated_photo_list" :key="'backward-'+i">
                        <img :src="photo" loading="lazy" />
                    </li>
                </ol>
            </div>

            <!-- 第三行 -->
            <div class="scroll-container">
                <ol class="boxes boxes-forward">
                    <li class="box" v-for="(photo, i) in duplicated_photo_list" :key="'forward-2-'+i">
                        <img :src="photo" loading="lazy" />
                    </li>
                </ol>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* ========================================================
   组件样式
   ======================================================== */

.bg { 
    position: relative; 
    width: 100%; 
    /* ⚠️ 关键修改：改用 100dvh 适应手机动态地址栏，如果没有内容也至少撑满屏幕 */
    min-height: 100dvh; 
    /* 移除 flex center，避免长内容布局 bug */
    display: block; 
    padding-top: 1px; /* 防止 margin 塌陷 */
    padding-bottom: 50px; /* 底部留点空间 */
    overflow-x: hidden;
}

.container { 
    width: 100%; 
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* --- 标题样式 --- */
.title-wrapper {
    text-align: center;
    margin-top: 60px; /* 顶部距离 */
    margin-bottom: 30px;
    z-index: 10;
    padding: 0 15px;
    animation: float 3s ease-in-out infinite;
}

.page-title {
    font-family: "Avenir Next", "Muli", "Nunito", sans-serif;
    font-weight: 900;
    font-size: 2.8rem;
    color: #ffffff;
    letter-spacing: 2px;
    margin: 0;
    line-height: 1.2;
    /* 文字阴影 */
    text-shadow: 
        2px 2px 0px rgba(255, 154, 158, 0.8), 
        4px 4px 0px rgba(250, 208, 196, 0.8), 
        0px 5px 15px rgba(0, 0, 0, 0.15);
}

.subtitle {
    font-family: "Verdana", sans-serif;
    font-size: 0.9rem;
    color: #fff;
    margin-top: 8px;
    opacity: 0.95;
    font-weight: bold;
    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
    letter-spacing: 1px;
}

@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
}

/* --- 滚动容器修复 --- */
.scroll-container { 
    position: relative; 
    margin-top: 15px; 
    /* ⚠️ 关键修改：原来是 100vw，改为 100% 防止把屏幕撑宽 */
    width: 100%; 
    height: 220px; 
    overflow: hidden; /* 确保图片不溢出容器 */
}

.boxes { 
    position: absolute; 
    display: flex; 
    height: 100%; 
    /* 动画逻辑 */
    animation: scroll linear infinite; 
    animation-duration: 40s; 
    gap: 20px; 
    padding-left: 0; 
    align-items: center; /* 垂直居中图片 */
}

.boxes-forward { animation-name: scrollForward; }
.boxes-backward { animation-name: scrollBackward; }

/* 滚动动画：确保无缝衔接 */
@keyframes scrollForward { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
@keyframes scrollBackward { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }

/* 图片卡片 */
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
    overflow: hidden; /* 修复图片圆角溢出 */
}
.box img { width: 100%; height: 100%; object-fit: cover; border-radius: 15px; }
.box:hover { z-index: 10; width: 280px; transform: scale(1.1) rotateY(0); box-shadow: 0 15px 30px rgba(0,0,0,0.25); }

.boxes-backward .box { transform: perspective(100px) rotateY(8deg); }
.boxes-backward .box:hover { transform: scale(1.1) rotateY(0); }

/* --- 手机适配 --- */
@media (max-width: 768px) {
    .page-title { font-size: 2rem; } 
    .scroll-container { height: 160px; margin-top: 10px; }
    .boxes { gap: 10px; }
    .box { width: 130px; height: 130px; }
    .box:hover { width: 180px; }
}
</style>

<!-- ========================================================
     ⚠️ 关键修改：全局强制样式 (Global Reset)
     把背景色移到 body 上，彻底解决白边问题
======================================================== -->
<style>
/* 1. 重置所有盒模型，防止 padding 撑破宽度 */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

/* 2. 设置 html/body 为 100% 并禁止横向滚动 */
html, body {
    width: 100%;
    min-height: 100%;
    overflow-x: hidden; /* 禁止左右滑动 */
    margin: 0 !important;
    padding: 0 !important;
}

/* 3. ⚠️ 把渐变背景加在 Body 上！这样就算内容不满，也是彩色的 */
body {
    background: linear-gradient(-45deg, #ff7d99, #ffc766, #5cb6ff, #ff6363);
    background-size: 300% 300%;
    animation: globalGradient 15s ease infinite;
    font-family: sans-serif;
}

/* 定义全局背景动画 */
@keyframes globalGradient { 
    0% { background-position: 0% 0%; } 
    50% { background-position: 100% 100%; } 
    100% { background-position: 0% 0%; } 
}

/* 4. 确保 Vue 根节点也占满 */
#app {
    width: 100%;
    min-height: 100vh;
    overflow-x: hidden;
}
</style>
