// DIVS
var transposed_text_div = document.getElementById("transposed_text_div");

//----------------------------------------
// TEXTAREAS

var original_textarea = document.getElementById("original_textarea");
//var transposed_textarea = document.getElementById("transposed_textarea");

//---------------------------------------
// DROPDOWNS

// *** CHORDS
var start_dropdown = document.getElementById("start_dropdown");
start_dropdown.addEventListener('change', changeEndDropdownOptions)

var end_dropdown = document.getElementById("end_dropdown");
end_dropdown.addEventListener('change', endOptionChanged);
initializeDropdowns();
changeEndDropdownOptions();


function initializeDropdowns()
{
  let c_scale = new ChromaticScale();
  setDropdownOptions(start_dropdown, c_scale.allChords());
  setDropdownOptions(end_dropdown, c_scale.allChords());
}

function setDropdownOptions(dropdown, arr)
{
  // Clear current list
  dropdown.length = 0;

  // Populate list
  for (let i = 0; i < arr.length; ++i)
  {
    let curr_chord = arr[i];
    let option = document.createElement('option');
    option.value = curr_chord;
    option.text = curr_chord;
    dropdown.appendChild(option);
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
  let c_scale = new ChromaticScale();
  let start_chord = start_dropdown.options[start_dropdown.selectedIndex].value;

  if (start_chord.endsWith('m'))
  {
    setDropdownOptions(end_dropdown, c_scale.minor_chords);
  }
  else
  {
    setDropdownOptions(end_dropdown, c_scale.major_chords);
  }
  end_dropdown.value = getSelectedStartOption();
}

function endOptionChanged()
{
  if (getSelectedStartOption() != getSelectedEndOption())
  {
    transpose();
  }
}

//-----------------------------------
// TRANSPOSE

function transpose()
{
  let original_text = original_textarea.value; 

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

  
  // Transpose chords for each textline
  let chord_transposer = new ChordTransposer(start_chord, end_chord);
  for (let i = 0; i < text_lines.length; ++i)
  {
    let curr_textline_tokens = text_lines[i].processed_tokens;
    for (let j = 0; j < curr_textline_tokens.length; ++j)
    {
      let curr_token = curr_textline_tokens[j];
      let curr_chord = getChord(curr_token.string);
      let transposed_chord = chord_transposer.transpose(curr_chord);
      curr_token.string = transposed_chord.string();
    }
  }


  // Convert lines to formatted HTML
  let formatted_lines = [];
  for (let i = 0; i < text_lines.length; ++i)
  {
    let curr_textline = text_lines[i];
    if (curr_textline.format_str != '')
    {
      let html_str = toHtml(curr_textline);
      formatted_lines.push(html_str);
    }
  }

  console.log('\n\nBUILDING RESULTS...');

  let formatted_html = '';
  if (newline_format_str.includes('\n'))
  {
    let reformatted_newline_str = replaceWhiteSpaceWithHtmlEntities(newline_format_str);
    console.log('\nREFORMATTED_NEWLINE_STR= ' + reformatted_newline_str);

    formatted_html = getFormattedString(reformatted_newline_str, formatted_lines);
  }
  else
  {
    formatted_html = getFormattedString(newline_format_str, formatted_lines);
  }
  console.log('\n\nFINAL_HTML= ' + formatted_html);
  transposed_text_div.innerHTML = formatted_html; 
}


function getNewlineFormatString(text)
{
  let format_str = '';

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
      format_str += '{?}';
    }
  }
  return format_str;
}



