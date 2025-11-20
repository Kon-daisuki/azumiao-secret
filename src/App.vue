<script setup>
import { computed, ref } from 'vue';

const photo_filenames = [];
const total_photos = 15; 

for (let i = 1; i <= total_photos; i++) {
    photo_filenames.push(`${i}.jpg`);
}

const photo_list = photo_filenames.map(name => `${import.meta.env.BASE_URL}images/${name}`);
const duplicated_photo_list = computed(() => [...photo_list, ...photo_list, ...photo_list, ...photo_list]);

// ==========================================
// 👇 只加了这个 JS 逻辑来修复手机点击没反应的问题
// ==========================================
const activeIndex = ref(null);

function toggleExpand(id) {
    // 如果点击的是同一个，就关闭；否则就打开新的
    activeIndex.value = (activeIndex.value === id) ? null : id;
}
</script>

<template>
    <!-- 点击背景关闭放大 -->
    <div class="bg" @click.self="activeIndex = null">
        <div class="container">
            <!-- 第一行 -->
            <div class="scroll-container">
                <!-- 这里的 class="paused" 是为了点击时停止滚动，方便看图 -->
                <ol class="boxes boxes-forward" :class="{ paused: activeIndex !== null }">
                    <li class="box" 
                        v-for="(photo, i) in duplicated_photo_list" 
                        :key="'f-'+i"
                        :class="{ active: activeIndex === 'f-'+i }"
                        @click="toggleExpand('f-'+i)">
                        <img :src="photo" loading="lazy" />
                    </li>
                </ol>
            </div>
            
            <!-- 第二行 -->
            <div class="scroll-container">
                <ol class="boxes boxes-backward" :class="{ paused: activeIndex !== null }">
                    <li class="box" 
                        v-for="(photo, i) in duplicated_photo_list" 
                        :key="'b-'+i"
                        :class="{ active: activeIndex === 'b-'+i }"
                        @click="toggleExpand('b-'+i)">
                        <img :src="photo" loading="lazy" />
                    </li>
                </ol>
            </div>

            <!-- 第三行 -->
            <div class="scroll-container">
                <ol class="boxes boxes-forward" :class="{ paused: activeIndex !== null }">
                    <li class="box" 
                        v-for="(photo, i) in duplicated_photo_list" 
                        :key="'f2-'+i"
                        :class="{ active: activeIndex === 'f2-'+i }"
                        @click="toggleExpand('f2-'+i)">
                        <img :src="photo" loading="lazy" />
                    </li>
                </ol>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* ========================================================
   修复 1：背景露白问题
   改用 fixed 强行铺满屏幕
   ======================================================== */
.bg { 
    position: fixed; /* 改为 fixed */
    top: 0; left: 0; /* 铺满 */
    width: 100vw; 
    height: 100vh; 
    background-color: #FFF; 
    z-index: 0; 
    background: linear-gradient(-45deg, #ff7d996e, #ffc766, #5cb6ff, #ff6363); 
    background-size: 300% 300%; 
    animation: gradient 15s ease infinite; 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    overflow: hidden; /* 只有这里改了，防止滚动条 */
}

.container { width: 100%; position: relative; z-index: 1; }
@keyframes gradient { 0% { background-position: 0% 0%; } 50% { background-position: 100% 100%; } 100% { background-position: 0% 0%; } }

.scroll-container { position: relative; margin-top: 20px; width: 100%; height: 250px; }

/* ========================================================
   修复 2：布局错乱问题
   width: max-content 确保图片排成一行，不换行
   ======================================================== */
.boxes { 
    position: absolute; 
    display: flex; 
    height: 100%; 
    width: max-content; /* 关键修复：防止换行 */
    animation: scroll linear infinite; 
    animation-duration: 50s; 
    gap: 20px; 
    margin-top: 60px; 
    padding-left: 0; 
    padding-top: 20px;
    padding-bottom: 20px;
    will-change: transform; /* 优化性能 */
}

/* 点击时暂停动画 */
.boxes.paused { animation-play-state: paused; }

.boxes-forward { animation-name: scrollForward; }
.boxes-backward { animation-name: scrollBackward; }

@keyframes scrollForward { 0% { transform: translateX(0); } 100% { transform: translateX(-25%); } }
@keyframes scrollBackward { 0% { transform: translateX(-25%); } 100% { transform: translateX(0); } }

/* ========================================================
   修复 3：图片变成白块问题 & 保持倾斜
   原先 perspective(100px) 太小导致 BUG，改为 300px (稍微大一点点，但仍然保持强烈倾斜)
   ======================================================== */
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
    /* ⚠️ 修复点：这里原来是 100px，改成 300px 就能修好白块问题，同时保留倾斜 */
    transform: perspective(300px) rotateY(-15deg); 
}

.box img { width: 100%; height: 100%; object-fit: cover; object-position: center; border-radius: 15px; transition: all 0.8s ease; pointer-events: none; }

/* 电脑端 Hover (保留原样) */
.box:hover { opacity: 1; z-index: 1; width: 300px; transition: all 0.5s ease; transform: scale(1.1); }

/* 反向列的倾斜 (保留原样，同样调整透视) */
.boxes-backward .box { transform: perspective(300px) rotateY(15deg); }
.boxes-backward .box:hover { transform: scale(1.1); }

/* ========================================================
   修复 4：手机点击放大 (新增 .active 状态)
   模拟你原来想要的“放大效果”
   ======================================================== */
.box.active {
    opacity: 1 !important;
    z-index: 100 !important;
    width: 300px !important; /* 强制变宽 */
    /* 保持放大，这里我去掉了 rotateY(0)，如果你想放大时也倾斜，就保留原样 */
    /* 但根据你原本的 mobile 代码，你似乎希望放大时看清楚（rotateY(0)）*/
    transform: scale(1.1) !important; 
    box-shadow: 0 20px 50px rgba(0,0,0,0.6);
}

/* --- 手机样式适配 (保留你的代码逻辑) --- */
@media (max-width: 768px) {
    .container { padding-top: 0; }
    .scroll-container { height: 150px; margin-top: 10px; }
    .boxes { margin-top: 15px; gap: 10px; }
    .box { width: 120px; height: 120px; }

    /* 手机上被点击激活时的样式 */
    .box.active {
        width: 220px !important;
        transform: scale(1.1) rotateY(0deg) !important; /* 放大时回正，方便看图 */
    }
}

/* --- 电脑端样式优化 --- */
@media (min-width: 1025px) {
    .container { width: 33.33vw; min-width: 500px; margin: 0 auto; }
    .scroll-container { width: 100%; }
}
</style>
