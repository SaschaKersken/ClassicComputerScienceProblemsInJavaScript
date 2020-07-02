util = {
  out: function(data) {
    if (typeof data === 'object') {
      document.writeln(JSON.stringify(data));
    } else {
      document.writeln(data);
    }
  }
};
