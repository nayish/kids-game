const NUMBER_OF_OPTIONS = 4;
const SLOW_SPEED = 1.8;
const ADDITION_CHAR = '+';
const MULTIPLICATION_CHAR = '×';
let ops = [ADDITION_CHAR];
let maxNumber = 5;
let minNumber = 1;
let currentAudio;
let successAnimation;
let hands = true;

window.onload = () => {
    setKnobs();

    document.getElementById('skip').onclick = () => {
        clearTimeout(successAnimation);

        newEquation();
    };

    document.getElementById('multiplication-knob').onclick = () => {
        if (ops.includes(MULTIPLICATION_CHAR) && ops.length > 1) {
            ops.splice(ops.indexOf(MULTIPLICATION_CHAR), 1);
        } else {
            ops.push(MULTIPLICATION_CHAR);
        }

        setKnobs();
    };
    document.getElementById('addition-knob').onclick = () => {
        if (ops.includes(ADDITION_CHAR) && ops.length > 1) {
            ops.splice(ops.indexOf(ADDITION_CHAR), 1);
        } else {
            ops.push(ADDITION_CHAR);
        }
        setKnobs();
    };

    document.getElementById('max-knob').onchange = (e) => {
        maxNumber = Math.max(1, e.target.value);
        if (minNumber >= maxNumber) {
            minNumber = maxNumber - 1;
        }
        setKnobs();
    };

    document.getElementById('min-knob').onchange = (e) => {
        minNumber = Math.max(0, e.target.value);
        if (minNumber >= maxNumber) {
            maxNumber = minNumber + 1;
        }
        setKnobs();
    };

    document.getElementById('play').onclick = async () => {
        document.getElementById('challenge').className = "";
        document.getElementById('init').className = "hidden";
        newEquation();
    };

    document.getElementById('back-button').onclick = async () => {
        document.getElementById('challenge').className = "hidden";
        document.getElementById('init').className = "";
    };
    document.getElementById('init').className = "";
};

function setKnobs() {
    document.getElementById('multiplication-knob').checked = ops.includes(MULTIPLICATION_CHAR);
    document.getElementById('addition-knob').checked = ops.includes(ADDITION_CHAR);
    document.getElementById('max-knob').value = maxNumber;
    document.getElementById('min-knob').value = minNumber;
}

function newEquation() {
    document.getElementById('board').className = "";

    const num1 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    const num2 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    const op = ops[Math.floor(Math.random() * ops.length)];

    const solution = (op === '+') ? num1 + num2 : num1 * num2;

    const options = getOptions(solution);

    [...document.getElementsByClassName("num1")].forEach(el => el.innerText = num1);
    [...document.getElementsByClassName("num2")].forEach(el => el.innerText = num2);
    [...document.getElementsByClassName("op")].forEach(el => el.innerText = op);
    [...document.getElementsByClassName("solution")].forEach(el => el.innerText = '?');

    document.getElementById("options").innerHTML = '';

    options.forEach(option => {
        const optionElement = createResultElement(option);
        if (option > 999) {
            optionElement.className = 'long';
        }
        optionElement.onclick = () => {
            if (option === solution) {
                playSound('clap', SLOW_SPEED);
                document.getElementById('board').className = "success";
                [...document.getElementsByClassName("solution")].forEach(el => el.innerText = solution);
                successAnimation = setTimeout(() => {
                    newEquation();
                }, 4000);
            } else {
                playSound('no');
                optionElement.disabled = true;
            }
        };
        setTimeout(() => {
            optionElement.onmouseover = (e) => {
                playSound(option);
            };
        }, 300);
        document.getElementById("options").appendChild(optionElement);
    });

    playEquation(num1, op, num2);
    setTimeout(() => {
        [...document.getElementsByClassName("equation")].forEach(el => el.onmouseover = () => playEquation(num1, op, num2))
    }, 300);


    const showHands = (hands && (num1 <=5 && num1 >=1) && (num2 >= 1 && num2 <=5) && op === ADDITION_CHAR);
    document.getElementById('hands').className = showHands ? '' : 'hidden';
    document.getElementById('num1-hand').className = `finger-${num1}`;
    document.getElementById('num2-hand').className = `finger-${num2}`;
}



async function playEquation(num1, op, num2) {
    await playSound('1', {speed: SLOW_SPEED, volume: 0});
    await playSound(num1, {speed: SLOW_SPEED});
    await playSound(op, {speed: SLOW_SPEED});
    await playSound(num2, {speed: SLOW_SPEED});
}

async function playSound(sound, {speed, volume} = {}) {
    return new Promise(
        (resolve, reject) => {
            currentAudio && currentAudio.pause();
            const audio = new Audio(`sounds/${sound}.wav`);
            audio.playbackRate=speed ?? 1;
            audio.volume=volume ?? audio.volume;
            audio.play().catch(reject);
            currentAudio = audio;
            audio.onended = resolve;
        }
    );
}

function getOptions(solution) {
    const options = [];

    const min = Math.max(0, solution - Math.max(NUMBER_OF_OPTIONS,Math.floor((maxNumber - minNumber) / 2)));

    for (let i = 0; i < NUMBER_OF_OPTIONS - 1; i++) {
        let option;
        do {
            option = getOption(min)
        } while (options.includes(option) || option === solution);
        options.push(option)
    }

    const position = Math.floor(Math.random() * NUMBER_OF_OPTIONS);

    options.splice(position, 0, solution);

    return options;
}

function getOption(min) {
    return min + Math.floor(Math.random() * Math.max(NUMBER_OF_OPTIONS,(maxNumber - minNumber)));
}

function createResultElement(result) {
    let el = document.createElement('button');
    el.innerText = result;
    el.className = 'option';
    return el;
}