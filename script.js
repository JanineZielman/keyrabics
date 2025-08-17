const layout = [
  ['}', '{', '’', '٠', '٩', '٨', '٧', '٦', '٥', '٤', '٣', '٢', '١', '+', '' ],
  ['>', '(', ':', 'خ', 'و', 'ا', 'د', 'ذ', 'ق', 'ف', 'ي', 'ه', 'ة', 'غ', 'ء'],
  ['', ']', '٬', 'ج', 'ع', 'ر', 'م', 'س', 'ك', 'ل', 'ن', 'ت', 'ب', 'ى', ''],
  ['', '', '', 'ح', 'ز', 'ص', 'ش', 'ط', 'ظ', 'ض', 'ث', '؟', '', '', '' ]
];

const output = document.getElementById("output");
const addTextBtn = document.getElementById("addTextBtn");
const keyboard = document.getElementById("keyboard");

let isDraggingText = false;
let activeText = null;
let startX, startY, startLeft, startTop;

// Create a new text field
function createTextField(initialText = "اكتب هنا...") {
  const span = document.createElement("span");
  span.className = "textField";
  span.contentEditable = "true";
  span.innerText = initialText;

  // Select it when clicked
  span.addEventListener("focus", () => {
    activeText = span;
  });

  // Draggable
  span.addEventListener("mousedown", (e) => {
    if (span.isContentEditable && document.activeElement === span) return; // don't drag while typing
    isDraggingText = true;
    activeText = span;
    startX = e.clientX;
    startY = e.clientY;
    const rect = span.getBoundingClientRect();
    const parentRect = output.getBoundingClientRect();
    startLeft = rect.left - parentRect.left;
    startTop = rect.top - parentRect.top;
    e.preventDefault();
  });

  // Double click delete
  span.addEventListener("dblclick", () => {
    if (confirm("Delete this text field?")) {
      span.remove();
      if (activeText === span) activeText = null;
    }
  });

  output.appendChild(span);
  span.focus();
}

// Add button
addTextBtn.addEventListener("click", () => {
  createTextField();
  updatePrintSize();
});

// Dragging logic
document.addEventListener("mousemove", (e) => {
  if (!isDraggingText || !activeText) return;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  activeText.style.left = startLeft + dx + "px";
  activeText.style.top = startTop + dy + "px";
  activeText.style.transform = "translate(0,0)";
});

document.addEventListener("mouseup", () => {
  isDraggingText = false;
});

// Build keyboard
layout.forEach((row) => {
  row.reverse().forEach((key) => {
    const button = document.createElement("div");
    button.className = "key";
    button.textContent = key;
    if (key === '') {
      button.style.visibility = 'hidden';
    } else {
      button.addEventListener("click", () => {
        if (!activeText) return;
        if (key === 'حذف') {
          activeText.innerText = activeText.innerText.slice(0, -1);
        } else if (key === 'غلق') {
          activeText.innerText = '';
        } else {
          // Insert character at caret
          insertAtCaret(activeText, key);
        }
      });
    }
    keyboard.appendChild(button);
  });
});

// Insert text at caret inside a contentEditable span
function insertAtCaret(el, text) {
  const sel = window.getSelection();
  const range = sel.rangeCount ? sel.getRangeAt(0) : null;
  if (range && el.contains(range.startContainer)) {
    range.deleteContents();
    range.insertNode(document.createTextNode(text));
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  } else {
    el.innerText += text;
  }
  el.focus();
}

// Global style controls
document.getElementById("fontSelect").addEventListener("change", (e) => {
  output.style.fontFamily = e.target.value;
});
document.getElementById("fontSize").addEventListener("input", (e) => {
  output.style.fontSize = e.target.value + "px";
});
document.getElementById("fontColor").addEventListener("input", (e) => {
  output.style.color = e.target.value;
});

function updateBoxSize() {
  const ratio = document.getElementById("aspectRatio").value.split(":");
  const wRatio = parseInt(ratio[0]);
  const hRatio = parseInt(ratio[1]);

  // max height = 50vh
  const maxHeight = window.innerHeight * 0.5;
  const width = (maxHeight * wRatio) / hRatio;
  const height = maxHeight;

  output.style.width = width + "px";
  output.style.height = height + "px";

  // store ratio for print styling
  output.setAttribute("data-ratio", `${wRatio}:${hRatio}`);
  updatePrintSize();
}

document.getElementById("aspectRatio").addEventListener("change", updateBoxSize);
window.addEventListener("resize", updateBoxSize);
updateBoxSize();


// Init
createTextField();
document.getElementById("boxWidth").dispatchEvent(new Event("input"));




function updatePrintSize() {
  const output = document.getElementById('output');
  const rect = output.getBoundingClientRect(); // get width and height in pixels
  const widthPx = rect.width;
  const heightPx = rect.height;

  // update CSS variables
  output.style.setProperty('--output-width', widthPx + 'px');
  output.style.setProperty('--output-height', heightPx + 'px');

  // optionally update @page size dynamically
  const styleSheet = document.getElementById('dynamic-print') || document.createElement('style');
  styleSheet.id = 'dynamic-print';
  styleSheet.innerHTML = `
    @media print {
      @page { size: ${widthPx}px ${heightPx}px; margin: 0; }
    }
  `;
  document.head.appendChild(styleSheet);
}

// call whenever output size changes
updatePrintSize();