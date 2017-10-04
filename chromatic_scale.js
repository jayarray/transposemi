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

var scale_types = ['flat', 'sharp'];

//--------------------------------------------------

function getEnumValue(str, arr)
{
  return arr.indexOf(str);
}

function getScaleType(chord)
{
  let chord_name = chord.key();
  if (chord.is_minor)
  {
    let scale_value = minor_sharps.indexOf(chord_name);
    if (scale_value >= 0)
    {
      return 'sharp';
    }
      
    scale_value = minor_flats.indexOf(chord_name);
    if (scale_value >= 0)
    {
      return 'flat';
    }   
  }
  else
  {
    let scale_value = major_sharps.indexOf(chord_name);
    if (scale_value >= 0)
    {
      return 'sharp';
    }
      
    scale_value = major_flats.indexOf(chord_name);
    if (scale_value >= 0)
    {
      return 'flat';
    } 
  }
  return null;
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
  return chord_names.map(chord => chord + 'm');
}

function getFullListOfChords()
{
  let minor_chords = getMinorChords();
  return chord_names.concat(minor_chords);
}
