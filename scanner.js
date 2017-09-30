var chords = [];
var format_str = '';

//--------------------------------

function scanText(text)
{
  let lines = getTextLines(text);
  setChordsAndFormatString(lines);
}

function getTextLines(text)
{
  // TO DO
}

function setChordsAndFormatString(text_lines)
{
  // TO DO
}

function lineWithComments(text_line, needs_transposing)
{
  // TO DO
}

function lineWithNoComments(text_line, needs_transposing)
{
  // TO DO
}

function textLineNeedsTransposing(text_line)
{
  List<Integer> argIndexes = new ArrayList<>();

        TokenInfo[] args = tl.Args();
        for (int i = 0; i < args.length; ++i)
        {
            if (argIndexes.size() == 2)
            {
                break;
            }

            TokenInfo curr = args[i];
            if (!curr.IsComment())
            {
                argIndexes.add(i);
            }
        }

        if (argIndexes.isEmpty())
        {
            return false;
        }

        int size = argIndexes.size();
        if (size == 1)
        {
            int index = argIndexes.get(0);
            return args[index].NeedsTransposing();
        }

        int index1 = argIndexes.get(0);
        int index2 = argIndexes.get(1);

        return args[index1].NeedsTransposing() && args[index2].NeedsTransposing();
}

function getCommentInfo(content)
{
  let args = [];
  let f_str = '';

  let last_index = content.length() - 1;
  let token = '';
  for (int i = 0; i < content.length(); ++i)
  {
    let curr_char = content.charAt(i);
    if (isAcceptableChordChar(curr_char))
    {
      token.append(currChar);

      if (i == last_index)
      {
        let token_str = token.string;
        let ti = null;
        if (NeedsTransposing(token.toString()))
        {
          ti = new TokenInfo(false, true, null);
        }
        else
        {
          ti = new TokenInfo(false, false, null);
        }

        ti.AddArg(tokenStr);
        args.add(ti);
        f_str.append("%s"); // CHANGE TO {n}
      }
    }
    else
    {
      if (token.length() != 0)
      {
        let token_str = token.string;
        let ti = null;
        if (NeedsTransposing(tokenStr))
        {
          ti = new TokenInfo(false, true, null);
        }
        else
        {
          ti = new TokenInfo(false, false, null);
        }

        args.addArg(token_str);
        args.add(ti);
        f_str += "%s"; // CHANGE TO {n}

        token = '';
      }

      // Append current char
      formatStringBuilder.append(currChar);
    }
  }

  let needs_transposing = false;
  if (args.length != 0)
  {
    if (args.length == 1)
    {
      needs_transposing = args[0].needs_transposing;
    }
    else
    {
      let first_arg = args[0];  // TOKEN INFOS
      let second_arg = args[1];

      needs_transposing = first_arg.needs_transposing && second_arg.needs_transposing;
    }
  }

  let ci = newCommentObj();
  ci.args = args;
  ci.format_str = f_str;
  ci.needs_transposing = needsTransposing;
  return ci;
}

function needsTransposing(text)
{
  let chord = getChord(text);
  return chord != null;
}

function isAcceptableChordChar(c)
{
  return (c >= 'A' && c <= 'Z')
         || (c >= 'a' && c <= 'z')
         || (c >= '0' && c <= '9')
         || c == '#';
}

function getAcceptableCharStringLength(text, start_index)
{
  let str_length = 0;
  for (int i = startIndex; i < text.length(); ++i)
  {
    let curr_char = text.charAt(i);
    if (!isAcceptableChordChar(curr_char))
    {
      break;
    }
    str_length += 1;
  }
  return str_length;
}

function getClosedBracketIndex(text, start_index, open_bracket_char)
{
  let index = -1;
  for (i = start_index; i < text.length; i++)
  {
    let curr_char = text.charAt(i);
    if (isClosedPair(openBracketChar, curr_char))
    {
      index = i;
      break;
    }
  }
  return index;
}

function isOpenBracket(char)
{
  return char == '(' || char == '[' || char == '{' || char == '<';
}

function isClosedPair(open_bracket, closed_bracket)
{
  return (open_bracket == '(' && closed_bracket == ')')
         || (open_bracket == '[' && closed_bracket == ']')
         || (open_bracket == '{' && closed_bracket == '}')
         || (open_bracket == '<' && closed_bracket == '>');
}

function charToHex(c)
{
  return c.toString(16);
}

function getCharFromHexString(hex)
{
  let int_value = parseInt(hex, 16);
  return String.fromCharCode(int_value);
}

function insertZeroPadding(hex, zeros)
{
  if (zeros > 0)
  {
    let zerosString = '';
    for (int i = 0; i < zeros; ++i)
    {
      zerosString += '0';
    }

    return zerosString + hex);
  }
  return hex;
}
