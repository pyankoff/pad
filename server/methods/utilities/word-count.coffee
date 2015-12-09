Meteor.methods
  "countWords": () ->
    Notes.find().forEach (note)->
      wordCount = 0
      Points.find {_id: {$in: note.points}}
          .forEach (point) ->
            wordCount += point.message.split(' ').length
      Notes.update note._id, {$set: {wordCount: wordCount}}
