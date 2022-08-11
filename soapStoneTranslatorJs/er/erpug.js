


//weird that this isnt a native js function
//insert an item at an index
Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

//img touch canvas from github
(function() {
  var root = this; //global object

  var ImgTouchCanvas = function(options) {
      if( !options || !options.canvas || !options.path) {
          throw 'ImgZoom constructor: missing arguments canvas or path';
      }

      this.canvas         = options.canvas;
      this.canvas.width   = this.canvas.clientWidth;
      this.canvas.height  = this.canvas.clientHeight;
      this.context        = this.canvas.getContext('2d');

      this.desktop = options.desktop || false; //non touch events
      
      this.position = {
          x: 0,
          y: 0
      };
      this.scale = {
          x: 0.5,
          y: 0.5
      };
      this.imgTexture = new Image();
      this.imgTexture.src = options.path;

      this.lastZoomScale = null;
      this.lastX = null;
      this.lastY = null;

      this.mdown = false; //desktop drag

      this.init = false;
      this.checkRequestAnimationFrame();
      requestAnimationFrame(this.animate.bind(this));

      this.setEventListeners();
  };


  ImgTouchCanvas.prototype = {
      animate: function() {
          //set scale such as image cover all the canvas
          if(!this.init) {
              if(this.imgTexture.width) {
                  var scaleRatio = null;
                  if(this.canvas.clientWidth > this.canvas.clientHeight) {
                      scaleRatio = this.canvas.clientWidth / this.imgTexture.width;
                  }
                  else {
                      scaleRatio = this.canvas.clientHeight / this.imgTexture.height;
                  }

                  this.scale.x = scaleRatio;
                  this.scale.y = scaleRatio;
                  this.init = true;
              }
          }

          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

          this.context.drawImage(
              this.imgTexture, 
              this.position.x, this.position.y, 
              this.scale.x * this.imgTexture.width, 
              this.scale.y * this.imgTexture.height);

          requestAnimationFrame(this.animate.bind(this));
      },


      gesturePinchZoom: function(event) {
          var zoom = false;

          if( event.targetTouches.length >= 2 ) {
              var p1 = event.targetTouches[0];
              var p2 = event.targetTouches[1];
              var zoomScale = Math.sqrt(Math.pow(p2.pageX - p1.pageX, 2) + Math.pow(p2.pageY - p1.pageY, 2)); //euclidian distance

              if( this.lastZoomScale ) {
                  zoom = zoomScale - this.lastZoomScale;
              }

              this.lastZoomScale = zoomScale;
          }    

          return zoom;
      },

      doZoom: function(zoom) {
          if(!zoom) return;

          //new scale
          var currentScale = this.scale.x;
          var newScale = this.scale.x + zoom/100;
          

          //some helpers
          var deltaScale = newScale - currentScale;
          var currentWidth    = (this.imgTexture.width * this.scale.x);
          var currentHeight   = (this.imgTexture.height * this.scale.y);
          var deltaWidth  = this.imgTexture.width*deltaScale;
          var deltaHeight = this.imgTexture.height*deltaScale;


          //by default scale doesnt change position and only add/remove pixel to right and bottom
          //so we must move the image to the left to keep the image centered
          //ex: coefX and coefY = 0.5 when image is centered <=> move image to the left 0.5x pixels added to the right
          var canvasmiddleX = this.canvas.clientWidth / 2;
          var canvasmiddleY = this.canvas.clientHeight / 2;
          var xonmap = (-this.position.x) + canvasmiddleX;
          var yonmap = (-this.position.y) + canvasmiddleY;
          var coefX = -xonmap / (currentWidth);
          var coefY = -yonmap / (currentHeight);
          var newPosX = this.position.x + deltaWidth*coefX;
          var newPosY = this.position.y + deltaHeight*coefY;

          //edges cases
          var newWidth = currentWidth + deltaWidth;
          var newHeight = currentHeight + deltaHeight;
          
          if( newWidth < this.canvas.clientWidth ) return;
          if( newPosX > 0 ) { newPosX = 0; }
          if( newPosX + newWidth < this.canvas.clientWidth ) { newPosX = this.canvas.clientWidth - newWidth;}
          
          if( newHeight < this.canvas.clientHeight ) return;
          if( newPosY > 0 ) { newPosY = 0; }
          if( newPosY + newHeight < this.canvas.clientHeight ) { newPosY = this.canvas.clientHeight - newHeight; }


          //finally affectations
          this.scale.x    = newScale;
          this.scale.y    = newScale;
          this.position.x = newPosX;
          this.position.y = newPosY;
      },

      doMove: function(relativeX, relativeY) {
          if(this.lastX && this.lastY) {
            var deltaX = relativeX - this.lastX;
            var deltaY = relativeY - this.lastY;
            var currentWidth = (this.imgTexture.width * this.scale.x);
            var currentHeight = (this.imgTexture.height * this.scale.y);

            this.position.x += deltaX;
            this.position.y += deltaY;


            //edge cases
            if( this.position.x > 0 ) {
              this.position.x = 0;
            }
            else if( this.position.x + currentWidth < this.canvas.clientWidth ) {
              this.position.x = this.canvas.clientWidth - currentWidth;
            }
            if( this.position.y > 0 ) {
              this.position.y = 0;
            }
            else if( this.position.y + currentHeight < this.canvas.clientHeight ) {
              this.position.y = this.canvas.clientHeight - currentHeight;
            }
          }

          this.lastX = relativeX;
          this.lastY = relativeY;
      },

      setEventListeners: function() {
          // touch
          this.canvas.addEventListener('touchstart', function(e) {
              this.lastX          = null;
              this.lastY          = null;
              this.lastZoomScale  = null;
          }.bind(this));

          this.canvas.addEventListener('touchmove', function(e) {
              e.preventDefault();
              
              if(e.targetTouches.length == 2) { //pinch
                  this.doZoom(this.gesturePinchZoom(e));
              }
              else if(e.targetTouches.length == 1) {
                  var relativeX = e.targetTouches[0].pageX - this.canvas.getBoundingClientRect().left;
                  var relativeY = e.targetTouches[0].pageY - this.canvas.getBoundingClientRect().top;                
                  this.doMove(relativeX, relativeY);
              }
          }.bind(this));

          if(this.desktop) {
              // keyboard+mouse
              window.addEventListener('keyup', function(e) {
                  if(e.keyCode == 187 || e.keyCode == 61) { //+
                      this.doZoom(5);
                  }
                  else if(e.keyCode == 54) {//-
                      this.doZoom(-5);
                  }
              }.bind(this));

              window.addEventListener('mousedown', function(e) {
                  this.mdown = true;
                  this.lastX = null;
                  this.lastY = null;
              }.bind(this));

              window.addEventListener('mouseup', function(e) {
                  this.mdown = false;
              }.bind(this));

              window.addEventListener('mousemove', function(e) {
                  var relativeX = e.pageX - this.canvas.getBoundingClientRect().left;
                  var relativeY = e.pageY - this.canvas.getBoundingClientRect().top;

                  if(e.target == this.canvas && this.mdown) {
                      this.doMove(relativeX, relativeY);
                  }

                  if(relativeX <= 0 || relativeX >= this.canvas.clientWidth || relativeY <= 0 || relativeY >= this.canvas.clientHeight) {
                      this.mdown = false;
                  }
              }.bind(this));
          }
      },

      checkRequestAnimationFrame: function() {
          var lastTime = 0;
          var vendors = ['ms', 'moz', 'webkit', 'o'];
          for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
              window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
              window.cancelAnimationFrame = 
                window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
          }

          if (!window.requestAnimationFrame) {
              window.requestAnimationFrame = function(callback, element) {
                  var currTime = new Date().getTime();
                  var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                  var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
                    timeToCall);
                  lastTime = currTime + timeToCall;
                  return id;
              };
          }

          if (!window.cancelAnimationFrame) {
              window.cancelAnimationFrame = function(id) {
                  clearTimeout(id);
              };
          }
      }
  };

  root.ImgTouchCanvas = ImgTouchCanvas;
}).call(this);


