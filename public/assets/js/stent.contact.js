stent.contact = (function () {

  let _contact = {};

  let _wrapper = $("#contactModal .modal-content");

  const getSignals = function (key) {
    return stent.ajax.getRestAsync("/tenants/" + stent.tenant.key + "/contacts/" + key + "/signals");
  };

  const getContact = function (key) {
    return stent.ajax.getRestAsync("/profiles/" + key);
  };

  const signalsDOM = function () {

    var html = "";

    // Build HTML
    if (typeof _contact.signals === "string") {
      html += _contact.signals;
    } else {
      /* eslint-disable */
      _contact.signals.forEach(signal => {

        html += `
          <div class="row">
            
            <div class="col-auto"> 
              <div class="signal-vertical-bar"></div>
              <div class="signal-type mx-auto bg-${signal.level}" data-toggle="tooltip" data-placement="right" title="${signal.type}">
                <span class="fe fe-${signal.icon}"></span>
              </div>
            </div>

            <div class="col"> 
              
              <div class="card">
                <div class="card-body">
                  <p style="white-space: pre-wrap;">${signal.body}</p>
                  <time class="small text-muted">
                    ${moment(signal.timestamp).format("MM/DD/YYYY LT")}
                    ${signal.ownerName || signal.origin ? ` - ` : ``}
                    ${signal.ownerName ? `<span>${signal.ownerName}</span>` : ``}
                    ${signal.origin ? ` - <span style="white-space: break-spaces;" class="badge badge-soft-secondary">${signal.origin}</span>` : ``}
                  </time>
                </div>
              </div>

            </div>

          </div>`;
      });
      /* eslint-enable */
    }


    return html;
  };

  const profileDOM = function () {

    /* eslint-disable */
    return `
        <h5 class="header-pretitle">
          <span class="fe fe-file-text mr-2" style="font-size: 1rem;"></span>
          Summary
        </h5>
        <div class="card">
          <div class="card-body" style="white-space: pre-wrap;">${_contact.profile && _contact.profile.summary ? $.trim(_contact.profile.summary) : "-"
      }</div>
        </div>

        <div class="row">
          
          <div class="col-12 col-xl-4 text-center d-flex flex-column">
            <h5 class="header-pretitle">
              <span class="fe fe-eye mr-2" style="font-size: 1rem;"></span>
              Gender
            </h5>
            <div class="card flex-grow-1">
              <div class="card-body">
              ${_contact.profile &&
        _contact.profile.demographics &&
        _contact.profile.demographics.faceAttributes &&
        _contact.profile.demographics.faceAttributes.gender
        ? _contact.profile.demographics.faceAttributes.gender
        : "-"
      }
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-6 col-xl-4 text-center d-flex flex-column">
            <h5 class="header-pretitle">
              <span class="fe fe-gift mr-2" style="font-size: 1rem;"></span>
              Age
            </h5>
            <div class="card flex-grow-1">
              <div class="card-body">
              ${_contact.profile && _contact.profile.demographics && _contact.profile.demographics.faceAttributes && _contact.profile.demographics.faceAttributes.age
        ? _contact.profile.demographics.faceAttributes.age
        : "-"
      }
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-6 col-xl-4 text-center d-flex flex-column">
            <h5 class="header-pretitle">
              <span class="fe fe-twitter mr-2" style="font-size: 1rem;"></span>
              Languages
            </h5>
            <div class="card flex-grow-1">
              <div class="card-body">
              ${_contact.profile &&
        _contact.profile.demographics &&
        _contact.profile.demographics.locale &&
        _contact.profile.demographics.locale.detectedLanguage &&
        _contact.profile.demographics.locale.detectedLanguage.length > 0
        ? _contact.profile.demographics.locale.detectedLanguage.map(lang => lang.code)
        : "-"
      }
              </div>
            </div>
          </div>

        </div>

        <div class="row">
          
          <div class="col-12 col-xl-4 text-center d-flex flex-column">
            <h5 class="header-pretitle">
              <span class="fe fe-share-2 mr-2" style="font-size: 1rem;"></span>
              Relations
            </h5>
            <div class="card flex-grow-1">
              <div class="card-body">
              ${_contact.profile &&
        _contact.profile.relationals && _contact.profile.relationals.network && _contact.profile.relationals.network.connections ?
        _contact.profile.relationals.network.connections :
        "-"
      }
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-6 col-xl-4 text-center d-flex flex-column">
            <h5 class="header-pretitle">
              <span class="fe fe-linkedin mr-2" style="font-size: 1rem;"></span>
              LinkedIn
            </h5>
            <div class="card flex-grow-1">
              <div class="card-body">
                ${_contact.profile && _contact.profile.linkedin
        ? `<a target="_blank" href="https://www.linkedin.com/in/${_contact.profile.linkedin}/">${_contact.profile.linkedin
        }</a>`
        : "-"
      }
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-6 col-xl-4 text-center d-flex flex-column">
            <h5 class="header-pretitle">
              <span class="fe fe-twitter mr-2" style="font-size: 1rem;"></span>
              Twitter
            </h5>
            <div class="card flex-grow-1">
              <div class="card-body">${_contact.profile && _contact.profile.twitter && _contact.profile.twitter.length > 0 ? _contact.profile.twitter.join(", ") : "-"
      }</div>
            </div>
          </div>

        </div>

        <h5 class="header-pretitle">
          <span class="fe fe-map mr-2" style="font-size: 1rem;"></span>
          Location
        </h5>
        <p>${_contact.profile &&
        _contact.profile.demographics &&
        _contact.profile.demographics.resides &&
        _contact.profile.demographics.resides.location &&
        _contact.profile.demographics.resides.location.name
        ? `
                <div class="mapouter">
                  <div class="gmap_canvas">
                    <iframe 
                      width="100%" 
                      height="400" 
                      src="https://maps.google.com/maps?q=${encodeURIComponent(
          _contact.profile.demographics.resides.location.name
        )}&t=&z=8&ie=UTF8&iwloc=&output=embed" 
                      frameborder="0" 
                      scrolling="no" 
                      marginheight="0" 
                      marginwidth="0">
                    </iframe>
                  </div>
                </div>
              `
        : "-"
      }
        </p>
      `;
    /* eslint-enable */
  };

  const companiesDOM = function () {

    if (!_contact.companies || _contact.companies.length === 0) {
      return `
          <div class="alert alert-light" role="alert">
            Ooooops. No company found for this ambassador.
          </div>`;
    }

    return _contact.companies.map(company => {

      let name = company.name ? company.name : "";
      let initials = name.length > 2 ? name.substring(0, 2).toUpperCase() : "";
      let isCurrent = company.current === true ? true : false;
      let hasLogo = company.logo && company.logo !== "" ? true : false;
      let logo = hasLogo
        ? `<img src="${company.logo
        }" class="avatar-img rounded-circle" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-company.svg'" ></img>`
        : `<span class="avatar-title rounded-circle ${isCurrent ? "bg-primary" : ""}">${initials}</span>`;
      let description = company.description && company.description !== "" ? company.description : "";
      let title = company.title && company.title !== "" ? company.title : "";
      let locationName = company.locationName && company.locationName !== "" ? company.locationName : "";
      let employeeCountRange =
        company.firmographics &&
          company.firmographics.employeeCountRange &&
          company.firmographics.employeeCountRange &&
          company.firmographics.employeeCountRange.start &&
          company.firmographics.employeeCountRange.end
          ? company.firmographics.employeeCountRange.start +
          " - " +
          company.firmographics.employeeCountRange.end +
          " employees"
          : "";

      let startJobDate =
        company.timePeriod &&
          company.timePeriod.startDate &&
          company.timePeriod.startDate.month &&
          company.timePeriod.startDate.year
          ? moment(company.timePeriod.startDate.month, "M").format("MMMM") + " " + company.timePeriod.startDate.year
          : "";

      let endJobDate =
        company.timePeriod &&
          company.timePeriod.endDate &&
          company.timePeriod.endDate.month &&
          company.timePeriod.endDate.year
          ? moment(company.timePeriod.endDate.month, "M").format("MMMM") + " " + company.timePeriod.endDate.year
          : "";

      /* eslint-disable */
      return `
          <div class="row">
              
            <div class="col-auto"> 
              <div class="company-avatar">${logo}</div>
            </div>

            <div class="col"> 
              
              <div class="card ${!isCurrent ? "card-inactive" : ""}">
                <div class="card-body">
                  ${isCurrent ? `<span class="badge badge-pill badge-primary float-right">Current</span>` : ``}  
                  <h2 class="mb-3">${name} <a style="font-size: 1rem;" class="fe fe-link ml-2" href="https://www.google.com/search?q=${encodeURIComponent(
        name
      )}" target="_blank"></a></h2>
                  <h4>${title}</h4>
                  ${startJobDate !== ""
          ? `<div class="small">
                          <span class="fe fe-calendar mr-2"></span>${startJobDate}${endJobDate !== "" ? " - " + endJobDate : " - Today"
          }
                        </div>`
          : ``
        }
                  ${locationName !== ""
          ? `<div class="small"><span class="fe fe-map mr-2"></span>${locationName}</div>`
          : ``
        }
                  ${employeeCountRange !== ""
          ? `<div class="small"><span class="fe fe-users mr-2"></span>${employeeCountRange}</div>`
          : ``
        }
                  ${description !== "" ? `<div style="white-space: pre-wrap;">${description}</div>` : ``}
                </div>
              </div>

            </div>

          </div>

        `;
      /* eslint-enable */
    }).join("");
  };

  const skillsDOM = function () {

    if (!_contact.skills || _contact.skills.length === 0) {
      return `
          <div class="alert alert-light" role="alert">
            Ooooops. No skill found for this ambassador.
          </div>`;
    }

    return _contact.skills.map(skill => {
      return `
          <div class="badge badge-pill badge-primary mr-2 mb-2" style="font-size: 1rem;">
            <span class="fe fe-check-circle mr-1"></span>
            ${skill.name ? skill.name : ""}
          </div>
        `;
    }).join("");
  };

  const open = async function (key) {

    $("#contactModal").modal("show");

    if (!key) {
      return;
    }

    clear();

    stent.loader.show("#contactModal .modal-content");

    // Get informations fo the contact
    let fetchContact = await getContact(key);

    if (fetchContact.ok && fetchContact.message && fetchContact.message.profile !== null) {
      _contact = { ...fetchContact.message };
      _wrapper.html(mainDOM());
    } else {
      _wrapper.html(`
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
          <strong>Ooooooooops.</strong> Something went wrong when trying to get the contact data.
        </div>
      `);
    }

    _wrapper.append(loaderDOM());

    stent.loader.show("#contactModal #loader-wait-signals");

    let signals = await getSignals(key);

    $("#loader-wait-signals").remove();

    if (signals.ok && signals.message) {
      _contact.signals = [...signals.message];
    } else {
      _contact.signals = `
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
          <strong>Ooooooooops.</strong> Something went wrong when trying to get the contact's journey.
        </div>
      `;
    }

    _wrapper.append(tabsContainerDOM());

  };

  const close = function () {
    $("#contactModal").modal("hide");
    _contact = {};
  };

  const clear = function () {
    _contact = {};
    _wrapper.empty();
  };

  const mainDOM = function () {
    /*eslint-disable */
    return `
        <div class="header">
          <div class="container-fluid" data-item-id="${_contact.key}">
            <div class="header-body mt-n4">
              ${headerDOM()}
              ${tabsDOM()}
            </div>
          </div>
        </div>
      `;
    /*eslint-enable */
  };

  const headerDOM = function () {
    /* eslint-disable */
    return `
      <div class="row align-items-center">
        <div class="col-auto">
          <div class="avatar avatar-xxl header-avatar-top">
            <img
              src="${_contact.profile.pictureUrl == null
        ? "/assets/img/avatars/profiles/default-avatar.gif"
        : _contact.profile.pictureUrl
      }" 
              onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" 
              class="avatar-img rounded-circle border border-4 border-body"
            />
          </div>
        </div>
        <div class="col mb-3 ml-n3 ml-md-n2">
          <h6 class="header-pretitle">
          ${_contact.profile.headline}
          </h6>
          <h1 class="header-title">
            ${_contact.profile.firstName} ${_contact.profile.lastName} 
            <a 
              href="https://www.linkedin.com/in/${_contact.profile.linkedin}" 
              class="fe fe-link ml-2" 
              style="font-size:1.2rem" 
              target="_blank"
              data-toggle="tooltip" 
              data-placement="top" 
              title="Open LinkedIn profile page">
            </a>
          </h1>
          ${_contact.profile.email ? `<div class="mt-2 text-muted">${_contact.profile.email}</div>` : ""}
        </div>
      </div>
    `;
    /* eslint-enable */
  };

  const tabsDOM = function () {
    /*eslint-disable */
    return `
      <div class="row align-items-center">
        <div class="col">
          <ul class="nav nav-tabs nav-overflow header-tabs" id="contact-nav-links">
            <li class="nav-item">
              <span class="nav-link active" id="contact-journey">Journey</span>
            </li>
            <li class="nav-item">
              <span class="nav-link" id="contact-profile">Profile</span>
            </li>
            <li class="nav-item">
              <span class="nav-link" id="contact-companies">Experience</span>
            </li>
            <li class="nav-item">
              <span class="nav-link" id="contact-skills">Skills</span>
            </li>
          </ul>
        </div>
      </div>
    `;
    /*eslint-enable */
  };

  const loaderDOM = function () {
    return "<div class=\"container-fluid tab-container\" id=\"loader-wait-signals\"></div>";
  };

  const tabsContainerDOM = function () {
    return `
      <div class="container-fluid tab-container" id="contact-journey-container">${signalsDOM()}</div>
      <div class="container-fluid tab-container d-none" id="contact-profile-container">${profileDOM()}</div>
      <div class="container-fluid tab-container d-none" id="contact-companies-container">${companiesDOM()}</div>
      <div class="container-fluid tab-container d-none" id="contact-skills-container">${skillsDOM()}</div>
    `;
  };

  const bindEvents = function () {

    $("#contactModal .modal-content")
      .off("click", ".nav-link")
      .on("click", ".nav-link", function () {

        let tabName = $(this).attr("id");
        if ($(this).hasClass("active")) return;

        // Hide all tab containers
        _wrapper.find(".tab-container").addClass("d-none");
        _wrapper.find(".nav-link.active").removeClass("active");

        // Show the necessary one
        $("#" + tabName + "-container").removeClass("d-none");
        $(this).addClass("active");

      });

  };

  const init = function () {
    bindEvents();
  };

  init();

  return {
    open,
    close,
    clear,
    get: function () {
      return _contact;
    },

  };
})();
