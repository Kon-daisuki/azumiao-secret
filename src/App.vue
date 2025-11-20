<script setup>
import { computed } from 'vue';

// ========================================================
// ⚠️ 只改了这里：让它自动去读你上传的 1.jpg 到 15.jpg
// ========================================================
const photo_filenames = [];
const total_photos = 15; // 你一共有 15 张图

for (let i = 1; i <= total_photos; i++) {
    // 生成 "1.jpg", "2.jpg" ...
    photo_filenames.push(`${i}.jpg`);
}

// 自动加上 /images/ 前缀
// 最终结果是: ["/images/1.jpg", "/images/2.jpg", ...]
const photo_list = photo_filenames.map(name => `${import.meta.env.BASE_URL}images/${name}`);

const duplicated_photo_list = computed(() => {
    return [...photo_list, ...photo_list];
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
   👇 这里是你要求的样式，完全原样保留，一个字没改
   ======================================================== */
.bg { 
    position: relative; 
    width: 100%; 
    height: 100%; 
    background-color: #FFF; 
    z-index: 0; 
    background: linear-gradient(-45deg, #ff7d996e, #ffc766, #5cb6ff, #ff6363); 
    background-size: 300% 300%; 
    animation: gradient 15s ease infinite; 
    display: flex; 
    justify-content: center; 
    align-items: center; 
}

.container { width: 100%; }
@keyframes gradient { 0% { background-position: 0% 0%; } 50% { background-position: 100% 100%; } 100% { background-position: 0% 0%; } }
.scroll-container { position: relative; margin-top: 20px; width: 100vw; height: 250px; }
.boxes { 
    position: absolute; 
    display: flex; 
    height: 100%; 
    animation: scroll linear infinite; 
    animation-duration: 50s; 
    gap: 20px ; 
    margin-top: 60px; 
    padding-left: 0; 
    padding-top: 20px;
    padding-bottom: 20px;
}
.boxes-forward { animation-name: scrollForward; }
.boxes-backward { animation-name: scrollBackward; }
@keyframes scrollForward { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
@keyframes scrollBackward { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
.box { list-style: none; position: relative; width: 200px; height: 200px; flex-shrink: 0; margin-right: 5px; border: none; border-radius: 15px; transition: all 0.5s ease; box-shadow: 0 0px 5px rgba(0, 0, 0, 0.5); opacity: 0.8; transform: perspective(100px) rotateY(-15deg); }
.box img { width: 100%; height: 100%; object-fit: cover; object-position: center; border-radius: 15px; transition: all 0.8s ease; }
.box:hover { opacity: 1; z-index: 1; width: 300px; transition: all 0.5s ease; transform: scale(1.1); }

.boxes:hover { animation-play-state: paused; }

.boxes-backward .box { transform: perspective(100px) rotateY(15deg); }
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
    .box:hover { width: 200px; transform: scale(1.05) rotateY(0); }
    .boxes-backward .box:hover { transform: scale(1.05) rotateY(0); }
}

/* --- 电脑端样式优化 --- */
@media (min-width: 1025px) {
    .container { width: 33.33vw; min-width: 500px; margin: 0 auto; }
    .scroll-container { width: 100%; }
}
</style>
