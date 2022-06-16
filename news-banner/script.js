var firstElementCloned = document.getElementById("newest-posts-list").getElementsByTagName("li")[0].cloneNode(true);
var elementsList = document.getElementById("newest-posts-list");
elementsList.appendChild(firstElementCloned);
