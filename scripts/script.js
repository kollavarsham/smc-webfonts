(function () {
  var fontCollection = [
    {
      fontFamily  : 'Meera',
      fontWeight  : 'normal',
      fontStyle   : 'normal',
      cssFileName : 'meera',
      jsFiddleId  : 'v4vyxLju'
    }, {
      fontFamily  : 'Rachana',
      fontWeight  : 'normal',
      fontStyle   : 'normal',
      cssFileName : 'rachana',
      jsFiddleId  : 'mapzaymx'
    }, {
      fontFamily  : 'Dyuthi',
      fontWeight  : 'normal',
      fontStyle   : 'normal',
      cssFileName : 'dyuthi',
      jsFiddleId  : '1c791dfe'
    }, {
      fontFamily  : 'RaghuMalayalam',
      fontWeight  : 'normal',
      fontStyle   : 'normal',
      cssFileName : 'raghumalayalam',
      jsFiddleId  : 'f1L1jy2z'
    }, {
      fontFamily  : 'Chilanka',
      fontWeight  : 'normal',
      fontStyle   : 'normal',
      cssFileName : 'chilanka',
      jsFiddleId  : 'tp2m8L9p'
    }, {
      fontFamily  : 'Keraleeyam',
      fontWeight  : 'bold',
      fontStyle   : 'normal',
      cssFileName : 'keraleeyam',
      jsFiddleId  : 'a6uqj4eL'
    }, {
      fontFamily  : 'Manjari',
      fontWeight  : 'normal',
      fontStyle   : 'normal',
      cssFileName : 'manjari',
      jsFiddleId  : '133d3ajo'
    }, {
      fontFamily  : 'Manjari',
      fontWeight  : 100,
      fontStyle   : 'normal',
      cssFileName : 'manjari',
      jsFiddleId  : 'h4mmru5e'
    }, {
      fontFamily  : 'Suruma',
      fontWeight  : 500,
      fontStyle   : 'normal',
      cssFileName : 'suruma',
      jsFiddleId  : 'Lv8dchff'
    }, {
      fontFamily  : 'Rachana',
      fontWeight  : 'bold',
      fontStyle   : 'normal',
      cssFileName : 'rachana',
      jsFiddleId  : '1f7nxt16'
    }, {
      fontFamily  : 'Uroob',
      fontWeight  : 'bold',
      fontStyle   : 'normal',
      cssFileName : 'uroob',
      jsFiddleId  : 'pLq5qz9j'
    }, {
      fontFamily  : 'Karumbi',
      fontWeight  : 'normal',
      fontStyle   : 'normal',
      cssFileName : 'karumbi',
      jsFiddleId  : '7d3okgq9'
    }, {
      fontFamily  : 'AnjaliOldLipi',
      fontWeight  : 'normal',
      fontStyle   : 'normal',
      cssFileName : 'anjali',
      jsFiddleId  : '9ajq9cun'
    }, {
      fontFamily  : 'Manjari',
      fontWeight  : 'bold',
      fontStyle   : 'normal',
      cssFileName : 'manjari',
      jsFiddleId  : '3c3vuuz6'
    }
  ];

  var fonts = fontCollection
    .sort(firstBy('fontFamily').thenBy('fontWeight'))
    .map(function (f) {
      var name = f.fontFamily + ' (' + f.fontWeight + ')';
      return {
        name       : name,
        properName : name.toLowerCase().replace(/\(|\)/g, '').replace(/\s/g, '-'),
        font       : f
      };
    });

  var englishText = 'The quick brown fox jumps over the lazy dog.';
  var malayalamText = 'ഖസാക്കിന്റെ ഇതിഹാസം നാടകം മലയാള ­നാടക ­ചരിത്രത്തിലെ ഒരു സംഭവ­മാണ് – ഒരു ഗ്രാമം ഒത്തു ചേര്‍ന്ന് നാടകം സൃഷ്ടിക്കുക. കുഞ്ഞുങ്ങള്‍­ മുതല്‍ വൃദ്ധര്‍ വരെ അഭിനേതാ­ക്കളാകുക, നാടക­ത്തിനായി ഗ്രാമ­ത്തിലെ എല്ലാ കുടുംബ­ങ്ങളും മാസ­ങ്ങളോളം പണി­യെടുക്കുക. അടുത്ത­കാലത്തൊന്നും ഇത്തര­ത്തിലൊരു സംഘാടന­മുണ്ടായിട്ടില്ല. അവ­തരണ­ത്തിലും നാടകം ശ്രദ്ധയാ­കര്‍ഷിച്ചു. ഇന്ത്യയുടെ വിവിധ­ഭാഗങ്ങളില്‍നിന്ന് നാടകാ­സ്വാദകര്‍ ഖസാക്ക് കാണാന്‍ തൃക്കരിപ്പൂരി­ലെത്തി.';

  document.querySelectorAll('.ml-text').forEach(function (e) { e.innerText = malayalamText; });
  document.querySelectorAll('.en-text').forEach(function (e) { e.innerText = englishText; });

  var makeActive = function (itemsSelector, activeElement) {
    document.querySelectorAll(itemsSelector).forEach(function (f) { f.classList.remove('active'); });
    activeElement.classList.add('active');
  };

  var switcher = document.querySelector('#switcher');

  var openSwitcher = document.querySelector('#open-switcher');
  openSwitcher.onclick = function () {
    switcher.style.display = 'inline-block';
  };

  var closeSwitcher = document.querySelector('#close-switcher');
  closeSwitcher.onclick = function () {
    switcher.style.display = 'none';
  };

  fonts.forEach(function (f) {
    var fontElement = document.createElement('div');
    fontElement.id = f.properName + '-button';
    fontElement.className = 'switcher-font';
    var normalizedName = f.name.replace(/\s\(normal\)/, '');
    fontElement.innerText = normalizedName;
    fontElement.onclick = function () {
      var nameElement = document.querySelector('#font-name');
      nameElement.innerText = normalizedName;

      var fontCssText = 'font-family: \'' + f.font.fontFamily + '\'; font-weight: ' + f.font.fontWeight + '; font-style: normal;';
      var fontContainerElement = document.querySelector('.font-container');
      fontContainerElement.style.cssText = fontCssText;

      var tabHeadContainerElement = document.querySelector('.tab-head-container');
      tabHeadContainerElement.style.cssText = fontCssText;

      var usageElement = document.querySelector('#usage');
      usageElement.innerText = '<!-- HTML (within the HEAD element) -->\n<link rel="stylesheet" href="https://cdn.jsdelivr.net/smc-webfonts/0.0.1/fonts/' + f.font.cssFileName + '.min.css">\n\n/* CSS */\n.your-style {\n  font-family : \'' + f.font.fontFamily + '\';\n  font-weight : ' + f.font.fontWeight + ';\n  font-style  : normal;\n}';

      window.location.hash = '#' + f.properName;

      makeActive('.switcher-font', this);

      var jsFiddleContainer = document.querySelector('#jsFiddle-container');
      while (jsFiddleContainer.firstChild) {
        jsFiddleContainer.removeChild(jsFiddleContainer.firstChild);
      }
      var jsFiddle = document.createElement('script');
      jsFiddle.setAttribute('async', '');
      jsFiddle.setAttribute('src', '//jsfiddle.net/FloydPink/' + f.font.jsFiddleId + '/embed/result,css,html/');

      jsFiddleContainer.appendChild(jsFiddle);

      closeSwitcher.onclick.call(closeSwitcher);
    };
    switcher.appendChild(fontElement);

  });

  document.querySelectorAll('.tab-head').forEach(function (h) {
    h.onclick = function () {
      document.querySelectorAll('.tab').forEach(function (t) { t.style.display = 'none'; });
      document.querySelector('.' + this.id).style.display = 'block';

      makeActive('.tab-head', this);
    };
  });

  var mlHead = document.querySelector('#ml');
  mlHead.onclick.call(mlHead);

  var initialFont = 'manjari-normal';
  if (window.location.hash) {
    var activeFontName = window.location.hash.substring(1);
    if (fonts.filter(function (f) { return f.properName === activeFontName;}).length === 1) {
      initialFont = activeFontName;
    }
  }

  var firstFontElement = document.querySelector('#' + initialFont + '-button');
  firstFontElement.onclick.call(firstFontElement);

})();