var app = new Vue({
  el: '#app',
  data: {
    messages: [],
  },
  computed: {
    done_analysing: function () {
      if (this.messages.length == 0) {
        return false;
      } else {
        return true;
      }
    },
    statistics_messages_count: function() {
      return this.messages.length;
    },
    statistics_person_messages_count: function() {
      var counted_messages = this.messages.reduce(function (all_persons, line) {
        if (line.person in all_persons) {
          all_persons[line.person]++;
        } else {
          all_persons[line.person] = 1;
        }
        return all_persons;
      }, {});
      return _.fromPairs(_.sortBy(_.toPairs(counted_messages), function(a){return a[1]}).reverse());
    },
    statistics_emoji_count: function() {
      var counted_emojis = this.messages.reduce(function (all_emojis, line) {
        var emoji_array = line.line.match(/([\uD800-\uDBFF][\uDC00-\uDFFF])/g);
        if (emoji_array != null) {
          emoji_array.forEach(function(emoji){
            if (emoji in all_emojis) {
              all_emojis[emoji]++;
            } else {
              all_emojis[emoji] = 1;
            }
          });
        }
        return all_emojis;
      }, {});
      return _.fromPairs(_.sortBy(_.toPairs(counted_emojis), function(a){return a[1]}).reverse());
    },
    statistics_messages_per_day_count: function() {
      var counted_messages_by_day = this.messages.reduce(function (all_dates, line) {
        if (line.date in all_dates) {
          all_dates[line.date]++;
        } else {
          all_dates[line.date] = 1;
        }
        return all_dates;
      }, {});
      return counted_messages_by_day;
    },
    statistics_messages_per_month_count: function() {
      var counted_messages_by_month = this.messages.reduce(function (all_dates, line) {
        if (line.date.substr(3,5) in all_dates) {
          all_dates[line.date.substr(3,5)]++;
        } else {
          all_dates[line.date.substr(3,5)] = 1;
        }
        return all_dates;
      }, {});
      return counted_messages_by_month;
    },
    statistics_messages_per_hour: function() {
      var counted_messages_by_hour = this.messages.reduce(function (all_times, line) {
        if (parseInt(line.time.substr(0,2)) in all_times) {
          all_times[parseInt(line.time.substr(0,2))]++;
        } else {
          all_times[parseInt(line.time.substr(0,2))] = 1;
        }
        return all_times;
      }, {});
      return counted_messages_by_hour;
    },
    statistics_time_between_messages: function() {
      // var messages_between_map = {};
      // this.messages.forEach(function (line, index) {
      // }
      return this.messages;
    }
  },
  watch: {
    statistics_messages_count: 'setupCharts',
    statistics_person_messages_count: 'setupCharts',
    statistics_emoji_count: 'setupCharts',
    statistics_messages_per_day_count: 'setupCharts',
  },
  methods: {
    processFile: function(event) {
      var file = event.target.files[0]; if (!file) { return; }
      var reader = new FileReader();
      var self = this;

      reader.onload = function(event) {
        var content = event.target.result;
        var datelength = 8;
        var timelength = 8;
        var personlength = (datelength+1 + timelength+1) + 1;

        // parse each line to check if the line is valid, then split the values in an object
        self.messages = content.split(/\r?\n/).filter(function(line) {
          var date = parseInt(line.substr(0, datelength).replace(/-/g,''));
          person = line.substr(timelength+2, line.substr(personlength).indexOf(":"));
          if (!isNaN(date) && person != '') { return line; }
        }).map(function(line) {

          // return object split by date, time, person and line
          return {
            date: line.substr(0, datelength),
            time: line.substr(datelength+1, timelength),
            person: line.substr(personlength, line.substr(personlength).indexOf(":")),
            line: line.substr(personlength).substr(line.substr(personlength).indexOf(":") + 2)
          };
        });
      };
      reader.readAsText(file);
      this.setupCharts();
    },
    setupCharts: _.debounce(function() {
      var chart_statistics_emoji_count = document.getElementById('chart_statistics_emoji_count').getContext('2d');
      var emojis = 15;
      new Chart(chart_statistics_emoji_count, {
          type: 'bar',
          data: {
              labels: _.take(Object.keys(app.statistics_emoji_count), emojis),
              datasets: [{
                  backgroundColor: 'rgb(37, 211, 102)',
                  data: _.take(Object.values(app.statistics_emoji_count), emojis),
              }]
          },
      });

      var chart_statistics_messages_per_day_count = document.getElementById('chart_statistics_messages_per_day_count').getContext('2d');
      var days = 10;
      var test = new Chart(chart_statistics_messages_per_day_count, {
          type: 'line',
          data: {
              labels: _.takeRight(Object.keys(app.statistics_messages_per_day_count), days),
              datasets: [{
                  backgroundColor: 'rgba(37, 211, 102, 0)',
                  borderColor: 'rgb(37, 211, 102)',
                  data: _.takeRight(Object.values(app.statistics_messages_per_day_count), days),
              }]
          },
      });

      var chart_statistics_messages_per_month_count = document.getElementById('chart_statistics_messages_per_month_count').getContext('2d');
      var months = 12;
      var test = new Chart(chart_statistics_messages_per_month_count, {
          type: 'line',
          data: {
              labels: _.takeRight(Object.keys(app.statistics_messages_per_month_count), months),
              datasets: [{
                  backgroundColor: 'rgba(37, 211, 102, 0)',
                  borderColor: 'rgb(37, 211, 102)',
                  data: _.takeRight(Object.values(app.statistics_messages_per_month_count), months),
              }]
          },
      });

      var chart_statistics_messages_per_hour = document.getElementById('chart_statistics_messages_per_hour').getContext('2d');
      var test = new Chart(chart_statistics_messages_per_hour, {
          type: 'bar',
          data: {
              labels: Object.keys(app.statistics_messages_per_hour),
              datasets: [{
                  backgroundColor: 'rgb(37, 211, 102)',
                  data: Object.values(app.statistics_messages_per_hour),
              }]
          },
      });

      // var messages_between_map = {};
      // var self = this;
      // this.messages.forEach(function (line, index) {
      //   // if (self.messages.length == index) { break; }
      //   var first_message = moment(self.messages[index].time, "HH:mm:ss");
      //   var next_message = moment(self.messages[index].time, "HH:mm:ss");
      //   console.log(first_message);
      //   console.log(next_message);
      //   var difference_between = moment.utc(next_message.diff(first_message));
      //   console.log(difference_between.format("HH:mm:ss"));
      //   // messages_between_map.push(difference_between);
      // });

      // console.log(first_message);
      // console.log(next_message);
      // var difference_between = moment.utc(next_message.diff(first_message));
      // console.log(difference_between.format("HH:mm:ss"));
    }, 100),
  }
});

Chart.defaults.global.legend.display = false;
Chart.defaults.global.tooltips.enabled = false;
Chart.defaults.global.animation.duration = 2200;
var set_options = {};