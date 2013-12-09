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