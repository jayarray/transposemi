// RAW TOKENS
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

  getAll()
  {
    let raw_tokens = [];
    while (this.hasNext())
    {
      raw_tokens.push(this.getNext());
    }
    return raw_tokens;
  }
}

//------------------------------------------------
// COMMENTS

class Comment
{
  constructor(open_bracket, closed_bracket, inner_string)
  {
    this.open_bracket = open_bracket;
    this.closed_bracket = closed_bracket;
    this.inner_string = inner_string;

    this.format_str = this.getFormatString(open_bracket, closed_bracket, inner_string);
    this.needs_transposing = this.needsTransposing(inner_string);                       // Indicates there is something that needs transposing
    this.non_comments_need_transposing = this.nonCommentsNeedTransposing(inner_string); // Indicates all current-level non-comment tokens can be plaintext.
    this.processed_tokens = this.getProcessedTokens(inner_string);
  }

  needsTransposing(inner_string)
  {
    let tokenizer = new Tokenizer(inner_string);
    let raw_tokens = tokenizer.getAll();

    let pt_builder = new ProcessedTokenBuilder(raw_tokens);
    let p_tokens = pt_builder.getAll();

    let token_counts = getProcessedTokenCounts(p_tokens);
    if (token_counts.comments > 0)
    {
      let transposable_comment_count = 0;
      
      let comment_tokens = [];
      for (let i = 0; i < p_tokens.length; ++i)
      {
        let curr_pt = p_tokens[i];
        if (curr_pt.type == 'comment')
        {
          let inner_comment = getComment(curr_pt.string);
          if (inner_comment.needs_transposing) // Might change to needsTransposing(s)
          {
            transposable_comment_count += 1;
          }
        }
      }
      return transposable_comment_count > 0 || (token_counts.chords > 0 && token_counts.words == 0);
    }
    return token_counts.chords > 0 && token_counts.words == 0;
  }

  getFormatString(open_bracket, closed_bracket, inner_string)
  {
    let tokenizer = new Tokenizer(inner_string);
    let raw_tokens = tokenizer.getAll();

    let pt_builder = new ProcessedTokenBuilder(raw_tokens);
    let processed_tokens = pt_builder.getAll();

    let format_str = open_bracket;
    for (let i = 0; i < processed_tokens.length; ++i)
    {
      let curr_token = processed_tokens[i];
      if (curr_token.type == 'chord' || curr_token.type == 'comment')
      {
        format_str += '{?}';
      }
      else
      {
        format_str += curr_token.string;
      }
    }
    format_str += closed_bracket;

    return format_str;
  }

  nonCommentsNeedTransposing(inner_string)
  {
    let tokenizer = new Tokenizer(inner_string);
    let raw_tokens = tokenizer.getAll();

    let pt_builder = new ProcessedTokenBuilder(raw_tokens);
    let processed_tokens = pt_builder.getAll();


    let non_comment_tokens = [];
    for (let i = 0; i < processed_tokens.length; ++i)
    {
      let curr_token = processed_tokens[i];
      if (curr_token.type == 'word' | curr_token.type == 'chord')
      {
        non_comment_tokens.push(curr_token);
      }
    }

    let token_counts = getProcessedTokenCounts(non_comment_tokens);
    return non_comment_tokens.length != 0 && token_counts.chords > 0 && token_counts.words == 0;
  }

  getProcessedTokens(inner_string) // CONT HERE
  {
    let tokenizer = new Tokenizer(inner_string);
    let raw_tokens = tokenizer.getAll();

    let pt_builder = new ProcessedTokenBuilder(raw_tokens);
    let processed_tokens = pt_builder.getAll();

    let transposable_tokens = [];
    for (let i = 0; i < processed_tokens.length; ++i)
    {
      let curr_token = processed_tokens[i];
      if (curr_token.type == 'chord' || curr_token.type == 'comment')
      {
        transposable_tokens.push(curr_token);
      }
    }
    return transposable_tokens;
  }
  

  getTransposingInfo(inner_string)
  {
    let tokenizer = new Tokenizer(inner_string);
    let raw_tokens = tokenizer.getAll();

    let pt_builder = new ProcessedTokenBuilder(raw_tokens);
    let processed_tokens = pt_builder.getAll();

    let transposable_tokens = [];
    for (let i = 0; i < processed_tokens.length; ++i)
    {
      let curr_token = processed_tokens[i];
    }

    let token_counts = getProcessedTokenCounts(processed_tokens);
    if (token_counts.comments > 0)
    {
      let transposable_comment_count = 0;
      
      let comment_tokens = [];
      for (let i = 0; i < processed_tokens.length; ++i)
      {
        let curr_pt = processed_tokens[i];
        if (curr_pt.type == 'comment')
        {
          let inner_comment = getComment(curr_pt.string);
          if (inner_comment.needs_transposing)
          {
            transposable_comment_count += 1;
          }
        }
      }

      let needs_transposing = transposable_comment_count > 0 || (token_counts.chords > 0 && token_counts.words == 0);
      let non_comments_need_transposing = token_counts.chords > 0 && token_counts.words == 0;
      return {'needs_transposing': needs_transposing, 'non_comments_need_transposing': non_comments_need_transposing, 'processed_tokens': processed_tokens};
    }
    
    let needs_transposing = token_counts.chords > 0 && token_counts.words == 0;
    return {'needs_transposing': needs_transposing, 'non_comments_need_transposing': needs_transposing,  'processed_tokens': processed_tokens};
  }

