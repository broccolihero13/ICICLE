// There needs to be some tweaks made to the jquery ajax system to let it know about hte
// CSR prefixes
$.ajaxSetup({
      dataFilter: function(data, type) {
          var prefixes = ['//', 'while(1);', 'while(true);', 'for(;;);'],
              i,
              l,
              pos;
          if (type != 'json' && type != 'jsonp') {
              return data;
          }
   
          for (i = 0, l = prefixes.length; i < l; i++) {
              pos = data.indexOf(prefixes[i]);
              if (pos === 0) {
                  return data.substring(prefixes[i].length);
              }
          }
          return data;
      }
  });

 window.onerror = function(error, url, line) {
      console.log({acc:'error', data:'ERR:'+error+' URL:'+url+' L:'+line});
  };

