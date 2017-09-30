function convertChordToInt(chord)
{
  let key = chord.Key();

  let sharp_value = getEnumValue(key, sharp_names);
  if (sharp_value >= 0)
  {
    return sharp_value;
  }

  let flat_value = getEnumValue(key, flat_names);
  if (flat_value >= 0)
  {
    return flat_value;
  }

  return -1;
}
