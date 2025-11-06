document.addEventListener("DOMContentLoaded", function () {
    const inputForm = document.querySelector(".input-form");
    const textInput = document.getElementById("user-input");
    const displayArea = document.getElementById("text-display");
    const suggestionsBox = document.querySelector(".suggestions-box");
    const reviewPanel = document.querySelector(".column");
    const testBtn = document.getElementById('test-btn');
    const submitBtn = inputForm.querySelector('button[type="submit"]');
    const loadingBar = document.querySelector('.loading-bar');
    const errorMessageDisplay = document.getElementById("error-message-display");

    //Reusable function to handle the grammar check request ---
    async function handleGrammarCheck(text) {
        
        if(submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Duke kontrolluar...';
        }
        loadingBar.style.width = '70%';
        if (errorMessageDisplay) errorMessageDisplay.textContent = '';

        try {
            // --- Make API Call ---
            const response = await fetch("http://localhost:5000/grammarcheck", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "An unknown server error occurred." }));
                throw new Error(errorData.error || `Server responded with status: ${response.status}`);
            }

            const grammarData = await response.json();

            //Update UI with results
            displayArea.innerHTML = `
                <h3>Korrigjimet:</h3>
                <div class="corrections-text">${formatCorrections(text, grammarData.suggestions)}</div>
                <hr>
                <h3>Versioni i plotë i korrigjuar:</h3>
                <div class="highlight-container">
                    <div class="highlight">${grammarData.corrected}</div>
                    <button class="copy-btn">Kopjo</button>
                </div>
                <p><button class="reload-btn">Rifresko</button></p>
            `;

            suggestionsBox.textContent = grammarData.suggestions.length;
            reviewPanel.innerHTML = generateSuggestionsHTML(grammarData.suggestions);

            inputForm.style.display = "none";
            document.getElementById("submitted-content").style.display = "block";
            textInput.value = "";

            loadingBar.style.width = '100%';
            setTimeout(() => { loadingBar.style.width = '0'; }, 300);

        } catch (error) {
        
            if (errorMessageDisplay) {
                errorMessageDisplay.textContent = `Gabim: ${error.message}`;
            } else {
                alert(`Gabim: ${error.message}`);
            }
            console.error("Error:", error);
        } finally {
            //Reset UI
            if(submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Korrigjo';
            }
            loadingBar.style.width = '0';
        }
    }


    inputForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const text = textInput.value.trim();
        if (text) {
            handleGrammarCheck(text);
        } else {
            if (errorMessageDisplay) {
                errorMessageDisplay.textContent = "Ju lutem, shkruani një tekst.";
            } else {
                alert("Ju lutem, shkruani një tekst.");
            }
        }
    });

    testBtn.addEventListener('click', function() {
        const testText = `Ti sot duhesh përgëzuar shumë, jo thjesht për hapin që po ndërmerr për jetën tënde, por edhe që je ende këtu, në Shqipërinë tonë ku për fat të keq studentët paksohen vit pas viti. Nuk është e lehtë të vendosësh që të qëndrosh, kur e ke mundësinë për të ikur. Universitetet tona mund të mos ofrojnë kushtet më të mira të mundshme, por kanë histori të shkëlqyer e kanë formësuar sigurishtë breza të tërë intelektualësh të këtij vendi. Në auditoret e universiteteve tona ka studentë të talentuar e të përkushtuar, ka pedagogë pasionantë që e dashurojnë punën që bëjnë, ka profesorat me merita të padiskutueshme. Pavarësisht dritëhijeve, universiteti sot e gjithë ditën mbetet institucion i vlerave.`;
        handleGrammarCheck(testText);
    });

    document.getElementById("submitted-content").addEventListener('click', function(e) {
        if (e.target.classList.contains('copy-btn')) {
            const textToCopy = e.target.previousElementSibling.textContent;
            navigator.clipboard.writeText(textToCopy).then(() => {
                e.target.textContent = "Kopjuar!";
                e.target.style.background = "#4CAF50";
                setTimeout(() => {
                    e.target.textContent = "Kopjo";
                    e.target.style.background = "";
                }, 2000);
            });
        }

        if (e.target.classList.contains('reload-btn')) {
            e.target.classList.add('loading');
            e.target.textContent = "Duke rifreskuar...";
            setTimeout(() => { window.location.reload(true); }, 500);
        }
    });

    //Helper Functions 
    function formatCorrections(originalText, results) {
        let formattedText = originalText;
        results.forEach(({ word, suggestions }) => {
            if (suggestions.length > 0) {
                formattedText = formattedText.replace(
                    new RegExp(`\\b${word}\\b`, "gi"),
                    `<span class="highlight-word">${word} <span class="suggestion">→ ${suggestions[0]}</span></span>`
                );
            }
        });
        return formattedText;
    }

    function generateSuggestionsHTML(results) {
        if (results.length === 0) {
            return '<p>Nuk u gjet asnjë gabim.</p>';
        }
        return results
            .filter(({ suggestions }) => suggestions.length > 0)
            .map(({ word, suggestions }) =>
                `<p>Ndrysho <strong>${word}</strong> me: <span class="highlight">${suggestions[0]}</span></p>`
            )
            .join("");
    }


    document.documentElement.style.setProperty('--accent-color', '#cccccc');
    document.querySelector('.control-buttons').style.display = 'none';
});
