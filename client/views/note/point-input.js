Template.pointInput.events({
  'focus textarea[name=message]': function(e){
    Session.set('searching', false);
  },
  'keydown textarea[name=message]': function (event) {
    if (isEnter(event) && ! event.shiftKey) {
      event.preventDefault();
      var text = $('textarea[name=message]').val();
      // Markdown requires double spaces at the end of the line to force line-breaks.
      text = text.replace(/([^\n])\n/g, "$1  \n");

      // Prevent accepting empty message
      if ($.trim(text) === "") return;

      // Clear the textarea.
      $('textarea[name=message]').val('');
      $('textarea[name=message]').css({
        height: 37
      });

      var point;
      if (isDivider(text)) {
        point = createDivider(text.replace(/--+/g, ""));
      } else {
        point = {
          message: text
        };
      }
      var pointId = Points.insert(point);

      // insert into note
      if (currentNoteId()) {
        Notes.update(currentNoteId(), {
          $addToSet: {points: pointId},
          $set: {updatedAt: new Date()}
        }, function() {
          scrollDown();
        });
      } else {
        var currentPoints = Meteor.user().profile.currentPoints;
        currentPoints = _.last(currentPoints, 20);
        currentPoints.push(pointId);
        Meteor.users.update(Meteor.userId(), {
          $set: {'profile.currentPoints': currentPoints}
        }, function() {
          scrollDown();
        });
      }

      // find divider notes
      var pointIds = currentNote() ? currentNote().points : currentPoints;
      var section = Points.findOne({
        _id: {$in: pointIds},
        section: true
      }, {sort: {createdAt: -1}, limit:1});
      if (section) {
        var sectionId = section.noteId;
      }

      if (sectionId && pointId != section._id) {
        Notes.update(sectionId, {
          $addToSet: {points: pointId},
          $set: {updatedAt: new Date()}
        });
      };

      // count words
      var wordCount = text.split(' ').length;
      if (!Session.get("insert")) {
        Meteor.users.update(Meteor.userId(), {
          $inc: {
            'profile.stats.wordsDay': wordCount,
            'profile.stats.wordsTotal': wordCount,
            'profile.stats.points': 1
          }
        });
      };

      if (currentNoteId()) {
        Notes.update(currentNoteId(), {
          $inc: {
            'wordCount': wordCount,
          }
        });
      };

      Session.set('insert', false);
      analytics.track("New point");
    } else if (event.keyCode == 86 && event.metaKey) {
      Session.set("insert", true);
    }
  },
  'keyup textarea[name=message]': function (event) {
    $("textarea").textcomplete([ {
      match: /\B:([\-+\w]+)$/,
      search: function (term, callback) {
        Tracker.autorun(function(){
          var cursor = PointsIndex.search(term, {limit: 5});
          var points = cursor.fetch();
          callback(points);
        });
      },
      template: function (text) {
        return text.message;
      },
      replace: function (text) {
        var pointId = text.__originalId;
        Notes.update({_id: currentNoteId()}, {$addToSet:{
          points: pointId
        }}, function() {
          scrollDown();
        });
        return '';
      },
      index: 1,
      maxCount: 5,
      debounce: 500
    }
    ]);

    $('.dropdown-menu').prependTo('.message-tab-content');
    $('.dropdown-menu').css({
      "position": "static",
    });
  }
});

function isDivider(text) {
  return text.substring(0, 2) === '--';
}

function createDivider(title) {
  var noteId = Notes.insert({
    title: title
  });

  point = {
    message: title,
    noteId: noteId,
    section: true
  };
  return point;
}
