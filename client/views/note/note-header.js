Template.noteHeader.helpers({
  title: function(){
    return this.title;
  },
  wordCount: function() {
    if (currentNote()) {
      return currentNote().wordCount;
    } else {
      return Meteor.user() && Meteor.user().profile && Meteor.user().profile.stats.wordsTotal;
    }
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
  'click .new-note': function(e) {
    e.preventDefault()
    var noteId = Notes.insert({
      title: 'new note'
    });
    FlowRouter.go('note', {'note': noteId});
  },
  'click .delete-note': function(e) {
    e.preventDefault()
    Notes.remove({_id: this._id});
    swal({
      title: 'Note deleted',
      text:  'Note deleted successfully',
      type: 'success',
      timer: 1000
    });

    FlowRouter.go('home');
  },
  'click .edit-room-title': function(e) {
		e.preventDefault()
		Session.set('editRoomTitle', true);
    Meteor.setTimeout(function() {
      $('#note-title-field').focus().select()
    }, 10);
    Dropdowns.hide('actions-dropdown');
  },
  'blur #note-title-field': function(e) {
    Session.set('editRoomTitle', false);
  }
});
