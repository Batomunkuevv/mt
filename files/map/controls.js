
import { ref, watch, onMounted } from 'vue'
export default {
    emits: ['changeScale', 'changePosition'],
    props: ['changeScaleStep', 'changePositionStep', 'translateY', 'translateX', 'scalePercent'],
    setup(props, ctx) {
        const isDrag = ref(false)
        const mouseY = ref(0)
        const startMouseY = ref(0)
        const lastMouseY = ref(0)
        const lineHeight = ref(0)
        const translateY = ref('translateY(0px)')
        const line = ref(null)
        const scalePercent = ref(0)
        const handleY = ref(0)
        const startHandleY = ref(0)

        const handle = ref(null)
        onMounted(() => {
            lineHeight.value = line.value.getBoundingClientRect().height
            // console.log(line.value.getBoundingClientRect().height)
        })

        const move = (y) => {
            if (y > 0 || y < -lineHeight.value) return
            handleY.value = y
            translateY.value = `translateY(${y}px)`
            scalePercent.value = Math.abs(100 * y / lineHeight.value)
        }

        const drag = (e) => {
            mouseY.value = e.clientY
        }

        const startMouseY2 = ref(0)

        watch(isDrag, (isDrag) => {
            if (isDrag) {
                startMouseY.value = mouseY.value
            }

        }, { once: true })

        watch(isDrag, (isDrag) => {
            if (isDrag) {
                startMouseY2.value = mouseY.value
                startHandleY.value = handleY.value
            }
        })

        watch([mouseY, isDrag], ([mouseY, isDrag]) => {
            if (isDrag) {
                // console.log(  Math.round(mouseY - startMouseY2.value + startHandleY.value)   , -((startMouseY.value) - mouseY))
                move(Math.round(mouseY - startMouseY2.value + startHandleY.value))
            }
        })

        watch(scalePercent, (value) => {
            ctx.emit('changeScale', value)
            const y = -value / 100 * lineHeight.value
            move(y)
        })


        watch(() => props.scalePercent, (value) => {
            const y = -value / 100 * lineHeight.value
            move(y)
        })

        const encreaseScale = () => {
            const result = scalePercent.value + props.changeScaleStep
            scalePercent.value = result > 100 ? 100 : result
        }

        const dicreaseScale = () => {
            const result = scalePercent.value - props.changeScaleStep
            scalePercent.value = result < 0 ? 0 : result
        }

        const changePosition = (direction) => {
            let y = props.translateY
            let x = props.translateX

            if (direction === 'top') {
                y += props.changePositionStep
            } else if (direction === 'right') {
                x -= props.changePositionStep

            } else if (direction === 'bottom') {
                y -= props.changePositionStep

            } else if (direction === 'left') {
                x += props.changePositionStep

            } else if (direction === 'center') {
                x = 0
                y = 0
            }

            ctx.emit('changePosition', { x, y })

        }

        return {
            isDrag,
            drag,
            translateY,
            line,
            encreaseScale,
            dicreaseScale,
            changePosition,
            handle
        }
    },
    template: `
    <div @mousemove="drag" @mouseout="isDrag = false" @mouseup="isDrag = false" class="map__controls controls">
    <svg width="60" class="controls__elements" height="265" viewBox="0 0 60 265" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <g class="controls__nav ">
            <path
                d="M30 58C45.464 58 58 45.464 58 30C58 14.536 45.464 2 30 2C14.536 2 2 14.536 2 30C2 45.464 14.536 58 30 58Z"
                fill="white" fill-opacity="0.3" stroke="#15286d" stroke-width="3" />
            <path @click="changePosition('center')" class="center map__clickable"
                d="M29.9995 34.827C32.6657 34.827 34.827 32.6657 34.827 29.9995C34.827 27.3333 32.6657 25.1719 29.9995 25.1719C27.3333 25.1719 25.1719 27.3333 25.1719 29.9995C25.1719 32.6657 27.3333 34.827 29.9995 34.827Z"
                stroke="#15286d" fill="white" stroke-width="3">
            </path>
            <path @click="changePosition('top')" class="controls__top button map__clickable"
                d="M25.1719 15.5161L29.9995 10.6885L34.827 15.5161" stroke="#15286d" stroke-width="3"
                stroke-linecap="square" />
            <path @click="changePosition('right')" class="controls__right button map__clickable"
                d="M44.4824 25.1719L49.31 29.9995L44.4824 34.827" stroke="#15286d" stroke-width="3"
                stroke-linecap="square" />
            <path @click="changePosition('bottom')" class="controls__bottom button map__clickable"
                d="M34.827 44.4824L29.9995 49.31L25.1719 44.4824" stroke="#15286d" stroke-width="3"
                stroke-linecap="square" />
            <path @click="changePosition('left')" class="controls__left button map__clickable"
                d="M15.518 34.827L10.6904 29.9995L15.518 25.1719" stroke="#15286d" stroke-width="3"
                stroke-linecap="square" />
        </g>
        <g class="controls__scale">
            <g class="controls__closer">
                <path @click="encreaseScale" class="controls__circle map__clickable"
                    d="M29.9997 107.242C37.465 107.242 43.5169 101.19 43.5169 93.7243C43.5169 86.2589 37.465 80.207 29.9997 80.207C22.5343 80.207 16.4824 86.2589 16.4824 93.7243C16.4824 101.19 22.5343 107.242 29.9997 107.242Z"
                    fill="white" fill-opacity="0.3" stroke="#15286d" stroke-width="3" />
                <path class="controls__icon" d="M24.6895 93.7234H35.3101M29.9998 88.4131V99.0338" stroke="#15286d"
                    stroke-width="3" />
            </g>
            <g class="controls__away">
                <path @click="dicreaseScale" class="controls__circle map__clickable"
                    d="M29.9997 262.69C37.465 262.69 43.5169 256.638 43.5169 249.173C43.5169 241.707 37.465 235.655 29.9997 235.655C22.5343 235.655 16.4824 241.707 16.4824 249.173C16.4824 256.638 22.5343 262.69 29.9997 262.69Z"
                    fill="white" fill-opacity="0.3" stroke="#15286d" stroke-width="3" />
                <path class="controls__icon" d="M24.6895 249.173H35.3101" stroke="#15286d" stroke-width="3" />
            </g>
            <g class="controls__band" ref="line">
                <g class="controls__line">
                    <path d="M30 115.448V224.552V115.448Z" fill="white" fill-opacity="0.3" />
                    <path d="M30 115.448V224.552" stroke="#15286d" stroke-width="3" />
                </g>
                <path ref="handle" :style="{ transform: translateY }" @mousedown="isDrag = true"
                    class="controls__handle map__clickable" d="M39.6551 224.068H20.3447V231.792H39.6551V224.068Z"
                    fill="#15286d" stroke="#15286d" stroke-width="3" />
            </g>
        </g>
    </svg>

</div>
    `
}