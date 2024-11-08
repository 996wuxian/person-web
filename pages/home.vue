<template>
  <main class="container">
    <button v-show="!circle" class="animate__animated animate__jackInTheBox" @click="changeCircle">check wuxian's web</button>
    <div v-show="circleVisible" class="circle" :class="circle ? 'circle-active' : ''"></div>
    <div class="block" :class="circle ? 'block-show' : ''">
      <div class="block-content" :class="blockShow ? 'block-transition' : ''">
        <div class="picture">
          <div class="title">pictures</div>
          <div class="picture-container">
            <img src="/assets/img/preview1.jpg" alt="" />
            <img src="/assets/img/preview2.jpg" alt="" />
            <img src="/assets/img/preview3.png" alt="" />
            <img src="/assets/img/preview4.png" alt="" />
          </div>
        </div>

        <div class="block-center bg-d4ddd8">
          <div class="center-title">As you can see, there are mine.</div>
          <div class="center-desc">
            <img src="/assets/img/logo.jpg" alt="" />

            <div class="block-center-content">
              <div>Written self-introduction</div>
              <span>Who am I? You can call me wuxian, is a 24-year-old '切图仔' boy</span>
            </div>
          </div>
          <div class="block-center-bottom">
            Photo from Steam Wallpaper, This is one of my favorite photos that I think can be shown to everyone. I hope everyone likes it.
          </div>
        </div>
        <div class="picture-container b-rd">
          <img src="/assets/img/preview5.png" alt="" />
          <img src="/assets/img/preview7.png" alt="" />
          <img src="/assets/img/preview6.png" alt="" />
          <img src="/assets/img/preview8.png" alt="" />
        </div>
      </div>
    </div>

    <div class="block block-middle" :class="circle ? 'block-show' : ''">
      <div class="block-middle-content" :class="blockShow ? 'block-middle-transition' : ''">
        <div class="picture-one">
          <img src="/assets/img/recording.gif" alt="" />
          <span>Github Address : https://github.com/996wuxian</span>
        </div>
        <div class="project-images bg-3F6371">
          <div class="project-page">
            <div class="project-title">project-image</div>
            <img src="/assets/img/page.png" alt="" />
            <img src="/assets/img/theme.png" :class="showSecondImages ? 'animate__animated animate__fadeIn' : 'display-none'" alt="" />
            <img src="/assets/img/role.png" :class="showThirdImages ? 'animate__animated animate__fadeIn' : 'display-none'" alt="" />
          </div>
        </div>
        <div class="block-gif">
          <img src="/assets/img/recording1.gif" alt="" />
        </div>
      </div>
    </div>

    <div class="block block-right" :class="circle ? 'block-show' : ''">
      <div class="block-content" :class="blockShow ? 'block-transition' : ''">
        <div class="music-container">
          <div class="music-top-title">Music</div>
          <img src="/assets/img/zj.webp" alt="" />
          <div class="music-content">
            <div class="music-title">
              {{ currentSong.name }}
              <span>草东没有派对</span>
            </div>
            <div class="music-controller">
              <div class="music-controller-top">
                <img v-if="!isLoop" src="/assets/img/dq.png" alt="循环" @click="toggleLoop" />
                <img v-else src="/assets/img/no-loop.png" alt="不循环" @click="toggleLoop" />
                <div class="controller-img">
                  <img src="/assets/img/zqh.png" alt="上一曲" @click="playPrevious" />
                  <img v-if="!isPlaying" src="@/assets/img/bofang.png" alt="播放/暂停" @click="togglePlay" />
                  <img v-else src="@/assets/img/zt.png" alt="播放/暂停" @click="togglePlay" />
                  <img src="/assets/img/yqh.png" alt="下一曲" @click="playNext" />
                </div>
                <div class="volume-control">
                  <img src="/assets/img/sy.png" alt="音量" @click="toggleVolumeControl" />
                  <input v-show="showVolumeControl" type="range" min="0" max="1" step="0.1" v-model="volume" class="volume-slider" />
                </div>
              </div>
              <div class="music-time">
                <span>{{ formatTime(currentTime) }}</span>
                <div class="progress-bar" @click="seek">
                  <div class="progress" :style="{ width: progress + '%' }"></div>
                </div>
                <span>{{ formatTime(duration) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="music-center">
          <div v-if="currentSong.text && Object.keys(currentSong.text).length > 0" class="lyrics-container">
            <div
              v-for="(line, index) in currentSong.text"
              :key="index"
              :class="{
                'lyric-line': true,
                'music-active': index === activeLyricIndex
              }"
            >
              {{ line?.text }}
            </div>
          </div>
          <div v-else class="instrumental-text">此歌曲为没有填词的纯音乐，请您欣赏</div>
        </div>
        <div class="other-music"></div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { lyrics } from '@/dictionary/lyric'

const circle = ref(false)
const circleVisible = ref(true)
const blockShow = ref(false)
const showSecondImages = ref(false)
const showThirdImages = ref(false)
const changeCircle = () => {
  if (audioElement.value) {
    audioElement.value.play()
    isPlaying.value = true
  }
  circle.value = true
  blockShow.value = true
  setTimeout(() => {
    circleVisible.value = false
  }, 3000)

  setTimeout(() => {
    showSecondImages.value = true
  }, 12 * 1000)

  setTimeout(() => {
    showThirdImages.value = true
  }, 14 * 1000)
}

const audioElement = ref<HTMLAudioElement | null>(null)
const currentSongIndex = ref(0)
const isPlaying = ref(false)
const currentTime = ref(0) // 歌曲正在播放的时间
const duration = ref(0) // 歌曲总时长
const volume = ref(1) // 音量
const isLoop = ref(false)
const showVolumeControl = ref(false)
const activeLyricIndex = ref(-1)
const timeMappings = ref<{ time: number; index: number }[]>([])

const audioList = [
  // {
  //   name: 'Intro',
  //   url: 'https://publish-assets.oss-cn-beijing.aliyuncs.com/01%20Intro.wav',
  //   text: ''
  // },
  // {
  //   name: '丑',
  //   url: 'https://publish-assets.oss-cn-beijing.aliyuncs.com/02%20%E9%86%9C.wav',
  //   text: lyrics.chou
  // },
  // {
  //   name: '烂泥',
  //   url: 'https://publish-assets.oss-cn-beijing.aliyuncs.com/03%20%E7%88%9B%E6%B3%A5.wav',
  //   text: lyrics.ln
  // },
  // {
  //   name: '勇敢的人',
  //   url: 'https://publish-assets.oss-cn-beijing.aliyuncs.com/04%20%E5%8B%87%E6%95%A2%E7%9A%84%E4%BA%BA.wav',
  //   text: lyrics.ygdr
  // },
  // {
  //   name: '大风吹',
  //   url: 'https://publish-assets.oss-cn-beijing.aliyuncs.com/05%20%E5%A4%A7%E9%A2%A8%E5%90%B9.wav',
  //   text: lyrics.dfc
  // },
  // {
  //   name: '埃玛',
  //   url: 'https://publish-assets.oss-cn-beijing.aliyuncs.com/06%20%E8%89%BE%E7%91%AA.wav',
  //   text: lyrics.am
  // },
  // {
  //   name: '等',
  //   url: 'https://publish-assets.oss-cn-beijing.aliyuncs.com/07%20%E7%AD%89.wav',
  //   text: lyrics.deng
  // },
  // {
  //   name: '鬼',
  //   url: 'https://publish-assets.oss-cn-beijing.aliyuncs.com/08%20%E9%AC%BC.wav',
  //   text: lyrics.gui
  // },
  // {
  //   name: '在',
  //   url: 'https://publish-assets.oss-cn-beijing.aliyuncs.com/09%20%E5%9C%A8.wav',
  //   text: lyrics.zai
  // },
  {
    name: '山海',
    url: 'https://publish-assets.oss-cn-beijing.aliyuncs.com/10%20%E5%B1%B1%E6%B5%B7.wav',
    text: lyrics.sh
  },
  {
    name: '我们',
    url: 'https://publish-assets.oss-cn-beijing.aliyuncs.com/11%20%E6%88%91%E5%80%91.wav',
    text: lyrics.wm
  },
  {
    name: '情歌',
    url: 'https://publish-assets.oss-cn-beijing.aliyuncs.com/12%20%E6%83%85%E6%AD%8C.wav',
    text: lyrics.qg
  }
]

// 当前的歌曲
const currentSong = computed(() => audioList[currentSongIndex.value])

// 单曲循环
const toggleLoop = () => {
  if (!audioElement.value) return

  isLoop.value = !isLoop.value
  audioElement.value.loop = isLoop.value
}

// 播放/暂停
const togglePlay = () => {
  if (!audioElement.value) return

  if (isPlaying.value) {
    audioElement.value.pause()
  } else {
    audioElement.value.play()
  }
  isPlaying.value = !isPlaying.value
}

// 下一首
const playNext = () => {
  currentSongIndex.value = (currentSongIndex.value + 1) % audioList.length
  loadAndPlaySong()
}
// 上一首
const playPrevious = () => {
  currentSongIndex.value = (currentSongIndex.value - 1 + audioList.length) % audioList.length
  loadAndPlaySong()
}

const loadAndPlaySong = () => {
  if (!audioElement.value) return

  audioElement.value.src = currentSong.value.url
  audioElement.value.load()

  activeLyricIndex.value = 0

  if (isPlaying.value) {
    audioElement.value.play().catch(error => {
      console.error('Error playing audio:', error)
    })
  }
  currentTime.value = 0
}

// 音量显隐
const toggleVolumeControl = () => {
  showVolumeControl.value = !showVolumeControl.value
}

// 获取当前歌曲播放时间
const updateTime = () => {
  if (audioElement.value) {
    currentTime.value = audioElement.value.currentTime
  }
}

// 进度条
const progress = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

// 点击进度条跳转到指定时间
const seek = (event: MouseEvent) => {
  if (!audioElement.value) return

  const progressBar = event.currentTarget as HTMLElement
  const rect = progressBar.getBoundingClientRect() // 其提供了元素的大小及其相对于视口的位置。
  const ratio = (event.clientX - rect.left) / rect.width
  const newTime = ratio * duration.value

  audioElement.value.currentTime = newTime
  currentTime.value = newTime
}

// 格式化时间显示
const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// 歌曲播放完毕后的触发的方法，循环和不循环
const handleEnded = () => {
  if (isLoop.value) {
    if (audioElement.value) {
      audioElement.value.currentTime = 0
      audioElement.value.play()
    }
  } else {
    playNext()
    if (audioElement.value && isPlaying.value) {
      audioElement.value.play()
    }
  }
}

// 监听音量变化赋值
watch(volume, newValue => {
  if (audioElement.value) {
    audioElement.value.volume = newValue
  }
})

// 监听歌曲变化
watch(
  () => currentSong.value,
  () => {
    // 重置当前时间
    currentTime.value = 0
    // 如果有音频元素，也重置它的时间
    if (audioElement.value) {
      audioElement.value.currentTime = 0
      timeMappings.value = currentSong.value.text.map((line, index) => ({
        time: parseTime(line.time),
        index
      }))
    }
  },
  { deep: true }
)

// 监听时间变化变化
watch(currentTime, newTime => {
  // 如果已到最后一行，直接返回
  if (activeLyricIndex.value >= timeMappings.value.length - 1) return

  // 获取下一行的时间
  const nextLine = timeMappings.value[activeLyricIndex.value + 1]

  // 如果当前时间大于等于下一行的时间，更新高亮行
  if (newTime >= nextLine.time) {
    activeLyricIndex.value++
  } else if (activeLyricIndex.value > 0) {
    // 如果时间倒退，则回到上一行
    const prevLine = timeMappings.value[activeLyricIndex.value - 1]
    if (newTime < prevLine.time) {
      activeLyricIndex.value--
    }
  }
})

// 时间格式化函数
function parseTime(time: string): number {
  const [minutes, seconds] = time.split(':').map(Number)
  return minutes * 60 + seconds
}

onMounted(() => {
  audioElement.value = new Audio()
  audioElement.value.src = currentSong.value.url

  // 监听audio时间变化
  audioElement.value.addEventListener('timeupdate', updateTime)
  // 监听歌曲加载完成，获取其总时长
  audioElement.value.addEventListener('loadedmetadata', () => {
    duration.value = audioElement.value?.duration || 0
  })
  // 监听歌曲播放完毕
  audioElement.value.addEventListener('ended', handleEnded)

  // 初始化时间索引映射
  timeMappings.value = currentSong.value.text.map((line, index) => ({
    time: parseTime(line.time),
    index
  }))
})

onUnmounted(() => {
  if (audioElement.value) {
    audioElement.value.removeEventListener('timeupdate', updateTime)
    audioElement.value.removeEventListener('ended', handleEnded)
  }
})
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  min-width: 900px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e8e8e8;
  overflow: hidden;
  position: relative;
}

