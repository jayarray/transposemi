var max_chord_length = 2;
var max_mod_length = 3;

//-----------------------------------

function isValidChordLetter(char)
{
  return char >= 'A' && char <= 'G';
}

function isLowerCase(char)
{
  return char >= 'a' && char <= 'z';
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
  for (let i = 0; i < str.length; ++i)
  {
    let curr_char = str.charAt(i);
    if (!isNumber(curr_char))
    {
      return false;
    }
  }
  return str.charAt(0) != '0'; // Proper numbers don't start with 0.
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
  if (str.length == 1)
  {
    return isValidChordName(str);
  }

  let curr_index = 0;
  if (isValidChordLetter(str.charAt(curr_index))) // FIRST char is a CHORD LETTER
  {
    let size = 1;
    curr_index++;

    if (isValidSymbol(str.charAt(curr_index))) // SECOND char is a FLAT / SHARP symbol
    {
      size++;
      return isValidChordName(str.substring(0, size));
    }
    return true;
  }
  return false;
}

function chordLength(str)
{
  let chordLength = 0;

  if (str.length == 1)
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
  for (let i = 0; i < str.length; ++i)
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
  for (let i = 0; i < str.length; ++i)
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
    return number.length;
  }
  return 0;
}

function nextIsMinorSymbol(str)
{
  return str.charAt(0) == 'm';
}

function nextIsMod(str)
{
  let mod_length = 3;
  if (str.length >= mod_length)
  {
    // Ensure all chars are lowercase
    for (let i = 0; i < mod_length; ++i)
    {
      let curr_char = str.charAt(i);
      if (!isLowerCase(curr_char))
      {
        return false;
      }
    }
    
    let mod = str.substring(0, mod_length); // HERE
    return isValidMod(mod);
  }
  return false;
}

function modLength(str)
{
  let mod_length = 3;
  if (str.length >= mod_length)
  {
    // Ensure all chars are lowercase
    for (let i = 0; i < mod_length; ++i)
    {
      let curr_char = str.charAt(i);
      if (!isLowerCase(curr_char))
      {
        return 0;
      }
    }

    let mod = str.substring(0, mod_length);
    if (isValidMod(mod))
    {
      return mod_length;
    }
  }
  return 0;
}

class Chord
{
  constructor()
  {
    this.name = null;
    this.is_flat = false;
    this.is_sharp = false;
    this.is_minor = false;
    this.modifier = null;
  }

  key()
  {
    if (this.is_sharp)
    {
      return this.name + "#";
    }
    else if (this.is_flat)
    {
      return this.name + "b";
    }
    else
    {
      return this.name;
    }
  }

  equalTo(chord)
  {
    let this_key = this.key();
    let other_key = chord.key();
    return this_key.localCompare(other_key) == 0;
  }

  hasSameNameAs(chord)
  {
    return this.name.localCompare(chord.name) == 0;
  }

  string()
  {
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
}

function getChord(str)
{
  let chord = new Chord();

  if (startsWithChord(str))
  {
    // Verify you have a CHORD
    let chord_length = chordLength(str);
    if (chord_length > 0)
    {
      if (chord_length == 1)  // Assign chord name ONLY
      {
        chord.name = str.substring(0, chord_length);
      }
      else // Chord contains a FLAT or SHARP symbol
      {
        chord.name = str.substring(0, 1);

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

      if (!isNullOrEmpty(str, chord_length)) // Check if you've reached the last char
      {
        str = str.substring(chord_length);
        if (nextIsMinorSymbol(str))
        {
          // Test if 'm' is a MINOR SYMBOL or part of a MOD
          if (nextIsMod(str))
          {
            let mod_length = modLength(str);
            if (mod_length > 0)
            {
              chord.modifier = str.substring(0, mod_length);
              if (!isNullOrEmpty(str, mod_length))
              {
                str = str.substring(mod_length);
                if (nextIsNumber(str))
                {
                  let num_length = numberLength(str);
                  if (num_length > 0)
                  {
                    let updatedModifier = chord.modifier + str.substring(0, num_length);
                    chord.modifier = updatedModifier;
                    if (!isNullOrEmpty(str, num_length))
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
                let num_length = numberLength(str);
                if (num_length > 0)
                {
                  let updatedModifier = str.substring(0, num_length);
                  chord.modifier = updatedModifier;
                  if (!isNullOrEmpty(str, num_length))
                  {
                    return null;
                  }
                }
                return chord;  // CHORD m NUMBER
              }
              else if (nextIsMod(str))
              {
                // Verify you have a MOD
                let mod_length = modLength(str);
                if (mod_length > 0)
                {
                  let updatedModifier = str.substring(0, mod_length);
                  chord.modifier = updatedModifier;
                  if (!isNullOrEmpty(str, mod_length))
                  {
                    str = str.substring(mod_length);
                    if (nextIsNumber(str))
                    {
                      // Verify you have a NUMBER
                      let num_length = numberLength(str);
                      if (num_length > 0)
                      {
                        let finalModifier = chord.modifier + str.substring(0, num_length);
                        chord.modifier = finalModifier;
                        if (!isNullOrEmpty(str, num_length))
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
          let num_length = numberLength(str);
          if (num_length > 0)
          {
            chord.modifier = str.substring(0, num_length);
            if (!isNullOrEmpty(str, num_length))
            {
              return null;
            }
          }
          return chord; // CHORD NUMBER
        }
        else if (nextIsMod(str))
        {
          let mod_length = modLength(str);
          if (mod_length > 0)
          {
            chord.modifier = str.substring(0, mod_length);
            if (!isNullOrEmpty(str, mod_length))
            {
              str = str.substring(mod_length);
              if (nextIsNumber(str))
              {
                let num_length = numberLength(str);
                let updatedModifier = chord.modifier + str.substring(0, num_length);
                chord.modifier = updatedModifier;
                if (!isNullOrEmpty(str, num_length))
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
