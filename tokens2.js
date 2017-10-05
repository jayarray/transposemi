class RawToken
{
  constructor(char, type) 
  {
    this.char = char;  
    this.type = type;  // ALPHA | DIGIT | SPECIAL | BRACKET | OTHER
  }

  descr()
  {
    return 'CHAR=' + this.char + ', TYPE=' + this.type;
  }
}

class Tokenizer
{
  constructor(text) 
  {
    this.text = text;
    this.curr_index = 0;
  }

  hasNext()
  {
    return this.curr_index < this.text.length;
  }

  getNext()
  {
    let c = this.text.charAt(this.curr_index);

    let next = null;
    if (isAlpha(c))
    {
      next = new RawToken(c, 'alpha');
    }
    else if (isDigit(c))
    {
      next = new RawToken(c, 'digit');
    }
    else if (isSpecial(c))
    {
      next = new RawToken(c, 'special');
    }
    else if (isBracket(c))
    {
      next = new RawToken(c, 'bracket');
    }
    else
    {
      next = new RawToken(c, 'other');
    }
    this.curr_index += 1;

    return next;
  }
}

class Comment
{
  constructor(open_bracket, closed_bracket, inner_string, processed_tokens, needs_transposing)
  {
    this.open_bracket = open_bracket;
    this.closed_bracket = closed_bracket;
    this.inner_string = inner_string;
    this.processed_tokens = processed_tokens;
    this.needs_transposing = needs_transposing;
  }

  string()
  {
    return this.open_bracket + this.inner_string + this.closed_bracket;
  }

  descr()
  {
    return 'NEEDS_TRANSPOSING=' + this.needs_transposing + ', COMMENT=' + this.string() + ', PROCESSED_TOKENS=' + this.processed_tokens.length;
  }
}

class CommentInfo
{
  constructor(string, start_index, end_index, needs_transposing)
  {
    this.string = string
    this.start_index = start_index;
    this.end_index = end_index;
    this.needs_transposing = needs_transposing;
  }

  descr()
  {
    return 'START=' + this.start_index + ', END=' + this.end_index + ', NEEDS_TRANSPOSING=' + this.needs_transposing + ', STRING=' + this.string;
  }
}

function getCommentInfo(raw_tokens, start_index)
{
  let open_bracket = raw_tokens[start_index].char;
  let open_count = 0;
  let first_open_index = -1;

  let close_bracket = getCorrespondingClosedBracket(open_bracket);
  let close_count = 0;
  let last_closed_index = -1;

  for (let i = start_index; i < raw_tokens.length; ++i)
  {
    let curr_token = raw_tokens[i];
    if (curr_token.type == 'bracket')   // ALPHA | DIGIT | SPECIAL | BRACKET | OTHER
    {
      //console.log('  CURR_CHAR=' + curr_token.char);
      if (isOpenBracket(curr_token.char) && curr_token.char == open_bracket)
      {
        //console.log(' i=' + i + ', CURR_CHAR=' + curr_token.char + ', OPEN_BRACKET');
        open_count += 1;
      }
      else if (isClosedBracket(curr_token.char) && curr_token.char == close_bracket)
      {
        //console.log(' i=' + i + ', CURR_CHAR=' + curr_token.char + ', CLOSED_BRACKET');
        close_count += 1;
      }

      //console.log('  OPEN=,' + open_count + ' CLOSE=' + close_count);
      if (open_count == close_count)
      {
        let string = '';
        raw_tokens.slice(start_index, i + 1).forEach(token => string += token.char);

        let comment_info = new CommentInfo(string, start_index, i, 'false'); // FIX: check if it needs transposing
        console.log('Returning CommentInfo --> ' + comment_info.descr());
        return comment_info;
      }
    }
  }
  return null;
}

class WordInfo
{
  constructor(string, start_index, end_index, needs_transposing)
  {
    this.string = string;
    this.start_index = start_index;
    this.end_index = end_index;
    this.needs_transposing = needs_transposing;
  }

  descr()
  {
    return 'START=' + this.start_index + ', END=' + this.end_index + ', NEEDS_TRANSPOSING=' + this.needs_transposing + ', STRING=' + this.string;
  }
}

function getWordInfo(raw_tokens, start_index)
{
  let end_index = start_index;

  //console.log('\n');
  for (let i = start_index; i < raw_tokens.length; ++i)
  {
    let curr_token = raw_tokens[i];
    if (isWordChar(curr_token.char))
    {
      end_index = i;
      //console.log('getWordInfo():: i=' + i + ', CURR_CHAR=' + curr_token.char + ', IS_WORD_CHAR=true, END_INDEX=' + end_index);
    }
    else
    {
      //console.log('getWordInfo():: BREAK  i=' + i + ', CURR_CHAR=' + curr_token.char + ', IS_WORD_CHAR=false, END_INDEX=' + end_index);
      break;
    }
  }

  let string = '';
  if (end_index == start_index)
  {
    string = raw_tokens[end_index].char;
  }
  else
  {
    raw_tokens.slice(start_index, end_index + 1).forEach(token => string += token.char);
  }

  let needs_transposing = false;
  let chord = getChord(string); 
  if (chord != null)
  {
    needs_transposing = true;
  }

  let word_info = new WordInfo(string, start_index, end_index, needs_transposing);
  console.log('Returning WordInfo --> ' + word_info.descr());
  return word_info;
}