button {
  color: #666;
  padding: 0.7em 1.7em;
  font-size: 18px;
  border-radius: 0.5em;
  background: #e8e8e8;
  cursor: pointer;
  border: 1px solid #e8e8e8;
  transition: all 0.3s;
  box-shadow:
    6px 6px 12px #c5c5c5,
    -6px -6px 12px #ffffff;
  position: absolute;
  z-index: 999;
}

button:active {
  color: #666;
  box-shadow:
    inset 4px 4px 12px #c5c5c5,
    inset -4px -4px 12px #ffffff;
}

.circle {
  width: 0;
  height: 0;
  background-color: #fff;
  border-radius: 50%;
  transition: all 4s;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.circle-active {
  width: 2000px;
  height: 2000px;
  transition: all 4s;
  background-color: #e8e8e8;
}

.block {
  width: 30%;
  height: 100%;
  position: absolute;
  left: 4%;
  top: 0;
  transform: skewX(-2deg);
  opacity: 0; // 初始设置透明度为0
  transition: all 5s; // 添加透明度过渡效果
  transition-delay: 1s; // 延迟1秒开始显示
}

.block-middle {
  left: 36%;
}

.block-right {
  left: 68%;
}

.block-show {
  opacity: 1; // 显示时的透明度
  transform: skewX(-5deg);
  transition: all 5s; // 添加透明度过渡效果
}

.block-content {
  position: absolute;
  top: 50%;
  transition: all 10s;
}

.block-middle-content {
  position: absolute;
  bottom: 50%;
  transition: all 10s;
}

.block-transition {
  top: -20%;
  transition: all 10s;
}

.block-middle-transition {
  bottom: -10%;
  transition: all 10s;
}

.picture {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 700;
  background-color: #d5dbdf;
  font-size: 20px;
  border-radius: 10px;
  color: #666;

  .title {
    margin-bottom: 20px;
  }
}

.picture-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  height: 350px;
  overflow: hidden;
  background-color: #d5dbdf;
  border-radius: 0 0 10px 10px;

  img {
    width: calc(100% / 2 - 10px);
    border-radius: 8px;
  }
}

