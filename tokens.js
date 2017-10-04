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
  constructor(raw_token) 
  {
    this.type = null; // CHORD | COMMENT | PLAINTEXT | WORD
    this.needs_transposing = null;
    this.string = null;

    this.initialize(raw_token);
  }

  initialize(raw_token)
  {
    if (raw_token.is_word)
    {
      console.log('  PROCESSED_TOKEN:: raw_token=' + raw_token.string); // DEBUG: FIX:: Sometimes leaves <space> in chord_str (so it doesnt register as valid)
      let chord = getChord(raw_token.string);
      if (chord != null)
      {
        this.type = 'chord';
        this.needs_transposing = true;
      }
      else
      {
        this.type = 'word';
        this.needs_transposing = false;
      }
    }
    else if (raw_token.is_comment)
    {
      this.type = 'comment';

      let comment = new Comment(raw_token.string);
      this.needs_transposing = comment.needs_transposing;
    }
    else
    {
      this.type = 'plaintext';
      this.needs_transposing = false;
    }
    this.string = raw_token.string;
  }

  descr()
  {
    return 'STRING=' + this.string + ', TYPE=' + this.type + ', NEEDS_TRANSPOSING=' + this.needs_transposing;
  }
}

class Comment
{
  constructor(str)
  {
    this.open_bracket = null;
    this.closed_bracket = null;
    this.string = '';
    this.format_str = '';
    this.processed_tokens = [];
    this.needs_transposing = null;

    this.initialize(str);
    this.process();
  }

  initialize(str)
  {
    this.open_bracket = str.charAt(0);
    this.closed_bracket = str.slice(-1);
    if (str.length > 2)
    {
      this.string = str.slice(1, str.length - 1);
    }
  }

  process()
  {
    // Get format string & transposeable args
    if (this.string.trim() == '')
    {
      this.needs_transposing = false
      return;
    }

    let raw_tokens = getRawTokens(this.string);
    let processed_tokens = getProcessedTokens(raw_tokens);

    let final_tokens = [];
    let index = 0;
  
    let word_count = 0;
    let trans_comment_count = 0;
    let chord_count = 0;
    for (let i = 0; i < processed_tokens.length; ++i)
    {
      let curr_token = processed_tokens[i];
      if (curr_token.type == 'plaintext' || (curr_token.type == 'comment' && !curr_token.needs_transposing) || curr_token.type == 'word')
      {
        this.format_str += curr_token.string;
        if (curr_token.type == 'word')
        {
          word_count += 1;
        }
      }
      else
      {
        this.format_str += '{' + index + '}';
        final_tokens.push(curr_token);
        index += 1;

        if (curr_token.type == 'chord')
        {
          chord_count += 1;
        }
        else if (curr_token.type == 'comment')
        {
          trans_comment_count += 1;
        }
      }
    }
    this.processed_tokens = final_tokens;

    // Check if transposable
    let all_chords = chord_count == final_tokens.length && word_count == 0;
    let at_least_one_transposable_comment = trans_comment_count > 0;
    if (all_chords || at_least_one_transposable_comment)
    {
      this.needs_transposing = true; 
    }
    else
    {
      this.needs_transposing = false;
      this.format_str = this.string;
    }
    this.format_str = this.open_bracket + this.format_str + this.closed_bracket;

    /*console.log('  FINAL_COUNT = ' + final_tokens.length + ', CHORD_COUNT = ' + 
      chord_count + ', COMM_COUNT = ' + trans_comment_count +
      ', WORD_COUNT = ' + word_count); // DEBUG*/
  }

  descr()
  {
    let d = 'STRING = ' + this.string + ', FORMAT_STR = ' + this.format_str + ', NEEDS_TRANSPOSING = ' + this.needs_transposing;
    for (let i = 0; i < this.processed_tokens.length; ++i)
    {
      d += '\n    TOKEN: ' + this.processed_tokens[i].descr();
    }
    return d;
  }

  toString()
  {
    return this.open_bracket + this.string + this.closed_bracket;
  }
}

class TextLine
{
  constructor(str)
  {
    this.string = str;
    this.processed_tokens = [];
    this.format_str = '';
    this.needs_transposing = null;

    this.initialize(str);
    this.process();
  }

  initialize(str)
  {
    if (str.trim() != '')
    {
      let raw_tokens = getRawTokens(str);
      let processed_tokens = getProcessedTokens(raw_tokens);
        
      if (processed_tokens.length > 0)
      {
        this.processed_tokens = processed_tokens;
      }
    }
  }

  process()
  {
    let f_index = 0;
    let final_tokens = [];
  
    let word_count = 0;
    let chord_count = 0;
    let trans_comment_count = 0;

    // Build format string
    this.processed_tokens.forEach(token => {
      if (token.type == 'plaintext')
      {
        this.format_str += token.string;
      }
      else if (token.type == 'comment')
      {
        let comment = new Comment(token.string);
        //console.log('\n  COMMENT: ' + comment.descr()); //DEBUG  // HERE NOW
        if (comment.needs_transposing)
        {
          final_tokens.push(token);
          this.format_str += '{' + f_index + '}';
          f_index += 1;
          trans_comment_count += 1;
        }
        else
        {
          this.format_str += token.string;
        }
      }
      else
      {
        if (token.type == 'word')
        {
          word_count += 1;
          this.format_str += token.string;
        }
        else if (token.type == 'chord')
        {
          final_tokens.push(token);
          this.format_str += '{' + f_index + '}';
          f_index += 1;
          chord_count += 1;
        }
      }
    });
    this.processed_tokens = final_tokens;

    // Check if transposable
    let all_chords = chord_count == final_tokens.length && word_count == 0;
    let at_least_one_transposable_comment = trans_comment_count > 0;
    if (all_chords || at_least_one_transposable_comment)
    {
      this.needs_transposing = true; 
    }
    else
    {
      this.needs_transposing = false;
      this.format_str = this.string;
    }
  }

  descr()
  {
    let tokens_str = '';
    for (let i = 0; i < this.processed_tokens.length; ++i)
    {
      tokens_str += '\n    TOKEN: ' + this.processed_tokens[i].descr();
    }

    return 'PROCESSED_TOKENS = ' + this.processed_tokens.length + 
      ', NEEDS_TRANSPOSING = ' + this.needs_transposing + 
      ', FORMAT_STR = ' + this.format_str +
      '\n  TOKENS:' + tokens_str;
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
      plaintext.string = str.substring(start_index + 1, i); // REMOVE +1 if it FAILS
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

function getProcessedTokens(raw_tokens)
{
  return raw_tokens.map(token => new ProcessedToken(token));
}

function getTextLines(str_lines)
{
  return str_lines.map(line => new TextLine(line));
}