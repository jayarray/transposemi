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