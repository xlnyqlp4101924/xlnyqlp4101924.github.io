$(function() {
	$(".item").on("click", ".copybtn", function() {
		$(this).parent().find(".selInput").select();
		if (document.execCommand('copy')) {
			document.execCommand('copy');
		}
		popBox()
        setTimeout(function(){{
            var popBox = document.getElementById("popBox");
            popBox.style.display = "none";
		}},1000)
	})
})
function popBox() {{
	var popBox = document.getElementById("popBox");
	popBox.style.display = "block";
	
}};