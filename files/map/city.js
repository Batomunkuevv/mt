import { ref, onMounted, watch } from 'vue'

export default {
    props: ['actualScale', 'translateY', 'translateX', 'data', 'screenElement', 'isDrag', 'scalePercent'],
    emits: ['focusItem'],
    setup(props, ctx) {
        const element = ref(null)
        const parentElement = ref(null)
        const elementStyleObject = ref({ left: 0, top: 0, height: 0, width: 0 })
        const height = ref(0)
        const width = ref(0)
        const me = ref(null)
        const centerX = ref(0)
        const centerY = ref(0)

        const intervalId = ref(null)
        const intervalCount = ref(0)

        const getCenter = () => {
            intervalCount.value++

            centerX.value = element.value.getBoundingClientRect().left - me.value.parentElement.getBoundingClientRect().left + element.value.getBoundingClientRect().width / 2
            centerY.value = element.value.getBoundingClientRect().top - me.value.parentElement.getBoundingClientRect().top + element.value.getBoundingClientRect().height / 2
        }

        onMounted(() => {
            element.value = document.getElementById(`point-${props.data.id}`)
            height.value = element.value.getBoundingClientRect().height
            width.value = element.value.getBoundingClientRect().width
            getCenter()
        })

        watch(intervalCount, (value) => {
            if (value > 10) {
                clearInterval(intervalId.value)
                intervalCount.value = 0
            }
        })

        watch(() => [props.actualScale, props.translateY, props.translateX, props.isDrag], ([actualScale, translateY, translateX, isDrag]) => {
            if (isDrag) {
                getCenter()
            } else if (!isDrag) {
                intervalId.value = setInterval(getCenter, 20)
            }
        }, { deep: true })

        watch([height,
            width,
            centerX,
            centerY],
            ([height,
                width,
                centerX,
                centerY]) => {

                elementStyleObject.value = { left: centerX + 'px', top: centerY + 'px', height: height + 'px', width: width + 'px' }
            })


        return {
            me,
            elementStyleObject,
            height,
            width,
            centerX,
            centerY,
            props
        }
    },
    template: `
    <div :style="elementStyleObject" ref="me" :class="{ 'no-transition': true }" class="city ">
    <div v-if="props.scalePercent < 50" class="city__point"></div>
    <div v-else class="city__popup" :class="{'russian': props.data.isRussian, 'reversed': props.data.name === 'Кипр' }">
        <div class="city__name">{{ props.data.name }}</div>
        <svg class="city__triangle" xmlns="http://www.w3.org/2000/svg" width="27" height="16" viewBox="0 0 27 16"
            fill="none">
            <path d="M14 13.5L3 1H24.5L14 13.5Z" fill="#2E4ADF" stroke="#2E4ADF" stroke-width="1" />
        </svg>
    </div>
</div>
    `
}