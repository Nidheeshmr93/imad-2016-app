function loadLoggedInUser (username) {
    var loginArea = document.getElementById('login_area');
    loginArea.innerHTML = `
        <h3> Hi <i>${username}</i></h3>
        <a href="/logout">Logout</a>
    `;
}

function loadLogin () {
    // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
				loadadmincheck();
            }
            else
			{
				window.location="/login";
			}				
        }
    };
    
    request.open('GET', '/check-login', true);
    request.send(null);
}
function loadadmincheck()
{
var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
				loadLoggedInUser(this.responseText);
				loadpostarea();
            }
            else{
				window.location="/";
			}			
        }
    };
    
    request.open('GET', '/check-adlogin', true);
    request.send(null);

}
ffunction loadpostarea()
{
	var PostHtml = 
        `<h3>Registration</h3>
		<table>
		<tr>
		<td>Title</td>
        <td> <input type="text" id="title" placeholder="Title" required/> </td>
		</tr>
		<tr>
		<td>Heading</td>
		<td> <input type="text" id="heading" placeholder="Heading" required /> </td>
		</tr>
		<tr>
		<td>Date</td>
        <td> <input type="date" id="date" name="Date" required /> </td> 
		</tr>
		<tr>
		<td> Content</td>
        <td> <textarea id="content"   required > </textarea>  
		</tr> 
        <tr>
		<td> </td>
        <td> <input type="submit" id="post_btn" value="POST"  /> </td>
		</tr> `
        ;
    document.getElementById('post_area').innerHTML = PostHtml;
    
    var post = document.getElementById('post_btn');
       post.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  alert('content posted successfully');
                  post.value = 'Posted!';
              } else {
                  alert('Could not Post the Content');
                  post.value = 'Post';
              }
          }
        };
		// i changed right here
        
        // Make the request
        var title = document.getElementById('title').value;
		var heading = document.getElementById('heading').value;
        var date = document.getElementById('date').value;
		var content = document.getElementById('content').value;
		
          console.log(title);
		  console.log(heading);
          console.log(date);
		  console.log(content);
		
          request.open('POST', '/create-post', true);
          request.setRequestHeader('Content-Type', 'application/json');
          request.send(JSON.stringify({title: title, heading:heading, date: date, content:content,  }));  
          register.value = 'Posting...';
		
    
    };
}
// The first thing to do is to check if the user is logged in!
loadLogin();
