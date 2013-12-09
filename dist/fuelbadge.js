// --------------------------------------------------------------------------
// Fuel Badge
// Author: Takashi Okamoto
// Description: Draw Nike FuelBand-like canvas
// --------------------------------------------------------------------------
(function(window) {
  window.FuelBadge = typeof window.FuelBadge !== 'undefined' ? window.FuelBadge : {};
})(window);

/* **********************************************
     Begin utils.js
********************************************** */

(function(window) {
  var FuelBadge = window.FuelBadge || {};
  // --------------------------------------------------------------------------
  // CanvasUtil
  // --------------------------------------------------------------------------
  var Utils = Utils || {};

  Utils.drawRoundRect = function(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof fill === "undefined") {
      fill = true;
    }
    if (typeof stroke === "undefined") {
      stroke = false;
    }
    if (typeof radius === "undefined") {
      radius = 3;
    }
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (stroke) {
      ctx.stroke();
    }
    if (fill) {
      ctx.fill();
    }
    ctx.restore();
  };

  window.FuelBadge.Utils = Utils;
})(window);

/* **********************************************
     Begin letters.js
********************************************** */

(function(window) {
  var FuelBadge = window.FuelBadge || {};

  var Letters = (function() {
    return {
      '0':
        "***\n"+
        "* *\n"+
        "* *\n"+
        "* *\n"+
        "***\n",
      '1':
        "** \n"+
        " * \n"+
        " * \n"+
        " * \n"+
        "***\n",
      '2':
        "***\n"+
        "  *\n"+
        "***\n"+
        "*  \n"+
        "***\n",
      '3':
        "***\n"+
        "  *\n"+
        "***\n"+
        "  *\n"+
        "***\n",
      '4':
        "* *\n"+
        "* *\n"+
        "***\n"+
        "  *\n"+
        "  *\n",
      '5':
        "***\n"+
        "*  \n"+
        "***\n"+
        "  *\n"+
        "***\n",
      '6':
        "***\n"+
        "*  \n"+
        "***\n"+
        "* *\n"+
        "***\n",
      '7':
        "***\n"+
        "  *\n"+
        "  *\n"+
        "  *\n"+
        "  *\n",
      '8':
        "***\n"+
        "* *\n"+
        "***\n"+
        "* *\n"+
        "***\n",
      '9':
        "***\n"+
        "* *\n"+
        "***\n"+
        "  *\n"+
        "***\n",
      'A':
        " * \n"+
        "* *\n"+
        "***\n"+
        "* *\n"+
        "* *\n",
      'B':
        "** \n"+
        "* *\n"+
        "***\n"+
        "* *\n"+
        "** \n",
      'E':
        "***\n"+
        "*  \n"+
        "** \n"+
        "*  \n"+
        "***\n",
      'F':
        "***\n"+
        "*  \n"+
        "** \n"+
        "*  \n"+
        "*  \n",
      'L':
        "*  \n"+
        "*  \n"+
        "*  \n"+
        "*  \n"+
        "***\n",
      'S':
        "***\n"+
        "*  \n"+
        "***\n"+
        "  *\n"+
        "***\n",
      'U':
        "* *\n"+
        "* *\n"+
        "* *\n"+
        "* *\n"+
        "***\n"
    };
  })();

  window.FuelBadge.Letters = Letters;
})(window);

/* **********************************************
     Begin pixel.js
********************************************** */

(function(window) {
  var FuelBadge = window.FuelBadge || {};
  // --------------------------------------------------------------------------
  // Pixel
  // --------------------------------------------------------------------------
  var Pixel = function(col, row, color, on) {
    this.col = col;
    this.row = row;
    this.color = color;
    this.on = on;
  }

  Pixel.cellBlock = 10;
  Pixel.radius = 2;
  Pixel.clearColor = '#111';

  Pixel.prototype.setOn = function(val) {
    if (this.on !== val) {
      this.on = val;
    }
  };

  Pixel.prototype.render = function(ctx, scale) {
    var rad = Pixel.cellBlock/1.5;
    ctx.save();
    if (this.on) {
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 2 * scale;
      FuelBadge.Utils.drawRoundRect(ctx, ((this.col+1) * Pixel.cellBlock - rad) * scale, ((this.row + 1) * Pixel.cellBlock - rad) * scale, Pixel.radius*2 * scale, Pixel.radius*2 * scale, Pixel.radius*1.1 * scale, true, false);
    } else {
      ctx.clearRect(this.col * Pixel.cellBlock, this.row * Pixel.cellBlock, Pixel.cellBlock, Pixel.cellBlock);
    }
    ctx.restore();
  }

  window.FuelBadge.Pixel = Pixel;
})(window);

/* **********************************************
     Begin screen.js
********************************************** */

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
      this.pixels.push(new FuelBadge.Pixel(col, rows + 1, 'hsl(' + hValue + ',100%,50%)', true));
    }
    
    // F
    var offset = 3;
    Screen.drawLetter(this, FuelBadge.Letters['1'], offset);
    
    // U
    offset = 7;
    Screen.drawLetter(this, FuelBadge.Letters['2'], offset);
    
    // E
    offset = 11;
    Screen.drawLetter(this, FuelBadge.Letters['3'], offset);
    
    // L
    offset = 15;
    Screen.drawLetter(this, FuelBadge.Letters['4'], offset);
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

  Screen.prototype.turnOn = function(col, row) {
    var pixel = this.pixels[col+row*this.cols];
    if (!pixel.on) {
      pixel.on = true;
      pixel.render(screen.ctx, screen.scale);
    }
  };

  Screen.prototype.turnOff = function(col, row) {
    var pixel = this.pixels[col+row*this.cols];
    if (pixel.on) {
      pixel.on = false;
      pixel.render(screen.ctx, screen.scale);
    }
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