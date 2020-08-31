define(function (require, exports, module) {
  var data = require('../core/data');

  var Base64 = {
    _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    encode: function (e) {
      var t = '';
      var n, r, i, s, o, u, a;
      var f = 0;
      e = Base64._utf8_encode(e);
      while (f < e.length) {
        n = e.charCodeAt(f++);
        r = e.charCodeAt(f++);
        i = e.charCodeAt(f++);
        s = n >> 2;
        o = ((n & 3) << 4) | (r >> 4);
        u = ((r & 15) << 2) | (i >> 6);
        a = i & 63;
        if (isNaN(r)) {
          u = a = 64;
        } else if (isNaN(i)) {
          a = 64;
        }
        t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a);
      }
      return t;
    },
    decode: function (e) {
      var t = '';
      var n, r, i;
      var s, o, u, a;
      var f = 0;
      e = e.replace(/[^A-Za-z0-9\+\/\=]/g, '');
      while (f < e.length) {
        s = this._keyStr.indexOf(e.charAt(f++));
        o = this._keyStr.indexOf(e.charAt(f++));
        u = this._keyStr.indexOf(e.charAt(f++));
        a = this._keyStr.indexOf(e.charAt(f++));
        n = (s << 2) | (o >> 4);
        r = ((o & 15) << 4) | (u >> 2);
        i = ((u & 3) << 6) | a;
        t = t + String.fromCharCode(n);
        if (u != 64) {
          t = t + String.fromCharCode(r);
        }
        if (a != 64) {
          t = t + String.fromCharCode(i);
        }
      }
      t = Base64._utf8_decode(t);
      return t;
    },
    _utf8_encode: function (e) {
      e = e.replace(/\r\n/g, '\n');
      var t = '';
      for (var n = 0; n < e.length; n++) {
        var r = e.charCodeAt(n);
        if (r < 128) {
          t += String.fromCharCode(r);
        } else if (r > 127 && r < 2048) {
          t += String.fromCharCode((r >> 6) | 192);
          t += String.fromCharCode((r & 63) | 128);
        } else {
          t += String.fromCharCode((r >> 12) | 224);
          t += String.fromCharCode(((r >> 6) & 63) | 128);
          t += String.fromCharCode((r & 63) | 128);
        }
      }
      return t;
    },
    _utf8_decode: function (e) {
      var t = '';
      var n = 0;
      var r = (c1 = c2 = 0);
      while (n < e.length) {
        r = e.charCodeAt(n);
        if (r < 128) {
          t += String.fromCharCode(r);
          n++;
        } else if (r > 191 && r < 224) {
          c2 = e.charCodeAt(n + 1);
          t += String.fromCharCode(((r & 31) << 6) | (c2 & 63));
          n += 2;
        } else {
          c2 = e.charCodeAt(n + 1);
          c3 = e.charCodeAt(n + 2);
          t += String.fromCharCode(((r & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
          n += 3;
        }
      }
      return t;
    },
  };

  /**
   * 导出svg时删除全部svg元素中的transform
   * @auth Naixor
   * @method removeTransform
   * @param  {[type]}        svgDom [description]
   * @return {[type]}               [description]
   */
  function cleanSVG(svgDom, x, y) {
    function getTransformToElement(target, source) {
      var matrix;
      try {
        matrix = source.getScreenCTM().inverse();
      } catch (e) {
        throw new Error("Can not inverse source element' ctm.");
      }
      return matrix.multiply(target.getScreenCTM());
    }
    function dealWithPath(d, dealWithPattern) {
      if (!(dealWithPattern instanceof Function)) {
        dealWithPattern = function () {};
      }
      var strArr = [],
        pattern = [],
        cache = [];
      for (var i = 0, l = d.length; i < l; i++) {
        switch (d[i]) {
          case 'M':
          case 'L':
          case 'T':
          case 'S':
          case 'A':
          case 'C':
          case 'H':
          case 'V':
          case 'Q': {
            if (cache.length) {
              pattern.push(cache.join(''));
              cache = [];
            }
            // 脑图的path格式真奇怪...偶尔就给我蹦出来一个"..V123 C..", 那空格几个意思 - -
            if (pattern[pattern.length - 1] === ',') {
              pattern.pop();
            }
            if (pattern.length) {
              dealWithPattern(pattern);
              strArr.push(pattern.join(''));
              pattern = [];
            }
            pattern.push(d[i]);
            break;
          }
          case 'Z':
          case 'z': {
            pattern.push(cache.join(''), d[i]);
            dealWithPattern(pattern);
            strArr.push(pattern.join(''));
            cache = [];
            pattern = [];
            break;
          }
          case '.':
          case 'e': {
            cache.push(d[i]);
            break;
          }
          case '-': {
            if (d[i - 1] !== 'e') {
              if (cache.length) {
                pattern.push(cache.join(''), ',');
              }
              cache = [];
            }
            cache.push('-');
            break;
          }
          case ' ':
          case ',': {
            if (cache.length) {
              pattern.push(cache.join(''), ',');
              cache = [];
            }
            break;
          }
          default: {
            if (/\d/.test(d[i])) {
              cache.push(d[i]);
            } else {
              // m a c s q h v l t z情况
              if (cache.length) {
                pattern.push(cache.join(''), d[i]);
                cache = [];
              } else {
                // 脑图的path格式真奇怪...偶尔就给我蹦出来一个"..V123 c..", 那空格几个意思 - -
                if (pattern[pattern.length - 1] === ',') {
                  pattern.pop();
                }
                pattern.push(d[i]);
              }
            }
            if (i + 1 === l) {
              if (cache.length) {
                pattern.push(cache.join(''));
              }
              dealWithPattern(pattern);
              strArr.push(pattern.join(''));
              cache = null;
              pattern = null;
            }
          }
        }
      }
      return strArr.join('');
    }

    function replaceWithNode(svgNode, parentX, parentY) {
      if (!svgNode) {
        return;
      }
      if (svgNode.tagName === 'defs') {
        return;
      }
      if (svgNode.getAttribute('fill') === 'transparent') {
        svgNode.setAttribute('fill', 'none');
      }
      if (svgNode.getAttribute('marker-end')) {
        svgNode.removeAttribute('marker-end');
      }
      parentX = parentX || 0;
      parentY = parentY || 0;
      if (svgNode.getAttribute('transform')) {
        var ctm = getTransformToElement(svgNode, svgNode.parentElement);
        parentX -= ctm.e;
        parentY -= ctm.f;
        svgNode.removeAttribute('transform');
      }
      switch (svgNode.tagName.toLowerCase()) {
        case 'g':
          break;
        case 'path': {
          var d = svgNode.getAttribute('d');
          if (d) {
            d = dealWithPath(d, function (pattern) {
              switch (pattern[0]) {
                case 'V': {
                  pattern[1] = +pattern[1] - parentY;
                  break;
                }
                case 'H': {
                  pattern[1] = +pattern[1] - parentX;
                  break;
                }
                case 'M':
                case 'L':
                case 'T': {
                  pattern[1] = +pattern[1] - parentX;
                  pattern[3] = +pattern[3] - parentY;
                  break;
                }
                case 'Q':
                case 'S': {
                  pattern[1] = +pattern[1] - parentX;
                  pattern[3] = +pattern[3] - parentY;
                  pattern[5] = +pattern[5] - parentX;
                  pattern[7] = +pattern[7] - parentY;
                  break;
                }
                case 'A': {
                  pattern[11] = +pattern[11] - parentX;
                  pattern[13] = +pattern[13] - parentY;
                  break;
                }
                case 'C': {
                  pattern[1] = +pattern[1] - parentX;
                  pattern[3] = +pattern[3] - parentY;
                  pattern[5] = +pattern[5] - parentX;
                  pattern[7] = +pattern[7] - parentY;
                  pattern[9] = +pattern[9] - parentX;
                  pattern[11] = +pattern[11] - parentY;
                }
              }
            });
            svgNode.setAttribute('d', d);
            svgNode.removeAttribute('transform');
          }
          return;
        }
        case 'image':
        case 'text': {
          if (parentX && parentY) {
            var x = +svgNode.getAttribute('x') || 0,
              y = +svgNode.getAttribute('y') || 0;
            svgNode.setAttribute('x', x - parentX);
            svgNode.setAttribute('y', y - parentY);
          }
          if (svgNode.getAttribute('dominant-baseline')) {
            svgNode.removeAttribute('dominant-baseline');
            svgNode.setAttribute('dy', '.8em');
          }
          svgNode.removeAttribute('transform');
          return;
        }
      }
      if (svgNode.children) {
        for (var i = 0, l = svgNode.children.length; i < l; i++) {
          replaceWithNode(svgNode.children[i], parentX, parentY);
        }
      }
    }
    svgDom.style.visibility = 'hidden';
    replaceWithNode(svgDom, x || 0, y || 0);
    svgDom.style.visibility = 'visible';
  }
  data.registerProtocol(
    'svg',
    (module.exports = {
      fileDescription: 'SVG 矢量图',
      fileExtension: '.svg',
      mineType: 'image/svg+xml',
      dataType: 'text',
      encode: function (json, minder) {
        var paper = minder.getPaper(),
          paperTransform = paper.shapeNode.getAttribute('transform'),
          svgXml,
          svgContainer,
          svgDom,
          renderContainer = minder.getRenderContainer(),
          renderBox = renderContainer.getRenderBox(),
          transform = renderContainer.getTransform(),
          width = renderBox.width,
          height = renderBox.height,
          padding = 20;
        paper.shapeNode.setAttribute('transform', 'translate(0.5, 0.5)');
        svgXml = paper.container.innerHTML;
        paper.shapeNode.setAttribute('transform', paperTransform);
        svgContainer = document.createElement('div');
        document.body.appendChild(svgContainer);
        svgContainer.innerHTML = svgXml;
        svgDom = svgContainer.querySelector('svg');
        svgDom.setAttribute('width', (width + padding * 2) | 0);
        svgDom.setAttribute('height', (height + padding * 2) | 0);
        svgDom.setAttribute('style', 'background: ' + minder.getStyle('background')); //"font-family: Arial, Microsoft Yahei, Heiti SC; " +
        svgDom.setAttribute('viewBox', [0, 0, (width + padding * 2) | 0, (height + padding * 2) | 0].join(' '));
        svgDom.setAttribute('content', Base64.encode(JSON.stringify(json))); // 保存json
        tempSvgContainer = document.createElement('div');
        cleanSVG(svgDom, (renderBox.x - padding) | 0, (renderBox.y - padding) | 0);
        document.body.removeChild(svgContainer);
        tempSvgContainer.appendChild(svgDom);
        // need a xml with width and height
        svgXml = tempSvgContainer.innerHTML;
        // var jsonXML = '<defs id="kitymindJSON">' + HtmlUtil.htmlEncode(JSON.stringify(json)) + '</defs>';
        // svgXml = svgXml.slice(0, svgXml.indexOf('>') + 1) + jsonXML + svgXml.slice(svgXml.indexOf('<', 1));
        // svg 含有 &nbsp; 符号导出报错 Entity 'nbsp' not defined
        svgXml = svgXml.replace(/&nbsp;/g, '&#xa0;');
        // svg 含有 &nbsp; 符号导出报错 Entity 'nbsp' not defined
        return svgXml;
      },
      decode: function (svgXml) {
        var svgContainer = document.createElement('div');
        document.body.appendChild(svgContainer);
        svgContainer.innerHTML = svgXml;
        var svgDom = svgContainer.querySelector('svg');
        var json = JSON.parse(Base64.decode(svgDom.getAttribute('content')));
        return json;
      },
    })
  );
});
