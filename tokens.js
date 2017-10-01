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
    return 'STRING=' + this.string + ', IS_WORD=' + this.is_word + ', IS_COMMENT=' + this.is_comment;
  }
}

class ProcessedToken
{
  constructor() 
  {
    this.type = null; // CHORD | COMMENT | PLAINTEXT
    this.needs_transposing = null;
    this.string = null;
  }

  descr()
  {
    return 'STRING=' + this.string + ', TYPE=' + this.type + ', NEEDS_TRANSPOSING=' + this.needs_transposing;
  }
}

class TextLine
{
  constructor()
  {
    this.processed_tokens = [];
    this.format_str = null;
  }

  needsTransposing()
  {
    return !this.processed_tokens.filter(token => !(token.type == 'comment' || token.needs_transposing)).length;
  }

  descr()
  {
    return 'PROCESSED_TOKENS = ' + this.processed_tokens.length + ', NEEDS_TRANSPOSING = ' + this.needsTransposing() + ', FORMAT_STR = ' + this.format_str;
  }

  toString()
  {
    if (processed_tokens.length == 0)
    {
      return '';
    }

    let str = '';
    for (let i = 0; i < this.processed_tokens.length; ++i)
    {
      str += this.processed_tokens[i].string;
    }
    return str;
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

function commentNeedsTransposing(str)
{
  console.log('    COMMENT_NEEDS_TRANS:: str = ' + str) // DEBUG
  if (str == '()') // FIX: Why is this coming in as null?
  {
    return false;
  }

  let content = str.slice(1, str.length - 1); // str[1:last)
  console.log('    COMMENT_NEEDS_TRANS:: content = ' + content) // DEBUG
  let raw_tokens = getRawTokens(content);
  let processed_tokens = getProcessedTokens(raw_tokens);

  let needs_transposing = true;
  for (let i = 0; i < processed_tokens.length; ++i)
  {
    let curr_proc_token = processed_tokens[i];
    if (curr_proc_token.type == 'plaintext' || curr_proc_token.type == 'comment')
    {
      needs_transposing = false;
      break;
    }
  }
  return needs_transposing;
}

function getRawTokens(str)
{
  let raw_tokens = [];
  
  let prev_char = '';
  let curr_token = '';
  let curr_text = '';

  let start_index = -1;

  for (let i = 0; i < str.length; ++i)
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

        prev_char = ')';
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
          i = end_index + 1;
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

  // Check if there are chars/text leftover
  let leftover_str = str.substring(start_index);
  //console.log('LEFTOVER_STRING = ' + leftover_str); // DEBUG

  let is_word = true;
  for (let i = 0; i < leftover_str.length; ++i)
  {
    let c = leftover_str.charAt(i);
    if (!isWordChar(c) && !isSpecialSymbol(c))
    {
      is_word = false;
      break;
    }
  }

  //console.log('IS_WORD = ' + is_word);
  if (is_word)
  {
    let word = new RawToken();
    word.is_word = true;
    word.string = str.substring(start_index);
    raw_tokens.push(word);
  }
  else
  {
    let plaintext = new RawToken();
    plaintext.string = str.substring(start_index);
    raw_tokens.push(plaintext);
  }
  return raw_tokens.slice(1);  // 1st item and on.
}


function getProcessedToken(raw_token)
{
  let processed_token = new ProcessedToken();
  if (raw_token.is_word)
  {
    let chord = getChord(raw_token.string);
    if (chord != null)
    {
      processed_token.type = 'chord';
      processed_token.needs_transposing = true;
    }
    else
    {
      processed_token.type = 'plaintext';
      processed_token.needs_transposing = false;
    }
  }
  else if (raw_token.is_comment)
  {
    processed_token.type = 'comment';
    processed_token.needs_transposing = commentNeedsTransposing(raw_token.string);
  }
  else
  {
    processed_token.type = 'plaintext';
    processed_token.needs_transposing = false;
  }
  processed_token.string = raw_token.string;

  return processed_token;
}

function getProcessedTokens(raw_tokens)
{
  return raw_tokens.map(token => getProcessedToken(token));
}

function processTextLine(text_line)
{
  let format_str = '';
  let f_index = 0;
  let final_tokens = [];

  text_line.processed_tokens.forEach(token => {
    if (token.type == 'plaintext' || (token.type == 'comment' && !commentNeedsTransposing(token.string)) )
    {
      format_str += token.string;
    }
    else
    {
      final_tokens.push(token);
      format_str += '{' + f_index + '}';
      f_index += 1;
    }
  });

  text_line.processed_tokens = final_tokens;
  if (final_tokens.length == 0)
  {
    text_line.needs_transposing = false;
  }
  else
  {
    text_line.needs_transposing = true;
  }
  text_line.format_str = format_str;
}

function processTextLines(text_lines)
{
  text_lines.forEach(line => processTextLine(line));
}