.block-center {
  margin: 20px 0;
  border-radius: 10px;
  padding: 20px;
  color: rgb(102, 102, 102);
}

.bg-d4ddd8 {
  background-color: #d4ddd8;
}

.center-title {
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 20px;
}

.center-desc {
  display: flex;
  justify-content: space-between;
  align-items: center;

  img {
    width: 40%;
    height: 40%;
    border-radius: 50%;
    transform: skewX(5deg);
    box-shadow:
      0px 0px 12px #c5c5c5,
      0px 0px 12px #ffffff;

    animation: rotate 20s linear infinite;
  }
}

.block-center-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  margin-left: 10px;

  div {
    padding-bottom: 5px;
    border-bottom: 1px solid #666;
    margin-bottom: 10px;
  }

  span {
    line-height: 25px;
  }
}

.block-center-bottom {
  margin-top: 20px;
  text-indent: 2em;
  line-height: 20px;
}

.b-rd {
  border-radius: 10px 10px;
}

.picture-one {
  background-color: #d5dbdf;
  border-radius: 10px;
  padding: 20px;
  img {
    width: 100%;
    border-radius: 10px;
    margin-bottom: 10px;
  }
  span {
    color: #666;
  }
}

.bg-3F6371 {
  background-color: #3f6371;
}

