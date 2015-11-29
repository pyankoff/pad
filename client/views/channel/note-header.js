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
  'click .fa-search': function(e) {
    console.log('activate search');
  },
  'click .fa-plus': function(e) {
    var noteId = Notes.insert({
      title: 'new note',
      suggestKeywords: true
    });
    FlowRouter.go('note', {'note': noteId});
  }
});
