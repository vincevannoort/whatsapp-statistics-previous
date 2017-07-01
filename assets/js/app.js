var app = new Vue({
  el: '#app',
  data: {
    lines: []
  },
  computed: {
    statistics_lines_count: function() {
      return this.lines.length;
    },
    statistics_person_lines_count: function() {
      var counted_lines = this.lines.reduce(function (all_persons, line) {
        if (line.person in all_persons) {
          all_persons[line.person]++;
        } else {
          all_persons[line.person] = 1;
        }
        return all_persons;
      }, {});
      return _.fromPairs(_.sortBy(_.toPairs(counted_lines), function(a){return a[1]}).reverse());
    },
    statistics_emoji_count: function() {
      var counted_emojis = this.lines.reduce(function (all_emojis, line) {
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
    }
  },
  methods: {
    processFile(event) {
      var file = event.target.files[0]; if (!file) { return; }
      var reader = new FileReader();
      var self = this;

      reader.onload = function(event) {
        var content = event.target.result;
        var datelength = 8;
        var timelength = 8;
        var personlength = (datelength+1 + timelength+1) + 1;

        // parse each line to check if the line is valid, then split the values in an object
        self.lines = content.split(/\r?\n/).filter(function(line) {
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
    }
  }
});