.project-images {
  padding: 20px;
  margin: 20px 0;
  border-radius: 10px;
}

.project-page {
  height: 340px;
  min-height: 300px;
  .project-title {
    color: #fff;
    font-size: 20px;
    text-align: center;
    margin-bottom: 20px;
  }
  img {
    width: calc(100% - 40px);
    height: 300px;
    border-radius: 10px;
    position: absolute;
  }
}

.display-none {
  display: none;
}

.block-gif {
  img {
    width: 100%;
    border-radius: 10px;
  }
}

.music-container {
  background-color: #474747;
  padding: 20px;
  border-radius: 10px;
  img {
    width: 100%;
    border-radius: 10px;
  }
}

.music-top-title {
  text-align: center;
  font-weight: 700;
  color: #666;
  font-size: 20px;
  color: #fff;
  margin-bottom: 20px;
}

.music-content {
  display: flex;
  margin-top: 10px;
  justify-content: space-between;
}

.music-title {
  display: flex;
  flex-direction: column;
  color: #fff;

  span {
    color: #999;
    margin-top: 15px;
  }
}

.music-controller {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 40px;

  &-top {
    display: flex;
    justify-content: space-between;

    img {
      width: 25px;
      height: 25px;
      cursor: pointer;
    }
  }
}

.controller-img {
  display: flex;
  gap: 20px;
}

