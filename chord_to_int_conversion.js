function convertChordToInt(chord)
{
  let key = chord.key();
  let c_scale = new ChromaticScale();

  let sharp_value = c_scale.sharp_notes_reverse_lookup[key];
  if (sharp_value != null)
  {
    return sharp_value;
  }

  let flat_value = c_scale.flat_notes_reverse_lookup[key];
  if (flat_value != null)
  {
    return flat_value;
  }

  return -1;
}