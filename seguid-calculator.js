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
const purify = (s) => {
    return s.toUpperCase().replace(/[^GATCRYWSMKHBVDN]/g, '');
}
const complement = (s) => {
    const chars = s.split('');
    for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        if (complement_table[char]) {
            chars[i] = complement_table[char];
        }
    }
    return chars.join('');
}

const reverse = (s) => {
    return s.split('').reverse().join('');
}

const reverse_complement = (s) => {
    return complement(reverse(s));
}

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
        el.innerHTML = await lsseguid(sequence.value, alphabet = "{DNA-extended}");
        el = document.getElementById("csseguid");
        el.innerHTML = await csseguid(sequence.value, alphabet = "{DNA-extended}");
        el = document.getElementById("ldseguid");
        el.innerHTML = await ldseguid(sequence.value, reverse_complement(sequence.value), alphabet = "{DNA-extended}");
        el = document.getElementById("cdseguid");
        el.innerHTML = await cdseguid(sequence.value, reverse_complement(sequence.value), alphabet = "{DNA-extended}");
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
    sequence.value = reverse_complement(sequence.value);
    update();
});
button = document.getElementById("clear");
button.addEventListener("click", function () {
    sequence.value = "";
    update();
});

update();
