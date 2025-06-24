const layout = [
      ['}', '{', '’', '٠', '٩', '٨', '٧', '٦', '٥', '٤', '٣', '٢', '١', '+', '' ],
      ['>', '(', ':', 'خ', 'و', 'ا', 'د', 'ذ', 'ق', 'ف', 'ي', 'ه', 'ة', 'غ', 'ء'],
      ['', ']', '٬', 'ج', 'ع', 'ر', 'م', 'س', 'ك', 'ل', 'ن', 'ت', 'ب', 'ى', ''],
      ['', '', '', 'ح', 'ز', 'ص', 'ش', 'ط', 'ظ', 'ض', 'ث', '؟', '', '', '' ]
    ];

    // const keyMap = {
    //   a: 'ا',
    //   b: 'ب',
    //   t: 'ت',
    //   j: 'ج',
    //   h: 'ح',
    //   d: 'د',
    //   r: 'ر',
    //   z: 'ز',
    //   s: 'س',
    //   sh: 'ش',
    //   ṣ: 'ص',
    //   ḍ: 'ض',
    //   ṭ: 'ط',
    //   ẓ: 'ظ',
    //   'ʿ': 'ع',
    //   gh: 'غ',
    //   f: 'ف',
    //   q: 'ق',
    //   k: 'ك',
    //   l: 'ل',
    //   m: 'م',
    //   n: 'ن',
    //   w: 'و',
    //   y: 'ي',
    //   ā: 'ى',
    //   th: 'ث',
    //   dh: 'ذ',
    //   'ʼ': 'ء',
    // };

    const keyboard = document.getElementById('keyboard');
    const output = document.getElementById('output');
    const exportSvgBtn = document.getElementById('exportSvgBtn');

    layout.forEach((row) => {
      row.reverse().forEach((key) => {
        const button = document.createElement('div');
        button.className = 'key';
        button.textContent = key;
        if (key === '') {
          button.style.visibility = 'hidden';
        } else {
          button.addEventListener('click', () => {
            if (key === 'حذف') {
              output.value = output.value.slice(0, -1);
            } else if (key === 'غلق') {
              output.value = '';
            } else {
              output.value += key;
            }
          });
        }
        keyboard.appendChild(button);
      });
    });

    document.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      if (key === 'backspace') {
        output.value = output.value.slice(0, -1);
      } else if (key === 'escape') {
        output.value = '';
      } 
      // else if (keyMap[key]) {
      //   output.value += keyMap[key];
      //   e.preventDefault();
      // }
    });
