
$(()=>{
  document.querySelectorAll('.btnss')
    .forEach(item => {
      item.addEventListener('click', function() {
        var id =this.id;
        var likeStatus=this.name;
        var likesNumber=parseInt(this.value);
        console.log("this is ->"+this.id);
        var audio= new Audio('../images/likeClick.mp3');
        audio.play();

        if(likeStatus==="unliked")
        {
          this.name="liked";
          this.value=likesNumber+1;
          likesNumber=this.value;
          likeStatus=this.name;
          this.innerHTML= '<i class="fas fa-heart"></i>' + likesNumber.toString() + ' likes';
        }
        else{
          this.name="unliked";
          this.value=likesNumber-1;
          likesNumber=this.value;
          likeStatus=this.name;
          this.innerHTML= '<i class="far fa-heart"></i>' + likesNumber.toString() + ' likes';
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
function myreadmore(obj){
  let classNameofReadmore= obj.value;
  document.getElementById("readmoreoption"+classNameofReadmore).style.display="none";
  document.getElementById("tags"+classNameofReadmore).style.display="block";
  document.getElementById("readmoreOpen"+classNameofReadmore).style.display="inline";
}
window.addEventListener("scroll",function(){

		var intViewportWidth = window.innerWidth;
    var offset=window.pageYOffset;
    if(offset<600){
    document.getElementById("post-button").style.display="none";
    document.getElementById("post-button").style.opacity=0;
    }
    else{
    document.getElementById("post-button").style.display="flex";
    document.getElementById("post-button").style.opacity=1;
    }
    console.log(offset);

});
function myFunction(){
  document.getElementById("uploadOption").style.display="flex";

}
function myClose(){
  document.getElementById("uploadOption").style.display="none";

}
//
