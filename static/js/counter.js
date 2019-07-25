function Stopwatch(config) {
  config = config || {};
  this.element = config.element || {};
  this.previousTime = config.previousTime || new Date().getTime();
  this.paused = config.paused && true;
  this.elapsed = config.elapsed || 0;
  this.countingUp = config.countingUp && true;
  this.timeLimit = config.timeLimit || (this.countingUp ? 60 * 10 : 0);
  this.updateRate = config.updateRate || 100;
  this.onTimeUp = config.onTimeUp || function() {
    this.stop();
  };
  this.onTimeUpdate = config.onTimeUpdate || function() {
    console.log(this.elapsed)
  };
  if (!this.paused) {
    this.start();
  }
}


Stopwatch.prototype.start = function() {
  this.paused = false;
  this.previousTime = new Date().getTime();
  this.keepCounting();
};

Stopwatch.prototype.keepCounting = function() {
  if (this.paused) {
    return true;
  }
  var now = new Date().getTime();
  var diff = (now - this.previousTime);
  if (!this.countingUp) {
    diff = -diff;
  }
  this.elapsed = this.elapsed + diff;
  this.previousTime = now;
  this.onTimeUpdate();
  if ((this.elapsed >= this.timeLimit && this.countingUp) || (this.elapsed <= this.timeLimit && !this.countingUp)) {
    this.stop();
    this.onTimeUp();
    return true;
  }
  var that = this;
  setTimeout(function() {
    that.keepCounting();
  }, this.updateRate);
};

Stopwatch.prototype.stop = function() {
  this.paused = true;
};


$(document).ready(function() {
    $('.countdown-timer').each(function() {
        var count_id = $(this).attr('id');
        var countdown_time = document.getElementById(count_id).innerHTML;
        var elapsed_milliseconds = Number(countdown_time.split(':')[0]) * 60 * 60 * 1000 +Number(countdown_time.split(':')[1]) * 60 * 1000 + Number(countdown_time.split(':')[2]) * 60 * 1000;
        var stopwatch = new Stopwatch({
            'element': $(this),               // DOM element
            'paused': false,                  // Status
            'elapsed': elapsed_milliseconds,  // Current time in milliseconds
            'countingUp': false,              // Counting up or down
            'timeLimit': 0,                   // Time limit in milliseconds
            'updateRate': 100,                // Update rate, in milliseconds
            'onTimeUp': function() {          // onTimeUp callback
                this.stop();
                $(this.element).html('NOW');
            },
            'onTimeUpdate': function() {      // onTimeUpdate callback
                var t = this.elapsed,
                    h = ('0' + Math.floor(t / 3600000)).slice(-2),
                    m = ('0' + Math.floor(t % 3600000 / 60000)).slice(-2),
                    s = ('0' + Math.floor(t % 60000 / 1000)).slice(-2);
                var formattedTime = h + ':' + m + ':' + s;
                $(this.element).html(formattedTime);
            }
        });
    });
});