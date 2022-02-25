let toggles = document.querySelectorAll('.toggle')

toggles.forEach((toggle) => {
    toggle.classList.contains(active)
});

function timeRemind() {
    if (toggleTime == currentTime) {
        soundAlarm()
    }
}

