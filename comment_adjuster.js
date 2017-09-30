var adjusted_format_str = '';
var adjusted_args = [];

//-----------------------------------

function adjustComment(comment)
{
  let original_format_str = comment.string;
  let arg_string_list = [];
  let chord_names_list = new ArrayList<>();

  let index = 0;
  for (int i = 0; i < comment.args.length; ++i)
  {
    let curr = comment.args[i];
    Chord chord = validator.GetChord(curr);
    if (chord == null)
    {
      arg_string_list.push(curr);
    }
    else
    {
      chordNamesList.add(curr);
      let arg_str = '{0}'.format(index);
      arg_string_list.push(arg_str);
      index += 1;
    }
  }
  adjusted_format_str = arg_string_list.join(' ');
}
