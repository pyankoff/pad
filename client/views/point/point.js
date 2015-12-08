Template.point.helpers({
  user: function () {
    return Meteor.users.findOne({
      _id: this.userId
    });
  },

  isOwner: function () {
    return this.userId === Meteor.userId();
  },

  isEditing: function () {
    return Template.instance().isEditing.get();
  },

  time: function (timestamp) {
    return moment(timestamp).format('h:mm a');
  },

  firstPoint: function() {
   var previous = previousMessage(this);

    if (previous && moment(this.createdAt).diff(previous.createdAt) < 120000) {
      return false;
    }
    return true;
  }
});

Template.point.events({
  'click .edit': function (event, tmp) {
    event.preventDefault();
    toggleEdit();
  },

  'keydown .edit-box': function (event, tmp) {
    if (event.keyCode === 27 && !event.shiftKey) { // esc to cancel
      event.preventDefault();
      toggleEdit()
    } else if (event.keyCode === 13 && !event.shiftKey) { // enter to save
      event.preventDefault();

      var value = tmp.find('.form-message-input').value;
      toggleEdit();

      // Markdown requires double spaces at the end of the line to force line-breaks.
      value = value.replace(/([^\n])\n/g, "$1  \n");

      // Prevent accepting empty message
      if ($.trim(value) === "") return;

      Points.update(this._id, {
        $set: { message: value }
      });


      var position = self.$('.message .cursor').position();
      if (position) {
        var width = position.left;
        self.$('.modify').css({
          right: width + 8
        });
      }
    }
  },
  'click .delete': function (event) {
    event.preventDefault();

    Meteor.call('points.delete', this._id,
      function (error) {
        if (error) {
          swal({
            title: 'Yikes! Something went wrong',
            text: error.reason,
            type: 'error'
          });
        } else {
          swal({
            title: 'Message deleted',
            text:  'Message deleted successfully',
            type: 'success',
            html: true
          });
        }
      }
    );
  }
});

Template.point.onCreated(function() {
  this.isEditing = new ReactiveVar(false);
});

var _focus = function () {
  var tmp = Template.instance();
  var input = tmp.find('.form-message-input');
  input.focus();

  if (input.setSelectionRange) {
    var len = input.value.length * 2;
    input.setSelectionRange(len, len);
  } else {
    $(input).val($(input).val());
  }

  input.scrollTop = 999999;
};

var previousMessage = function(current) {
  var pointIds = currentNote().points;

  return Points.findOne({
    _id: {$in: pointIds},
    createdAt: {$lt: current.createdAt}
  }, {sort: {createdAt: -1}, limit:1});
};

var toggleEdit = function () {
  var toggled = !Template.instance().isEditing.get();
  Template.instance().isEditing.set(toggled);

  if (toggled) {
    _focus();
  }
};
