class RawToken
{
  constructor() 
  {
    this.is_word = false;
    this.is_comment = false;
    this.string = null;
  }

  descr()
  {
    return 'IS_WORD=' + this.is_word + ', IS_COMMENT=' + this.is_comment + ', STRING=' + this.string;
  }
}

class ProcessedToken
{
  constructor() 
  {
    this.type = null; // CHORD | COMMENT | PLAINTEXT
    this.string = null;
  }

  descr()
  {
    return 'TYPE=' + this.type + ', STRING=' + this.string;
  }
}

class TextLine
{
  constructor()
  {
    this.args = [];
    this.format_str = '';
  }

  addArgsWithAssociatedFormatString(token_args, format_string)
  {
    for (i = 0; i < token_args.length; ++i)
    {
      addArg(token_args[i]);
    }
    this.string += format_str;
  }

  addArg(token_arg)
  {
    this.args.push(token_arg);
  }

  appendToFormatString(str)
  {
    this.format_str += str;
  }

  hasComments()
  {
    for (i = 0; i < this.args.length; ++i)
    {
      let curr_token = this.args[i];
      if (curr_token.is_comment)
      {
        return true;
      }
    }
    return false;
  }

  toString()
  {
    if (args.length == 0)
    {
      return this.format_str;
    }

    for (i = 0; i < this.args.length; ++i)
    {
      let curr_token = argsArr[i];
      //Object[] args = curr_token.Args();
      argStrings[i] = String.format(curr_token.format_str, args);
    }

    //Object[] argObjArr = argStrings;
    //String finalString = String.format(FormatStringBuilder.toString(), argObjArr);

    return finalString;
  }
}

//----------------------------

function isLetter(char)
{
  return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
}

function isNumber(char)
{
  return char >= '0' && char <= '9';
}

function isSpecialSymbol(char)
{
  return char == '#' || char == 'b';  // Might add more
}

function isWordChar(char)
{
  return isLetter(char) || isNumber(char) || isSpecialSymbol(char);
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

function getLines(str)
{
  return str.split('\n');
}

function getRawTokens(str)
{
  let raw_tokens = [];
  
  let prev_char = '';
  let curr_token = '';
  let curr_text = '';

  let start_index = -1;

  for (i = 0; i < str.length; ++i)
  {
    let curr_char = str.charAt(i);
    curr_text += curr_char;

    if (isOpenBracket(curr_char))
    {
      let next_index = i + 1;
      if (next_index < str.length && isClosedPair(curr_char, str.charAt(next_index)))
      {
        let next_char = str.charAt(next_index);
        let comment = new RawToken();
        comment.is_comment = true;
        comment.string = '()';
        raw_tokens.push(comment);

        prev_char = next_char;
        i = next_index;
      }
      else
      {
        let temp_start_index = i;
        let end_index = i;
        let temp_curr_char = curr_char;
        while (end_index < str.length && !isClosedPair(curr_char, temp_curr_char))
        {
          end_index += 1;
          temp_curr_char = str.charAt(end_index);
        }
  
        if (end_index >= str.length)
        {
          curr_text += curr_char;
        }
        else
        {
          // Append previously awaiting token
          if (isWordChar(prev_char))
          {
            let word = new RawToken();
            word.is_word = true;
            word.string = str.substring(start_index, i);
            raw_tokens.push(word);
          }
          else if (!isWordChar(prev_char))
          {
            let plaintext = new RawToken();
            plaintext.string = str.substring(start_index, i);
            raw_tokens.push(plaintext);
          }
    
          // Append comment
          let comment = new RawToken();
          comment.is_comment = true;
          comment.string = str.substring(i, end_index + 1);
          raw_tokens.push(comment);
    
          prev_char = str.charAt(end_index - 1);
          i = end_index;
          start_index = i;
        }
      } 
    }
    else if (isWordChar(prev_char) && !isWordChar(curr_char))
    {
      let word = new RawToken();
      word.is_word = true;
      word.string = str.substring(start_index, i);
      raw_tokens.push(word);

      prev_char = curr_char;
      start_index = i;
    }
    else if (!isWordChar(prev_char) && isWordChar(curr_char))
    {
        let plaintext = new RawToken();
        plaintext.string = str.substring(start_index, i);
        raw_tokens.push(plaintext);
  
        prev_char = curr_char;
        start_index = i;
    }
    else
    {
      prev_char = curr_char;
      curr_text += curr_char;
    }
  }
  return raw_tokens.slice(1);  // 1st item and on.
}

function getProcessedTokens(raw_tokens)
{
  let processed_tokens = [];

  for (i = 0; i < raw_tokens.length; ++i)
  {
    let token = new ProcessedToken();

    let curr_token = raw_tokens[i];
    if (curr_token.is_word)
    {
      token.type = 'word';
    }
    else if (curr_token.is_word)
    {
      token.type = 'comment';
    }
    else
    {
      token.type = 'plaintext';
    }
    token.string = curr_token.string;
    processed_tokens.push(token);
  }
  return processed_tokens;
}