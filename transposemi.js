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
}

//-----------------------------------
// TRANSPOSE

function transpose()
{
  let original_text = original_textarea.value; 
  //original_textarea.value += '\n\nCHAR_COUNT = ' + original_text.length;

  let lines = original_text.split('\n');
  console.log('\nTOTAL_LINES = ' + lines.length); // DEBUG

  let text_lines = getTextLines(lines);
  console.log('\nTEXT_LINE_COUNT = ' + text_lines.length);
  text_lines.forEach((line, i) => console.log('  TEXTLINE (' + i + '): ' + line.descr()));

  for (let i = 0; i < text_lines.length; ++i)
  {
    let tokens = text_lines[i].processed_tokens;
    for (let j = 0; j < tokens.length; ++j)
    {
      console.log('    TOKEN: ' + tokens[j].descr());
    }
  }
  

  // TODO:
  //   * Transpose this shit!
}



