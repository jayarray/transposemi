var max_chord_length = 2;
var max_mod_length = 3;

//-----------------------------------

function isValidChordLetter(char)
{
  return char >= 'A' && char <= 'G';
}

function isValidSymbol(char)
{
  return char == 'b' || char == '#';
}

function isValidChordName(str)
{
   return str.length <= max_chord_length && chord_names.includes(str);
}

function isValidMod(str)
{
   return str.length <= max_mod_length && mod_names.includes(str);
}

function isValidNumber(str)
{
  for (i = 0; i < str.length; ++i)
  {
    let curr_char = str.charAt(i);
    if (!isNumber(curr_char))
    {
      return false;
    }
  }
  return char.charAt(0) != '0'; // Proper numbers don't start with 0.
}

function isNullOrEmpty(str, start_index)
{
  try
  {
    let result = str.charAt(start_index);
    if (result == '')
    {
      return true;
    }
  }
  catch (error)
  {
    return true; // is null
  }
  return false;
}

function startsWithChord(str)
{
  if (str.length() == 1)
  {
    return isValidChordName(str);
  }

  let currIndex = 0;
  if (isValidChordLetter(str.charAt(currIndex))) // FIRST char is a CHORD LETTER
  {
    let size = 1;
    currIndex++;

    if (isValidSymbol(str.charAt(currIndex))) // SECOND char is a FLAT / SHARP symbol
    {
      size++;
      return isValidChord(str.substring(0, size));
    }
    return true;
  }
  return false;
}

function chordLength(str)
{
  let chordLength = 0;

  if (str.length() == 1)
  {
    if (isValidChordName(str))
    {
      chordLength++;
    }
    return chordLength;
  }

  if (isValidChordLetter(str.charAt(chordLength))) // FIRST char is a CHORD LETTER
  {
    chordLength++;
    if (isValidSymbol(str.charAt(chordLength))) // SECOND char is a FLAT / SHARP symbol
    {
      chordLength++;
      if (!isValidChordName(str.substring(0, chordLength)))
      {
        chordLength--;
      }
    }
  }
  return chordLength;
}

function nextIsNumber(str)
{
  let number = '';
  for (i = 0; i < str.length(); ++i)
  {
    let curr_char = str.charAt(i);
    if (!isNumber(curr_char))
    {
      return false;
    }
    number += curr_char;
  }
  return isValidNumber(number);
}

function numberLength(str)
{
  let number = '';
  for (i = 0; i < str.length; ++i)
  {
    let curr_char = str.charAt(i);
    if (!isNumber(curr_char))
    {
      return 0;
    }
    number += curr_char;
  }

  if (isValidNumber(number))
  {
    return number.length();
  }
  return 0;
}

function nextIsMinorSymbol(str)
{
  return str.charAt(0) == 'm';
}

function nextIsMod(str)
{
  int modLength = 3;
  if (str.length() >= modLength)
  {
    // Ensure all chars are lowercase
    for (int i = 0; i < modLength; ++i)
    {
      char currChar = str.charAt(i);
      if (!Character.isLowerCase(currChar))
      {
        return false;
      }
    }
    
    let mod = str.substring(0, modLength);
    return StringIsValidMod(mod);
  }
  return false;
}

function modLength(str)
{
  int modLength = 3;
  if (str.length() >= modLength)
  {
    // Ensure all chars are lowercase
    for (int i = 0; i < modLength; ++i)
    {
      char currChar = str.charAt(i);
      if (!Character.isLowerCase(currChar))
      {
        return 0;
      }
    }

    let mod = str.substring(0, modLength);
    if (StringIsValidMod(mod))
    {
      return modLength;
    }
  }
  return 0;
}

function newChordObj()
{
  return {"name": null, 
          "is_flat": null, 
          "is_sharp": null, 
          "is_minor": null,
          "modifier": null,

          key: function() {
            if (IsSharp)
            {
              return Name + "#";
            }
            else if (IsFlat)
            {
              return Name + "b";
            }
            else
            {
              return Name;
            }
          },

          equalTo: function (chord) {
            let this_key = key();
            let other_key = chord.key();
            return this_key.localCompare(other_key) == 0;
          },

          hasSameNameAs: function (chord) {
            return this.name.localCompare(chord.name) == 0;
          },

          string: function () {
            let ret = this.name;
            if (this.is_flat)
            {
              ret += 'b';
            }

            if (this.is_sharp)
            {
              ret += '#';
            }

            if (this.is_minor)
            {
              ret += 'm';
            }

            if (this.modifier != null && this.modifier != '')
            {
              ret += this.modifier;
            }
            return ret;
          }
  };
}

