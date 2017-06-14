const heading_reg = /^(={1,5})([^=]{1,200}?)={1,5}$/;

//interpret ==heading== lines

const isHeading = function(line) {
  return heading_reg.test(line);
};

const parseHeading = function(line) {
  let head = line.match(heading_reg) || [];
  let depth = 1;
  if (head[1]) {
    depth = head[1].length;
  }
  return {
    title: head[2] || '',
    depth: depth,
    sentences: []
  };
};

const sections = function(lines) {
  let arr = [parseHeading('')];
  for (var i = 0; i < lines.length; i++) {
    let line = lines[i];
    //empty lines
    if (!line) {
      continue;
    }
    //handle new ==headings==
    if (isHeading(line)) {
      arr.push(parseHeading(line));
      continue;
    }
    arr[arr.length - 1].sentences.push(line);
  }
  return arr;
};

module.exports = sections;
