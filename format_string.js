function getFormattedString(format_str, args) 
{
  console.log('\nFORMAT_STR = ' + format_str + ', ARGS = ' + args);

  let result = '';

  for (let i = 0; i < args.length; ++i) 
  {
    let curr_arg = args[i];
    let placeholder_str = '{' + i + '}';
    console.log('  i = ' + i +', CURR_PLACEHOLDER: ' + placeholder_str); // DEBUG

    if (result == '')
    {
      result = format_str.replace(placeholder_str, curr_arg);
    }
    else
    {
      result = result.replace(placeholder_str, curr_arg);
    }

    console.log('  CURR_RESULT = ' + result); // DEBUG
    while (result.includes(placeholder_str))
    {
      result = result.replace(placeholder_str, curr_arg);
    }
  }
  return result;
}

//-------------------------------------

class FormatStringInfo
{
  constructor(format_str, processed_tokens)
  {
    this.format_str = format_str;
    this.transposable_tokens = processed_tokens;
  }

  descr()
  {
    return 'FORMAT_STR=' + this.format_str + ', PROCESSED_TOKENS=' + this.transposable_tokens.length;
  }
}

function getFormatStringInfo(processed_tokens)
{
  let f_index = 0;
  let format_str = '';
  let transposable_tokens = [];

  for (let i = 0; i < processed_tokens.length; ++i)
  {
    let curr_token = processed_tokens[i];
    if (curr_token.needs_transposing)
    {
      transposable_tokens.push(curr_token);
      format_str += '{' + f_index + '}';
      f_index += 1;
    }
    else
    {
      format_str += curr_token.string;
    }
  }
  return new FormatStringInfo(format_str, transposable_tokens);
}