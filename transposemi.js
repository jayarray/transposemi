var original_textarea = document.getElementById("original_textarea");
var transposed_textarea = document.getElementById("transposed_textarea");

var start_dropdown = document.getElementById("start_dropdown");
setStartDropdownOptions();

var end_dropdown = document.getElementById("end_dropdown");
setEndDropdownOptions();

var transpose_button = document.getElementById("transpose_button");
transpose_button.addEventListener('click', 'transpose');

//---------------------------------------
// DROPDOWNS

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

function setEndDropdownOptions()
{
  let c = chord_names;
  for (i = 0; i < c.length; ++i)
  {
    let curr_chord = chord_names[i];
    let option = document.createElement('option');
    option.value = curr_chord;
    option.text = curr_chord;
    end_dropdown.appendChild(option);
  }
}


//---------------------------------------
//


function getChordInfo(str)
{
  // TO DO
}



function transpose()
{
  // Get original text

  // Transpose it

  // Return formatted html (with colored fonts n stuff)

  // Display in tranposed_textarea
}
