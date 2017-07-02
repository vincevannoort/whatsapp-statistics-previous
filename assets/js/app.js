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
          type: 'line',
          data: {
              labels: _.take(Object.keys(app.statistics_emoji_count), emojis),
              datasets: [{
                  backgroundColor: 'rgba(37, 211, 102, 0)',
                  borderColor: 'rgb(37, 211, 102)',
                  data: _.take(Object.values(app.statistics_emoji_count), emojis),
              }]
          },
      });

      var chart_statistics_messages_per_day_count = document.getElementById('chart_statistics_messages_per_day_count').getContext('2d');
      var days = 30;
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
    }, 100),
    // get_result_from_index_and_array: function(current_index, index, array) {
    //   if (index === 0) {
    //     return array[index];
    //   } else if (index < 0) {
    //     return array[(current_index + array.length + index) % array.length];
    //   } else if (index > 0) {
    //     return array[(current_index + index) % array.length];
    //   }
    // },
    // get_5next_and_5previous_results_from_index_and_array: function(index, array) {
    //   console.log(array);
    //   console.log(Object.keys(array), Object.keys(array).length);
    //   console.log(Object.values(array), Object.values(array).length);

    //   var array_values = Object.values(array);
    //   return 0;
    //   // var array_keys = Object.keys(array);
    //   // console.log(this.get_result_from_index_and_array(index, -5, array_keys));
    //   // console.log(this.get_result_from_index_and_array(index, -5, array_values));
    //   // return {
    //   //   this.get_result_from_index_and_array(index, -5, array_values),
    //   //   this.get_result_from_index_and_array(index, -4, array_values),
    //   //   this.get_result_from_index_and_array(index, -3, array_values),
    //   //   this.get_result_from_index_and_array(index, -2, array_values),
    //   //   this.get_result_from_index_and_array(index, -1, array_values),
    //   //   this.get_result_from_index_and_array(index, 0, array_values),
    //   //   this.get_result_from_index_and_array(index, 1, array_values),
    //   //   this.get_result_from_index_and_array(index, 2, array_values),
    //   //   this.get_result_from_index_and_array(index, 3, array_values),
    //   //   this.get_result_from_index_and_array(index, 4, array_values),
    //   //   this.get_result_from_index_and_array(index, 5, array_values),
    //   // };
    // }
  }
});

Chart.defaults.global.legend.display = false;
Chart.defaults.global.tooltips.enabled = false;
var set_options = {};