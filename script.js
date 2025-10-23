document.addEventListener('DOMContentLoaded', () => {
    const formulaInput = document.getElementById('formula-input');
    const parseButton = document.getElementById('parse-button');
    const variablesSection = document.getElementById('variables-section');
    const resultSection = document.getElementById('result-section');
    const historyList = document.getElementById('history-list');
    const clearHistoryButton = document.getElementById('clear-history-button');

    let history = JSON.parse(localStorage.getItem('formulaHistory')) || [];

    function renderHistory() {
        historyList.innerHTML = '';
        if (history.length > 0) {
            clearHistoryButton.style.display = 'block';
        } else {
            clearHistoryButton.style.display = 'none';
        }
        history.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.formula} = ${item.result}`;
            li.addEventListener('click', () => {
                formulaInput.value = item.formula;
                parseButton.click();
            });
            historyList.appendChild(li);
        });
    }

    renderHistory();

    // Обработчик кнопки "Очистить историю"
    clearHistoryButton.addEventListener('click', () => {
        history = [];
        localStorage.removeItem('formulaHistory');
        renderHistory();
    });

    parseButton.addEventListener('click', () => {
        const formula = formulaInput.value;
        variablesSection.innerHTML = '';
        resultSection.innerHTML = '';

        const variables = [...new Set(formula.match(/\b[a-zA-Z]+\b/g))];

        if (variables.length > 0) {
            variables.forEach(v => {
                const div = document.createElement('div');
                div.classList.add('variable-input');
                div.innerHTML = `
                    <label for="${v}-value">${v}:</label>
                    <input type="number" id="${v}-value" placeholder="Введите значение для ${v}">
                `;
                variablesSection.appendChild(div);
            });

            const calculateButton = document.createElement('button');
            calculateButton.id = 'calculate-button';
            calculateButton.textContent = 'Вычислить';
            variablesSection.appendChild(calculateButton);

            calculateButton.addEventListener('click', () => {
                let expression = formula;
                let isValid = true;

                variables.forEach(v => {
                    const valueInput = document.getElementById(`${v}-value`);
                    const value = valueInput.value;
                    if (value === '') {
                        isValid = false;
                    }
                    expression = expression.replace(new RegExp(`\\b${v}\\b`, 'g'), `(${value})`);
                });

                if (!isValid) {
                    resultSection.innerHTML = `<span style="color: red;">Ошибка: введите значения для всех переменных.</span>`;
                    return;
                }

                try {
                    expression = expression.replace(/sin\((.*?)\)/g, (match, p1) => `Math.sin(${p1})`);
                    expression = expression.replace(/cos\((.*?)\)/g, (match, p1) => `Math.cos(${p1})`);
                    expression = expression.replace(/tan\((.*?)\)/g, (match, p1) => `Math.tan(${p1})`);
                    expression = expression.replace(/log\((.*?)\)/g, (match, p1) => `Math.log(${p1})`);
                    expression = expression.replace(/sqrt\((.*?)\)/g, (match, p1) => `Math.sqrt(${p1})`);
                    expression = expression.replace(/pow\((.*?),(.*?)\)/g, (match, p1, p2) => `Math.pow(${p1},${p2})`);
                    expression = expression.replace(/abs\((.*?)\)/g, (match, p1) => `Math.abs(${p1})`);
                    expression = expression.replace(/round\((.*?)\)/g, (match, p1) => `Math.round(${p1})`);
                    expression = expression.replace(/floor\((.*?)\)/g, (match, p1) => `Math.floor(${p1})`);
                    expression = expression.replace(/ceil\((.*?)\)/g, (match, p1) => `Math.ceil(${p1})`);
                    expression = expression.replace(/exp\((.*?)\)/g, (match, p1) => `Math.exp(${p1})`);

                    expression = expression.replace(/PI/g, Math.PI);
                    expression = expression.replace(/E/g, Math.E);

                    const result = Function('"use strict";return (' + expression + ')')();

                    resultSection.innerHTML = `Результат: <strong>${result}</strong>`;

                    history.unshift({ formula: formula, result: result });
                    if (history.length > 10) { 
                        history.pop();
                    }
                    localStorage.setItem('formulaHistory', JSON.stringify(history));
                    renderHistory();

                } catch (e) {
                    resultSection.innerHTML = `<span style="color: red;">Ошибка: проверьте синтаксис формулы.</span>`;
                }
            });
        } else {
            try {
                const result = Function('"use strict";return (' + formula + ')')();
                resultSection.innerHTML = `Результат: <strong>${result}</strong>`;

                history.unshift({ formula: formula, result: result });
                if (history.length > 10) { 
                    history.pop();
                }
                localStorage.setItem('formulaHistory', JSON.stringify(history));
                renderHistory();

            } catch (e) {
                resultSection.innerHTML = `<span style="color: red;">Ошибка: проверьте синтаксис формулы.</span>`;
            }
        }
    });
});