  descr()
  {
    let ret = 'NEEDS_TRANSPOSING=' + this.needs_transposing;
    ret += 'FORMAT_STR=' + this.format_str;
    this.processed_tokens.forEach(token => ret += '  TOKEN: ' + token.descr());
    return ret;
  }
}


function getComment(str)
{
  let tokenizer = new Tokenizer(str);
  let raw_tokens = tokenizer.getAll();

  let c = getCommentInfo(raw_tokens, 0);
  return new Comment(c.open_bracket, c.closed_bracket, c.inner_string);
}

function getCommentInfo(raw_tokens, start_index)
{
  let open_bracket = raw_tokens[start_index].char;
  let open_count = 0;
  let first_open_index = -1;

  let closed_bracket = getCorrespondingClosedBracket(open_bracket);
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
      else if (isClosedBracket(curr_token.char) && curr_token.char == closed_bracket)
      {
        //console.log(' i=' + i + ', CURR_CHAR=' + curr_token.char + ', CLOSED_BRACKET');
        close_count += 1;
      }

      //console.log('  OPEN=,' + open_count + ' CLOSE=' + close_count);
      if (open_count == close_count)
      {
        let string = '';
        raw_tokens.slice(start_index, i + 1).forEach(token => string += token.char);
        if (string.length == 2) // EMPTY COMMENT (No processed tokens)
        {
          let inner_string = '';
          let processed_tokens = [];
          let comment_info = new CommentInfo(string, start_index, i, false, open_bracket, closed_bracket, inner_string, processed_tokens);
          console.log('Returning CommentInfo --> ' + comment_info.descr());
          return comment_info;
        }

        // Get processed tokens (if any)
        let inner_string = string.substring(1, string.length - 1);

        let tokenizer = new Tokenizer(inner_string);
        let comment_raw_tokens = [];
        while (tokenizer.hasNext())
        {
          comment_raw_tokens.push(tokenizer.getNext());
        }

        let pt_builder = new ProcessedTokenBuilder(comment_raw_tokens);
        let processed_tokens = []; 
        while (pt_builder.hasNext())
        {
          let p = pt_builder.getNext();
          processed_tokens.push(p);
        }

        // Get args
        let info = getInfoAboutProcessedTokens(processed_tokens);

        let comment_info = new CommentInfo(string, 
                                          start_index, 
                                          i, 
                                          info.needs_transposing, 
                                          open_bracket, 
                                          closed_bracket, 
                                          inner_string, 
                                          info.transposable_tokens);
        console.log('Returning CommentInfo --> ' + comment_info.descr());
        return comment_info;
      }
    }
  }
  return null;
}

class CommentInfo
{
  constructor(string, start_index, end_index, needs_transposing, open_bracket, closed_bracket, inner_string, processed_tokens)
  {
    this.string = string
    this.start_index = start_index;
    this.end_index = end_index;
    this.needs_transposing = needs_transposing;

    this.open_bracket = open_bracket;
    this.closed_bracket = closed_bracket;
    this.inner_string = inner_string;
    this.processed_tokens = processed_tokens; 
  }

  descr()
  {
    return 'START=' + this.start_index + ', END=' + this.end_index + ', NEEDS_TRANSPOSING=' + this.needs_transposing + ', STRING=' + this.string;
  }
}

function getProcessedTokenCounts(processed_tokens)
{
  let words = 0;
  let chords = 0;
  let comments = 0;

  for (let i = 0; i < processed_tokens.length; ++i)
  {
    let curr_token = processed_tokens[i];
    if (curr_token.type == 'chord')
    {
      chords += 1;
    }
    else if (curr_token.type == 'comment')
    {
      comments += 1;
    }
    else if (curr_token.type == 'word')
    {
      words += 1;
    }
  }
  return {'words': words, 'chords': chords, 'comments': comments};
}

function processComment(comment, format_str, transposable_tokens)
{
  let tokenizer = new Tokenizer(comment.inner_string);
  let raw_tokens = tokenizer.getAll();

  let pt_builder = new ProcessedTokenBuilder(raw_tokens);
  let processed_tokens = pt_builder.getAll();
 
  format_str += comment.open_bracket;
  for (let i = 0; i < processed_tokens.length; ++i)
  {
    let curr_token = processed_tokens[i];
    if (curr_token.needs_transposing)
    {
      if (curr_token.type == 'chord')
      {
        transposable_tokens.push(curr_token);
        format_str += '{?}';
      }
      else if (curr_token.type == 'comment')
      {
        let open_bracket = curr_token.string.charAt(0);
        let closed_bracket = curr_token.string.charAt(curr_token.string.length - 1);
        let inner_string = curr_token.string.substring(1, curr_token.string.length - 1);
        let comment = new Comment(open_bracket, closed_bracket, inner_string);

        if (comment.needs_transposing) // HERE NOW!!!
        {
          format_str = processComment(comment, format_str, transposable_tokens);
        }
        else
        {
          format_str += curr_p_token.string;
        }
      }
    }
    else
    {
      format_str += curr_token.string;
    }
  }
  return format_str + comment.closed_bracket;
}

