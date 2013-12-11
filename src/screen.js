(function(window) {
  var FuelBadge = window.FuelBadge || {};
  // --------------------------------------------------------------------------
  // Screen
  // --------------------------------------------------------------------------
  var Screen = function(id, cols, rows, scale) {
    this.id = id;
    this.cols = cols;
    this.rows = rows;
    this.width = cols * FuelBadge.Pixel.cellBlock;
    this.height = (rows+2) * FuelBadge.Pixel.cellBlock;
    this.scale = scale || 1;
    this.$canvas = $('<canvas/>', { id: id, width: this.width, height: this.height });
    this.$canvas[0].width = this.width;
    this.$canvas[0].height = this.height;
    this.pixels = [];
    
    // add display pixels in white
    this.ctx = this.$canvas[0].getContext("2d");
    // Add Pixels to screen
    var row = 0, col = 0;
    for (row = 0; row < rows; row++) {
      for (col = 0; col < cols; col++) {
        this.pixels.push(new FuelBadge.Pixel(col, row, '#fff', false));
      }
    }

    // Add Color Bar: green -> red
    var dx = 110/20, hValue = 0;
    for (col = 0; col < 20; col++) {
      hValue = (dx * (20 - col)) - 20;
      this.pixels.push(new FuelBadge.Pixel(col, this.rows + 1, 'hsl(' + hValue + ',100%,50%)', true));
    }
  };

  Screen.prototype.turnOnColorBar = function() {
    var pixel = null;
    for (var col = 0; col < 20; col++) {
      pixel = this.getPixel(col, this.rows);
      pixel.on = true;
    }
  };

  Screen.prototype.turnOffColorBar = function() {
    var pixel = null;
    for (var col = 0; col < 20; col++) {
      pixel = this.getPixel(col, this.rows);
      pixel.on = false;
    }
  };

  Screen.prototype.setColorBarProgress = function(percent) {
    if (percent > 1) percent = 1;
    if (percent < 0) percent = 0;
    percent = 1 - percent;

    var step = Math.floor(percent * this.cols);
    var pixel = null;
    for (var col = 0; col < this.cols; col++) {
      pixel = this.getPixel(col, this.rows);
      pixel.on = false;
      pixel.render(this.ctx, this.scale);
    }
    for (col = this.cols-1; col >= step; col--) {
      pixel = this.getPixel(col, this.rows);
      pixel.on = true;
      pixel.render(this.ctx, this.scale);
    }
  };

  Screen.prototype.animateColorBar = function() {
    var percent = 0;
    var screen = this;
    while (percent <= 1) {
      window.setTimeout((function(per) {
        return function() {
          screen.setColorBarProgress(per);
        };
      })(percent), percent * 300);
      percent += .05;
    }
  };

  Screen.prototype.append = function($container) {
    var x = $container.width()/2 - this.width/2,
        y = $container.height()/2 - this.height/2;

    this.$container = $container;
    this.$canvas.css({ left: x+'px', top: y+'px' });
    $container.append(this.$canvas);
  };

  Screen.prototype.render = function() {
    for (var i = 0, len = this.pixels.length; i < len; ++i) {
      this.pixels[i].render(this.ctx, this.scale);
    }
  };

  Screen.prototype.turnOn = function(col, row, force) {
    var pixel = this.pixels[col+row*this.cols];
    if (!pixel.on || force === true) {
      pixel.on = true;
      pixel.render(this.ctx, this.scale);
    }
  };

  Screen.prototype.turnOff = function(col, row) {
    var pixel = this.pixels[col+row*this.cols];
    if (pixel.on) {
      pixel.on = false;
      pixel.render(this.ctx, this.scale);
    }
  };

  Screen.prototype.drawString = function(str, align) {
    // clear screen
    this.clear();
    if (str.length > 0) {
      var stringArray = [],
          letter = null,
          letterArray = null,
          tempString = null;

      for (var i = 0; i < str.length; i++) {
        letter = FuelBadge.Letters.getLetter(str[i]);
        letterArray = letter.split("\n");
        for (var j = 0; j < letterArray.length; j++) {
          if (letterArray[j] !== "") {
            if (i === 0) {
              stringArray[j] = letterArray[j];
            } else {
              // make sure string isn't too long
              tempString = stringArray[j] += " " + letterArray[j];
              if (tempString.length >= this.cols) {
                break;
              }
              stringArray[j] = tempString;
            }
          }
        }
      }

      // center everthing
      if (typeof align === 'undefined' || align.toLowerCase() === 'center') {
        if (stringArray[0].length < this.cols-1) {
          var offset = Math.floor((this.cols - stringArray[0].length) / 2);
          var offsetString = "";
          while (offsetString.length <= offset) {
            offsetString += " ";
          }
          for (i = 0; i < stringArray.length; i++) {
            stringArray[i] = offsetString + stringArray[i];
          }
        }
      }
      // set the string
      var pixelsString = stringArray.join("\n");
      this.setPixels(pixelsString);
    }

    this.render();
  };

  Screen.prototype.getPixel = function(col, row) {
    return this.pixels[col+row*this.cols];
  };

  Screen.prototype.setPixels = function(pixelsString) {
    var rows = pixelsString.split("\n");
    var row = null;
    var character = null;
    var pixel = null;
    for (var y = 0, len = rows.length; y < len; ++y) {
      row = rows[y];
      for (var x = 0; x < row.length; x++) {
        character = row[x];
        pixel = this.getPixel(x, y);
        if (character === '*') {
          pixel.on = true;
        } else {
          pixel.on = false;
        }
      }
    }
  };

  Screen.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    var pixel = null;
    var len = 20*5;//this.pixels.length;
    for (var i = 0; i < len; ++i) {
      pixel = this.pixels[i];
      if (pixel.on) {
        pixel.on = false;
      }
    }
    this.turnOnColorBar();
  };

  Screen.prototype.drawGrid = function() {
    // draw grid
    this.ctx.strokeStyle = "green";
    this.ctx.save();
    this.ctx.translate(0.5, 0.5);
    for (var row = 0; row <= this.rows; row++) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(0, row*FuelBadge.Pixel.cellBlock);
      this.ctx.lineTo(this.cols*FuelBadge.Pixel.cellBlock, row*FuelBadge.Pixel.cellBlock);
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
      this.ctx.restore();
      for (var col = 0; col <= this.cols; col++) {
        this.ctx.save();
        if (col === this.cols) {
          this.ctx.translate(-0.5, 0);
        }
        this.ctx.beginPath();
        this.ctx.moveTo(col*FuelBadge.Pixel.cellBlock, 0);
        this.ctx.lineTo(col*FuelBadge.Pixel.cellBlock, row*FuelBadge.Pixel.cellBlock);
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        this.ctx.restore();
      }
    }
    this.ctx.restore();
  };

  Screen.drawLetter = function(screen, letter, offset) {
    var col = 0, row = 0, p = null;
    for (var i = 0; i < letter.length; i++) {
      p = letter[i];
      if (p === '\n') {
        row++;
        col = 0;
      } else {
        var pixel = screen.pixels[col+offset+(row*screen.cols)];
        if (p === '*') {
          pixel.on = true;
        } else {
          pixel.on = false;
        }
        col++;
      }
    }
  };

  window.FuelBadge.Screen = Screen;
})(window);