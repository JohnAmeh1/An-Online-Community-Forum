<?php defined('APP') or die('direct script access denied!'); ?>

<div class="js-post-edit-modal class_55 hide" style="min-width: 600px;min-height:auto" >
	<div class="class_39" style="float:right; margin: 10px;padding:5px;padding-left:10px;padding-right:10px;" onclick="postedit.hide()">X</div>
	<h1 class="class_27"  >
		Edit Post
	</h1>
	<form onsubmit="postedit.submit(event)" method="post" class="class_42" >
		<div class="class_43" >
			<textarea placeholder="Whats on your mind?" name="post" class="js-post-edit-input class_44" ></textarea>
		</div>
		<div class="class_45" >
			<button class="class_46"  >
				Save
			</button>
		</div>
	</form>
</div>

<script>
	
	var postedit = {
 
 		edit_id: 0,

		show: function(id){

			postedit.edit_id = id;

			let data = document.querySelector("#post_"+id).getAttribute("row");
			data = data.replaceAll('\\"','"');
			data = JSON.parse(data);

			if(typeof data == 'object')
			{
				document.querySelector(".js-post-edit-input").value = data.post;
			}else{
				alert("Invalid post data");
			}

			document.querySelector(".js-post-edit-modal").classList.remove('hide');
			document.querySelector(".js-login-modal").classList.add('hide');
			document.querySelector(".js-signup-modal").classList.add('hide');
		},
		
		hide: function(){
			document.querySelector(".js-post-edit-modal").classList.add('hide');
		},

		submit: function(e){

			e.preventDefault();
			let post = document.querySelector(".js-post-edit-input").value.trim();
			let form = new FormData();
 
			form.append('id', postedit.edit_id);
			form.append('post', post);
			form.append('data_type', 'edit_post');
			var ajax = new XMLHttpRequest();

			ajax.addEventListener('readystatechange',function(){

				if(ajax.readyState == 4)
				{
					if(ajax.status == 200){

						console.log(ajax.responseText);
						let obj = JSON.parse(ajax.responseText);
						alert(obj.message);

						if(obj.success)
							window.location.reload();
					}else{
						alert("Please check your internet connection");
					}
				}
			});

			ajax.open('post','ajax.inc.php', true);
			ajax.send(form);
		},


	};

</script>