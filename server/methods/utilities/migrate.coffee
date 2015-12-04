Meteor.methods
  "migrate": () ->
    Notes.find().forEach (note)->
      Points.find {noteId: note._id}, {sort: {createdAt: 1}}
          .forEach (point) ->
            Notes.update note._id, {$addToSet: {points: point._id}}
