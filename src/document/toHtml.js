
//turn a Doc object into a HTML string
const toHtml = function(doc, options) {
  let data = doc.data;
  let html = '';
  html += '<!DOCTYPE html>\n';
  html += '<html>\n';
  html += '<head>\n';
  //add page title
   if (options.title === true && data.title) {
     html += '<title>' + data.title + ' - Wikipedia' + '</title>\n';
   }
  html += '</head>\n';
  html += '<body>\n';
  //add header 
   if (options.title === true && data.title) {
     html += '<h1>' + data.title +  '</h1>\n';
   }
  //render infoboxes (up at the top)
  if (options.infoboxes === true && data.infoboxes) {
    html += data.infoboxes.map(i => i.html(options)).join('\n');
  }
  //render each section
  html += data.sections.map(s => s.html(options)).join('\n');
  html += '</body>\n';
  html += '</html>\n';
  return html;
};
module.exports = toHtml;
