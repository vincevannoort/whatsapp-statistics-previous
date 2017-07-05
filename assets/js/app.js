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
        var emoji_array = line.line.match(/(?:\uD83D\uDC68\u200D(?:\u2764\uFE0F\u200D\uD83D\uDC8B\u200D\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])))|\uD83D\uDC69\u200D(?:\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\u2764\uFE0F\u200D\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])))|(?:\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D\uD83D\uDC68|\uD83D\uDC66\u200D\uD83D\uDC66|(?:\uD83D[\uDC67-\uDC69])\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]))|\uD83D\uDC69(?:\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\u2764\uFE0F\u200D(?:\uD83D[\uDC68\uDC69])|(?:\uD83D[\uDC67\uDC69])\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]))|(?:\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708])\uFE0F|(?:\u26F9|\uD83C[\uDFC3\uDFC4\uDFCA-\uDFCC]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDD75\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E])(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]\uFE0F)|(?:\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E])(?:\uD83C[\uDFFB-\uDFFF])|(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB-\uDFFF]|\u200D(?:[\u2695\u2696\u2708]\uFE0F|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDC66\uDC67\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]))|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD30\uDD33-\uDD36])(?:\uD83C[\uDFFB-\uDFFF])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E\uDD3C)\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E])\u200D[\u2640\u2642])\uFE0F)|(?:(?:[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2708\u2709\u270C\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27A1\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE1A\uDE2F\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCB-\uDFCE\uDFD4-\uDFDF\uDFF3\uDFF5\uDFF7]|\uD83D[\uDC3F\uDC41\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73-\uDD79\uDD87\uDD8A-\uDD8D\uDD90\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3])\uFE0F|[\u23E9-\u23EC\u23F0\u23F3\u26CE\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2795-\u2797\u27B0\u27BF]|\uD83C[\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF6]|\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0])/g);
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