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

var add_to_log = function(msg) {
  $('#status_response').append(msg + "<br/>");
};

// Save branding options to chrome.storage

$(document).ready(function() {
  //Create Admin Click
  $('#create__admin_btn').click(function(e) {

    e.preventDefault();
    // prompt for username, password
    var username = $('#admin_name').val();
    var firstname = $('#admin_first_name').val();
    var lastname = $('#admin_last_name').val();
    var password = Math.random().toString(36).slice(-8);
    console.log(username, firstname, lastname);
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      var data_2_send = {
        req: "create__admin",
        username: username,
        password: password,
        name: firstname + " " + lastname
      };
      add_to_log('creating user ' + firstname + " " + lastname + "...");
      add_to_log('adding as admin...');

      ///this passes data to current tab
      chrome.tabs.sendMessage(tabs[0].id, data_2_send, function(response) {
        // Do something with the response back
        //add_to_log(JSON.stringify(response));
        add_to_log('..all done. User id: ' + response.id + ', password: ' + password);
      });
      //return true;
    });
  });
  //show Remote Admin Tool Click
  $('#showRAT_btn').click(function(e) {
    e.preventDefault();
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      var data_2_send = {
        req: "showRAT"
      };
      add_to_log('Hiding ICICLE enhancements');
      chrome.tabs.sendMessage(tabs[0].id, data_2_send, function(response) {
        console.log(response);
      });
    });
  });
  $('#areYouSure').click(function(e) {
    e.preventDefault();
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      var data_2_send = {
        req: "areYouSure"
      };
      add_to_log('Fetching scary buttons...');
      chrome.tabs.sendMessage(tabs[0].id, data_2_send, function(response) {
        console.log(response);
      });
    });
  });
  $('#getGradeReport').click(function(e) {
    e.preventDefault();
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      var data_2_send = {
        req: 'getGradeReport'
      };
      add_to_log('Generating Grade Export Report');
      chrome.tabs.sendMessage(tabs[0].id, data_2_send, function(response) {
        console.log(response);
      });
    });
  });
  // //////// Configure Settings /////////
  //
  // $("#configure_settings").click(function(e) {
  //   e.preventDefault();
  //
  //   chrome.tabs.query({
  //     active: true,
  //     currentWindow: true
  //   }, function(tabs) {
  //
  //     var data_2_send = {
  //       req: "configure_settings",
  //       timezone: $('#time_zone').val()
  //     };
  //
  //     add_to_log('pao sending applying settings ...');
  //     chrome.tabs.sendMessage(tabs[0].id, data_2_send, function(response) {
  //       // Do something with the response back
  //       add_to_log('pao ..all done.');
  //     }); //end chrome.tabs.sendMessage
  //
  //   }); //end chrome.tabs.query
  //
  // }); //end Configure Settings
  //
  $('a.page_redirect').click(function(e) {
    e.preventDefault();
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      var url = $(e.target).attr('href');

      //link for error reports
      if ($(e.target).attr('href') == '/error_reports') {
        url += '/' + $('#error_id').val();
      }
      //link for SIS Admin User
      if ($(e.target).attr('href') == '/accounts/self/users') {
        url += '/' + adminUserID;
        add_to_log('User:' + adminUserID + ' is open in current tab.');
      }

      //Link for theme editor
      if ($(e.target).attr('href') == '/theme_editor') {
        add_to_log('found theme_editor');
        var tab = tabs[0];
        var TabURL = tab.url;
        add_to_log('Tab URL is: ' + TabURL);
        var account = TabURL.split('/')[4];
        //enable theme editor link to work from any page by checking the current account
        if ($.isNumeric(account)) {
          //do nothing;
        } else {
          var account = 'self';
        }

        add_to_log('Account is: ' + account);
        url = '/accounts/' + account + '/theme_editor';
      }

      chrome.tabs.sendMessage(tabs[0].id, {
        req: 'redirect',
        href: url
      }, function(response) {
        // Do something with the response back
        add_to_log('..all done. User id: ' + response.id);

      });
      //return true;
    });

  }); //end Open links in Current Tab


});
