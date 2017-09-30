var semitones = null;
var enum_arr = null;

//-------------------------------------

function getSemitones(enumArr, curr_chord_index, other_chord_index)
{
  enum_arr = eumArr;

  if (curr_chord_index < other_chord_index)
  {
    semitones = other_chord_index - curr_chord_index;
  }
  else
  {
    semitones = -(curr_chord_index - other_chord_index); 
  }
}

function transposeThisChord(chord)
{
  let chord_index = getEnumValue(key, sharp_names);

  let new_value = (chord_index + semitones) % enum_arr.length;
  if (new_value < 0)
  {
    new_value += enum_arr.length;
  }

  let new_chord_name = enum_arr[new_value];
  let new_chord = getTransposedChord(new_chord_name);
}

function getTransposedChord(name)
{
  let new_chord = newChordObj();

  if (name.length == 1)
  {
    chord.name = name;
    chord.is_flat = false;
    chord.is_sharp = false;
  }
  else
  {
    let last_char = name.charAt(1);
    if (last_char == 'b')
    {
      chord.is_flat = true;
      chord.is_sharp = false;
    }
    else if (last_char == '#')
    {
      chord.is_flat = false;
      chord.is_sharp = true;
    }
    chord.name = name.substring(0, 1);
  }
  return chord; 
}




