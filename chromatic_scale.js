var chord_names = ["A", "Ab", "A#", "B", "Bb", "C", "C#", "D", "Db", "D#", "E", "Eb", "F", "F#", "G", "Gb", "G#"];
var sharp_names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
var flat_names = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
var natural_names = ["C", "D", "E", "F", "G", "A", "B"];
var solfege_names = ["DO", "RE", "MI", "FA", "SOL", "LA", "SI"];
var mod_names = ["maj", "sus", "dim", "aug", "add"];
var scale_type =["flat", "sharp"]

var major_keys = ["G", "D", "A", "E", "B", "F#", "C#", "Cb", "Gb", "Db", "Ab", "Eb", "Bb", "F"];
var major_sharps = ["G", "D", "A", "E", "B", "F#", "C#"];
var major_flats = ["Cb", "Gb", "Db", "Ab", "Eb", "Bb", "F"];

var minor_keys = ["A", "E", "B", "F#", "C#", "G#", "D#", "A#", "Ab", "Eb", "Bb", "F", "C", "G", "D"];
var minor_sharps = ["A", "E", "B", "F#", "C#", "G#", "D#", "A#"];
var minor_flats = ["Ab", "Eb", "Bb", "F", "C", "G", "D"];

//--------------------------------------------------

function getEnumValue(str, arr)
{
  return arr.indexOf(str);
}

function majorKeyScaleLookup(key)
{
  let sharp_enum_value = getEnumValue(scale_type, 'sharp');
  let flat_enum_value = getEnumValue(scale_type, 'flat');

  if (major_sharps.includes(key))
  {
    return sharp_enum_value;
  }
  return flat_enum_value;
}

function minorKeyScaleLookup(key)
{
  let sharp_enum_value = getEnumValue(scale_type, 'sharp');
  let flat_enum_value = getEnumValue(scale_type, 'flat');

  if (minor_sharps.includes(key))
  {
    return sharp_enum_value;
  }
  return flat_enum_value;
} 

//---------------------------------

function getMajorChords()
{
  return chord_names;
}

function getMinorChords()
{
  let minor_chords = [];
  for (let i = 0; i < chord_names.length; ++i)
  {
    let chord_str = chord_names[i] + 'm';
    minor_chords.push(chord_str);
  }
  return minor_chords;
}

function getFullListOfChords()
{
  let minor_chords = getMinorChords();
  return chord_names.concat(minor_chords);
}
