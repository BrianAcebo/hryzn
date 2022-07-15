import { supabase } from "$lib/utils/supabase";


// Remove special characters
const regexUsername = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;


// Check username for errors
export const checkUsername = async (username) => {


  // Error object to send back
  let usernameResult = {
    error: false,
    msg: ''
  }


  // Check if there is a username entered
  if (typeof username != 'undefined') {


    // Easier to validate when it's lowercase
    username = username.toLowerCase();


    try {


      // User sent invalid username
      if (username.length < 3) return usernameResult = { error: true, msg: 'Username must be greater than 3 characters' };
      if (username.length > 30) return usernameResult = { error: true, msg: 'Username must be less than 30 characters' };
      if (!regexUsername.test(username)) return usernameResult = { error: true, msg: 'Username must not have any special characters' };


      const user = supabase.auth.user();


      // Let's check to see if username is taken
      let { data, error, status } = await supabase
        .from('profiles')
        .select(`id, username`)
        .eq('username', username)
        .single()


      // New username is already taken
      if (data && data.id != user.id) {
        return usernameResult = { error: true, msg: 'Username is already taken' };
      }


      // If no other returns, then username is available
      return usernameResult;


    } catch (error) {


      console.log(error);
      return usernameResult = { error: true, msg: 'Sorry, but there is an error' };


    }


  } else {


    // Username is empty
    return usernameResult = { error: true, msg: 'Please enter a username' };


  }


}


// Check bio for errors
export const checkBio = async (bio) => {


  // Error object to send back
  let bioResult = {
    error: false,
    msg: ''
  }


  // Check if there is a bio entered
  if (typeof bio != 'undefined') {


    if (bio) {


      try {


        // Sanitize the bio
        bio = sanitize(bio);


        // Bio is too long
        if (bio.length > 200) return bioResult = { error: true, msg: 'Bio must be less than 200 characters' };


        // If no other returns, then bio is good
        return bioResult;


      } catch (error) {


        console.log(error);
        return bioResult = { error: true, msg: 'Sorry, but there is an error' };


      }
    } else {


      // No bio is fine
      return bioResult;


    }

  } else {


    // No bio is fine
    return bioResult;


  }

}


// Sanitize string
const sanitize = (str) => {
	return str.replace(/[^\w. ]/gi, function (c) {
		return '&#' + c.charCodeAt(0) + ';';
	});
};
