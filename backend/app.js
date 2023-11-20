import Parser from '@postlight/parser';

let url = "";

Parser.parse(url, { contentType: 'text' }).then(result => console.log(result.content));