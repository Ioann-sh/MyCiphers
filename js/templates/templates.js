const templates = {
    'unavailable': `
        <div id="unavailable">
            <h2 id="unavailable-title">В разработке</h2>
        </div>
        `,

    'caesar': `
        <div id="caesar">
            <h2 id="cipher-title">Шифр Цезаря</h2>
            <p>Реализация шифра Цезаря. Лабораторна работа №1.</p>
            <label for="message">Введите сообщение:</label>
            <input type="text" id="message" placeholder="Введите сообщение" value="pushkin"/>

            <label for="message">Введите ключ:</label>
            <input type="number" id="key" placeholder="Введите ключ" value="3"/>

            <button onclick="encrypt('caesar')">Зашифровать</button>
            <button onclick="decrypt('caesar')">Расшифровать</button>
            <button onclick="hack('caesar')">Взломать</button>
            <div id="result"></div>
        </div>
        `,

    'enigma': `
        <div id="enigma">
            <h2 id="cipher-title">Шифр Энигмы</h2>
            <p>Реализация шифра Энигмы. Лабораторна работа №2.</p>
            <input type="text" id="message" placeholder="Введите сообщение" value="съешь ещё этих мягких французских булок"/>

            <label for="message">Введите Ротор 1:</label>
            <input type="text" id="rotor1" placeholder="Ротор 1" value="БВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯА"/>

            <label for="message">Введите Ротор 2:</label>
            <input type="text" id="rotor2" placeholder="Ротор 2" value="ГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯАБВ"/>

            <label for="message">Введите Ротор 1:</label>
            <input type="text" id="rotor3" placeholder="Ротор 3" value="ДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯАБВГ" />

            <label for="message">Введите Рефлектор:</label>
            <input type="text" id="reflector" placeholder="Рефлектор" value="ЯЮЭЬЫЪЩШЧЦХФУТСРПОНМЛКИЙЖЗЁЕДГВБА" />
            
            <label for="message">Введите начальные позиции:</label>
            <input type="number" id="initialPositions" placeholder="Начальные позиции" value="000"/>
            
            <button onclick="encrypt('enigma')">Зашифровать</button>
            <button onclick="decrypt('enigma')">Расшифровать</button>
            <button onclick="hack('enigma')">Взломать</button>
            <div id="result"></div>
        </div>
        `,

    'vizener': `
        <div id="vizener">
            <h2 id="cipher-title">Шифр Виженера</h2>
            <p>Реализация шифра Виженера. Лабораторна работа №2.</p>
            <label for="message">Введите сообщение:</label>
            <input type="text" id="message" placeholder="Сообщение" value="ilovedyouandmylovemaystillbetheredeepinmysoulremainstostayaglowthatshouldnotcauseyouanymoredespairidonotwanttohurtyouanymoreilovedyouunrequitedinstillwonderthroughboutsofjealousyanddiffidenceilovedyousosincerelyandtendergodblessyouwithsuchloveofsomeoneelse"/>

            <label for="message">Введите ключ:</label>
            <input type="text" id="key" placeholder="Ключ" value="pushkin"/>
            
            <button onclick="encrypt('vizener')">Зашифровать</button>
            <button onclick="decrypt('vizener')">Расшифровать</button>
            <button onclick="hack('vizener')">Взломать</button>
            <div id="result"></div>
        </div>
        `,

    'gost': `
        <div id="gost">
            <h2 id="cipher-title">Шифр ГОСТ 28147-89</h2>
            <p>Реализация шифра ГОСТ 28147-89 с использованием хэша. Лабораторна работа №3 и №6.</p>
            <label for="message">Введите сообщение:</label>
            <input type="text" id="message" placeholder="Введите сообщение" value="I loved you and my love may still be there, Deep in my soul remains to stay aglow."/>

            <label for="message">Ключ:</label>
            <p id="key"></p>
            
            <button onclick="generateKey('gost')">Генерация ключа</button>
            <button onclick="encrypt('gost')">Зашифровать</button>
            <button onclick="decrypt('gost')">Расшифровать</button>
            <div id="result"></div>
        </div>
        `
}
