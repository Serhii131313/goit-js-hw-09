import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

let timerId = null;

const refs = {
    date: document.querySelector('#datetime-picker'),
    btnStart: document.querySelector('button[data-start]'),
    days: document.querySelector('[data-days]'),
    hour: document.querySelector('[data-hours]'),
    minute: document.querySelector('[data-minutes]'),
    second: document.querySelector('[data-seconds]'),
    span: document.querySelector('.value'),
};

refs.btnStart.disabled = true;

refs.btnStart.addEventListener('click', onBtnStartTimer);

const flatpickrInstance = flatpickr('#datetime-picker', {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        if (selectedDates[0] <= Date.now()) {
            Notiflix.Notify.failure('Please choose a date in the future');
            refs.btnStart.disabled = true;
        } else {
            refs.btnStart.disabled = false;
            Notiflix.Notify.success('Let\'s go?');
        }
    },
});

function onBtnStartTimer() {
    refs.date.disabled = true;
    refs.btnStart.disabled = true;
    timerId = setInterval(() => {
        const currentTime = new Date(refs.date.value);
        const deltaTime = currentTime - Date.now();
        const { days, hours, minutes, seconds } = convertMs(deltaTime);

        refs.days.textContent = addLeadingZero(days);
        refs.hour.textContent = addLeadingZero(hours);
        refs.minute.textContent = addLeadingZero(minutes);
        refs.second.textContent = addLeadingZero(seconds);

        if (deltaTime < 1000) {
            clearInterval(timerId);
            refs.date.disabled = false;
        }
    }, 1000);
}

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
    return `${value}`.padStart(2, '0');
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6, minutes: 42, seconds: 20}
