const User = require("../models/User");
const bcrypt = require("bcrypt");
const auth = require("../auth");

module.exports.checkEmailExists = (reqBody) => {
	
	return User.find({ email: reqBody.email }).then(result => {
		if(result.length > 0){	
			return true
		} else {
			return false
		}
	})
}

module.exports.registerUser = (reqBody) => {
	//console.log(reqBody);
	let newUser = new User({
		name: reqBody.name,
		email: reqBody.email,
		password: bcrypt.hashSync(reqBody.password, 10)
	})

	return newUser.save().then((user, error) => {
		if(error){
			return false
		} else {
			return true
		}
	})
}

module.exports.loginUser = (reqBody) => {
	return User.findOne({ email: reqBody.email }).then(result => {
		//console.log(result);

		// Email doesn't exist
		if(result == null){
			return false;
		} else {
			const isPasswordCorrect = bcrypt.compareSync(reqBody.password, result.password);
			//console.log(isPasswordCorrect);
			//console.log(result);

			// Correct password
			if(isPasswordCorrect){
				return { access: auth.createAccessToken(result) }
			// Password incorrect	
			} else {
				return false
			};

		};
	});
};

module.exports.getProfile = (data) => {
	console.log(data);
	return User.findOne({ _id: data.userId}).then(result => {
		if(result == null){
			return false
		} else {
			result.password = "";
			return result;
		}
	})
}

module.exports.checkNameExists = (reqBody) => {
	
	return User.find({ name: reqBody.name }).then(result => {

		if(result.length > 0){
			
			return true
		
		} else {
			
			return false
		
		}
	})
}
