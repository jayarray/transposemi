function getFormattedString(format_str, str_array)
{
  let placeholder = '{?}';
  let result = '';
  
  for (let i = 0; i < str_array.length; ++i) 
  {
    let curr_str = str_array[i]; 
    if (result == '')
    {
      result = format_str.replace(placeholder, curr_str);
    }
    else
    {
      result = result.replace(placeholder, curr_str);
    }
  }
  return result;
}