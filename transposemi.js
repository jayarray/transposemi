// BUTTONS

var transpose_button = document.getElementById("transpose_button");
transpose_button.addEventListener('click', transpose);

//---------------------------------------
// TEXTAREAS

var original_textarea = document.getElementById("original_textarea");
var transposed_textarea = document.getElementById("transposed_textarea");

//---------------------------------------
// DROPDOWNS

var start_dropdown = document.getElementById("start_dropdown");
setStartDropdownOptions();
start_dropdown.addEventListener('change', changeEndDropdownOptions)

var end_dropdown = document.getElementById("end_dropdown");
setEndDropdownOptions(chord_names);
changeEndDropdownOptions();


function setStartDropdownOptions()
{
  let all_chord_names = getFullListOfChords();
  for (let i = 0; i < all_chord_names.length; ++i)
  {
    let curr_chord = all_chord_names[i];
    let option = document.createElement('option');
    option.value = curr_chord;
    option.text = curr_chord;
    start_dropdown.appendChild(option);
  }
}

function setEndDropdownOptions(arr)
{
  end_dropdown.length = 0;

  for (let i = 0; i < arr.length; ++i)
  {
    let curr_chord = arr[i];
    let option = document.createElement('option');
    option.value = curr_chord;
    option.text = curr_chord;
    end_dropdown.appendChild(option);
  }
}

function getSelectedStartOption()
{
  return start_dropdown.options[start_dropdown.selectedIndex].value;
}

function getSelectedEndOption()
{
  return end_dropdown.options[end_dropdown.selectedIndex].value;
}

function changeEndDropdownOptions()
{
  let start_chord = start_dropdown.options[start_dropdown.selectedIndex].value;
  if (start_chord.endsWith('m'))
  {
    setEndDropdownOptions(getMinorChords());
  }
  else
  {
    setEndDropdownOptions(getMajorChords());
  }

  end_dropdown.value = getSelectedStartOption();

}

//-----------------------------------
// TRANSPOSE

function transpose()
{
  let original_text = original_textarea.value; 

  /* DEBUG
  let tokenizer = new Tokenizer(original_text);
  let raw_tokens = [];
  while (tokenizer.hasNext())
  {
    raw_tokens.push(tokenizer.getNext());
  }
  console.log('\nRAW_TOKENS = ' + raw_tokens.length);
  //raw_tokens.forEach(token => console.log('  TOKEN: ' + token.descr()));

  let pbuilder = new ProcessedTokenBuilder(raw_tokens);
  let processed_tokens = [];
  while (pbuilder.hasNext())
  {
    processed_tokens.push(pbuilder.getNext());
  }
  console.log('\n\nPROCESSED_TOKENS = ' + processed_tokens.length);
  processed_tokens.forEach(token => console.log('  TOKEN: ' + token.descr()));
  */

  let lines = original_text.split('\n');
  console.log('\nTOTAL_LINES = ' + lines.length);
  lines.forEach(line => console.log('LINE=' + line));

  let text_lines = lines.map(line => getTextLine(line));
  console.log('\nTEXT_LINE_COUNT = ' + text_lines.length);

  text_lines.forEach((line, i) => {
    console.log('\n  TEXTLINE (' + i + '):: ' + line.descr());
    line.processed_tokens.forEach(ptoken => {
      console.log('    TOKEN: ' + ptoken.string);
    });
  });

  //return; // DEBUG


  let start_chord = getChord(getSelectedStartOption());
  let end_chord = getChord(getSelectedEndOption());
  if (start_chord.string() == end_chord.string())
  {
    console.log('CHORDS are the same. No transposition needed.');
    return;
  }

  // Keep original format handy
  let newline_format_str = getNewlineFormatString(original_text);
  console.log('\n\n*** NEWLINE_FORMAT_STR:\n' + newline_format_str);


  console.log('\n\n*** TRANSPOSING:: FROM=' + start_chord.string() + ', TO=' + end_chord.string());

  let textline_transposer = new TextLineTransposer(start_chord, end_chord);
  console.log('\nTRANSPOSING textlines...'); // DEBUG

  let transposed_text = '';
  for (let i = 0; i < text_lines.length; ++i)
  {
    let curr_textline = text_lines[i];
    if (curr_textline.needs_transposing)
    {
      transposed_text += textline_transposer.transpose(curr_textline);
    }
    else
    {
      transposed_text += curr_textline.format_str;
    }
  }
  transposed_textarea.value = transposed_text; 
}

function getNewlineFormatString(text)
{
  let format_str = '';
  let f_index = 0;

  let i = 0;
  while (i < text.length)
  {
    let curr_char = text.charAt(i);
    if (curr_char == '\n')
    {
      format_str += curr_char;
      i += 1;
    }
    else
    {
      while(i < text.length && curr_char != '\n')
      {
        i += 1;
        curr_char = text.charAt(i);
      }

      format_str += '{' + f_index + '}' + curr_char;
      f_index += 1;
      i += 1;
    }
  }
  return format_str;
}



