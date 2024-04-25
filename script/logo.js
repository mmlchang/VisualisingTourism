document.addEventListener('DOMContentLoaded', function () {
  function addCSSRule(selector, rules) {
    var style = document.createElement('style');
    document.head.appendChild(style);
    style.sheet.insertRule(selector + "{" + rules + "}", 0);
  }

  // Define the CSS rules for the .letter and .letter.animate classes
  addCSSRule('.letter', 'display: inline-block; font-size: 80px; background-image: url(images/adventure.jpeg); background-repeat: repeat; -webkit-background-clip: text; -webkit-text-fill-color: transparent; -webkit-font-smoothing: antialiased; letter-spacing: 10px; font-family: \'Brush Script MT\';');
  addCSSRule('.letter.animate', 'animation: dash 500ms ease-in forwards; opacity: 0;');

  function drawText(word) {
    word = word || 'Adventure Sarawak';
    var wordArray = word.split(' ');
    var innerTextElement = document.getElementById('inner-text');
    innerTextElement.innerHTML = '';
    innerTextElement.classList.remove('done-animating');
    wordArray.forEach(function (letter, index) {
      var span = document.createElement('span');
      span.textContent = letter;
      span.className = 'letter animate';
      span.style['animation-delay'] = (300 * index) + 'ms';
      innerTextElement.appendChild(span);

      if (index === wordArray.length - 1) {
        span.addEventListener('animationend', function () {
          innerTextElement.classList.add('done-animating');
        });
      }
    });
  }

  document.getElementById('custom-text-form').addEventListener('submit', function (e) {
    e.preventDefault();
    e.stopPropagation();

    drawText(document.getElementById('custom-text').value);
  });

  drawText();
});