//we will also scale the image in this function, that is new
function fit_text_to_rect(text, x1, y1, width, height, imScale, firstRun) {
  var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgba(161, 160, 155, 1)";
  ctx.strokeStyle = "rgba(40, 40, 40, 1)";
  if (firstRun) {
    OGx1 = x1;
    OGy1 = y1;
    OGwidth = width;
    OGheight = height;
  }
  function get_lines() {
    lines = [];
    linesIter = 0;
    line = "";
    const words = text.split(" ");
    //turn any <br>s into seperate words if theyre not already
    for (i = 0; i < words.length; i++) {
      if ((words[i].match(/<br>/g) || []).length != 0) {
        //hacky way to check if it is just a <br>
        if (words[i].length > 4) {
          // splitBreaks = words[i].split(/<br\s*?>/i); /(、)/g
          splitBreaks = words[i].split(/(<br>)/g);
          //current word will be first split
          words[i] = splitBreaks[0];
          //then start at one and insert remaining splits
          for (e = 1; e < splitBreaks.length; e++) {
            words.insert(i + e, splitBreaks[e]);
          }
        }
      }
    }
    //check if any words are wider than max width, and split em if they are
    for (i = 0; i < words.length; i++) {
      //if any word is longer than the width we will split it
      if (ctx.measureText(words[i]).width > width) {
        //get the length of characters
        wordLetterIndex = words[i].length;
        //reduce until it fits
        while (
          ctx.measureText(words[i].slice(0, wordLetterIndex)).width > width
        ) {
          wordLetterIndex -= 1;
        }
        //copy of word[i] since we will be changing it but need it for the letters that dont fit
        currentWord = words[i];
        //the word becomes the shortened word
        words[i] = currentWord.slice(0, wordLetterIndex);
        //the remaining characters after we make the word fit are the next word
        words.insert(
          i + 1,
          currentWord.slice(wordLetterIndex, currentWord.length)
        );
      }
    }
    // console.log(words)
    for (i = 0; i < words.length; i++) {
      testline = line + words[i] + " ";
      //check length of row of words
      textWidth = ctx.measureText(testline).width;
      // if testline is greater than width, append line which is testline without the word that pushed us over
      if (textWidth > width || words[i] == "<br>") {
        lines[linesIter] = line;
        //dont restart with br and space if it was a br
        line = "";
        if (words[i] != "<br>") {
          //restart the line with the current word that pushed us over, unless it was a br
          line = words[i] + " ";
        }

        linesIter += 1;
      }
      // if testline isnt too long then it becomes line and we continue
      else {
        line = testline;
      }
    }
    // the for loop will finish with a line that is not to width, add this final line
    lines[linesIter] = line;
    // console.log(lines);
    return lines;
  }
  //idk how to check this, but i guess its font size ish

  // ctx.scale(.5, .5);
  ctx.font = "30px GaramondPremierER";
  textHeight = 30;
  //total text width in px
  textWidth = ctx.measureText(text).width;
  //if one line will fit on the image, it wont because we check earlier before calling fit text to rect but w.e
  // if (textWidth < width) {
  //     console.log("one line ok");
  //     void ctx.drawImage(base_image1, 0, 0, 1149, 254, 0, 0, 1149, 254);
  // 	// ctx.fillText(text, x1 + (width - textWidth) / 2, y1 + height / 2 - textHeight / 2); for centered
  //     //for align left
  //     ctx.strokeText(text, x1, y1 + height / 2 - textHeight / 2);
  //     ctx.fillText(text, x1, y1 + height / 2 - textHeight / 2);
  // }
  // else {
  lines = get_lines();
  minTextHeight = 8;
  // console.log(lines[0].slice(0,11))
  if(lines[0].slice(0,11) == "<force-font"){
    // console.log(lines[0].slice(0,16))
    for(ffl = 0; ffl < Math.min(3,lines.length); ffl += 1){
    if(lines[ffl].slice(0,16) == "<force-font-all:"){
      // console.log(lines[ffl].slice(16,18));
      minTextHeight = parseInt(lines[ffl].slice(16,18));
      lines.splice(ffl, 1);
      // console.log(lines)
    }
  }
  //   for(ffl = 0; ffl < Math.min(3,lines.length); ffl += 1){
  //     console.log(lines[ffl])
  //     if(lines[ffl].slice(0,12) == "<force-font:"){
  //       console.log(lines[ffl].slice(12,14));
  //       // lines.splice(ffl, 1);
  //     }
  // }
  }
  while (1) {
    // if the lines at the current height fit in the meme text space, break
    // console.log("TExt height:", lines.length*textHeight, " height " , height)
    if (lines.length * textHeight < height) {
      break;
    }
    // otherwise reduce textheight and font size by 2 and get lines again
    else {
      textHeight -= 2;
      //lol ok so if we end up smaller than 8, we are going to recursively call this function, but after it runs successfully we will return
      returnPls = false;
      if (textHeight < minTextHeight) {
        //ok so i ran a few large text length trials and found a relationship between the textheight/height at size 8, and the final scale size
        //(textHeight/height)^0.43 gets us close but still below, so lets do ^0.45 on first run then scale up by .1 each time
        if (firstRun) {
          //we go text height +2 since the relationship is for at 8px not 6, once we have gone under
          imScale = Math.pow((lines.length * (textHeight + 2)) / height, 0.43);
          // console.log(lines.length*textHeight/height);
          // console.log(imScale);
          // console.log("firstrunscale");
        }
        //each time we will scale the image and everything up a little
        else {
          imScale = imScale + 0.1;
        }
        // console.log("im scaled ", imScale);
        fit_text_to_rect(
          text,
          OGx1 * imScale,
          OGy1 * imScale,
          OGwidth * imScale,
          OGheight * imScale,
          imScale,
          false
        );
        //this way, only the function that successfully gets the image big enough will be able to run to the drawing text part,
        //all the previous ones will be on a return train
        returnPls = true;
      }
      if (returnPls) {
        return;
      }
      // console.log(textHeight)
      ctx.font = String(textHeight) + "px GaramondPremierER";
      lines = get_lines();
    }
  }
  //messing with this resets font and fillstyle stuff
  canvas.width = 1149 * imScale;
  canvas.height = 254 * imScale;
  //so we set it all again
  ctx.font = String(textHeight) + "px GaramondPremierER";
  ctx.fillStyle = "rgba(161, 160, 155, 1)";
  ctx.strokeStyle = "rgba(40, 40, 40, 1)";

  console.log("scaled to *:", imScale);
  void ctx.drawImage(
    base_image1,
    0,
    0,
    1149,
    254,
    0,
    0,
    1149 * imScale,
    254 * imScale
  );
  console.log(textHeight)
  //starting y for drawing text is half the text block height above center of y(height) since half below the center half above
  y = height / 2 - Math.round((linesIter / 2) * textHeight);
  for (i = 0; i < lines.length; i++) {
    tempTxtHeight = textHeight
    ctx.font = String(tempTxtHeight) + "px GaramondPremierER";
    if(lines[i].slice(0,16) != "<force-font-all:"){
      if(lines[i].slice(0,12) == "<force-font:"){
      tempTxtHeight = parseInt(lines[i].slice(12,14));
      ctx.font = String(tempTxtHeight) + "px GaramondPremierER";
      lines[i] = lines[i].slice(14)
      }
      ctx.lineWidth = 2 / imScale;
      ctx.strokeText(lines[i], x1, y1 + y);
      ctx.fillText(lines[i], x1, y1 + y);

      y += tempTxtHeight;
    }
  }
  // }
}

    //this is for base64 conversion
    (function (global, factory) {
      typeof exports === "object" && typeof module !== "undefined"
        ? (module.exports = factory())
        : typeof define === "function" && define.amd
          ? define(factory)
          : // cf. https://github.com/dankogai/js-base64/issues/119
          (function () {
            // existing version for noConflict()
            var _Base64 = global.Base64;
            var gBase64 = factory();
            gBase64.noConflict = function () {
              global.Base64 = _Base64;
              return gBase64;
            };
            if (global.Meteor) {
              // Meteor.js
              Base64 = gBase64;
            }
            global.Base64 = gBase64;
          })();
    })(
      typeof self !== "undefined"
        ? self
        : typeof window !== "undefined"
          ? window
          : typeof global !== "undefined"
            ? global
            : this,
      function () {
        "use strict";
        /**
         *  base64.ts
         *
         *  Licensed under the BSD 3-Clause License.
         *    http://opensource.org/licenses/BSD-3-Clause
         *
         *  References:
         *    http://en.wikipedia.org/wiki/Base64
         *
         * @author Dan Kogai (https://github.com/dankogai)
         */
        var version = "3.7.2";
        /**
         * @deprecated use lowercase `version`.
         */
        var VERSION = version;
        var _hasatob = typeof atob === "function";
        var _hasbtoa = typeof btoa === "function";
        var _hasBuffer = typeof Buffer === "function";
        var _TD = typeof TextDecoder === "function" ? new TextDecoder() : undefined;
        var _TE = typeof TextEncoder === "function" ? new TextEncoder() : undefined;
        var b64ch =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var b64chs = Array.prototype.slice.call(b64ch);
        var b64tab = (function (a) {
          var tab = {};
          a.forEach(function (c, i) {
            return (tab[c] = i);
          });
          return tab;
        })(b64chs);
        var b64re =
          /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
        var _fromCC = String.fromCharCode.bind(String);
        var _U8Afrom =
          typeof Uint8Array.from === "function"
            ? Uint8Array.from.bind(Uint8Array)
            : function (it, fn) {
              if (fn === void 0) {
                fn = function (x) {
                  return x;
                };
              }
              return new Uint8Array(Array.prototype.slice.call(it, 0).map(fn));
            };
        var _mkUriSafe = function (src) {
          return src.replace(/=/g, "").replace(/[+\/]/g, function (m0) {
            return m0 == "+" ? "-" : "_";
          });
        };
        var _tidyB64 = function (s) {
          return s.replace(/[^A-Za-z0-9\+\/]/g, "");
        };
        /**
         * polyfill version of `btoa`
         */
        var btoaPolyfill = function (bin) {
          // console.log('polyfilled');
          var u32,
            c0,
            c1,
            c2,
            asc = "";
          var pad = bin.length % 3;
          for (var i = 0; i < bin.length;) {
            if (
              (c0 = bin.charCodeAt(i++)) > 255 ||
              (c1 = bin.charCodeAt(i++)) > 255 ||
              (c2 = bin.charCodeAt(i++)) > 255
            )
              throw new TypeError("invalid character found");
            u32 = (c0 << 16) | (c1 << 8) | c2;
            asc +=
              b64chs[(u32 >> 18) & 63] +
              b64chs[(u32 >> 12) & 63] +
              b64chs[(u32 >> 6) & 63] +
              b64chs[u32 & 63];
          }
          return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
        };
        /**
         * does what `window.btoa` of web browsers do.
         * @param {String} bin binary string
         * @returns {string} Base64-encoded string
         */
        var _btoa = _hasbtoa
          ? function (bin) {
            return btoa(bin);
          }
          : _hasBuffer
            ? function (bin) {
              return Buffer.from(bin, "binary").toString("base64");
            }
            : btoaPolyfill;
        var _fromUint8Array = _hasBuffer
          ? function (u8a) {
            return Buffer.from(u8a).toString("base64");
          }
          : function (u8a) {
            // cf. https://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string/12713326#12713326
            var maxargs = 0x1000;
            var strs = [];
            for (var i = 0, l = u8a.length; i < l; i += maxargs) {
              strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
            }
            return _btoa(strs.join(""));
          };
        /**
         * converts a Uint8Array to a Base64 string.
         * @param {boolean} [urlsafe] URL-and-filename-safe a la RFC4648 §5
         * @returns {string} Base64 string
         */
        var fromUint8Array = function (u8a, urlsafe) {
          if (urlsafe === void 0) {
            urlsafe = false;
          }
          return urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a);
        };
        // This trick is found broken https://github.com/dankogai/js-base64/issues/130
        // const utob = (src: string) => unescape(encodeURIComponent(src));
        // reverting good old fationed regexp
        var cb_utob = function (c) {
          if (c.length < 2) {
            var cc = c.charCodeAt(0);
            return cc < 0x80
              ? c
              : cc < 0x800
                ? _fromCC(0xc0 | (cc >>> 6)) + _fromCC(0x80 | (cc & 0x3f))
                : _fromCC(0xe0 | ((cc >>> 12) & 0x0f)) +
                _fromCC(0x80 | ((cc >>> 6) & 0x3f)) +
                _fromCC(0x80 | (cc & 0x3f));
          } else {
            var cc =
              0x10000 +
              (c.charCodeAt(0) - 0xd800) * 0x400 +
              (c.charCodeAt(1) - 0xdc00);
            return (
              _fromCC(0xf0 | ((cc >>> 18) & 0x07)) +
              _fromCC(0x80 | ((cc >>> 12) & 0x3f)) +
              _fromCC(0x80 | ((cc >>> 6) & 0x3f)) +
              _fromCC(0x80 | (cc & 0x3f))
            );
          }
        };
        var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
        /**
         * @deprecated should have been internal use only.
         * @param {string} src UTF-8 string
         * @returns {string} UTF-16 string
         */
        var utob = function (u) {
          return u.replace(re_utob, cb_utob);
        };
        //
        var _encode = _hasBuffer
          ? function (s) {
            return Buffer.from(s, "utf8").toString("base64");
          }
          : _TE
            ? function (s) {
              return _fromUint8Array(_TE.encode(s));
            }
            : function (s) {
              return _btoa(utob(s));
            };
        /**
         * converts a UTF-8-encoded string to a Base64 string.
         * @param {boolean} [urlsafe] if `true` make the result URL-safe
         * @returns {string} Base64 string
         */
        var encode = function (src, urlsafe) {
          if (urlsafe === void 0) {
            urlsafe = false;
          }
          return urlsafe ? _mkUriSafe(_encode(src)) : _encode(src);
        };
        /**
         * converts a UTF-8-encoded string to URL-safe Base64 RFC4648 §5.
         * @returns {string} Base64 string
         */
        var encodeURI = function (src) {
          return encode(src, true);
        };
        // This trick is found broken https://github.com/dankogai/js-base64/issues/130
        // const btou = (src: string) => decodeURIComponent(escape(src));
        // reverting good old fationed regexp
        var re_btou =
          /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
        var cb_btou = function (cccc) {
          switch (cccc.length) {
            case 4:
              var cp =
                ((0x07 & cccc.charCodeAt(0)) << 18) |
                ((0x3f & cccc.charCodeAt(1)) << 12) |
                ((0x3f & cccc.charCodeAt(2)) << 6) |
                (0x3f & cccc.charCodeAt(3)),
                offset = cp - 0x10000;
              return (
                _fromCC((offset >>> 10) + 0xd800) +
                _fromCC((offset & 0x3ff) + 0xdc00)
              );
            case 3:
              return _fromCC(
                ((0x0f & cccc.charCodeAt(0)) << 12) |
                ((0x3f & cccc.charCodeAt(1)) << 6) |
                (0x3f & cccc.charCodeAt(2))
              );
            default:
              return _fromCC(
                ((0x1f & cccc.charCodeAt(0)) << 6) | (0x3f & cccc.charCodeAt(1))
              );
          }
        };
        /**
         * @deprecated should have been internal use only.
         * @param {string} src UTF-16 string
         * @returns {string} UTF-8 string
         */
        var btou = function (b) {
          return b.replace(re_btou, cb_btou);
        };
        /**
         * polyfill version of `atob`
         */
        var atobPolyfill = function (asc) {
          // console.log('polyfilled');
          asc = asc.replace(/\s+/g, "");
          if (!b64re.test(asc)) throw new TypeError("malformed base64.");
          asc += "==".slice(2 - (asc.length & 3));
          var u24,
            bin = "",
            r1,
            r2;
          for (var i = 0; i < asc.length;) {
            u24 =
              (b64tab[asc.charAt(i++)] << 18) |
              (b64tab[asc.charAt(i++)] << 12) |
              ((r1 = b64tab[asc.charAt(i++)]) << 6) |
              (r2 = b64tab[asc.charAt(i++)]);
            bin +=
              r1 === 64
                ? _fromCC((u24 >> 16) & 255)
                : r2 === 64
                  ? _fromCC((u24 >> 16) & 255, (u24 >> 8) & 255)
                  : _fromCC((u24 >> 16) & 255, (u24 >> 8) & 255, u24 & 255);
          }
          return bin;
        };
        /**
         * does what `window.atob` of web browsers do.
         * @param {String} asc Base64-encoded string
         * @returns {string} binary string
         */
        var _atob = _hasatob
          ? function (asc) {
            return atob(_tidyB64(asc));
          }
          : _hasBuffer
            ? function (asc) {
              return Buffer.from(asc, "base64").toString("binary");
            }
            : atobPolyfill;
        //
        var _toUint8Array = _hasBuffer
          ? function (a) {
            return _U8Afrom(Buffer.from(a, "base64"));
          }
          : function (a) {
            return _U8Afrom(_atob(a), function (c) {
              return c.charCodeAt(0);
            });
          };
        /**
         * converts a Base64 string to a Uint8Array.
         */
        var toUint8Array = function (a) {
          return _toUint8Array(_unURI(a));
        };
        //
        var _decode = _hasBuffer
          ? function (a) {
            return Buffer.from(a, "base64").toString("utf8");
          }
          : _TD
            ? function (a) {
              return _TD.decode(_toUint8Array(a));
            }
            : function (a) {
              return btou(_atob(a));
            };
        var _unURI = function (a) {
          return _tidyB64(
            a.replace(/[-_]/g, function (m0) {
              return m0 == "-" ? "+" : "/";
            })
          );
        };
        /**
         * converts a Base64 string to a UTF-8 string.
         * @param {String} src Base64 string.  Both normal and URL-safe are supported
         * @returns {string} UTF-8 string
         */
        var decode = function (src) {
          return _decode(_unURI(src));
        };
        /**
         * check if a value is a valid Base64 string
         * @param {String} src a value to check
         */
        var isValid = function (src) {
          if (typeof src !== "string") return false;
          var s = src.replace(/\s+/g, "").replace(/={0,2}$/, "");
          return !/[^\s0-9a-zA-Z\+/]/.test(s) || !/[^\s0-9a-zA-Z\-_]/.test(s);
        };
        //
        var _noEnum = function (v) {
          return {
            value: v,
            enumerable: false,
            writable: true,
            configurable: true,
          };
        };
        /**
         * extend String.prototype with relevant methods
         */
        var extendString = function () {
          var _add = function (name, body) {
            return Object.defineProperty(String.prototype, name, _noEnum(body));
          };
          _add("fromBase64", function () {
            return decode(this);
          });
          _add("toBase64", function (urlsafe) {
            return encode(this, urlsafe);
          });
          _add("toBase64URI", function () {
            return encode(this, true);
          });
          _add("toBase64URL", function () {
            return encode(this, true);
          });
          _add("toUint8Array", function () {
            return toUint8Array(this);
          });
        };
        /**
         * extend Uint8Array.prototype with relevant methods
         */
        var extendUint8Array = function () {
          var _add = function (name, body) {
            return Object.defineProperty(Uint8Array.prototype, name, _noEnum(body));
          };
          _add("toBase64", function (urlsafe) {
            return fromUint8Array(this, urlsafe);
          });
          _add("toBase64URI", function () {
            return fromUint8Array(this, true);
          });
          _add("toBase64URL", function () {
            return fromUint8Array(this, true);
          });
        };
        /**
         * extend Builtin prototypes with relevant methods
         */
        var extendBuiltins = function () {
          extendString();
          extendUint8Array();
        };
        var gBase64 = {
          version: version,
          VERSION: VERSION,
          atob: _atob,
          atobPolyfill: atobPolyfill,
          btoa: _btoa,
          btoaPolyfill: btoaPolyfill,
          fromBase64: decode,
          toBase64: encode,
          encode: encode,
          encodeURI: encodeURI,
          encodeURL: encodeURI,
          utob: utob,
          btou: btou,
          decode: decode,
          isValid: isValid,
          fromUint8Array: fromUint8Array,
          toUint8Array: toUint8Array,
          extendString: extendString,
          extendUint8Array: extendUint8Array,
          extendBuiltins: extendBuiltins,
        };
        //
        // export Base64 to the namespace
        //
        // ES5 is yet to have Object.assign() that may make transpilers unhappy.
        // gBase64.Base64 = Object.assign({}, gBase64);
        gBase64.Base64 = {};
        Object.keys(gBase64).forEach(function (k) {
          return (gBase64.Base64[k] = gBase64[k]);
        });
        return gBase64;
      }
    );


