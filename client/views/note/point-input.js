Template.pointInput.events({
  'focus textarea[name=message]': function(e){
    Session.set('searching', false);
  },
  'keydown textarea[name=message]': function (event) {
    if (isEnter(event) && ! event.shiftKey) {
      event.preventDefault();
      var value = $('textarea[name=message]').val();
      // Markdown requires double spaces at the end of the line to force line-breaks.
      value = value.replace(/([^\n])\n/g, "$1  \n");

      // Prevent accepting empty message
      if ($.trim(value) === "") return;

      $('textarea[name=message]').val(''); // Clear the textarea.

      var point = {
        message: value
      };
      if (value.substring(0, 2) === '--') {
        var sectionTitle = value.replace(/--+/g, "");
        var noteId = Notes.insert({
          title: sectionTitle
        });

        point = {
          message: sectionTitle,
          noteId: noteId,
          section: true
        };
      } else if ((currentNoteId() === undefined &&
            Session.equals('newNoteId', undefined))) {
        var noteId = Notes.insert({
          title: 'new note'
        });
        sectionId = Points.insert({
          message: 'new note',
          noteId: noteId,
          section: true
        });
        Session.set('newNoteId', noteId);
      }
      var pointId = Points.insert(point);

      if (currentNoteId()) {
        Notes.update(currentNoteId(), {
          $addToSet: {points: pointId},
          $set: {updatedAt: new Date()}
        }, function() {
          scrollDown();
        });

        var section = Points.findOne({
          _id: {$in: currentNote().points},
          section: true
        }, {sort: {createdAt: -1}, limit:1});
        if (section) {
          var sectionId = section._id;
        }
      } else {
        var sectionId = Session.get('newNoteId');
      }

      if (sectionId) {
        Notes.update(sectionId, {
          $addToSet: {points: pointId},
          $set: {updatedAt: new Date()}
        });
      };

      $('textarea[name=message]').css({
        height: 37
      });

      var wordCount = value.split(' ').length;
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
      analytics.track("New point", {

      });
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
      template: function (value) {
        return value.message;
      },
      replace: function (value) {
        var pointId = value.__originalId;
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
