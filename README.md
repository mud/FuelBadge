# FuelBadge

Nike FuelBand screen drawn with &lt;canvas&gt;.

## Usage

All you need to do is create an instance of FuelBadge.Screen, append it and render:

    var screen = null;
    $(function() {
      screen = new FuelBadge.Screen('canvas', 20, 5, 1);
      screen.append($('body'));
      screen.render();
      // draw grid
      screen.drawGrid();
    });

