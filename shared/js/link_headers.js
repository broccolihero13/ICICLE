define(function(){

  return {
    parse_canvas_link_headers : function(link_header_string){
      var links = {};

      //var parts = link_header_string.split(',');
      $(link_header_string.split(',')).each(function(idx,part){
        var part_split = part.split(';');
        var url = part_split[0].replace('<','').replace('>','');
        var key = part_split[1].split('=')[1].replace(/"/g,'');
        links[key] = {url:url};
      });

      return links;
    }
  }

});
