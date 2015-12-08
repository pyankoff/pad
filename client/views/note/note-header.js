Template.noteHeader.helpers({
  title: function(){
    return currentNote() && currentNote().title;
  },
  editingTitle: function() {
		return Session.get('editRoomTitle') ? 'hidden' : '';
  },
	showEditingTitle: function() {
    return Session.get('editRoomTitle') ? '' : 'hidden';
  }
});

Template.noteHeader.events({
  'keydown input#note-title-field': function (e) {
    if (e.which === 13) {
      Notes.update(currentNoteId(), {
        $set: {title: e.target.value, suggestKeywords: false}
      });
      Session.set('editRoomTitle', false);
    } else if (e.which === 27) {
      Session.set('editRoomTitle', false);
    }
  },
  'click .fa-plus': function(e) {
    var noteId = Notes.insert({
      title: 'new note',
      suggestKeywords: true
    });
    FlowRouter.go('note', {'note': noteId});
  },
  'click .fa-bars': function(e) {
    menu.toggle();
  },
  'click .edit-room-title': function(e) {
		e.preventDefault()
		Session.set('editRoomTitle', !Session.get('editRoomTitle'));
    if (Session.get('editRoomTitle')) {
      Meteor.setTimeout(function() {
        $('#room-title-field').focus().select()
      }, 10);
    }
  }
});
