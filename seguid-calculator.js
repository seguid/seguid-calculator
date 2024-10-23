const seguid_calulator = () => {
    const addSeguidCalculatorToDOM = () => {
        // Function to create a row with two columns
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
        } // createRow()
    
        const scDiv = document.getElementById("seguid-calculator");
    
        // Create the first row with instructions
        const row1 = document.createElement("div");
        row1.className = "row";
        const col1 = document.createElement("div");
        col1.className = "col";
        col1.innerHTML = "Biological sequences in raw format only. All except GATCRYWSMKHBVDN will be ignored. Complement and reverse complement will be calculated based on the {DNA-extended} alphabet.";
        row1.appendChild(col1);
        scDiv.appendChild(row1);
        
        // Create the next set of rows
        scDiv.appendChild(createRow("linear single-strand", "lsseguid"));
        scDiv.appendChild(createRow("circular single-strand", "csseguid"));
        scDiv.appendChild(createRow("linear double-strand", "ldseguid"));
        scDiv.appendChild(createRow("circular double-strand", "cdseguid"));
        scDiv.appendChild(createRow("Length", "length"));
        scDiv.appendChild(createRow("Characters", "chars"));
        
        // Create the textarea for the sequence input
        const textareaRow = document.createElement("div");
        textareaRow.className = "row";
        const textarea = document.createElement("textarea");
        textarea.className = "form-control mb-3";
        textarea.id = "sequence";
        textarea.rows = 10;
        textarea.cols = 120;
        textareaRow.appendChild(textarea);
        scDiv.appendChild(textareaRow);
        
        // Create the button row
        const buttonRow = document.createElement("div");
        buttonRow.className = "row d-flex justify-content-start";
        
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "col-auto";
        
        // Create and append buttons
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
    } // addSeguidCalculatorToDOM()
    
    
    // Genomic-sequence functions
    function makeComplementTable(alphabet = "{DNA-extended}") {
        // seguid.js:ALPHABETS
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
    
    
    // User-interface functions
    const purify = (s) => {
        return s.toUpperCase().replace(/[^GATCRYWSMKHBVDN]/g, "");
    }
    

    // Set up GUI
    addSeguidCalculatorToDOM();
    const sequence = document.getElementById("sequence");
    
    const update = async () => {
        sequence.value = purify(sequence.value);
        if (sequence.value.length === 0) {
            let el = document.getElementById("lsseguid");
            el.innerHTML = "";
            el = document.getElementById("csseguid");
            el.innerHTML = "";
            el = document.getElementById("ldseguid");
            el.innerHTML = "";
            el = document.getElementById("cdseguid");
            el.innerHTML = "";
        } else {
            let el = document.getElementById("lsseguid");
            //  seguid.js:lsseguid()
            el.innerHTML = await lsseguid(sequence.value, alphabet = "{DNA-extended}");
            el = document.getElementById("csseguid");
            // seguid.js:csseguid()
            el.innerHTML = await csseguid(sequence.value, alphabet = "{DNA-extended}");
            el = document.getElementById("ldseguid");
            // seguid.js:ldseguid()
            el.innerHTML = await ldseguid(sequence.value, reverseComplement(sequence.value), alphabet = "{DNA-extended}");
            
            el = document.getElementById("cdseguid");
            //  seguid.js:cdseguid()
            el.innerHTML = await cdseguid(sequence.value, reverseComplement(sequence.value), alphabet = "{DNA-extended}");
        }
        
        el = document.getElementById("length");
        el.innerHTML = sequence.value.length;
        
        el = document.getElementById("chars");
        el.innerHTML = [...new Set(sequence.value.toUpperCase().split("").sort())].join(" ");
    
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
