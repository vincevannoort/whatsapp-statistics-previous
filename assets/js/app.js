var app = new Vue({
  el: '#app',
  data: {
    messages: []
  },
  computed: {
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

      // limit to 10 emoji's
      var ordered_counted_emojis = _.fromPairs(_.sortBy(_.toPairs(counted_emojis), function(a){return a[1]}).reverse());
      var emojis = {};
      var count = 0;
      for (emoji in ordered_counted_emojis) {
        if (count < 10) {
          emojis[emoji] = ordered_counted_emojis[emoji];
          count++;
        } else { break; }
      }
      return emojis;
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
      console.log('creating charts');

      var chart_statistics_emoji_count = document.getElementById('chart_statistics_emoji_count').getContext('2d');
      new Chart(chart_statistics_emoji_count, {
          type: 'line',
          data: {
              labels: Object.keys(app.statistics_emoji_count),
              datasets: [{
                  backgroundColor: 'rgb(255, 99, 132)',
                  borderColor: 'rgb(255, 99, 132)',
                  data: Object.values(app.statistics_emoji_count),
              }]
          },
      });

      var chart_statistics_messages_per_day_count = document.getElementById('chart_statistics_messages_per_day_count').getContext('2d');
      var days = 30;
      new Chart(chart_statistics_messages_per_day_count, {
          type: 'line',
          data: {
              labels: _.takeRight(Object.keys(app.statistics_messages_per_day_count), days),
              datasets: [{
                  backgroundColor: 'rgb(255, 99, 132)',
                  borderColor: 'rgb(255, 99, 132)',
                  data: _.takeRight(Object.values(app.statistics_messages_per_day_count), days),
              }]
          },
      });
      
    }, 100),
  }
});