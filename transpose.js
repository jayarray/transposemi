class ChordTransposer
{
  constructor(start_chord, end_chord)
  {
    this.start_chord = null;
    this.end_chord = null;
    this.semitones = null;
    this.lookup = null;
    this.initialize(start_chord, end_chord);
  }

  initialize(start_chord, end_chord)
  {
    this.start_chord = start_chord;
    this.end_chord = end_chord;
    this.semitones = this.getSemitones(start_chord, end_chord);
    this.lookup = this.getLookupList(end_chord);
  }

  convertChordToInt(chord)
  {
    let key = chord.key();
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

  getSemitones(start_chord, end_chord)
  {
    let start_value = this.convertChordToInt(start_chord);
    let end_value = this.convertChordToInt(end_chord);

    let semitones = 0;
    if (start_value < end_value)
    {
      semitones = end_value - start_value;
    }
    else
    {
      semitones = -(start_value - end_value);
    }
    return semitones;
  }

  getNewChordValue(chord)
  {
    let chord_index = this.convertChordToInt(chord);
    let new_value = ((chord_index + this.semitones) % this.lookup.length);
    if (new_value < 0)
    {
      new_value = new_value + this.lookup.length;
    }
    return new_value
  }

  getLookupList(end_chord)
  {
    let scale_type = getScaleType(end_chord);
    if (end_chord.is_minor)
    {
      if (scale_type == 'flat')
      {
        return minor_flats;
      }
      else
      {
        return minor_sharps;
      }
    }
    else
    {
      if (scale_type == 'flat')
      {
        return major_flats;
      }
      else
      {
        return major_sharps;
      }
    }
    return null;
  }

  transpose(chord)
  {  
    //let lookup = this.getLookupList(this.end_chord);
    //let semitones = this.getSemitones(this.start_chord, this.end_chord);
    let new_chord_value = this.getNewChordValue(chord, this.semitones);
    let new_chord_name = this.lookup[new_chord_value];
  
    let transposed_chord = this.getTransposedChord(chord, new_chord_name);
    return transposed_chord;
  }

  getTransposedChord(chord, new_chord_name)
  {
    let new_chord = new Chord();

    if (new_chord_name.length == 1)
    {
      new_chord.name = new_chord_name;
      new_chord.is_flat = false;
      new_chord.is_sharp = false;
    }
    else
    {
      let last_char = new_chord_name.charAt(1);
      if (last_char == 'b')
      {
        new_chord.is_flat  =true ;
        new_chord.is_sharp = false;
      }
      else if (last_char == '#')
      {
        new_chord.is_flat = false;
        new_chord.is_sharp = true;
      }
      let new_name = new_chord_name.substring(0, 1);
      new_chord.name = new_name;
    }
    return new_chord;
  }
}

//--------------------------------------

class TextLineTransposer
{
  constructor(start_chord, end_chord)
  {
    this.start_chord = start_chord;
    this.end_chord = end_chord;
    this.chord_transposer = new ChordTransposer(start_chord, end_chord);
  }

  transpose(textline)
  {
    let processed_tokens = textline.processed_tokens;
    let chord_transposer = new ChordTransposer(this.start_chord, this.end_chord);
    let transposed_strings = [];

    for (let i = 0; i < processed_tokens.length; ++i)
    {
      let curr_token = processed_tokens[i];
      if (curr_token.type == 'chord')
      {
        let chord = getChord(curr_token.string);
        if (chord != null)
        {
          let transposed_chord = chord_transposer.transpose(chord);
          transposed_strings.push(transposed_chord.string());
        }
      }
      else if (curr_token.type == 'comment')
      {
        let tokenizer = new Tokenizer(curr_token.string);
        let raw_tokens = [];
        while (tokenizer.hasNext())
        {
          raw_tokens.push(tokenizer.getNext());
        }

        let comment_info = getCommentInfo(raw_tokens, 0); // HERE
        let new_str = this.transposeComment(new Comment(comment_info.open_bracket, 
                                                        comment_info.closed_bracket, 
                                                        comment_info.inner_string, 
                                                        comment_info.processed_tokens,
                                                        comment_info.needs_transposing));
        transposed_strings.push(new_str);
      }
    }
    return getFormattedString(textline.format_str, transposed_strings);
  }

  transposeComment(comment)
  {
    let transposed_strings = [];

    let tokens = comment.processed_tokens;
    for (let i = 0; i < tokens.length; ++i)
    {
      let curr_token = tokens[i];
      if (curr_token.type == 'chord')
      {
        let chord = getChord(curr_token.string);
        if (chord != null)
        {
          let transposed_chord = this.chord_transposer.transpose(chord);
          transposed_strings.push(transposed_chord.string());
        }
      }
    }
    return getFormattedString(comment.format_str, transposed_strings);
  }
}