// async function main_checkNmake() {
//   // console.log("calling");
//   yikes_or_nah(make_meme);
//   // expected output: "resolved"
// }

var templates = [
  '**** ahead', 'Likely ****', 'If only I had a ****...', '****, O ****', 'Ahh, ****...', 'No **** ahead', 'First off, ****', 'Didn\'t expect ****...', 'Behold, ****!', '****', '**** required ahead', 'Seek ****', 'Visions of ****...', 'Offer ****', '****!', 'Be wary of ****', 'Still no ****...', 'Could this be a ****?', 'Praise the ****', '****?', 'Try ****', 'Why is it always ****?', 'Time for ****', 'Let there be ****', '****...'
];
var wordCategoriesDict = { "enemies": ["enemy", "weak foe", "strong foe", "monster", "dragon", "boss", "sentry", "group", "pack", "decoy", "undead", "soldier", "knight", "cavalier", "archer", "sniper", "mage", "ordnance", "monarch", "lord", "demi-human", "outsider", "giant", "horse", "dog", "wolf", "rat", "beast", "bird", "raptor", "snake", "crab", "prawn", "octopus", "bug", "scarab", "slug", "wraith", "skeleton", "monstrosity", "ill-omened creature"], "people": ["Tarnished", "warrior", "swordfighter", "knight", "samurai", "sorcerer", "cleric", "sage", "merchant", "teacher", "master", "friend", "lover", "old dear", "old codger", "angel", "fat coinpurse", "pauper", "good sort", "wicked sort", "plump sort", "skinny sort", "lovable sort", "pathetic sort", "strange sort", "numble sort", "laggardly sort", "invisible sort", "unfathomable sort", "giant sort", "sinner", "thief", "liar", "dastard", "traitor", "pair", "trio", "noble", "aristocrat", "hero", "champion", "monarch", "lord", "god"], "things": ["item", "necessary item", "precious item", "something", "something incredible", "treasure chest", "corpse", "coffin", "trap", "armament", "shield", "bow", "projectile weapon", "armor", "talisman", "skill", "sorcery", "incantation", "mao", "material", "flower", "grass", "tree", "fruit", "seed", "mushroom", "tear", "crystal", "butterfly", "bug", "dung", "grace", "door", "key", "ladder", "lever", "lift", "spiritspring", "sending gate", "stone astrolabe", "Birdseye Telescope", "message", "bloodstain", "Erdtree", "Elden Ring"], "battleTactics": ["close-quarters battle", "ranged battle", "horseback battle", "luring out", "defeating one-by-one", "taking on all at once", "rushing in", "stealth", "mimicry", "confusion", "pursuit", "fleeing", "summoning", "circling around", "jumping off", "dashing through", "brief respite"], "actions": ["attacking", "jump attack", "running attack", "critical hit", "two-handing", "blocking", "parrying", "guard counter", "sorcery", "incantation", "skill", "summoning", "throwing", "healing", "running", "rolling", "backstepping", "jumping", "crouching", "target lock", "item crafting", "gesturing"], "situations": ["morning", "noon", "evening", "night", "clear sky", "overcast", "rain", "storm", "mist", "snow", "patrolling", "procession", "crowd", "surprise attack", "ambush", "pincer attack", "beating to a pulp", "battle", "reinforcements", "ritual", "explosion", "high spot", "defensible spot", "climbable spot", "bright spot", "dark spot", "open area", "cramped area", "hiding place", "sniping spot", "recon spot", "safety", "danger", "gorgeous view", "detour", "hidden path", "secret passage", "shortcut", "dead end", "looking away", "unnoticed", "out of stamina"], "places": ["high road", "checkpoint", "bridge", "castle", "fort", "city", "ruins", "church", "tower", "camp site", "house", "cemetery", "underground tomb", "tunnel", "cave", "evergaol", "great tree", "cellar", "surface", "underground", "forest", "river", "lake", "bog", "mountain", "valley", "cliff", "waterside", "nest", "hole"], "directions": ["east", "west", "south", "north", "ahead", "behind", "left", "right", "center", "up", "down", "edge"], "bodyParts": ["head", "stomach", "back", "arms", "legs", "rump", "tail", "core", "fingers"], "affinities": ["physical", "standard", "striking", "slashing", "piercing", "fire", "lightning", "magic", "holy", "poison", "toxic", "scarlet rot", "blood loss", "frost", "sleep", "madness", "death"], "concepts": ["life", "Death", "light", "dark", "stars", "fire", "Order", "chaos", "joy", "wrath", "suffering", "sadness", "comfort", "bliss", "misfortune", "good fortune", "bad luck", "hope", "despair", "victory", "defeat", "research", "faith", "abundance", "rot", "loyalty", "injustice", "secret", "opportunity", "pickle", "clue", "friendship", "love", "bravery", "vigor", "fortitude", "confidence", "distracted", "unguarded", "introspection", "regret", "resignation", "futility", "on the brink", "betrayal", "revenge", "destruction", "recklessness", "calmness", "vigilance", "tranquility", "sound", "tears", "sleep", "depths", "dregs", "fear", "sacrifice", "ruin"], "phrases": ["good luck", "look carefully", "listen carefully", "think carefully", "well done", "I did it!", "I've failed...", "here!", "not here!", "don't you dare!", "do it!", "I can't take this...", "don't think", "so lonely...", "here again...", "just getting started", "stay calm", "keep moving", "turn back", "give up", "don't give up", "help me...", "I don't believe it...", "too high up", "I want to go home...", "it's like a dream...", "seems familiar...", "beautiful...", "you don't have the right", "are you ready?"] };
var conjunctions = [
  'and then ', 'or ', 'but ', 'therefore ', 'in short ', 'except ', 'by the way ', 'so to speak ', 'all the more ', ', '
];
allWordsSorted = [];
for (const [key, value] of Object.entries(wordCategoriesDict)) {
    allWordsSorted = allWordsSorted.concat(value);
}
//gotta do this since normal sort is weirdly case sensitive
allWordsSorted = allWordsSorted.sort((a, b) => {
    return a.localeCompare(b, undefined, { sensitivity: 'base' });
});

