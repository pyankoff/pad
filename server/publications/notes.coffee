Meteor.publish 'notes', () ->
	Notes.find {userId: this.userId}, {sort: {createdAt: -1}, limit: 10}
