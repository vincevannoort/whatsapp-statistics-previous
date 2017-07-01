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
      // var countedNames = names.reduce(function (allNames, name) { 
      //   if (name in allNames) {
      //     allNames[name]++;
      //   }
      //   else {
      //     allNames[name] = 1;
      //   }
      //   return allNames;
      // }, {});

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
        var datetimelength = 17;

        // parse each line to check if the line is valid, then split the values in an object
        self.lines = content.split(/\r?\n/).filter(function(line) {
          var date = parseInt(line.substr(0, datelength).replace(/-/g,''));
          person = line.substr(datetimelength + 2, line.substr(19).indexOf(":"));
          if (!isNaN(date) && person != '') { return line; }
        }).map(function(line) {
          return {
            // moment(line.substr(0, datetimelength), "DD-MM-YY HH:mm::ss")
            datetime: line.substr(0, datetimelength),
            person: line.substr(datetimelength + 2, line.substr(19).indexOf(":")),
            line: line.substr(19).substr(line.substr(19).indexOf(":") + 2)
          };
        });
        // console.log(moment( self.lines[0].substr(0,datetimelength) ));
      };
      reader.readAsText(file);
    }
  }
});