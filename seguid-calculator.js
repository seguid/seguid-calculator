const SEGUID_JS_URL = "https://rawcdn.githack.com/seguid/seguid-javascript/main/seguid.js";

const seguid_calulator = () => {
    const VALID_CHARS = /^[GATCRYWSMKHBVDN]$/;

    const injectStyles = () => {
        const style = document.createElement("style");
        style.textContent = `
            #sequence:focus {
                outline: none;
                box-shadow: none;
            }
        `;
        document.head.appendChild(style);
    };

    const addSeguidCalculatorToDOM = () => {
        function createRow(text, id) {
            const row = document.createElement("div");
            row.className = "row fs-6 font-monospace";

            const col1 = document.createElement("div");
            col1.className = "col-md-5";
            col1.textContent = text;

            const col2 = document.createElement("div");
            col2.className = "col-md-6";
            col2.id = id;
            col2.style.whiteSpace = "nowrap";

            row.appendChild(col1);
            row.appendChild(col2);

            return row;
        }

        const scDiv = document.getElementById("seguid-calculator");

        const row1 = document.createElement("div");
        row1.className = "row";
        const col1 = document.createElement("div");
        col1.className = "col";
        col1.innerHTML = "Biological sequences in raw format only. Only GATCRYWSMKHBVDN ({DNA-extended} alphabet) are accepted. Complement and reverse complement will be calculated based on the {DNA-extended} alphabet.";
        row1.appendChild(col1);
        scDiv.appendChild(row1);

        scDiv.appendChild(createRow("linear single-strand", "lsseguid"));
        scDiv.appendChild(createRow("circular single-strand", "csseguid"));
        scDiv.appendChild(createRow("linear double-strand", "ldseguid"));
        scDiv.appendChild(createRow("circular double-strand", "cdseguid"));
        scDiv.appendChild(createRow("Length", "length"));
        scDiv.appendChild(createRow("Characters", "chars"));

        const textareaRow = document.createElement("div");
        textareaRow.className = "row";
        const textarea = document.createElement("textarea");
        textarea.className = "form-control mb-3";
        textarea.id = "sequence";
        textarea.rows = 10;
        textareaRow.appendChild(textarea);
        scDiv.appendChild(textareaRow);

        const errorDiv = document.createElement("div");
        errorDiv.className = "alert alert-danger mb-3";
        errorDiv.style.display = "none";
        scDiv.appendChild(errorDiv);

        const buttonRow = document.createElement("div");
        buttonRow.className = "row d-flex justify-content-start";

        const buttonContainer = document.createElement("div");
        buttonContainer.className = "col-auto";

        const buttons = [
            { id: "reverse", text: "Reverse", class: "btn btn-success me-2" },
            { id: "complement", text: "Complement", class: "btn btn-success me-2" },
            { id: "reverse_complement", text: "Reverse Complement", class: "btn btn-success me-2" },
            { id: "clear", text: "Clear", class: "btn btn-danger" }
        ];

        buttons.forEach(buttonInfo => {
            const button = document.createElement("button");
            button.id = buttonInfo.id;
            button.className = buttonInfo.class;
            button.textContent = buttonInfo.text;
            buttonContainer.appendChild(button);
        });

        buttonRow.appendChild(buttonContainer);
        scDiv.appendChild(buttonRow);

        return errorDiv;
    }


    // Genomic-sequence functions
    function makeComplementTable(alphabet = "{DNA-extended}") {
        pairs = ALPHABETS[alphabet];
        const table = {};
        for (p of pairs.split(",")) {
            table[p[0]] = p[1];
            table[p[1]] = p[0];
        }
        return table;
    }

    const complement_table = makeComplementTable();

    const complement = (s) => {
        const chars = s.split("");
        for (let i = 0; i < chars.length; i++) {
            const char = chars[i];
            if (complement_table[char]) {
                chars[i] = complement_table[char];
            }
        }
        return chars.join("");
    }

    const reverse = (s) => {
        return s.split("").reverse().join("");
    }

    const reverseComplement = (s) => {
        return complement(reverse(s));
    }


    // Validation
    const getInvalidChars = (s) => {
        const invalid = new Set();
        for (const ch of s) {
            if (!VALID_CHARS.test(ch)) {
                invalid.add(ch);
            }
        }
        return invalid;
    };


    // Set up GUI
    injectStyles();
    const errorDiv = addSeguidCalculatorToDOM();
    const sequence = document.getElementById("sequence");

    const update = async () => {
        const raw = sequence.value.toUpperCase().replace(/\s/g, "");
        sequence.value = raw;

        const invalid = getInvalidChars(raw);

        document.getElementById("length").innerHTML = raw.length;
        const sortedChars = [...new Set(raw.split("").sort())];
        document.getElementById("chars").innerHTML = sortedChars.join(" ");

        const reverseBtn = document.getElementById("reverse");
        const complementBtn = document.getElementById("complement");
        const rcBtn = document.getElementById("reverse_complement");

        if (invalid.size > 0) {
            const charList = [...invalid].sort().map(c => `'${c}'`).join(", ");
            errorDiv.textContent = `Invalid characters: ${charList}. Only GATCRYWSMKHBVDN are accepted.`;
            errorDiv.style.display = "block";

            document.getElementById("lsseguid").innerHTML = "";
            document.getElementById("csseguid").innerHTML = "";
            document.getElementById("ldseguid").innerHTML = "";
            document.getElementById("cdseguid").innerHTML = "";

            reverseBtn.disabled = true;
            complementBtn.disabled = true;
            rcBtn.disabled = true;
        } else {
            errorDiv.style.display = "none";

            reverseBtn.disabled = false;
            complementBtn.disabled = false;
            rcBtn.disabled = false;

            if (raw.length === 0) {
                document.getElementById("lsseguid").innerHTML = "";
                document.getElementById("csseguid").innerHTML = "";
                document.getElementById("ldseguid").innerHTML = "";
                document.getElementById("cdseguid").innerHTML = "";
            } else {
                document.getElementById("lsseguid").innerHTML = await lsseguid(raw, alphabet = "{DNA-extended}");
                document.getElementById("csseguid").innerHTML = await csseguid(raw, alphabet = "{DNA-extended}");
                document.getElementById("ldseguid").innerHTML = await ldseguid(raw, reverseComplement(raw), alphabet = "{DNA-extended}");
                document.getElementById("cdseguid").innerHTML = await cdseguid(raw, reverseComplement(raw), alphabet = "{DNA-extended}");
            }
        }
    }

    sequence.addEventListener("input", update);

    let button = document.getElementById("reverse");
    button.addEventListener("click", function () {
        sequence.value = reverse(sequence.value);
        update();
    });

    button = document.getElementById("complement");
    button.addEventListener("click", function () {
        sequence.value = complement(sequence.value);
        update();
    });

    button = document.getElementById("reverse_complement");
    button.addEventListener("click", function () {
        sequence.value = reverseComplement(sequence.value);
        update();
    });

    button = document.getElementById("clear");
    button.addEventListener("click", function () {
        sequence.value = "";
        update();
    });

    update();
} // seguid_calulator()

// Auto-initialize: load seguid.js if needed, then run
(function () {
    function init() {
        if (document.getElementById("seguid-calculator")) {
            seguid_calulator();
        }
    }

    function onReady(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    if (typeof ALPHABETS !== "undefined" && typeof lsseguid !== "undefined") {
        onReady(init);
    } else {
        const script = document.createElement("script");
        script.src = SEGUID_JS_URL;
        script.onload = function () { onReady(init); };
        document.head.appendChild(script);
    }
})();
