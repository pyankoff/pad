Meteor.methods({
	'points.delete': function (messageId) {
		check(messageId, String);

		if (!this.userId) {
	    throw new Meteor.Error(401, 'Unauthorized access');
		}

		if (!Points.find(messageId).count()) {
			throw new Meteor.Error(404, 'Message does not exist');
		}

		if(isOwner('Points', messageId)) {
			Points.remove(messageId);
		}
	}
});
