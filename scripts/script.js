/*global firstBy:true*/
(function () {
  const fontCollection = [
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

  const fonts = fontCollection
    .sort(firstBy('fontFamily').thenBy('fontWeight'))
    .map(f => {
      const name = f.fontFamily + ' (' + f.fontWeight + ')';
      return {
        name       : name,
        properName : name.toLowerCase().replace(/[()]/g, '').replace(/\s/g, '-'),
        font       : f
      };
    });

  const englishText = 'The quick brown fox jumps over the lazy dog.';
  // https://clagnut.com/blog/2380/#Malayalam
  const malayalamText = 'അജവും ആനയും ഐരാവതവും ഗരുഡനും കഠോര സ്വരം പൊഴിക്കെ ഹാരവും ഒഢ്യാണവും ഫാലത്തില്‍ മഞ്ഞളും ഈറന്‍ കേശത്തില്‍ ഔഷധ എണ്ണയുമായി ഋതുമതിയും അനഘയും ഭൂനാഥയുമായ ഉമ ദുഃഖഛവിയോടെ ഇടതു പാദം ഏന്തി ങ്യേയാദൃശം നിര്‍ഝരിയിലെ ചിറ്റലകളെ ഓമനിക്കുമ്പോള്‍ ബാ‍ലയുടെ കണ്‍കളില്‍ നീര്‍ ഊര്‍ന്നു വിങ്ങി.';

  document.querySelectorAll('.ml-text').forEach(e => e.innerText = malayalamText);
  document.querySelectorAll('.en-text').forEach(e => e.innerText = englishText);

  const makeActive = (itemsSelector, activeElement) => {
    document.querySelectorAll(itemsSelector).forEach(f => f.classList.remove('active'));
    activeElement.classList.add('active');
  };

  const switcher = document.querySelector('#switcher');

  document.querySelector('#open-switcher').onclick = function (e) {
    switcher.style.display = 'inline-block';
    e.stopPropagation();
  };

  switcher.onclick = e => { e.stopPropagation(); };

  const closeSwitcher = document.querySelector('#close-switcher');
  closeSwitcher.onclick = () => switcher.style.display = 'none';

  fonts.forEach(function (f) {
    const fontElement = document.createElement('div');
    fontElement.id = f.properName + '-button';
    fontElement.className = 'switcher-font';
    const normalizedName = f.name.replace(/\s\(normal\)/, '');
    fontElement.innerText = normalizedName;
    fontElement.onclick = function () {
      // change the font name
      const nameElement = document.querySelector('#font-name');
      nameElement.innerText = normalizedName;

      // change the static preview
      const fontCssText = 'font-family: \'' + f.font.fontFamily + '\'; font-weight: ' + f.font.fontWeight + '; font-style: normal;';
      const fontContainerElement = document.querySelector('.font-container');
      fontContainerElement.style.cssText = fontCssText;

      // change the tabHeadContainer font
      const tabHeadContainerElement = document.querySelector('.tab-head-container');
      tabHeadContainerElement.style.cssText = fontCssText;

      // update the usage
      const usageElement = document.querySelector('#usage');
      usageElement.innerText = '<!-- HTML (within the HEAD element) -->\n<link rel="stylesheet" href="https://cdn.jsdelivr.net/smc-webfonts/latest/fonts/' + f.font.cssFileName + '.min.css">\n\n/* CSS */\n.your-style {\n  font-family : \'' + f.font.fontFamily + '\';\n  font-weight : ' + f.font.fontWeight + ';\n  font-style  : normal;\n}';

      // set hash
      window.location.hash = '#' + f.properName;

      // make this font active
      makeActive('.switcher-font', this);

      // switch the jsfiddle
      const jsFiddleContainer = document.querySelector('#jsFiddle-container');
      while (jsFiddleContainer.firstChild) {
        jsFiddleContainer.removeChild(jsFiddleContainer.firstChild);
      }
      const jsFiddle = document.createElement('script');
      jsFiddle.setAttribute('async', '');
      jsFiddle.setAttribute('src', '//jsfiddle.net/FloydPink/' + f.font.jsFiddleId + '/embed/result,css,html/');
      jsFiddleContainer.appendChild(jsFiddle);

      // set page title
      document.title = 'SMC Malayalam Webfonts - ' + normalizedName;

      // close the menu
      closeSwitcher.onclick.call(closeSwitcher);
    };

    switcher.appendChild(fontElement);
  });

  document.querySelectorAll('.tab-head').forEach(function (h) {
    h.onclick = function () {
      document.querySelectorAll('.tab').forEach(t => t.style.display = 'none');
      document.querySelector('.' + this.id).style.display = 'block';

      makeActive('.tab-head', this);
    };
  });

  document.querySelector('html').onclick = () => { closeSwitcher.onclick.call(closeSwitcher); };

  const mlHead = document.querySelector('#ml');
  mlHead.onclick.call(mlHead);

  let initialFont = 'manjari-normal';
  if (window.location.hash) {
    const activeFontName = window.location.hash.substring(1);
    if (fonts.filter(f => f.properName === activeFontName).length === 1) {
      initialFont = activeFontName;
    }
  }

  const firstFontElement = document.querySelector('#' + initialFont + '-button');
  firstFontElement.onclick.call(firstFontElement);

})();
