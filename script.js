document.getElementById('parse-button').addEventListener('click', () => {
    const formula = document.getElementById('formula-input').value;
    const variablesSection = document.getElementById('variables-section');
    variablesSection.innerHTML = ''; // Очищаем предыдущие переменные

    // Регулярное выражение для поиска переменных (одиночные буквы)
    const variables = [...new Set(formula.match(/\b[a-zA-Z]\b/g))];

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
            variables.forEach(v => {
                const value = document.getElementById(`${v}-value`).value;
                // Заменяем переменные на их значения в выражении
                expression = expression.replace(new RegExp(`\\b${v}\\b`, 'g'), `(${value})`);
            });

            try {
                // Обрабатываем синус, косинус и другие функции
                expression = expression.replace(/sin\((.*?)\)/g, (match, p1) => `Math.sin(${p1})`);
                expression = expression.replace(/cos\((.*?)\)/g, (match, p1) => `Math.cos(${p1})`);
                expression = expression.replace(/tan\((.*?)\)/g, (match, p1) => `Math.tan(${p1})`);
                expression = expression.replace(/log\((.*?)\)/g, (match, p1) => `Math.log(${p1})`);

                const result = eval(expression); 
                document.getElementById('result-section').innerHTML = `Результат: **${result}**`;
            } catch (e) {
                document.getElementById('result-section').innerHTML = `<span style="color: red;">Ошибка: проверьте синтаксис формулы.</span>`;
            }
        });
    } else {
        document.getElementById('result-section').innerHTML = `<span style="color: #6c757d;">Формула не содержит переменных.</span>`;
    }
});
