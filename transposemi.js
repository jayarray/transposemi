// BUTTONS

var transpose_button = document.getElementById("transpose_button");
transpose_button.addEventListener('click', transpose);


//---------------------------------------
// TEXTAREAS

var original_textarea = document.getElementById("original_textarea");
var transposed_textarea = document.getElementById("transposed_textarea");

function transpose()
{
  let original_text = original_textarea.value; 
  //original_textarea.value += '\n\nCHAR_COUNT = ' + original_text.length;

  // Get lines
  let lines = original_text.split('\n');
  console.log('\nTOTAL_LINES = ' + lines.length); // DEBUG

  // Get TextLines
  let text_lines = [];
  for (let i = 0; i < lines.length; ++i)
  {
    let curr_line = lines[i];
    console.log('\nCURR_LINE (' + i + '): ' + curr_line); // DEBUG
    if (curr_line.trim() != '')
    {
      let raw_tokens = getRawTokens(curr_line);
      // DEBUG
      console.log('\nRAW_TOKEN_COUNT = ' + raw_tokens.length);
      for (let j = 0; j < raw_tokens.length; ++j)
      {
        console.log('  RAW_TOKEN: ' + raw_tokens[j].descr());
      }
      // DEBUG

      let processed_tokens = getProcessedTokens(raw_tokens);
      // DEBUG
      console.log('\nPROCESSED_TOKEN_COUNT = ' + processed_tokens.length);
      for (let j = 0; j < processed_tokens.length; ++j)
      {
        console.log('  PROCESSED_TOKEN: ' + processed_tokens[j].descr());
      }
      // DEBUG
      
      let t = new TextLine();
      if (processed_tokens.length > 0)
      {
        t.processed_tokens = processed_tokens;
      }
      text_lines.push(t);
    }
    else
    {
      text_lines.push(new TextLine());
    }
  }

  console.log('\nTEXT_LINE_COUNT = ' + text_lines.length);
  for (let i = 0; i < text_lines.length; ++i)
  {
    console.log('  TEXTLINE (' + i + '): ' + text_lines[i].descr());
  }

  // Process TextLines
  let processed_textlines = getProcessedTextLines(text_lines);
  // DEBUG
  console.log('\n\nPROCESSED_TEXTLINES_COUNT = ' + processed_textlines.length);
  processed_textlines.forEach((line, i) => {
    console.log('  PROCESSED_TEXTLINE (' + i + '): ' + line.descr())
  });
  // DEBUG

  // TODO:
  //   * Transpose this shit!
}


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
    let available_options = getMinorChords();
    setEndDropdownOptions(available_options);
  }
}



