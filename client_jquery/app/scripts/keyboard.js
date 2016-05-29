module.exports = function() {
  return {
    handleKeyboard: function(letter, btn, checkLetter) {
      if (btn.size() > 0 && !btn.prop('disabled') && isLetter(letter)) {
        checkLetter(btn, letter);
      }
    }
  };
};

/**
 * Checks if the given character is a letter.
 *
 * @param {character} c Character.
 * @return {boolean} Is the given character a valid letter.
 */
function isLetter(c) {
  return c.length === 1 && c.toLowerCase() !== c.toUpperCase();
}
