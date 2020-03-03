<%= require('html-loader!../partials/servererror.html') %>
<!doctype html>
<html lang="en" xml:lang="en">

<head>
    <%= require('html-loader!../partials/meta-common.html') %>
    <%= require('html-loader!../partials/favicons.html') %>
  	<title>Error 500</title>

</head>

<body>
    <header>
        <%= require('html-loader!../partials/official.html') %>
        <%= require('html-loader!../partials/experiment-banner.html') %>
        <%= require('html-loader!../partials/navbar.html') %>
    </header>
    <main>
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h1>Error 500</h1>
                </div>
			 </div>
         </div>	
  
    </main>
    <footer>
        <%= require('html-loader!../partials/feedback.html') %>
        <%= require('html-loader!../partials/footer.html') %>
        <%= require('html-loader!../partials/alphabar.html') %>
        <%= require('html-loader!../partials/ga.html') %>
    </footer>
    <%= require('html-loader!../js/es6/js.html') %>
</body>

</html>