//----------------------------------------------
// WORDS
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
    this.type = type;   // CHORD | COMMENT | WORD | PLAINTEXT
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
        type = 'word';
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

  getAll()
  {
    let processed_tokens = [];
    while (this.hasNext())
    {
      processed_tokens.push(this.getNext());
    }
    return processed_tokens;
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

  // Gather transposable tokens & build format string
  console.log('\nPROCESSED_TOKENS=' + processed_tokens.length);

  let format_str = '';
  let transposable_tokens = [];

  let info = getInfoAboutProcessedTokens(processed_tokens);
  if (!info.needs_transposing)
  {
    let pt_strings = info.transposable_tokens.map(token => token.string);
    format_str = getFormattedString(info.format_str, pt_strings);
    return new TextLine(transposable_tokens, format_str, info.needs_transposing);  // REMOVE IF BLOCK if fails!!!
  }

  for (let i = 0; i < processed_tokens.length; ++i)
  {
    let curr_token = processed_tokens[i];
    if (curr_token.type == 'chord')
    {
      format_str += '{?}';
      transposable_tokens.push(curr_token);
    }
    else if (curr_token.type == 'comment')
    {
      let open_bracket = curr_token.string.charAt(0);
      let closed_bracket = curr_token.string.charAt(curr_token.string.length - 1);
      let inner_string  = curr_token.string.substring(1, curr_token.string.length - 1);
      let comment = new Comment(open_bracket, closed_bracket, inner_string);
      
      if (comment.needs_transposing)
      {
        format_str = processComment(comment, format_str, transposable_tokens);
      }
      else
      {
        format_str += comment.format_str;
      }
    }
    else
    {
      format_str += curr_token.string;
    }
  }

  console.log('  * INFO: ' + info.descr());
  //console.log('RETURNING TEXTLINE: TOKENS=' + info.transposable_tokens.length + ', FORMAT_STR=' + info.format_str);
  //return new TextLine(info.transposable_tokens, info.format_str, info.needs_transposing);

  console.log('RETURNING TEXTLINE: TOKENS=' + transposable_tokens.length + ', FORMAT_STR=' + format_str);
  return new TextLine(transposable_tokens, format_str, info.needs_transposing); 
}

class ProcessedTokensInfo
{
  constructor(format_str, transposable_tokens, needs_transposing, word_count, comment_count, transposable_comment_count)
  {
    this.format_str = format_str;
    this.transposable_tokens = transposable_tokens;
    this.needs_transposing = needs_transposing;
    this.word_count = word_count;
    this.comment_count = comment_count;
    this.transposable_comment_count = transposable_comment_count;
  }

  descr()
  {
    return 'FORMAT_STR=' + this.format_str + 
           '\nNEEDS_TRANSPOSING=' + this.needs_transposing + 
           ', TRANS_TOKENS= ' + this.transposable_tokens.length +
           ', TRANS_COMMENTS=' + this.transposable_comment_count + 
           ', WORDS=' + this.word_count +
           ', COMMENTS=' + this.comment_count;
  }
}

function getInfoAboutProcessedTokens(processed_tokens)
{
  let format_str = '';
  let word_count = 0;
  let comment_count = 0;
  let transposable_comment_count = 0;
  let transposable_tokens = []; // Chords only

  for (let i = 0; i < processed_tokens.length; ++i)
  {
    let curr_token = processed_tokens[i];
    if (curr_token.needs_transposing)
    {
      transposable_tokens.push(curr_token);
      format_str += '{?}';

      if (curr_token.type == 'comment')
      {
        comment_count += 1;
        transposable_comment_count += 1;
      }
    }
    else
    {
      format_str += curr_token.string;
      if (curr_token.type == 'word')
      {
        word_count += 1;
      }
      else if (curr_token.type == 'comment')
      {
        comment_count += 1;
      }
    }

    console.log('  INFO:: CURR_TOKEN=' + curr_token.string + 
                ', WORD_COUNT=' + word_count + 
                ', COMMENT_COUNT=' + comment_count + 
                ', TRANS_TOKEN=' + transposable_tokens.length);
  }

  let needs_transposing = transposable_comment_count > 0 || (transposable_tokens.length > 0 && word_count == 0);
  if (!needs_transposing)
  {
    format_str = '';
    processed_tokens.forEach(token => format_str += token.string);
  }

  return new ProcessedTokensInfo(format_str, transposable_tokens, needs_transposing, word_count, comment_count, transposable_comment_count);
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