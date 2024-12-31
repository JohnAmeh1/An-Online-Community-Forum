
var mypost = {

	page_number: (typeof page_number == 'undefined') ? 1 : page_number,

	submit: function(e){

		e.preventDefault();
		let text = document.querySelector(".js-post-input").value.trim();
		if(text == ""){
			alert("Please type something to post");
			return;
		}

		let form = new FormData();

		form.append('post', text);
		form.append('data_type', 'add_post');
		var ajax = new XMLHttpRequest();

		ajax.addEventListener('readystatechange',function(){

			if(ajax.readyState == 4)
			{
				if(ajax.status == 200){

					//console.log(ajax.responseText);
					let obj = JSON.parse(ajax.responseText);
					alert(obj.message);

					if(obj.success){
						document.querySelector(".js-post-input").value = "";
						mypost.load_posts();
					}
				}else{
					alert("Please check your internet connection");
				}
			}
		});

		ajax.open('post','ajax.inc.php', true);
		ajax.send(form);
	},

	load_posts: function(e){

		let form = new FormData();

		form.append('page_number', mypost.page_number);
		form.append('data_type', 'load_posts');
		var ajax = new XMLHttpRequest();

		ajax.addEventListener('readystatechange',function(){

			if(ajax.readyState == 4)
			{
				if(ajax.status == 200){

					//console.log(ajax.responseText);
					let obj = JSON.parse(ajax.responseText);

					if(obj.success){
						let post_holder = document.querySelector(".js-posts");

						post_holder.innerHTML = "";
						let template = document.querySelector(".js-post-card");
						
						if(typeof obj.rows == 'object')
						{

							for (var i = 0; i < obj.rows.length; i++) {
 
 								template.querySelector(".js-post").innerHTML = obj.rows[i].post;
								template.querySelector(".js-date").innerHTML = obj.rows[i].date;
								template.querySelector(".js-comment-link").setAttribute('onclick',`mypost.view_comments(${obj.rows[i].id})`);
								
								if(obj.rows[i].comments > 0){
									template.querySelector(".js-comment-link").innerHTML = `Comments (${obj.rows[i].comments})`;
								}else{
									template.querySelector(".js-comment-link").innerHTML = `Comments`;
								}
								
								template.querySelector(".js-username").innerHTML = (typeof obj.rows[i].user == 'object') ? obj.rows[i].user.username : 'User';
								template.querySelector(".js-profile-link").href = (typeof obj.rows[i].user == 'object') ? 'profile.php?id='+obj.rows[i].user.id : '#';
								
								if(typeof obj.rows[i].user == 'object')
									template.querySelector(".js-image").src = obj.rows[i].user.image;

								let clone = template.cloneNode(true);
								clone.setAttribute('id','post_'+obj.rows[i].id);
								let row_data = JSON.stringify(obj.rows[i]);
								row_data = row_data.replaceAll('"','\\"');

								clone.setAttribute('row',row_data);
								clone.classList.remove('hide');
								
								post_holder.appendChild(clone);
							}
						}else{
							post_holder.innerHTML = "<div style='text-align:center;padding:10px'>No posts found</div>";
						}

					}

					document.querySelector(".js-page-number").innerHTML = "Page " + mypost.page_number;
				}
			}
		});

		ajax.open('post','ajax.inc.php', true);
		ajax.send(form);
	},

	view_comments: function(id){

		window.location.href = "post.php?id="+id;
	},

	next_page: function(){
		mypost.page_number = mypost.page_number + 1;
		mypost.load_posts();
		//window.location.href = 'index.php?page=' + mypost.page_number;
	},

	prev_page: function(){
		mypost.page_number = mypost.page_number - 1;
		if(mypost.page_number < 1)
			mypost.page_number = 1;

		mypost.load_posts();
		//window.location.href = 'index.php?page=' + mypost.page_number;
	},

	delete: function(id)
	{
		if(!confirm("Are you sure you want to delete this post?!"))
		{
			return;
		}

		let form = new FormData();

		form.append('id', id);
		form.append('data_type', 'delete_post');
		var ajax = new XMLHttpRequest();

		ajax.addEventListener('readystatechange',function(){

			if(ajax.readyState == 4)
			{
				if(ajax.status == 200){

					//console.log(ajax.responseText);
					let obj = JSON.parse(ajax.responseText);
					alert(obj.message);

					if(obj.success){
						window.location.reload();
					}
				}else{
					alert("Please check your internet connection");
				}
			}
		});

		ajax.open('post','ajax.inc.php', true);
		ajax.send(form);

	},


};

if(typeof home_page != 'undefined')
	mypost.load_posts();