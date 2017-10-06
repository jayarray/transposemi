// BUTTONS

var transpose_button = document.getElementById("transpose_button");
transpose_button.addEventListener('click', transpose);

//---------------------------------------
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


var font_color_dropdown = document.getElementById("font_color_dropdown");
font_color_dropdown.addEventListener('change', changeFontColor);

let sizes = [];
for (let i = 8; i <= 78; i += 2)
{
  sizes.push(i);
}

var font_size_dropdown = document.getElementById("font_size_dropdown");
font_size_dropdown.addEventListener('change', changeFontSize);
setDropdownOptions(font_size_dropdown, sizes);


function getSelectedSize()
{
  return font_size_dropdown.options[font_size_dropdown.selectedIndex].value;
}

function getSelectedColor()
{
  return font_color_dropdown.options[font_color_dropdown.selectedIndex].value;
}

function changeFontSize()
{
  // TODO
}

function changeFontColor()
{
  // TODO
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

  let transposed_textlines = [];
  for (let i = 0; i < text_lines.length; ++i)
  {
    let curr_textline = text_lines[i];
    if (curr_textline.needs_transposing)
    {
      let t = textline_transposer.transpose(curr_textline);
      console.log('  TRANSPOSED_LINE: ' + t);
      transposed_textlines.push(t);
    }
  }

  console.log('\n\nBUILDING RESULTS...');
  let formatted_text = getFormattedString(newline_format_str, transposed_textlines);
  let h = new HtmlText(formatted_text, getSelectedSize(), 'bold', getSelectedColor());

  transposed_text_div.innerHTML = h.html(); 
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

      format_str += '{' + f_index + '}';
      f_index += 1;
    }
  }
  return format_str;
}