class ProcessedToken
{
  constructor(string, type, needs_transposing) 
  {
    this.string = string; 
    this.type = type;   // CHORD | COMMENT | PLAINTEXT
    this.needs_transposing = needs_transposing;
  }

  descr()
  {
    return 'STRING=' + this.string + ', TYPE=' + this.type + ', NEEDS_TRANSPOSING=' + this.needs_transposing;
  }
}
class ProcessedTokenBuilder
{
  constructor(raw_tokens)
  {
    this.raw_tokens = raw_tokens;
    this.curr_index = 0;
  }

  hasNext()
  {
    return this.curr_index < this.raw_tokens.length;
  }

  getNext()
  {
    let curr_token = this.raw_tokens[this.curr_index];
    if (isWordChar(curr_token.char))
    {
      //console.log('\nPT_BUILDER:: getNext(): CURR_TOKEN=' + curr_token.char + ' is WORD_CHAR.');
      let word_info = getWordInfo(this.raw_tokens, this.curr_index);
      let type = null;
      if (word_info.needs_transposing)
      {
        type = 'chord';
      }
      else
      {
        type = 'plaintext';
      }
      this.curr_index = word_info.end_index + 1;
      return new ProcessedToken(word_info.string, type, word_info.needs_transposing);
    }
    else if (isOpenBracket(curr_token.char))
    {
      let comment_info = getCommentInfo(this.raw_tokens, this.curr_index);
      if (comment_info != null)
      {
        this.curr_index = comment_info.end_index + 1;
        return new ProcessedToken(comment_info.string, 'comment', comment_info.needs_transposing);
      }
      else
      {
        this.curr_index += 1;
        return new ProcessedToken(curr_token.char, 'plaintext', false);
      }
    }
    else
    {
      this.curr_index += 1;
      return new ProcessedToken(curr_token.char, 'plaintext', false);
    }
  }
}

class TextLine
{
  constructor(processed_tokens, format_str, needs_transposing)
  {
    this.processed_tokens = processed_tokens;
    this.format_str = format_str;
    this.needs_transposing = needs_transposing;
  }

  descr()
  {
    return 'NEEDS_TRANSPOSING=' + this.needs_transposing + ', FORMAT_STR=' + this.format_str + ', PROCESSED_TOKENS=' + this.processed_tokens.length;
  }

  string()
  {
    let str_args = processed_tokens.map(token => token.string);
    return getFormattedString(this.format_str, str_args);
  }
}

function getTextLine(str)
{
  let tokenizer = new Tokenizer(str);
  let raw_tokens = [];
  while (tokenizer.hasNext())
  {
    raw_tokens.push(tokenizer.getNext());
  }

  let pt_builder = new ProcessedTokenBuilder(raw_tokens);
  let processed_tokens = [];
  while (pt_builder.hasNext())
  {
    processed_tokens.push(pt_builder.getNext());
  }

  console.log('getTextLine():: RAW_TOKENS=' + raw_tokens.length + ', PROCESSED_TOKENS=' + processed_tokens.length);

  let f_index = 0;
  let format_str = '';
  for (let i = 0; i < processed_tokens.length; ++i)
  {
    let curr_token = processed_tokens[i];
    if (curr_token.needs_transposing)
    {
      format_str += '{' + f_index + '}';
      f_index += 1;
    }
    else
    {
      format_str += curr_token.string;
    }
  }

  let needs_transposing = false;
  for (let i = 0; i < processed_tokens.length; ++i)
  {
    if (processed_tokens[i].needs_transposing)
    {
      needs_transposing = true;
      break;
    }
  }

  console.log('Returning TEXTLINE: TOKENS=' + processed_tokens.length + ', FORMAT_STR=' + format_str);
  return new TextLine(processed_tokens, format_str, needs_transposing);
}

//-------------------------------------------------
// VALIDATIONS

function isAlpha(c)
{
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
}

function isDigit(c)
{
  return c >= '0' && c <= '9';
}

function isSpecial(c)
{
  return c == '#' || c == 'b';  // Might add more
}

function isWordChar(c)
{
  return isAlpha(c) || isDigit(c) || isSpecial(c);
}


function isOpenBracket(c)
{
  return c == '(' || c == '[' || c == '{' || c == '<';
}

function isClosedBracket(c)
{
  return c == ')' || c == ']' || c == '}' || c == '>';
}

function isBracket(c)
{
  return isOpenBracket(c) || isClosedBracket(c);
}

function isClosedPair(open_bracket, closed_bracket)
{
  return (open_bracket == '(' && closed_bracket == ')')
         || (open_bracket == '[' && closed_bracket == ']')
         || (open_bracket == '{' && closed_bracket == '}')
         || (open_bracket == '<' && closed_bracket == '>');
}

function getCorrespondingClosedBracket(open_bracket)
{
  if (open_bracket == '(')
  {
    return ')';
  }
  else if (open_bracket == '[')
  {
    return ']';
  }
  else if (open_bracket == '{')
  {
    return '}';
  }
  else if (open_bracket == '<')
  {
    return '>';
  }
  else
  {
    return null;
  }
}

