function loadRegForm () {
    var RegHtml = 
        `<h3>Registration</h3>
	  <table>
		<tr>
			<td>User Name </td>
        		<td> <input type="text" id="username" placeholder="Username" required/> </td>
		</tr>
		<tr>
			<td> Email </td>
			<td> <input type="email" id="email" placeholder="Email" required /> </td>
		</tr>
		<tr>
			<td> Password</td>
        	<td> <input type="password" id="password" name="password" placeholder="Password" required /> </td> 
		</tr>
		<tr>
			<td> Confirm Password </td>
        		<td> <input type="password" id="cpassword" name="cpassword" placeholder=Confirm "Password" required  /> <span id="error">  </span> </td>
		</tr> 
        	<tr>
			<td> </td>
        		<td> <input type="submit" id="register_btn" value="Register"  /> </td>
		</tr> 
	  </table>`
        ;
    document.getElementById('reg_area').innerHTML = RegHtml;
    
    var register = document.getElementById('register_btn');
    register.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  alert('User created successfully');
                  register.value = 'Registered!';
              } else {
                  alert('Could not register the user');
                  register.value = 'Register';
              }
          }
        };
        
        // Make the request
        var username = document.getElementById('username').value;
		var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
		var cpassword = document.getElementById('cpassword').value;
		if(password==cpassword)
		{
			var error= "Password is not matched";
			document.getElementById('error').innerHTML=error;
		}
		else
		{
          console.log(username);
		  console.log(email);
          console.log(password);
		  console.log(cpassword);
		
          request.open('POST', '/create-user', true);
          request.setRequestHeader('Content-Type', 'application/json');
          request.send(JSON.stringify({username: username, email:email, password: password,  }));  
          register.value = 'Registering...';
		}
    
    };
}


function loadLogin () {
    // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
				window.location="/";
            } 
        }
    };
    
    request.open('GET', '/check-login', true);
    request.send(null);
}


// The first thing to do is to check if the user is logged in!
loadLogin();

loadRegForm();