function getChord(str)
{
  let chord = newChordObj();

  if (startsWithChord(str))
  {
    // Verify you have a CHORD
    let chordLength = chordLength(str);
    if (chordLength > 0)
    {
      if (chordLength == 1)  // Assign chord name ONLY
      {
        chord.name = str.substring(0, chordLength));
      }
      else // Chord contains a FLAT or SHARP symbol
      {
        chord.name = str.substring(0, 1));

        let symbol = str.charAt(1);
        if (symbol == 'b')
        {
          chord.is_flat = true;
        }
        else if (symbol == '#')
        {
          chord.is_sharp = true;
        }
      }


      if (!isNullOrEmpty(str, chordLength)) // Check if you've reached the last char
      {
        str = str.substring(chordLength);
        if (nextIsMinorSymbol(str))
        {
          // Test if 'm' is a MINOR SYMBOL or part of a MOD
          if (nextIsMod(str))
          {
            let modLength = modLength(str);
            if (modLength > 0)
            {
              chord.modifier = str.substring(0, modLength);
              if (!isNullOrEmpty(str, modLength))
              {
                str = str.substring(modLength);
                if (nextIsNumber(str))
                {
                  let numLength = numberLength(str);
                  if (numLength > 0)
                  {
                    let updatedModifier = chord.modifier + str.substring(0, numLength);
                    chord.modifier = updatedModifier;
                    if (!isNullOrEmpty(str, numLength))
                    {
                      return null;
                    }
                    return chord; // CHORD MOD NUMBER
                  }
                }
                return null;
              }
              return chord; // CHORD MOD
            }
          }
          else // Next is not a MOD
          {
            chord.is_minor = true;
            if (!isNullOrEmpty(str, 1))  // Check if you've reached the last char
            {
              str = str.substring(1);
              if (nextIsNumber(str))
              {
                // Verify you have a NUMBER
                let numLength = numberLength(str);
                if (numLength > 0)
                {
                  let updatedModifier = str.substring(0, numLength);
                  chord.modifier = updatedModifier;
                  if (!isNullOrEmpty(str, numLength))
                  {
                    return null;
                  }
                }
                return chord;  // CHORD m NUMBER
              }
              else if (nextIsMod(str))
              {
                // Verify you have a MOD
                let modLength = modLength(str);
                if (modLength > 0)
                {
                  let updatedModifier = str.substring(0, modLength);
                  chord.modifier = updatedModifier;
                  if (!isNullOrEmpty(str, modLength))
                  {
                    str = str.substring(modLength);
                    if (nextIsNumber(str))
                    {
                      // Verify you have a NUMBER
                      let numLength = numberLength(str);
                      if (numLength > 0)
                      {
                        let finalModifier = chord.modifier + str.substring(0, numLength);
                        chord.modifier = finalModifier;
                        if (!isNullOrEmpty(str, numLength))
                        {
                          return null;
                        }
                      }
                      return chord; // CHORD m MOD NUMBER
                    }
                    return null; // ADDED 8/16/2015 Was allowing 'Csusxxx' as a chord.
                  }
                }
                return chord; // CHORD m MOD
              }
            }
          }
          return chord; // CHORD m
        }
        else if (nextIsNumber(str))
        {
          let numLength = numberLength(str);
          if (numLength > 0)
          {
            chord.modifier = str.substring(0, numLength);
            if (!isNullOrEmpty(str, numLength))
            {
              return null;
            }
          }
          return chord; // CHORD NUMBER
        }
        else if (nextIsMod(str))
        {
          let modLength = modLength(str);
          if (modLength > 0)
          {
            chord.modifier = str.substring(0, modLength);
            if (!isNullOrEmpty(str, modLength))
            {
              str = str.substring(modLength);
              if (nextIsNumber(str))
              {
                let numLength = numberLength(str);
                let updatedModifier = chord.modifier + str.substring(0, numLength);
                chord.modifier = updatedModifier;
                if (!isNullOrEmpty(str, numLength))
                {
                  return null;
                }
                return chord; // CHORD MOD NUMBER
              }
              return null; // str is INVALID  (Example:  AsusApple, Bmajp, etc) // ADDED
            }
          }
          return chord; // CHORD MOD
        }
        return null;
      }
    }
    return chord; // CHORD
  }
  return null;
}
