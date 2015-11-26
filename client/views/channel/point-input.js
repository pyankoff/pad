Template.pointInput.events({
  'keydown textarea[name=message]': function (event) {
    if (isEnter(event) && ! event.shiftKey) { // Check if enter was pressed (but without shift).
      event.preventDefault();
      var _id = currentRouteId();
      var value = $('textarea[name=message]').val();
      // Markdown requires double spaces at the end of the line to force line-breaks.
      value = value.replace(/([^\n])\n/g, "$1  \n");

      // Prevent accepting empty message
      if ($.trim(value) === "") return;

      $('textarea[name=message]').val(''); // Clear the textarea.
      Messages.insert({
        recipe: currentChannelSlug(),
        message: value
      });

      $('textarea[name=message]').css({
        height: 37
      });
      scrollDown();
    }
  },
  'keyup textarea[name=message]': function (event) {
    $("textarea").textcomplete([ {
      match: /\B:([\-+\w]*)$/,
      search: function (term, callback) {
        var results = [];
        var results2 = [];
        var results3 = [];
        $.each(emojiStrategy,function(shortname,data) {
          if(shortname.indexOf(term) > -1) { results.push(shortname); }
          else {
            if((data.aliases !== null) && (data.aliases.indexOf(term) > -1)) {
              results2.push(shortname);
            }
            else if((data.keywords !== null) && (data.keywords.indexOf(term) > -1)) {
              results3.push(shortname);
            }
          }
        });

        if(term.length >= 3) {
          results.sort(function(a,b) { return (a.length > b.length); });
          results2.sort(function(a,b) { return (a.length > b.length); });
          results3.sort();
        }
        var newResults = results.concat(results2).concat(results3);

        callback(newResults);
      },
      template: function (shortname) {
        return '<img class="emojione" src="//cdn.jsdelivr.net/emojione/assets/png/'+emojiStrategy[shortname].unicode+'.png"> :'+shortname+':';
      },
      replace: function (shortname) {
        return ':'+shortname+': ';
      },
      index: 1,
      maxCount: 10,
    }
    ]);

    $('.dropdown-menu').prependTo('.message-tab-content');
    $('.dropdown-menu').css({
      "position": "static",
    });
  }
});
