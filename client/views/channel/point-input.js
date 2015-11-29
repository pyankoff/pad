Template.pointInput.events({
  'keydown textarea[name=message]': function (event) {
    if (isEnter(event) && ! event.shiftKey) { // Check if enter was pressed (but without shift).
      event.preventDefault();
      var value = $('textarea[name=message]').val();
      // Markdown requires double spaces at the end of the line to force line-breaks.
      value = value.replace(/([^\n])\n/g, "$1  \n");

      // Prevent accepting empty message
      if ($.trim(value) === "") return;

      $('textarea[name=message]').val(''); // Clear the textarea.
      Points.insert({
        noteId: currentNoteId(),
        message: value
      });

      if (currentNote().suggestKeywords) {
        processWords();
      }

      $('textarea[name=message]').css({
        height: 37
      });
      scrollDown();

      Session.set("words", Session.get("words").concat(value.toLowerCase().split(' ')));
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

function processWords() {
  var words = Session.get('words');
  var stopWords = ["a", "about", "above", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "alone", "along", "already", "also","although","always","am","among", "amongst", "amoungst", "amount",  "an", "and", "another", "any","anyhow","anyone","anything","anyway", "anywhere", "are", "around", "as",  "at", "back","be","became", "because","become","becomes", "becoming", "been", "before", "beforehand", "behind", "being", "below", "beside", "besides", "between", "beyond", "bill", "both", "bottom","but", "by", "call", "can", "cannot", "cant", "co", "con", "could", "couldnt", "cry", "de", "describe", "detail", "do", "done", "down", "due", "during", "each", "eg", "eight", "either", "eleven","else", "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen", "fify", "fill", "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found", "four", "from", "front", "full", "further", "get", "give", "go", "had", "has", "hasnt", "have", "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how", "however", "hundred", "ie", "if", "in", "inc", "indeed", "interest", "into", "is", "it", "its", "itself", "keep", "last", "latter", "latterly", "least", "less", "ltd", "made", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly", "move", "much", "must", "my", "myself", "name", "namely", "neither", "never", "nevertheless", "next", "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing", "now", "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our", "ours", "ourselves", "out", "over", "own","part", "per", "perhaps", "please", "put", "rather", "re", "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several", "she", "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something", "sometime", "sometimes", "somewhere", "still", "such", "system", "take", "ten", "than", "that", "the", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "therefore", "therein", "thereupon", "these", "they", "thickv", "thin", "third", "this", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "top", "toward", "towards", "twelve", "twenty", "two", "un", "under", "until", "up", "upon", "us", "very", "via", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with", "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves", "the", "i"];
  words = _.difference(words, stopWords);
  var keyword = _.chain(words).countBy().pairs().max(_.last).head().value();

  if (keyword) {
    Notes.update(currentNoteId(), {
      $set: {title: keyword}
    });
  }
}
