currentNote = function () {
  var search = currentNoteId();
  var note = Notes.findOne({ _id: search });

  return note;
};

currentNoteId = function () {
  return FlowRouter.getParam('note');
};

isSubReady = function (subName) {
  return FlowRouter.subsReady(subName);
};

isEnter = function (e) {
  return e.keyCode === 13;
};

displayUnauthorizedError = function() {
  swal({
    title: 'Yikes! Something went wrong',
    text: "We can't complete your request at the moment, are you still online?",
    type: 'error'
  });
};
