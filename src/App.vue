<script setup>
import { computed } from 'vue';

const photo_filenames = [];
const total_photos = 15; 

for (let i = 1; i <= total_photos; i++) {
    photo_filenames.push(`${i}.jpg`);
}

// 你的图片路径逻辑保持不变
const photo_list = photo_filenames.map(name => `${import.meta.env.BASE_URL}images/${name}`);

// 为了保证无缝滚动流畅，建议多复制一份，这里改为复制 4 组
// 这样在宽屏或者高分辨率手机上滚动时不会出现断层
const duplicated_photo_list = computed(() => {
    return [...photo_list, ...photo_list, ...photo_list, ...photo_list];
});
</script>

<template>
    <div class="bg">
        <div class="container">
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
   修复后的样式
   ======================================================== */

.bg { 
    /* ⚠️ 关键修复：使用 fixed 定位，强行铺满视口，防止背景出现白边 */
    position: fixed; 
    top: 0;
    left: 0;
    width: 100vw; 
    height: 100vh; 
    z-index: 0; 
    /* 防止出现滚动条 */
    overflow: hidden;
    
    background-color: #FFF; 
    background: linear-gradient(-45deg, #ff7d996e, #ffc766, #5cb6ff, #ff6363); 
    background-size: 300% 300%; 
    animation: gradient 15s ease infinite; 
    
    display: flex; 
    justify-content: center; 
    align-items: center; 
}

.container { 
    width: 100%; 
    /* 确保内容居中且不会撑破背景 */
    position: relative;
    z-index: 1;
}

@keyframes gradient { 0% { background-position: 0% 0%; } 50% { background-position: 100% 100%; } 100% { background-position: 0% 0%; } }

.scroll-container { 
    position: relative; 
    margin-top: 20px; 
    width: 100%; 
    height: 250px; 
    /* ⚠️ 隐藏溢出，防止水平滚动条 */
    overflow: hidden; 
}

.boxes { 
    /* ⚠️ 关键修复：让容器宽度自动撑开，防止换行导致的布局崩坏 */
    width: max-content;
    
    display: flex; 
    height: 100%; 
    
    /* 动画保持不变 */
    animation: scroll linear infinite; 
    animation-duration: 50s; 
    gap: 20px; 
    margin-top: 60px; 
    padding-left: 0; 
    padding-top: 20px;
    padding-bottom: 20px;
    
    /* 提升渲染性能 */
    will-change: transform;
}

.boxes-forward { animation-name: scrollForward; }
.boxes-backward { animation-name: scrollBackward; }

/* 动画逻辑：因为我们可能复制了多组图，只需要移动其中一部分即可实现无缝 */
@keyframes scrollForward { 0% { transform: translateX(0); } 100% { transform: translateX(-25%); } }
@keyframes scrollBackward { 0% { transform: translateX(-25%); } 100% { transform: translateX(0); } }

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
    box-shadow: 0 0px 5px rgba(0, 0, 0, 0.5); 
    opacity: 0.8; 
    
    /* ⚠️ 关键修复：perspective 改为 500px。
       原先的 100px 过于极端，导致手机浏览器渲染错误（出现白框或穿模）。
       500px 依然有 3D 效果，但更稳定。 */
    transform: perspective(500px) rotateY(-15deg); 
}

.box img { width: 100%; height: 100%; object-fit: cover; object-position: center; border-radius: 15px; transition: all 0.8s ease; display: block; }
.box:hover { opacity: 1; z-index: 1; width: 300px; transition: all 0.5s ease; transform: scale(1.1); }

.boxes:hover { animation-play-state: paused; }

/* 反向滚动的 3D 角度修复 */
.boxes-backward .box { transform: perspective(500px) rotateY(15deg); }
.boxes-backward .box:hover { transform: scale(1.1); }

/* --- 平板样式 --- */
@media (min-width: 769px) and (max-width: 1024px) {
    .scroll-container { height: 200px; margin-top: 15px; }
    .boxes { margin-top: 30px; gap: 15px; }
    .box { width: 160px; height: 160px; }
    .box:hover { width: 240px; }
}

/* --- 手机样式 --- */
@media (max-width: 768px) {
    .container { padding-top: 0; }
    .scroll-container { height: 150px; margin-top: 10px; }
    .boxes { margin-top: 15px; gap: 10px; }
    .box { width: 120px; height: 120px; }
    /* 手机上移除 hover 的 rotateY 归零，防止触摸时闪烁 */
    .box:hover { width: 200px; transform: scale(1.05); } 
    .boxes-backward .box:hover { transform: scale(1.05); }
}

/* --- 电脑端样式优化 --- */
@media (min-width: 1025px) {
    .container { width: 33.33vw; min-width: 500px; margin: 0 auto; }
    .scroll-container { width: 100%; }
}
</style>
