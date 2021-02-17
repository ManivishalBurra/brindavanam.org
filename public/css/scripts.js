$(()=>{
  document.querySelectorAll('.btnss')
    .forEach(item => {
      item.addEventListener('click', function() {
        var id =this.id;
        var likeStatus=this.name;
        var likesNumber=this.value;
        console.log(this.innerHTML);
        if(likeStatus==="unliked")
        {
          this.name="liked";
          this.value=Number(likesNumber)+1;
          likesNumber=this.value;
          likeStatus=this.name;
          this.innerHTML= '<i class="fas fa-heart"></i>' + likesNumber + ' likes';
        }
        else{
          this.name="unliked";
          this.value=Number(likesNumber)-1;
          likesNumber=this.value;
          likeStatus=this.name;
          this.innerHTML= '<i class="far fa-heart"></i>' + likesNumber + ' likes';
        }
        $.ajax({
            url: '/post/' + id+'/'+likesNumber,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ id: id, likeStatus:likeStatus }),
            success: function(response)
            {
              console.log(response);
            }
        });

      });
    });


});

//
