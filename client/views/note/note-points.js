Template.notePoints.helpers({
  points: function () {
    if (this.note) {
      var pointIds = this.note.points;
      var points = Points.find({_id: {$in: pointIds}}).fetch();
      points = _.sortBy(points, function(doc) {
        return pointIds.indexOf(doc._id)
      });
      return points;
    }
  },
});
