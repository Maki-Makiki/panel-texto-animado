
document.addEventListener("DOMContentLoaded", () => {

    let config = {
        text: "PANTALLA LED",
        font: 10,
        spaceIdx: 5,
        timeIdx: 2,
        colorIdx: 0,
        direction: 0
    }

    const STORAGE_KEY = "led_marquee_config"

    function saveConfig() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    }

    function loadConfig() {

        const saved = localStorage.getItem(STORAGE_KEY)

        if (!saved) return

        try {
            const parsed = JSON.parse(saved)
            Object.assign(config, parsed)
        } catch (e) {
            console.warn("config corrupta en localStorage")
        }

    }

    function applyConfig() {

        document.documentElement.style.setProperty(
            "--font-mult",
            config.font / 10
        )

        document.documentElement.style.setProperty(
            "--marquee-space",
            spaces[config.spaceIdx] + "px"
        )

        document.documentElement.style.setProperty(
            "--marquee-time",
            times[config.timeIdx] + "s"
        )

        document.documentElement.style.setProperty(
            "--led-color",
            colors[config.colorIdx]
        )

        document.documentElement.style.setProperty(
            "--direction",
            colors[config.direction]
        )

        document.getElementById("font-val").innerText = config.font
        document.getElementById("space-val").innerText = spaces[config.spaceIdx] + "px"
        document.getElementById("time-val").innerText = times[config.timeIdx] + "s"
        document.getElementById("color-box").style.background = colors[config.colorIdx]
        if (config.direction) {
            document.querySelectorAll(".marquee-layer").forEach(layer=>{
                layer.classList.add("reverse")
            })
        }
    }

    const spaces = [10, 20, 40, 80, 150, 250, 500]

    const times = [5, 10, 15, 20, 30, 45, 60]

    const colors = [
        "#ffff00",
        "#ff0000",
        "#00ff00",
        "#00ffff",
        "#ffffff",
        "#81adffff",
    ]

    const lFrente = document.getElementById("layer-frente")
    const lBlur = document.getElementById("layer-blur")

    function buildTrack(layer) {

        layer.innerHTML = ""

        const track = document.createElement("div")
        track.className = "marquee-track"

        const item = document.createElement("span")
        item.className = "marquee-item"
        item.textContent = config.text

        track.appendChild(item)

        layer.appendChild(track)

        requestAnimationFrame(() => {

            const itemWidth = item.offsetWidth
            const screen = window.innerWidth

            const repeats = Math.ceil((screen * 2) / itemWidth)

            for (let i = 0; i < repeats; i++) {
                track.appendChild(item.cloneNode(true))
            }

            // duplicar el track entero
            const clone = track.cloneNode(true)
            layer.appendChild(clone)

        })
    }

    function updateLED() {

        buildTrack(lFrente)
        buildTrack(lBlur)

    }

    /* TOOLBAR */

    const toolbar = document.querySelector(".toolbar")
    const menuIcon = document.getElementById("menu-icon")

    document.querySelector(".btn-options").onclick = () => {

        toolbar.classList.toggle("hide-tools")

        menuIcon.src = toolbar.classList.contains("hide-tools")
            ? "./T_OpenMenu.svg"
            : "./T_CloseMenu.svg"

    }

    /* TEXTO */

    document.querySelector(".btn-text").onclick = () => {

        document.getElementById("input-led").value = config.text
        document.querySelector(".modal-input").classList.remove("hide")

    }

    document.getElementById("btn-save").onclick = () => {

        config.text = document.getElementById("input-led").value
        saveConfig();
        updateLED();

        document.querySelector(".modal-input").classList.add("hide")

    }

    document.getElementById("btn-cancel").onclick = () => {
        document.querySelector(".modal-input").classList.add("hide")
    }

    /* COLOR */

    document.querySelector(".btn-color").onclick = () => {

        config.colorIdx = (config.colorIdx + 1) % colors.length

        document.documentElement.style.setProperty(
            "--led-color",
            colors[config.colorIdx]
        )

        document.getElementById("color-box").style.background =
            colors[config.colorIdx]

        saveConfig();
    }

    /* FONT */

    document.querySelector(".btn-font").onclick = () => {

        config.font = config.font <= 4 ? 10 : config.font - 1

        document.documentElement.style.setProperty(
            "--font-mult",
            config.font / 10
        )

        document.getElementById("font-val").innerText = config.font
        saveConfig();
    }

    /* SPACE */

    document.querySelector(".btn-space").onclick = () => {

        config.spaceIdx = (config.spaceIdx + 1) % spaces.length

        document.documentElement.style.setProperty(
            "--marquee-space",
            spaces[config.spaceIdx] + "px"
        )

        document.getElementById("space-val").innerText =
            spaces[config.spaceIdx] + "px"

        saveConfig();
        updateLED();

    }

    /* TIME */

    document.querySelector(".btn-time").onclick = () => {

        config.timeIdx = (config.timeIdx + 1) % times.length

        document.documentElement.style.setProperty(
            "--marquee-time",
            times[config.timeIdx] + "s"
        )

        document.getElementById("time-val").innerText =
            times[config.timeIdx] + "s";
        saveConfig();
    }

    /* DIRECCION */

    document.querySelector(".btn-direction").onclick = () => {

        document.querySelectorAll(".marquee-layer").forEach(layer => {
            layer.classList.toggle("reverse")
        })

        document.getElementById("dir-icon").classList.toggle("mirror")
        config.direction = config.direction ? 0 : 1
        saveConfig();
    }

    /* FULLSCREEN */

    document.querySelector(".btn-fullscreen").onclick = () => {

        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
        } else {
            document.exitFullscreen()
        }

    }

    /* INIT */

    document.getElementById("color-box").style.background = colors[0]
    loadConfig();
    applyConfig();
    updateLED();

})