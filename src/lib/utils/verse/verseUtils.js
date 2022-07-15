// Update the verse's info
export const checkVerseInfo = (info) => {


    // No name
    if (info.name == '' || typeof info.name == 'undefined') {
      let data = {
        error: true,
        msg: 'Please enter a name.'
      }

      return data;
    }


    // Name too small or large
    if (info.name.length < 3 || info.name.length > 200) {
      let data = {
        error: true,
        msg: 'Name must be between 3 and 200 characters.'
      }
    
      return data;
    }


    // Capitalize first letter
    info.name = info.name.charAt(0).toUpperCase() + info.name.slice(1);


    // Description too large
    if (info.description && info.description.length > 300) {
      let data = {
        error: true,
        msg: 'Description must be less than 300 characters.'
      }
    
      return data;
    }


    // Sanitize for SEO slug
    info.slug = info.name.replace(/\ /g, '-');
    info.slug = info.slug.replace(/[^A-Za-z-]/g, "");
    info.slug = info.slug.toLowerCase();


    return info;


}


// Review the post
export const checkPost = (info) => {


  // No text allowed only if contains image or video
  if (info.text == '' && !info.containsMedia || typeof info.text == 'undefined' && !info.containsMedia) {
    let data = {
      error: true,
      msg: 'Post cannot be empty.'
    }

    return data;
  }


  // Text too large
  if (info.text && info.text.length > 1000) {
    let data = {
      error: true,
      msg: 'Text must be less than 1000 characters.'
    }
  
    return data;
  }


  return info;


}


// Review the chat message
export const checkMsg = (info) => {


  // No text allowed only if contains image or video
  if (info.text == '' || typeof info.text == 'undefined') {
    let data = {
      error: true,
      msg: 'Message cannot be empty.'
    }

    return data;
  }


  // Text too large
  if (info.text && info.text.length > 1000) {
    let data = {
      error: true,
      msg: 'Message must be less than 1000 characters.'
    }
  
    return data;
  }


  return info;


}


// Review the page name
export const checkPageName = (info) => {


  // No name
  if (info.name == '' || typeof info.name == 'undefined') {
    let data = {
      error: true,
      msg: 'Please enter a name.'
    }

    return data;
  }


  // Name too small or large
  if (info.name.length < 1 || info.name.length > 200) {
    let data = {
      error: true,
      msg: 'Name must be between 1 and 200 characters.'
    }
  
    return data;
  }


  return info;

  
}

