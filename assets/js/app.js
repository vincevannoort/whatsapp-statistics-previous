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
      return counted_lines;
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