// function make_canvas_zoomable(){
//   var can = document.getElementById("canvas");
// can.addEventListener("touchstart", ctxTouchStart, false);
// can.addEventListener("touchmove", ctxTouchMove, false);
// can.addEventListener("touchend", ctxTouchEnd, false);

// var oX, oY, dX, dY, iX, iY;
// iX = 0; iY = 0;
// function ctxTouchStart(e) {
//     if (!e)
//         var e = event;
//     e.preventDefault();

//     mouseIsDown = 0;
//     oX = e.targetTouches[0].pageX - canvas.offsetLeft;
//     oY = e.targetTouches[0].pageY - canvas.offsetTop;
// }
// function ctxTouchMove(e) {
//     if (!e)
//         var e = event;
//     e.preventDefault();
//     var canX = e.targetTouches[0].pageX - canvas.offsetLeft;
//     var canY = e.targetTouches[0].pageY - canvas.offsetTop;
//     dX = canX - oX;
//     dY = canY - oY;

//     /*   redraw img on canvas
//      *   where -(iX + dX) is the startX 
//      *   and -(iY + dY) is the startY 
//      */
//     reDrawImageOnCanvas(can, img, -(iX + dX), -(iY + dY));
// }
// function ctxTouchEnd(e) {
//     if (!e)
//         var e = event;
//     e.preventDefault();
//     iX += dX;
//     iY += dY;
// }
// }

