import MapControls from 'map/controls'
import MapCity from 'map/city'
import MapWorld from 'map/world'
import { onMounted, watch, ref } from 'vue'
import list from 'map/data'

export default {
  components: {
    MapControls,
    MapWorld,
    MapCity
  },
  setup() {
    const maxScale = 3
    const minScale = 1
    const changeScaleStep = 10
    const changePositionStep = 100
    const actualScale = ref(minScale)
    const scalePercent = ref(0)
    const transformValue = ref(`scale(${minScale}) translate(0,50px)`)
    const translateY = ref(0)
    const translateX = ref(0)
    const initMapPosition = ref({ x: 0, y: 0 })
    const mousePosition = ref({ x: 0, y: 0 })
    const initMousePosition = ref({ x: 0, y: 0 })
    const screen = ref(null)
    const isDrag = ref(false)
    const windowWidth = ref(0)

    const moveHandle = (e) => {
      mousePosition.value = { x: e.clientX, y: e.clientY }
    }

    onMounted(() => {
      windowWidth.value = document.body.clientWidth
    })

    watch(isDrag, (value) => {
      if (value) {
        initMousePosition.value = mousePosition.value
        initMapPosition.value = { x: translateX.value, y: translateY.value }
      } else {

      }
    }, { deep: true })


    watch([mousePosition, isDrag], ([mousePosition, isDrag]) => {
      if (isDrag) {

        const x = initMapPosition.value.x + (mousePosition.x - initMousePosition.value.x)
        const y = initMapPosition.value.y + (mousePosition.y - initMousePosition.value.y)
        changePosition({ x, y })
      }
    }, { deep: true })


    const changeScale = (percent) => {
      scalePercent.value = percent
      const maxDifference = maxScale - minScale
      const result = minScale + maxDifference * percent / 100
      actualScale.value = Math.round(result * 100) / 100
    }

    watch([actualScale, translateY, translateX], ([actualScale, translateY, translateX]) => {
      transformValue.value = `scale(${actualScale}) translate(${translateX}px,${translateY}px)`
    })

    const changePosition = ({ x, y }) => {
      translateY.value = y
      translateX.value = x
    }


    return {
      changeScale,
      changeScaleStep,
      transformValue,
      changePosition,
      changePositionStep,
      translateY,
      translateX,
      moveHandle,
      isDrag,
      actualScale,
      list,
      screen,
      scalePercent,
      windowWidth
    }
  },
  /*html*/
  template: `
      <div class="map__display">
        <MapControls
          :scalePercent="scalePercent"
          :changeScaleStep="changeScaleStep"
          :translateY="translateY"
          :translateX="translateX"
          :changePositionStep="changePositionStep"
          @changeScale="changeScale"
          @changePosition="changePosition"
        />
        <div
          ref="screen"
          class="map__touchscreen"
          @mousedown="isDrag = true"
          @mouseup="isDrag = false"
          @mousemove="moveHandle"
        >
          <div
            :class="{ 'is-touching': isDrag }"
            :style="{ transform: transformValue }"
            class="map__wrapper"
          >
            <MapWorld />
          </div>
          <div class="map__content">
            <MapCity
              v-for="item in list"
              :scalePercent="scalePercent"
              :isDrag="isDrag"
              @focusItem=""
              :screenElement="screen"
              :actualScale="actualScale"
              :translateY="translateY"
              :translateX="translateX"
              :data="item"
            />
          </div>
        </div>
      </div>

    `
}