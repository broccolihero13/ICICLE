/*jshint esversion:6*/

$(document).ready(function() {

  if (window.location.pathname.indexOf('courses') > -1) {
    $('#content').prepend(`<button style="display:none;" id="decrosslistbutton">Decrosslist All Sections from this course</button>`);
    onElementRendered('button#decrosslistbutton', () => {
      $('button#decrosslistbutton').on('click', () => {
        console.log('initiating...');
        let decross_course_id = window.location.pathname.split('/').find((item, i, arr) => {
          return parseInt(item) > 0;
        });
        console.log(decross_course_id);
        let urlForSections = `https://${window.location.hostname}/api/v1/courses/${decross_course_id}/sections?per_page=100`;
        console.log(urlForSections);
        $.getJSON(urlForSections, (data, response) => {
          data.forEach((section, i, arr) => {
            console.log(section.id);
            if (section.nonxlist_course_id) {
              $.ajax({
                url: `https://${window.location.hostname}/api/v1/sections/${section.id}/crosslist`,
                method: 'DELETE',
                contentType: "application/json",
                data: JSON.stringify({
                  "authenticity_token": $('input[name="authenticity_token"]').val()
                })
              }).then(() => {
                console.log(`${section.id} was decross-listed`);
              });
            }
            console.log(arr.length, i);
            if (arr.length - 1 === i) {
              console.log(`All sections decrosslisted or no crosslisted sections available`);
            }
          });
        });
      });
    });
  }
});
