// BUTTONS

var transpose_button = document.getElementById("transpose_button");
transpose_button.addEventListener('click', transpose);

//---------------------------------------
// TEXTAREAS

var original_textarea = document.getElementById("original_textarea");
var transposed_textarea = document.getElementById("transposed_textarea");

function transpose()
{
  transposed_textarea.value = '[TRANSPOSED]\n\n' + original_textarea.value;
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



