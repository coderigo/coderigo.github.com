jQuery(document).ready(function() {
    // Make all links open in new tab
    // There must be a non-hackish way to do this, right?
    // Swiped from: https://github.com/simonjodet/blog/blob/master/posts/2011-09-12-jekyll-and-node.markdown
    var domain_root = document.location.protocol+'//'+document.location.host;
    var all_links = $('a').each(function(index,element){
      if(element.href.substr(0,domain_root.length) !== domain_root)
      {
        element.target = '_blank';
      }
    });

    // Center images within <p> elements created by markdown in posts
    $('.post-body img').each(function(index, imgElement){
      console.log($(imgElement).parent());
      $(imgElement).parent().css('text-align','center');
      // css('text-align','center');
    })
});