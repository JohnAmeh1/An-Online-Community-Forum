
var mycomment = {

	page_number: (typeof page_number == 'undefined') ? 1 : page_number,
	post_id: (typeof post_id == 'undefined') ? 0 : post_id,

	submit: function(e){

		e.preventDefault();
		let text = document.querySelector(".js-comment-input").value.trim();
		if(text == ""){
			alert("Please type something to post");
			return;
		}

		let form = new FormData();

		form.append('post_id', mycomment.post_id);
		form.append('post', text);
		form.append('data_type', 'add_comment');
		var ajax = new XMLHttpRequest();

		ajax.addEventListener('readystatechange',function(){

			if(ajax.readyState == 4)
			{
				if(ajax.status == 200){

					console.log(ajax.responseText);
					let obj = JSON.parse(ajax.responseText);
					alert(obj.message);

					if(obj.success){
						document.querySelector(".js-comment-input").value = "";
						mycomment.load_comments();
					}
				}else{
					alert("Please check your internet connection");
				}
			}
		});

		ajax.open('post','ajax.inc.php', true);
		ajax.send(form);
	},

	load_comments: function(e){

		let form = new FormData();

		form.append('post_id', mycomment.post_id);
		form.append('page_number', mycomment.page_number);
		form.append('data_type', 'load_comments');
		var ajax = new XMLHttpRequest();

		ajax.addEventListener('readystatechange',function(){

			if(ajax.readyState == 4)
			{
				if(ajax.status == 200){

					//console.log(ajax.responseText);
					let obj = JSON.parse(ajax.responseText);

					if(obj.success){
						let post_holder = document.querySelector(".js-comments");

						post_holder.innerHTML = "";
						let template = document.querySelector(".js-comment-card");
						
						if(typeof obj.rows == 'object')
						{

							for (var i = obj.rows.length - 1; i >= 0; i--) {
 
 								template.querySelector(".js-comment").innerHTML = obj.rows[i].post;
								template.querySelector(".js-date").innerHTML = obj.rows[i].date;
								template.querySelector(".js-delete-button").setAttribute('onclick',`mycomment.delete(${obj.rows[i].id})`);
								template.querySelector(".js-edit-button").setAttribute('onclick',`postedit.show(${obj.rows[i].id})`);
								template.querySelector(".js-username").innerHTML = (typeof obj.rows[i].user == 'object') ? obj.rows[i].user.username : 'User';
								template.querySelector(".js-profile-link").href = (typeof obj.rows[i].user == 'object') ? 'profile.php?id='+obj.rows[i].user.id : '#';
								
								if(typeof obj.rows[i].user == 'object')
									template.querySelector(".js-image").src = obj.rows[i].user.image;

								let clone = template.cloneNode(true);
								clone.setAttribute('id','post_'+obj.rows[i].id);
								let row_data = JSON.stringify(obj.rows[i]);
								row_data = row_data.replaceAll('"','\\"');

								clone.setAttribute('row',row_data);

								let action_buttons = clone.querySelector(".js-action-buttons");
								if(!obj.rows[i].user_owns)
									action_buttons.remove();
								
								clone.classList.remove('hide');
								
								post_holder.appendChild(clone);
							}
						}else{
							post_holder.innerHTML = "<div style='text-align:center;padding:10px'>No comments found</div>";
						}

					}

					document.querySelector(".js-page-number").innerHTML = "Page " + mycomment.page_number;
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
		mycomment.page_number = mycomment.page_number + 1;
		mycomment.load_comments();
		//window.location.href = 'index.php?page=' + mycomment.page_number;
	},

	prev_page: function(){
		mycomment.page_number = mycomment.page_number - 1;
		if(mycomment.page_number < 1)
			mycomment.page_number = 1;

		mycomment.load_comments();
		//window.location.href = 'index.php?page=' + mycomment.page_number;
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

mycomment.load_comments();