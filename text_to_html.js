class HtmlText
{
  constructor(text, size, weight, color)
  {
    this.text = text;
    this.size = size;     // pt (int)
    this.weight = weight; // normal | lighter | bold | bolder
    this.color = color;   // #RRGGBB
  }

  string()
  {
    let space = '&nbsp;';
    let tab = '&emsp;'
    let newline = '<br>';

    let ret = '<div style="font-size:' + this.size + 'pt;' +
              ' font-weight:' + this.weight + ';' +
              ' color:' + this.color +
              ';">';

    for (let i = 0; i < this.text.length; ++i)
    {
      let curr_char = this.text[i];
      if (curr_char == ' ')
      {
        ret += space;
      }
      else if (curr_char == '\t')
      {
        ret += tab;
      }
      else if (curr_char == '\n')
      {
        ret += newline;
      }
      else
      {
        ret += curr_char;
      }
    }
    ret += '</div>';

    return ret;
  }
}

function toHtml(textline, size, color) // NOTE: textline trans_tokens should be transposed by this point.
{
  if (!textline.needs_transposing)
  {
    console.log('toHtml():: NEEDS_TRANSPOSING=' + textline.needs_transposing);

    let html_text = new HtmlText(textline.format_str, size, 'normal', '#000000');
    return html_text.html();
  }
  
  console.log('toHtml():: NEEDS_TRANSPOSING=Yes');
  let processed_tokens = textline.processed_tokens;

  let curr_index = 0;
  let pt_index = 0;

  let start_end_index_sets = getStartAndEndIndexSets(textline.format_str);
  let set_index = 0;

  let html = '';

  while(curr_index < textline.format_str.length)
  {
    if (set_index < start_end_index_sets.length)
    {
      let curr_set = start_end_index_sets[set_index]; // HERE NOW! FIXX !!!
      set_index += 1; // REMOVE IF FAILS!

      let h = null;
      if (curr_set.start_index == 0 || curr_set.start_index == curr_index || curr_set.end_index == textline.format_str.length - 1)
      {
        // Append token string to HTML
        let p_token = processed_tokens[pt_index];
        pt_index += 1;
        h = new HtmlText(p_token.string, size, 'bold', color); // Bold (colored)
        html += h.string();
      }
      else
      {
        if (pt_index >= processed_tokens.length)
        {
          // Append plaintext to HTML
          let f_substr = textline.format_str.substring(curr_index, textline.format_str.length - 1);
          h = new HtmlText(f_substr, size, 'normal', '#000000'); // Normal (black)
          html += h.string();
          break;
        }
        else
        {
          // Append plaintext to HTML
          let f_substr = textline.format_str.substring(curr_index, curr_set.start_index);
          h = new HtmlText(f_substr, size, 'normal', '#000000'); // Normal (black)
          html += h.string();

          // Append token string to HTML
          let p_token = processed_tokens[pt_index];
          pt_index += 1;
          h = new HtmlText(p_token.string, size, 'bold', color); // Bold (colored)
          html += h.string();
        }
      }
      curr_index = curr_set.end_index + 1;
    }
  }

  console.log('  HTML --> ' + html);
  return html;
}

function getStartAndEndIndexSets(format_str)
{
  let sets = [];

  let placeholder = '{?}';
  let start_index = format_str.indexOf(placeholder);
  let substr = format_str;
  let adjustment = format_str.length - substr.length;
  let curr_index = 0;

  console.log('  *** FORMAT_STR=' + format_str);
  while (start_index >= 0)
  {
    let set = {'start_index': start_index + adjustment, 'end_index': start_index + (placeholder.length - 1) + adjustment};
    console.log('INDEX_SET=' + JSON.stringify(set));
    sets.push(set);

    if (set.end_index < format_str.length - 1)
    {
      substr = format_str.substring(set.end_index + 1);
      adjustment = format_str.length - substr.length;
      console.log('  ** NEW_SUBSTR=' + substr);
      start_index = substr.indexOf(placeholder);
    }
    else
    {
      start_index = -1;
    }
  }
  return sets;
}