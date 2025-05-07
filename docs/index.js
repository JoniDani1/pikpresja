document.addEventListener("DOMContentLoaded", function () {
    const inputForm = document.querySelector(".input-form");
    const textInput = document.getElementById("user-input");
    const displayArea = document.getElementById("text-display");
    const suggestionsBox = document.querySelector(".suggestions-box");
    const reviewPanel = document.querySelector(".column");

//   // grab the button
//   const btn = document.getElementById('reloadBtn');
  
// In your JavaScript code, add this after DOMContentLoaded
const testBtn = document.getElementById('test-btn');

testBtn.addEventListener('click', async function() {
    const testText = `Ti sot duhesh përgëzuar shumë, jo thjesht për hapin që po ndërmerr për jetën tënde, por edhe që je ende këtu, në Shqipërinë tonë ku për fat të keq studentët paksohen vit pas viti. Nuk është e lehtë të vendosësh që të qëndrosh, kur e ke mundësinë për të ikur. Universitetet tona mund të mos ofrojnë kushtet më të mira të mundshme, por kanë histori të shkëlqyer e kanë formësuar sigurishtë breza të tërë intelektualësh të këtij vendi. Në auditoret e universiteteve tona ka studentë të talentuar e të përkushtuar, ka pedagogë pasionantë që e dashurojnë punën që bëjnë, ka profesorat me merita të padiskutueshme. Pavarësisht dritëhijeve, universiteti sot e gjithë ditën mbetet institucion i vlerave.`;

    try {
        const grammarResponse = await fetch("http://localhost:5000/grammarcheck", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: testText })
        });
        const grammarData = await grammarResponse.json();

        
        grammarData.suggestions = [
            { word: "paksohen", suggestions: ["pakësohen"] },
            { word: "sigurishtë", suggestions: ["sigurisht"] },
            { word: "auditoret", suggestions: ["auditorët"] },
            { word: "profesorat", suggestions: ["profesorët"] }
        ];

        grammarData.corrected = testText
            .replace("paksohen", "pakësohen")
            .replace("sigurishtë", "sigurisht")
            .replace("auditoret", "auditorët")
            .replace("profesorat", "profesorët");

        displayArea.innerHTML = `
            <h3>Korrigjimet:</h3>
            ${formatCorrections(testText, grammarData.suggestions)}
            <hr>
            <h3>Versioni i plotë i korrigjuar:</h3>
            <div class="highlight">${grammarData.corrected}</div>
            <p><button onclick="navigator.clipboard.writeText('${grammarData.corrected.replace(/'/g, "\\'").replace(/\n/g, "\\n")}')">Kopjo</button></p>
        `;

        suggestionsBox.textContent = grammarData.suggestions.length;
        reviewPanel.innerHTML = generateSuggestionsHTML(grammarData.suggestions);

        document.querySelector(".input-form").style.display = "none";
        document.getElementById("submitted-content").style.display = "block";

        
    } catch (error) {
        console.error("Error:", error);
        alert("Gabim në lidhjen me serverin.");
    }
});

    
    inputForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        document.querySelector('.loading-bar').style.width = '70%';

        const text = textInput.value.trim();
        if (!text) {
            alert("Please enter text.");
            return;
        }

        try {
            // // 🔍 SPELL CHECK
            // const spellResponse = await fetch("http://localhost:5000/spellcheck", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ text }),
            // });
            // const spellData = await spellResponse.json();

            // ✅ GRAMMAR CHECK
            const grammarResponse = await fetch("http://localhost:5000/grammarcheck", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });
            const grammarData = await grammarResponse.json();

            // ✨ Display everything
            displayArea.innerHTML = `
                <h3>Korrigjimet:</h3>
                ${formatCorrections(text, grammarData.suggestions)}
                <hr>
                <h3>Versioni i plote i korrigjuar:</h3>
                <div class="highlight">${grammarData.corrected}</div>
                <p><button onclick="navigator.clipboard.writeText('${grammarData.corrected.replace(/'/g, "\\'").replace(/\n/g, "\\n")}')">Kopjo</button></p>
                <p><button id="reloadBtn">Reload</button></p>

            `;

            suggestionsBox.textContent = grammarData.suggestions.length;
            reviewPanel.innerHTML = generateSuggestionsHTML(grammarData.suggestions);


            inputForm.style.display = "none";
            document.getElementById("submitted-content").style.display = "block";
            textInput.value = "";

            document.querySelector('.loading-bar').style.width = '100%';
            setTimeout(() => {
                document.querySelector('.loading-bar').style.width = '0';
            }, 300);

        } catch (error) {
            document.querySelector('.loading-bar').style.width = '0';
            console.error("Error:", error);
            alert("Error connecting to server.");
        }
    });

    function formatCorrections(originalText, results) {
        let formattedText = originalText;
        results.forEach(({ word, suggestions }) => {
            if (suggestions.length > 0) {
                formattedText = formattedText.replace(
                    new RegExp(`\\b${word}\\b`, "gi"),
                    `<span class="highlight">${word} → ${suggestions[0]}</span>`
                );
            }
        });
        return formattedText;
    }

    function generateSuggestionsHTML(results) {
        return results
            .filter(({ suggestions }) => suggestions.length > 0)
            .map(({ word, suggestions }) =>
                `<p>Change <strong>${word}</strong> to: <span class="highlight">${suggestions[0]}</span></p>`
            )
            .join("");
    }

    // function invertColor(hex) {
    //     if (hex.startsWith('#')) hex = hex.slice(1);
    //     if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    //     const r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16).padStart(2, '0');
    //     const g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16).padStart(2, '0');
    //     const b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16).padStart(2, '0');
    //     return `#${r}${g}${b}`;
    // }

    // window.invertColors = function () {
    //     document.body.classList.toggle("inverted");
    // };

    window.changeAccentColor = function (color) {
        document.documentElement.style.setProperty('--accent-color', color);
        document.querySelectorAll('.invert-btn, .color-picker-btn, .suggestions-box, .footnote').forEach(el => {
            el.style.backgroundColor = color;
        });
    };

    document.addEventListener('keydown', function (event) {
        if (event.key === 'T' || event.key === 't') {
            invertColors();
        } else if (event.key === '[') {
            document.documentElement.requestFullscreen();
        } else if (event.key === ']') {
            changeAccentColor('#3ade6e');
        } else if (event.key === '=') {
            const controlButtons = document.querySelector('.control-buttons');
            controlButtons.style.display = controlButtons.style.display === 'none' ? 'flex' : 'none';
        }
    });

    document.documentElement.style.setProperty('--accent-color', '#cccccc');
    document.querySelector('.control-buttons').style.display = 'none';

    
});
