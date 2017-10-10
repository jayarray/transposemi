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

function toHtml(textline, size, color)
{
  if (!textline.needs_transposing)
  {
    console.log('toHtml():: NEEDS_TRANSPOSING=' + textline.needs_transposing);

    let html_text = new HtmlText(textline.format_str, size, 'normal', '#000000');
    return html_text.string();
  }
  
  console.log('toHtml():: NEEDS_TRANSPOSING=Yes');
  let processed_tokens = textline.processed_tokens;

  let html = '';
  for (let i = 0; i < processed_tokens.length; ++i)
  {
    let curr_token = processed_tokens[i];
    if (curr_token.needs_transposing)
    {
      let h = new HtmlText(curr_token.string, size, 'bold', '#000000'); // Bold (colored)
      html += h.string();
    }
    else
    {
      let h = new HtmlText(curr_token.string, size, 'normal', '#000000'); // Plaintext (black)
      html += h.string();
    }
  }
  console.log('  HTML --> ' + html);
  return html;
}