var loadingMessageDotTimeout;
window.onload = (event) => {
  var updateLoadingMessageCount = 69;
  
updateLoadingMessage();

function updateLoadingMessage() {
  loadingMessageDotTimeout = setTimeout(function() {
    document.getElementById("loading").innerHTML += ".";

    updateLoadingMessageCount--;

    if (0 < updateLoadingMessageCount) {
      updateLoadingMessage();
    };
  }, 1000);
};

  fetch("../../../DS/yikesOrNah.json").then(response => {
    return response.json();
  })
  .then(jsondata => yikes_or_nah = jsonConcat(jsondata, yikes_or_nah));

  function jsonConcat(o1, o2) {
    for (var key in o2) {
      o1[key] = o2[key];
    }
    return o1;
  }
  // console.log(yikes_or_nah);

  console.log("page is fully loaded");
  topText = document.getElementById("msg1").innerHTML;
  bottomText = document.getElementById("msg2").innerHTML;
  messageType = document.getElementById("msgType").innerHTML;
  if (messageType != "1") {
    messageType = Base64.decode(messageType);
    // console.log(messageType);
  }
  if (topText == "1") {
    topText = "";
  } else {
    topText = Base64.decode(topText);
    // console.log(topText);
  }
  if (bottomText == "1") {
    bottomText = "";
  } else {
    bottomText = Base64.decode(bottomText);
    // console.log(bottomText);
  }
  if(messageType == "custom"){
    yikes_or_nah.checkEm([topText], handleRes, [topText,messageType],false, false);
  }

  else if(messageType == "fromTemplates"){
    // console.log(parseInt(topText.slice(0,1)))
    // console.log(parseInt(topText.slice(2,4)))
    template1 = templates[parseInt(topText.slice(0,2))]
    word1 = allWordsSorted[parseInt(topText.slice(2,5))]
    
    m1Text = template1.replaceAll('****', word1)

    if(bottomText != ""){
      conjunction = conjunctions[parseInt(bottomText.slice(0,2))]
      template2 = templates[parseInt(bottomText.slice(2,4))]
      word2 = allWordsSorted[parseInt(bottomText.slice(4,7))]
      
      m2Text = template2.replaceAll('****', word2)
      m2Text = conjunction + m2Text;
    }
    else{
      m2Text = "";
    }
    make_meme(m1Text, m2Text, messageType)
  }
};

