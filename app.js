const CODE_MAP = {
    'B': '1',
    'L': '2',
    'A': '3',
    'C': '4',
    'K': '5',
    'S': '6',
    'T': '7',
    'O': '8',
    'N': '9',
    'E': '0'
};

const codeInput = document.getElementById('code-input');
const inrValueNode = document.getElementById('inr-value');
const usdValueNode = document.getElementById('usd-value');
const exchangeRateInput = document.getElementById('exchange-rate');
const keys = document.querySelectorAll('.key[data-key]');
const backspaceKey = document.getElementById('backspace-key');

// Load saved exchange rate
const savedRate = localStorage.getItem('exchangeRate');
if (savedRate) {
    exchangeRateInput.value = savedRate;
}

// Keyboard button logic
keys.forEach(key => {
    key.addEventListener('click', () => {
        const letter = key.getAttribute('data-key');
        codeInput.value += letter;
        updateDisplays();
    });
});

backspaceKey.addEventListener('click', () => {
    codeInput.value = codeInput.value.slice(0, -1);
    updateDisplays();
});

function translateCode(code) {
    let numericString = '';
    const cleanCode = code.toUpperCase().trim();

    for (let char of cleanCode) {
        if (CODE_MAP[char]) {
            numericString += CODE_MAP[char];
        }
    }

    return numericString ? parseInt(numericString, 10) : 0;
}

function formatCurrency(value, currency = 'INR') {
    if (currency === 'INR') {
        return new Intl.NumberFormat('en-IN').format(value);
    } else {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }
}

function updateDisplays() {
    const code = codeInput.value;
    const inrValue = translateCode(code);
    const rate = parseFloat(exchangeRateInput.value) || 1;
    const usdValue = inrValue / rate;

    inrValueNode.textContent = formatCurrency(inrValue, 'INR');
    usdValueNode.textContent = formatCurrency(usdValue, 'USD');

    // Add a slight pulse effect on change
    if (inrValue > 0) {
        document.querySelectorAll('.display-card').forEach(card => {
            card.style.transform = 'scale(1.02)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 100);
        });
    }
}

codeInput.addEventListener('input', updateDisplays);
exchangeRateInput.addEventListener('input', () => {
    localStorage.setItem('exchangeRate', exchangeRateInput.value);
    updateDisplays();
});

// Initial call
updateDisplays();
