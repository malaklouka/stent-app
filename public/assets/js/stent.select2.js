stent.select2 = (function() {

  return {
    memberLayout: {
      escapeMarkup: function(markup) {
        return markup;
      },
      templateResult: function(data) {

        let pictureUrl = data.pictureUrl ? data.pictureUrl : "/assets/img/avatars/profiles/default-avatar.gif";

        return `
          <div>
            <div class="avatar avatar-xs">
              <img src="${pictureUrl}" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif';" class="avatar-img rounded-circle" />
            </div>
            <div style="display: inline-block; vertical-align: -2px; margin-left: 5px;">
              ${data.text}
            <div>
          </div>`;
      },
      templateSelection: function(data) {

        let pictureUrl = data.pictureUrl ? data.pictureUrl : "/assets/img/avatars/profiles/default-avatar.gif";

        return `
        <div style="margin-top: -2px; margin-left: -5px;">
          <div class="avatar avatar-xs" style="width: 1rem; height: 1rem;">
            <img src="${pictureUrl}" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif';" class="avatar-img rounded-circle" />
          </div>
          <div style="display: inline-block; vertical-align: -2px; margin-left: 5px;">
            ${data.text}
          <div>
        </div>`;
      }
    }

  };

})();