function handleRes(res, textList){
  anyYikes = false;
  for(i = 0; i < res.length; i += 1){
    if(res[i] == true || res[i] == "nono"){
      anyYikes = true;
    }
  }
  if(anyYikes == false){
    // console.log("nothing found, your phrase made it past")
    make_meme(textList[0], textList[1], "custom")
  }
  else{
    // console.log("your phrase did not make it past")
  }
}

function download_meme() {
  var canvas = document.getElementById("canvas");
  // var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
  // window.location.href = image; // it will save locally
  var link = document.getElementById("dlLink");
  link.setAttribute("download", "eldenRingMessage.png");
  link.setAttribute(
    "href",
    canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
  );
  link.click();
}

function copy_link() {
  var dummy = document.createElement('input'),
  text = window.location.href;

  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand('copy');
  document.body.removeChild(dummy);
  document.getElementById("loading").innerHTML = "link copied!";
  document.getElementById("loading").style.display = "block";
  setTimeout(function(){ document.getElementById("loading").style.display = "none"; }, 3000);
  
}

function make_meme(topText, bottomText, messageType) {
  function draw(topText, bottomText, msgType) {
    document.getElementById("loading").innerHTML = "loading... almost done";
    base_image1 = new Image();
    // base_image1.crossOrigin = `Anonymous`;
    base_image1.src =
      "http://www.colourofloosemetal.com/DS/blankMessageTemplate.png";
    base_image1.crossOrigin = "Anonymous";
    // base_image2.src = 'http://colourofloosemetal.com/smcs/memePics/sm1Ye.jpg';
    //white background for text since its a png
    base_image1.onload = function () {
      if (msgType == "fromTemplates") {
        void ctx.drawImage(base_image1, 0, 0, 1149, 254, 0, 0, 1149, 254);
        //for one line
        if (bottomText == "") {
          ctx.strokeText(topText, 234, 95);
          ctx.fillText(topText, 234, 95);
        }
        //for two lines
        else {
          ctx.strokeText(topText, 234, 76);
          ctx.fillText(topText, 234, 76);
          ctx.strokeText(bottomText, 234, 130);
          ctx.fillText(bottomText, 234, 130);
        }
        document.getElementById("loading").style.display = "none";
      } else if (msgType == "custom") {
        //note custom will only ever have "toptext"
        // void ctx.drawImage(base_image1, 0, 0, 1149, 254, 0, 0, 1149, 254);
        //if there are one or two lins of reasonable length we will draw them like the normal template
        //if there are no line break characters
        if ((topText.match(/<br>/g) || []).length == 0) {
          //816 is the max reasonable width for normal template text, it's about the length of "all the more o you dont have the right o you dont have the right"
          //for the base size image
          if (ctx.measureText(topText).width < 816) {
            // console.log("single line template style fits");
            void ctx.drawImage(base_image1, 0, 0, 1149, 254, 0, 0, 1149, 254);
            ctx.strokeText(topText, 234, 76);
            ctx.fillText(topText, 234, 76);
            document.getElementById("loading").style.display = "none";
            return;
          }
        }
        //for two lines(one line break character)
        else if ((topText.match(/<br>/g) || []).length == 1) {
          tt = topText.split("<br>")[0];
          bt = topText.split("<br>")[1];
          if (
            ctx.measureText(tt).width < 816 &&
            ctx.measureText(bt).width < 816
          ) {
            // console.log("double line template style fits");
            void ctx.drawImage(base_image1, 0, 0, 1149, 254, 0, 0, 1149, 254);
            ctx.strokeText(tt, 234, 76);
            ctx.fillText(tt, 234, 76);
            ctx.strokeText(bt, 234, 130);
            ctx.fillText(bt, 234, 130);
            document.getElementById("loading").style.display = "none";
            return;
          }
        }
        //the text lines are too long or there are more than 2 lines
        var doSome = new Promise(function(resolve, reject){
          fit_text_to_rect(topText, 195, 14, 932, 172, 1, true);
          resolve();
      });
      
      doSome.then(function(){
        document.getElementById("loading").style.display = "none";
      });


      }
    };
    
  }

  var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");
  // ctx.scale(.5, .5);
  ctx.font = "30px GaramondPremierER";

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
//   topText = document.getElementById("msg1").innerHTML;
//   bottomText = document.getElementById("msg2").innerHTML;
//   messageType = document.getElementById("msgType").innerHTML;
//   if (messageType != "1") {
//     messageType = Base64.decode(messageType);
//     console.log(messageType);
//   }
//   if (topText == "1") {
//     topText = "";
//   } else {
//     topText = Base64.decode(topText);
//   }
//   if (bottomText == "1") {
//     bottomText = "";
//   } else {
//     bottomText = Base64.decode(bottomText);
//   }
  // The minimum prediction confidence.

  topText = topText.replace("fl", "f l");

  ctx.fillStyle = "rgba(0, 0, 0, 0)";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //for text

  ctx.fillStyle = "rgba(161, 160, 155, 1)";
  ctx.strokeStyle = "rgba(40, 40, 40, 1)";
  ctx.lineWidth = 2;
  
  

  draw(topText, bottomText, messageType);
  
  return "done";
}
