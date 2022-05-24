/* eslint-disable no-undef */

const init = function () {
    const iframe = document.createElement('iframe')

    iframe.style.border = '0'
    iframe.style.position = 'fixed'
    iframe.style.right = '15px'
    iframe.style.bottom = '15px'
    iframe.style.width = '0px'
    iframe.style.height = '0px'

    iframe.src = 'IFRAME_SRC'

    document.body.appendChild(iframe)

    window.addEventListener(
        'message',
        function ({ data }) {
            if (!data.instantchatDimensions) return
            const { width, height } = data.instantchatDimensions
            iframe.style.height = `${height}px`
            iframe.style.width = `${width}px`
        },
        false
    )
}
window.addEventListener('load', init)
