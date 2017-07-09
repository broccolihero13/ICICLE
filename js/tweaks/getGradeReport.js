let startReport = (cb) => {
  $.ajax({
    url: `https://${window.location.hostname}/api/v1/accounts/self/reports/grade_export_csv`,
    type: `POST`,
    success: function(data) {
      console.log(`Report Started`);
      cb(data.id);
    },
    error: function() {
      console.log(`Error!`);
    }
  });
};
let checkReportStatus = (id) => {
  $.get(`https://${window.location.hostname}/api/v1/accounts/self/reports/grade_export_csv/${id}`, (data) => {
    if (data.progress == 100) {
      add_to_log(`a <href="${data.file_url}">Click to Download</a>`);
    } else {
      add_to_log(`Report is not ready yet...\n don't leave extension page`);
      setTimeout(() => {
        checkReportStatus(id);
      }, 2000);
    }
  });
};
startReport((id) => {
  checkReportStatus(id);
});
