document.addEventListener('DOMContentLoaded', () => {
    const formulaInput = document.getElementById('formula-input');
    const parseButton = document.getElementById('parse-button');
    const variablesSection = document.getElementById('variables-section');
    const resultSection = document.getElementById('result-section');

    parseButton.addEventListener('click', () => {
        const formula = formulaInput.value;
        variablesSection.innerHTML = '';
        resultSection.innerHTML = '';

        // Регулярное выражение для поиска переменных (одиночные или несколько букв)
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
                    // Заменяем переменные на их значения
                    expression = expression.replace(new RegExp(`\\b${v}\\b`, 'g'), `(${value})`);
                });

                if (!isValid) {
                    resultSection.innerHTML = `<span style="color: red;">Ошибка: введите значения для всех переменных.</span>`;
                    return;
                }

                try {
                    // Обрабатываем дополнительные математические функции
                    expression = expression.replace(/sin\((.*?)\)/g, (match, p1) => `Math.sin(${p1})`);
                    expression = expression.replace(/cos\((.*?)\)/g, (match, p1) => `Math.cos(${p1})`);
                    expression = expression.replace(/tan\((.*?)\)/g, (match, p1) => `Math.tan(${p1})`);
                    expression = expression.replace(/log\((.*?)\)/g, (match, p1) => `Math.log(${p1})`);
                    expression = expression.replace(/sqrt\((.*?)\)/g, (match, p1) => `Math.sqrt(${p1})`);
                    expression = expression.replace(/pow\((.*?),(.*?)\)/g, (match, p1, p2) => `Math.pow(${p1},${p2})`);
                    expression = expression.replace(/abs\((.*?)\)/g, (match, p1) => `Math.abs(${p1})`);

                    // Обрабатываем константы
                    expression = expression.replace(/PI/g, Math.PI);
                    expression = expression.replace(/E/g, Math.E);

                    // Используем более надёжный способ вычисления, чем простой eval()
                    const result = Function('"use strict";return (' + expression + ')')();

                    resultSection.innerHTML = `Результат: <strong>${result}</strong>`;
                } catch (e) {
                    resultSection.innerHTML = `<span style="color: red;">Ошибка: проверьте синтаксис формулы.</span>`;
                }
            });
        } else {
            resultSection.innerHTML = `<span style="color: #6c757d;">Формула не содержит переменных.</span>`;
        }
    });
});
