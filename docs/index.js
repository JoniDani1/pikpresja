document.addEventListener("DOMContentLoaded", function () {
    const inputForm = document.querySelector(".input-form");
    const textInput = document.getElementById("user-input");
    const displayArea = document.getElementById("text-display");
    const suggestionsBox = document.querySelector(".suggestions-box");
    const reviewPanel = document.querySelector(".column");

    inputForm.addEventListener("submit", async function (event) {
        event.preventDefault();

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
    <h3>Corrections:</h3>
    <div class="correction-line">
        ${formatCorrections(text, grammarData.suggestions)}
    </div>
    <hr>
    <h3>Full Corrected Version:</h3>
    <div class="highlight">${grammarData.corrected}</div>
    <p><button onclick="navigator.clipboard.writeText('${grammarData.corrected.replace(/'/g, "\\'").replace(/\n/g, "\\n")}')">Copy</button></p>
`;


            suggestionsBox.textContent = grammarData.suggestions.length;
            reviewPanel.innerHTML = generateSuggestionsHTML(grammarData.suggestions);


            inputForm.style.display = "none";
            document.getElementById("submitted-content").style.display = "block";
            textInput.value = "";
        } catch (error) {
            console.error("Error:", error);
            alert("Error connecting to server.");
        }
    });

    function formatCorrections(originalText, results) {
        let formattedText = originalText;
        results.forEach(({ word, suggestions }) => {
            if (word && suggestions.length > 0) {
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

    function invertColor(hex) {
        if (hex.startsWith('#')) hex = hex.slice(1);
        if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
        const r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16).padStart(2, '0');
        const g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16).padStart(2, '0');
        const b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
    }

    window.invertColors = function () {
        document.body.classList.toggle("inverted");
    };

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
