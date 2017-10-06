class ChromaticScale
{
  constructor()
  {
    // Names
    this.sharp_names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    this.flat_names = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];;
    this.natural_names = ["C", "D", "E", "F", "G", "A", "B"];
    this.solfege_names = ["DO", "RE", "MI", "FA", "SOL", "LA", "SI"];
    this.chord_names = ["A", "Ab", "A#", "B", "Bb", "C", "C#", "D", "Db", "D#", "E", "Eb", "F", "F#", "G", "Gb", "G#"];
    this.mod_names = ["maj", "sus", "dim", "aug", "add"];

    // Scales
    this.sharp_scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    this.flat_scale = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
    this.natural_scale = ["C", "D", "E", "F", "G", "A", "B"];

    // Types
    this.scale_type = ['flat', 'sharp'];

    // Chords
    this.major_chords = this.chord_names.map(chord => chord);
    this.minor_chords = this.chord_names.map(chord => chord + 'm');

    // Dictionaries
    this.chord_dict = {};
    this.chord_names.forEach((name, i) => this.chord_dict[name] = i);

    this.mod_dict = {};
    this.mod_names.forEach((name, i) => this.mod_dict[name] = i);

    this.flat_notes_lookup = {};
    this.flat_names.forEach((name, i) => this.flat_notes_lookup[i] = this.flat_names[i]);

    this.flat_notes_reverse_lookup = {};
    this.flat_names.forEach((name, i) => this.flat_notes_reverse_lookup[name] = i);

    this.sharp_notes_lookup = {};
    this.sharp_names.forEach((name, i) => this.sharp_notes_lookup[i] = this.sharp_names[i]);

    this.sharp_notes_reverse_lookup = {};
    this.sharp_names.forEach((name, i) => this.sharp_notes_reverse_lookup[name] = i);

    this.major_key_scale_lookup = {};
    ["G", "D", "A", "E", "B", "F#", "C#"].forEach(key => this.major_key_scale_lookup[key] = this.scale_type.indexOf('sharp'));    // Major sharps
    ["Cb", "Gb", "Db", "Ab", "Eb", "Bb", "F"].forEach(key => this.major_key_scale_lookup[key] = this.scale_type.indexOf('flat')); // Major flats

    this.minor_key_scale_lookup = {};
    ["A", "E", "B", "F#", "C#", "G#", "D#", "A#"].forEach(key => this.minor_key_scale_lookup[key] = this.scale_type.indexOf('sharp'));  // Minor sharps
    ["Ab", "Eb", "Bb", "F", "C", "G", "D"].forEach(key => this.minor_key_scale_lookup[key] = this.scale_type.indexOf('flat'));          // Minor flats

    this.solfege_notes_lookup = {};
    this.natural_names.forEach((name, i) => this.solfege_notes_lookup[name] = this.solfege_names[i]);


    this.chord_object_lookup_dict = {};
    let chord_attrs = 
    {
      "A": {"is_flat": true, "is_sharp": true, "is_neutral": true},
      "B": {"is_flat": true, "is_sharp": false, "is_neutral": true},
      "C": {"is_flat": false, "is_sharp": true, "is_neutral": true},
      "D": {"is_flat": true, "is_sharp": true, "is_neutral": true},
      "E": {"is_flat": true, "is_sharp": false, "is_neutral": true},
      "F": {"is_flat": false, "is_sharp": true, "is_neutral": true},
      "G": {"is_flat": true, "is_sharp": true, "is_neutral": true},
    };

    let keys = Object.keys(chord_attrs);
    for (let i = 0; i < keys.length; ++i)
    {
      let chord_name = keys[i];
      let curr_obj = chord_attrs[chord_name];

      if (curr_obj.is_flat)
      {
        let chord = new Chord();
        chord.name = chord_name;
        chord.is_flat = true;
        this.chord_object_lookup_dict[chord.string()] = chord; // FLAT
    
        chord = new Chord();
        chord.name = chord_name;
        chord.is_minor = true;
        chord.is_flat  = true;
        this.chord_object_lookup_dict[chord.string()] = chord; // FLAT m
      }
    
      if (curr_obj.is_sharp)
      {
        let chord = new Chord();
        chord.name = chord_name;
        chord.is_sharp  = true;
        this.chord_object_lookup_dict[chord.string()] = chord; // SHARP
    
        chord = new Chord();
        chord.name = chord_name;
        chord.is_minor = true;
        chord.is_sharp = true;
        this.chord_object_lookup_dict[chord.string()] = chord; // SHARP m
      }
    
      if (curr_obj.is_neutral)
      {
        let chord = new Chord();
        chord.name = chord_name;
        this.chord_object_lookup_dict[chord.string()] = chord; // NATURAL
    
        chord = new Chord();
        chord.name  = chord_name;
        chord.is_minor = true;
        this.chord_object_lookup_dict[chord.string()] = chord; //NATURAL m
      }
    }
  }

  allChords()
  {
    return this.major_chords.concat(this.minor_chords);
  }

  getChordByName(name)
  {
    return this.chord_object_lookup_dict[name];
  }
}