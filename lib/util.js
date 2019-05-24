'use strict';

exports.toCamelCase = function snakeCaseToCamelCase(word) {
  word = word.toLocaleLowerCase();
  const find = /\.\w|_\w/g;
  const convert = matches => matches[1].toUpperCase();
  return word.replace(find, convert);
};

exports.toPascalCase = function toPascalCase(str) {
  return str
    .replace(/(\-|\_|\.)/g, ' ')
    .replace(/(\w)(\w*)/g, (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase())
    .replace(/ /g, '');
};