.volume-control {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: 25px;
    height: 25px;
    cursor: pointer;
  }
}

.volume-slider {
  position: absolute;
  top: -240%;
  left: 50%;
  transform: translateX(-55%) rotate(-95deg);
  transform-origin: bottom;
  width: 100px;
  -webkit-appearance: none;
  background: #d4ddd8;
  border-radius: 5px;
  height: 3px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    background: #474747;
    border-radius: 50%;
    cursor: pointer;
  }
}

.music-time {
  display: flex;
  color: #fff;
  margin-top: 10px;
  align-items: center;
  gap: 15px;

  span {
    font-size: 14px;
  }
}

.progress-bar {
  flex: 1;
  height: 4px;
  background-color: #d4ddd8;
  border-radius: 5px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    height: 5px;
    transition: all 0.3s;
  }
}

.progress {
  position: absolute;
  height: 100%;
  background-color: #3f6371;
  border-radius: 5px;
  transition: width 0.1s linear;
  z-index: 999;
}

.music-center {
  margin-top: 20px;
  background: linear-gradient(90deg, #474747 0%, #2c2c2c 100%);
  color: #fff;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-x: hidden;
}

.lyrics-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 5px;
  }
}

.lyric-line {
  transition: all 0.3s ease;
  color: #999;
  font-size: 16px;
}

.music-active {
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  transform: scale(1.1);
}

.passed-lyric {
  color: #666;
}

.instrumental-text {
  text-align: center;
  color: #999;
  font-size: 16px;
  padding: 20px;
  font-style: italic;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
