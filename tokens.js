function getLines(str)
{
  return str.split('\n');
}

function isLetter(char)
{
  let lowercase = char.toLowerCase();
  return lowercase >= 'a' && lowercase <= 'z';
}

function isNumber(char)
{
  return char >= '0' && char <= '9';
}

function isSpecialSymbol(char)
{
  return char == '#' || or char == 'b';  // Might add more
}

function getFormatString(str)
{
  // TO DO
}

function isComment(str)
{
  // TO DO
}

function commentNeedsTransposing(comment)
{
  // TO DO
}

function isChord(token)
{
  // TO DO
}

function newTokenObj()
{
  return {"type": null, 
          "needs_transposing": null, 

          string: function () {
            return this.format_str.format(args);
          }
  };
}

function getTokens(str)
{
  let tokens = [];
  
  let curr_token = '';
  let curr_text = '';

  for (i = 0; i < str.length; ++i)
  {
    let curr_char = str.charAt(i);

    if (curr_text != '')
    {
      tokens.push(curr_text);
      curr_token = '';
    }

    if (isLetter(curr_char) || isNumber(curr_char) || isSpecialSymbol(curr_char))
    {
      curr_token += curr_char;
    }
    else
    {
      if (curr_token != '')
      {
        tokens.push(curr_token);
        curr_token = '';
      }
      
      curr_text += curr_char;
    }
  }
}



