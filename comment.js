function newCommentObj()
{
  return {"args": null, 
          "format_str": null, 
          "needs_transposing": null,

          string: function () {
            return this.format_str.format(args);
          }
  };
}
