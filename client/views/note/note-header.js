Template.noteHeader.helpers({
  title: function(){
    return currentNote() && currentNote().title;
  }
});

Template.noteHeader.events({
  'keypress input.recipe-input': function (e) {
    if (e.which === 13) {
      Notes.update(currentNoteId(), {
        $set: {title: e.target.value, suggestKeywords: false}
      })
    }
  },
  'click .fa-plus': function(e) {
    var noteId = Notes.insert({
      title: 'new note',
      suggestKeywords: true
    });
    FlowRouter.go('note', {'note': noteId});
  }
});

Template.noteHeader.onCreated(function() {
  var self = this;

  self.autorun(function () {
    self.subscribe('note', currentNoteId());
  });
});
