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
  original_textarea.value += '\n\nCHAR_COUNT = ' + original_text.length;

  // Get lines
  let lines = original_text.split('\n');

  // Get TextLines
  let text_lines = [];
  for (i = 0; i < lines.length; ++i)
  {
    let curr_line = lines[i];
    console.log('\nCURR_LINE (' + i + ')'); // DEBUG
    if (curr_line.trim() != '')
    {
      let raw_tokens = getRawTokens(curr_line);
      // DEBUG
      console.log('RAW_TOKEN_COUNT = ' + raw_tokens.length);
      for (i = 0; i < raw_tokens.length; ++i)
      {
        console.log('RAW_TOKEN: ' + raw_tokens[i].descr());
      }
      // DEBUG

      let processed_tokens = getProcessedTokens(raw_tokens);
      // DEBUG
      console.log('\n\nPROCESSED_TOKEN_COUNT = ' + processed_tokens.length);
      for (i = 0; i < processed_tokens.length; ++i)
      {
        console.log('PROCESSED_TOKEN: ' + processed_tokens[i].descr());
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

  console.log('\n\nTEXT_LINE_COUNT = ' + text_lines.length);
  for (i = 0; i < text_lines.length; ++i)
  {
    console.log('TEXTLINE (' + i + '): ' + text_lines[i].descr());
  }

  return; // DEBUG

  // WORKS (hereon down...)
  let raw_tokens = getRawTokens(original_text);
  original_textarea.value += '\n\nTOKEN_COUNT = ' + raw_tokens.length;

  for (i = 0; i < raw_tokens.length; ++i)
  {
    original_textarea.value += '\n' + raw_tokens[i].descr();
  }

  // Get processed tokens
  let processed_tokens = getProcessedTokens(raw_);
  original_textarea.value += '\n\nTOKEN_COUNT = ' + raw_tokens.length;
}


//---------------------------------------
// DROPDOWNS

var start_dropdown = document.getElementById("start_dropdown");
setStartDropdownOptions();

var end_dropdown = document.getElementById("end_dropdown");
setEndDropdownOptions(chord_names);


function setStartDropdownOptions()
{
  let c = chord_names;
  for (i = 0; i < c.length; ++i)
  {
    let curr_chord = chord_names[i];
    let option = document.createElement('option');
    option.value = curr_chord;
    option.text = curr_chord;
    start_dropdown.appendChild(option);
  }
}

function setEndDropdownOptions(arr)
{
  end_dropdown.length = 0;

  for (i = 0; i < arr.length; ++i)
  {
    let curr_chord = arr[i];
    let option = document.createElement('option');
    option.value = curr_chord;
    option.text = curr_chord;
    end_dropdown.appendChild(option);
  }
}





