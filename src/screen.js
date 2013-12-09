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
    this.$canvas = $('<canvas/>', { id: id });
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
        this.ctx.beginPath();
        this.ctx.moveTo(col*FuelBadge.Pixel.cellBlock, 0);
        this.ctx.lineTo(col*FuelBadge.Pixel.cellBlock, row*FuelBadge.Pixel.cellBlock);
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        this.ctx.restore();
      }
    }
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