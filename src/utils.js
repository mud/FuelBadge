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