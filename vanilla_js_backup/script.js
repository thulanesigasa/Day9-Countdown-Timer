const dateInput = document.getElementById('target-datetime');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const timerDisplay = document.getElementById('timer-display');
const messageEl = document.getElementById('message');

const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

let countdownInterval;
let targetDate;

// Set min attribute to current local time
const now = new Date();
now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
dateInput.min = now.toISOString().slice(0, 16);

function startCountdown() {
    const inputVal = dateInput.value;
    
    if (!inputVal) {
        alert("Please select a valid date and time.");
        return;
    }

    targetDate = new Date(inputVal).getTime();
    const now = new Date().getTime();

    if (targetDate <= now) {
        alert("Please select a future date and time.");
        return;
    }

    // UI Updates
    dateInput.parentElement.classList.add('hidden');
    timerDisplay.classList.remove('hidden');
    startBtn.classList.add('hidden');
    resetBtn.classList.remove('hidden');
    messageEl.classList.add('hidden');
    messageEl.textContent = '';

    // Run once immediately to avoid 1s delay
    updateTimer();

    countdownInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        clearInterval(countdownInterval);
        displayMessage("Time's up! 🎉");
        timerDisplay.classList.add('hidden');
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    displayTime(days, hours, minutes, seconds);
}

function displayTime(d, h, m, s) {
    daysEl.textContent = formatTime(d);
    hoursEl.textContent = formatTime(h);
    minutesEl.textContent = formatTime(m);
    secondsEl.textContent = formatTime(s);
}

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

function displayMessage(msg) {
    messageEl.textContent = msg;
    messageEl.classList.remove('hidden');
}

function resetTimer() {
    clearInterval(countdownInterval);
    dateInput.value = '';
    
    // UI Resets
    dateInput.parentElement.classList.remove('hidden');
    timerDisplay.classList.add('hidden');
    startBtn.classList.remove('hidden');
    resetBtn.classList.add('hidden');
    messageEl.classList.add('hidden');
    
    // Reset display values
    displayTime(0, 0, 0, 0);
}

startBtn.addEventListener('click', startCountdown);
resetBtn.addEventListener('click', resetTimer);
