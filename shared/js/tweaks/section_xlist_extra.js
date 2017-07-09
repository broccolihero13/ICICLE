require(['shared/js/canvas_api'], function(canvas_api) {
  if (window.location.pathname.indexOf('settings') > 0) {
    $('#sections>li.section').each(function(_idx, section) {
      section = $(section);

      var section_data = {};
      var add_text = [];
      var first = canvas_api.get_section(section.find('a.name').attr('href'))

        .then(function(_d) {
          section_data = _d;
          var dfd = new $.Deferred();
          if (section_data.sis_import_id != null) {
            add_text.push("Last Affected by SIS Import <a href='/api/v1/accounts/self/sis_imports/" + section_data.sis_import_id + "' target='_new'>" + section_data.sis_import_id + "</a>");
          }
          dfd.resolve();
          return dfd.promise();
        })
        .then(function() {
          if (section_data.nonxlist_course_id && section_data.nonxlist_course_id !== '') {
            // Add a link to the original course
            var course_api_url = '/api/v1/courses/' + section_data.nonxlist_course_id;
            return canvas_api.get_course(section_data.nonxlist_course_id)
              .then(function(_course) {
                add_text.push('XL: originally in <a href="/courses/' + section_data.nonxlist_course_id + '" target="_new">' + _course.id + '</a>');
              });
          } else {
            return $.when();
          }
        })
        .then(function() {
          if (add_text.length > 0) {
            var span = section.find('span.users_count');
            var span_text = span.html();
            span_text = span_text.replace(')', '- ' + add_text.join(', ') + ')');
            span.html(span_text);
          }
        })
        .fail(function(err) {
          console.log(err);
        });
    });
  }
});
