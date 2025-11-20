<script setup>
import { computed } from 'vue';

// ========================================================
// 图片逻辑保持不变
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
    <div class="bg">
        <div class="container">
            
            <!-- ========================================================
                 👇 标题部分：已美化
            ======================================================== -->
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
   组件内样式
   ======================================================== */
.bg { 
    position: relative; 
    width: 100%; 
    min-height: 100vh; /* 保证占满全屏高度 */
    background-color: #FFF; 
    z-index: 0; 
    /* 背景颜色保持不变 */
    background: linear-gradient(-45deg, #ff7d996e, #ffc766, #5cb6ff, #ff6363); 
    background-size: 300% 300%; 
    animation: gradient 15s ease infinite; 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    overflow: hidden; /* 防止内容溢出产生滚动条 */
}

.container { 
    width: 100%; 
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

/* --- 👇 标题美化样式 --- */
.title-wrapper {
    text-align: center;
    margin-bottom: 20px; /* 给图片腾出点空间 */
    margin-top: 40px;
    z-index: 10;
    animation: float 3s ease-in-out infinite; /* 让标题轻微浮动，增加活力 */
}

.page-title {
    /* 使用更粗更圆润的字体 */
    font-family: "Avenir Next", "Muli", "Nunito", "Heiti SC", "MicroSoft Yahei", sans-serif;
    font-weight: 900;
    font-size: 2.8rem;
    color: #ffffff;
    letter-spacing: 2px;
    margin: 0;
    
    /* ✨ 关键美化：文字阴影，营造层次感 ✨ */
    text-shadow: 
        2px 2px 0px rgba(255, 154, 158, 0.8), /* 粉色投影 */
        4px 4px 0px rgba(250, 208, 196, 0.8), /* 浅橙色投影 */
        0px 10px 20px rgba(0, 0, 0, 0.15);    /* 柔和的黑色弥散阴影 */
}

.subtitle {
    font-family: "Verdana", sans-serif;
    font-size: 0.9rem;
    color: #fff;
    margin-top: 5px;
    opacity: 0.9;
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    letter-spacing: 1px;
}

/* 简单的上下浮动动画 */
@keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
}

/* 背景动画 */
@keyframes gradient { 0% { background-position: 0% 0%; } 50% { background-position: 100% 100%; } 100% { background-position: 0% 0%; } }

/* 滚动容器 */
.scroll-container { position: relative; margin-top: 10px; width: 100vw; height: 220px; }

/* 滚动轨道 */
.boxes { 
    position: absolute; 
    display: flex; 
    height: 100%; 
    animation: scroll linear infinite; 
    animation-duration: 40s; /* 稍微调快一点点速度 */
    gap: 20px ; 
    margin-top: 40px; 
    padding-left: 0; 
    padding-top: 20px;
    padding-bottom: 20px;
}

.boxes-forward { animation-name: scrollForward; }
.boxes-backward { animation-name: scrollBackward; }

@keyframes scrollForward { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
@keyframes scrollBackward { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }

/* 图片卡片样式 */
.box { 
    list-style: none; 
    position: relative; 
    width: 200px; 
    height: 200px; 
    flex-shrink: 0; 
    margin-right: 5px; 
    border: none; 
    border-radius: 15px; 
    transition: all 0.5s ease; 
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2); /* 加深阴影让图片更立体 */
    opacity: 0.9; 
    transform: perspective(100px) rotateY(-10deg); 
    background: rgba(255, 255, 255, 0.3); /* 给图片加个淡淡的白底背景框 */
    backdrop-filter: blur(5px);
}
.box img { width: 100%; height: 100%; object-fit: cover; object-position: center; border-radius: 15px; transition: all 0.8s ease; }
.box:hover { opacity: 1; z-index: 1; width: 300px; transition: all 0.5s ease; transform: scale(1.1) rotateY(0); box-shadow: 0 15px 30px rgba(0,0,0,0.3); }

.boxes:hover { animation-play-state: paused; }

.boxes-backward .box { transform: perspective(100px) rotateY(10deg); }
.boxes-backward .box:hover { transform: scale(1.1) rotateY(0); }

/* --- 平板样式 --- */
@media (min-width: 769px) and (max-width: 1024px) {
    .scroll-container { height: 200px; margin-top: 15px; }
    .boxes { margin-top: 30px; gap: 15px; }
    .box { width: 160px; height: 160px; }
    .box:hover { width: 240px; }
}

/* --- 手机样式 --- */
@media (max-width: 768px) {
    .container { padding-top: 20px; }
    /* 手机上字体稍微调小一点，但依然要大 */
    .page-title { font-size: 2rem; } 
    .subtitle { font-size: 0.8rem; }
    
    .scroll-container { height: 160px; margin-top: 5px; }
    .boxes { margin-top: 10px; gap: 10px; }
    .box { width: 130px; height: 130px; }
    .box:hover { width: 200px; transform: scale(1.05) rotateY(0); }
    .boxes-backward .box:hover { transform: scale(1.05) rotateY(0); }
}

/* --- 电脑端样式优化 --- */
@media (min-width: 1025px) {
    .container { width: 100%; margin: 0 auto; }
    .scroll-container { width: 100%; }
}
</style>

<!-- ========================================================
     ⚠️ 关键修改：全局样式（去除白边）
     注意：这里没有 scoped，这是为了覆盖 body 默认的 margin
======================================================== -->
<style>
body, html {
    margin: 0 !important;
    padding: 0 !important;
    width: 100%;
    height: 100%;
    overflow-x: hidden; /* 只需要防止横向滚动 */
}
#app {
    width: 100%;
    height: 100%;
}
</style>
