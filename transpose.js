class ChordTransposer
{
  constructor(start_chord, end_chord)
  {
    this.start_chord = start_chord;
    this.start_chord_index = convertChordToInt(start_chord);

    this.end_chord = end_chord;
    this.end_chord_index = convertChordToInt(end_chord);

    this.lookup_dict = this.getLookupDictionary(end_chord);

    this.semitones = null;
    if (this.start_chord_index < this.end_chord_index)
    {
      this.semitones = this.end_chord_index - this.start_chord_index;
    }
    else
    {
      this.semitones = -(this.start_chord_index - this.end_chord_index);
    }
  }

  transpose(chord)
  {  
    let chord_index = convertChordToInt(chord);
    let new_value = ((chord_index + this.semitones) % Object.keys(this.lookup_dict).length); 

    if (new_value < 0)
    {
      new_value = new_value + Object.keys(this.lookup_dict).length;
    }
    
    let new_chord_name = this.lookup_dict[new_value.toString()]; // Remove ".toString()" if FAILS
    let new_chord = this.getTransposedChord(chord, new_chord_name);
    return new_chord;
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
    new_chord.modifier = chord.modifier;
    
    return new_chord;
  }

  getLookupDictionary(end_chord)
  {
    let c_scale = new ChromaticScale();

    let scale_value = -1;
    let chord_name = end_chord.key();
    if (end_chord.is_minor)
    {
      scale_value = c_scale.minor_key_scale_lookup[chord_name];
      if (scale_value == null)
      {
         scale_value = c_scale.major_key_scale_lookup[chord_name];
      }
    }
    else
    {
      scale_value = c_scale.major_key_scale_lookup[chord_name];
      if (scale_value == null)
      {
        scale_value = c_scale.minor_key_scale_lookup[chord_name];
      }
    }

    // Return the right dictonary
    if (scale_value == c_scale.scale_type.indexOf('sharp'))
    {
      console.log('  Returning SHARP lookup_dict...');
      return c_scale.sharp_notes_lookup;
    }

    console.log('  Returning FLAT lookup_dict...');
    return c_scale.flat_notes_lookup;
  }

  descr()
  {
    return 'START_INDEX= ' + this.start_chord_index +
           ', END_INDEX=' + this.end_chord_index + 
           ', SEMITONES=' + this.semitones + 
           ', LOOKUP=' + JSON.stringify(this.lookup_dict);
  }
}

//--------------------------------------

class TextLineTransposer
{
  constructor(start_chord, end_chord)
  {
    this.chord_transposer = new ChordTransposer(start_chord, end_chord);
    console.log('CHORD_TRANSPOSER:: ' + this.chord_transposer.descr());
  }

  transpose(textline)
  {
    if (!textline.needs_transposing)
    {
      return textline.format_str;
    }

    let processed_tokens = textline.processed_tokens;
    let transposed_strings = [];

    for (let i = 0; i < processed_tokens.length; ++i)
    {
      let curr_token = processed_tokens[i];
      if (curr_token.type == 'chord')
      {
        let chord = getChord(curr_token.string);
        if (chord != null)
        {
          let transposed_chord = this.chord_transposer.transpose(chord);
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
        let new_str = this.transposeComment(new Comment2(comment_info.open_bracket, 
                                                        comment_info.closed_bracket, 
                                                        comment_info.inner_string));
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

  getLookupDictionary(end_chord)
  {
    let c_scale = new ChromaticScale();

    let scale_value = -1;
    let chord_name = end_chord.key();
    if (end_chord.is_minor)
    {
      scale_value = c_scale.minor_key_scale_lookup[chord_name];
      if (scale_value == null)
      {
         scale_value = c_scale.major_key_scale_lookup[chord_name];
      }
    }
    else
    {
      scale_value = c_scale.major_key_scale_lookup[chord_name];
      if (scale_value == null)
      {
        scale_value = c_scale.minor_key_scale_lookup[chord_name];
      }
    }

    // Return the right dictonary
    if (scale_value == c_scale.scale_type.indexOf('sharp'))
    {
      console.log('  Returning SHARP lookup_dict...');
      return c_scale.sharp_notes_lookup;
    }

    console.log('  Returning FLAT lookup_dict...');
    return c_scale.flat_notes_lookup;
  }
}