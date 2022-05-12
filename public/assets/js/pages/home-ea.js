stent.requireJS(["widgets", "chart", "qr"], function () {

  // Active corresponding menu
  stent.navbar.activeMenu("home-ea");

  // change Page title
  stent.ui.setPageTitle("Dashboard");

  // Build home object
  stent.homeEA = (function () {

    let invitationLink = null;

    const fetchMembers = async function () {

      let fetchMembers = await stent.ajax.getRestAsync(
        "/tenants/" + stent.tenant.key + "/members"
      );

      if (fetchMembers && fetchMembers.ok && fetchMembers.message) {
        return fetchMembers.message;
      } else {
        stent.toast.danger("Error when trying to fetch the ambassadors. Please refresh the page to try again.");
        return null;
      }

    };

    const fetchInvitationLink = async function () {
      let query = `
        query {
          workspaceContext {
            workspace {
              settings {
                inviteCode
              }
            }
          }
        }`;

      // Renew data from server
      var result = await stent.ajax.getApiAsync(query, "POST");

      if (result.ok &&
        result.message &&
        result.message.data &&
        result.message.data.workspaceContext &&
        result.message.data.workspaceContext.workspace &&
        result.message.data.workspaceContext.workspace.settings &&
        result.message.data.workspaceContext.workspace.settings.inviteCode) {

        return result.message.data.workspaceContext.workspace.settings.inviteCode;

      } else {
        stent.toast.danger("Error when trying to fetch the invitation link. Please refresh the page to try again.");
        return null;
      }

    };

    const loadAsyncCharts = function () {
      stent.widgets.get().forEach(widget => stent.widgets.refresh(widget.guid));
    };

    const bindEvents = function () {

      $("#doNotShowAnymore")
        .off("click")
        .on("click", function () {
          if (window.confirm("Are you sure you want to remove the onboard process ?")) {
            localStorage.setItem("showHelper", false);
            window.location.reload();
          }
        });

    };

    const initHelp1 = async function () {

      $("#EA_invitationLink").attr("href", invitationLink);

      new QRCode(
        document.getElementById("qrcode"),
        {
          text: invitationLink,
          width: 160,
          height: 160,
          colorDark: "#702eea",
          colorLight: "#fbf9fd"
        }
      );

    };

    const initHelp2 = async function () {

      let emailTitle_EN = "Join me in Stent to unleash your full social selling potential";
      let emailBody_EN = encodeURIComponent(`Hi,

Welcome to the V3 Stent Employee Advocacy program.

You're about to experience a new way of team building on digital platforms.

${invitationLink}

I know what you're saying:
- You, the employer, hope that your employees will relay your messages wisely.
- You, the employees, worry that you'll have an additional task imposed on you.

We've got a different idea...

Namely, aligning yourself around the same corporate culture and helping it evolve for all to see, based on the desire to shine together, through all types of content, including video. For this reason, employers and employees are receiving this same email.
Your mission, should you choose to accept it, is to make this journey together thanks to Stent, the application that will unite you in this task.

- The Stent space will allow you to inspire, create and program content around a collaborative vision.
- The Stent application will allow you to personalize this vision, or even augment it with a rich nuance of each individual's journey, and visualize their progress, all while supported by the AI implemented at the heart of the system.

If this approach is so effective, it's because it's based on authentic sharing and the inter-enrichment of the values that you have in common.

The world is changing. The days when a company was a hermetically sealed black box tied to the challenges of this world are over. On the contrary, in an Employee Advocacy program, each and every person will not only gain recognition for their expertise, but also a springboard for reappropriating the various topics that make up society.

Have a great time everyone!


The V3 Stent Team

`);

      let emailTitle_FR = "Votre expérience V3 Stent commence aujourd'hui / ";
      let emailBody_FR = encodeURIComponent(`Bonjour,

Bienvenue dans le module Partage de contenu V3 Stent.

Vous êtes sur le point d’expérimenter une nouvelle manière de faire équipe sur les plateformes numériques.

${invitationLink}

Je sais ce que vous vous dites :
- Vous employeur, vous espérez que vos employés relaieront vos messages sagement.
- Vous employés, vous redoutez qu’on vous impose une tâche supplémentaire.

Nous vous proposons autre chose...

À savoir vous aligner autour de la même culture d’entreprise et la faire évoluer aux yeux de tous, sur la base de l’envie de rayonner ensemble à travers tout contenu, y compris vidéo. Pour cette raison, employeur et employés recevez ce même courriel unique.
Votre mission si vous l’acceptez est de cheminer ensemble grâce à Stent, l’application qui vous réunira dans cette tâche.

- L’espace Stent vous permettra d’inspirer, créer, programmer du contenu autour d’une vision collaborative.
- L’application Stent vous permettra de personnaliser cette vision, voire de la compléter de nuance riche du parcours propre à chacun et visualiser sa progression en étant accompagné par l’IA implémentée au cœur du système.

De quoi lancer facilement jeux, concours à thèmes avec, pourquoi pas, des récompenses pour stimuler vos futurs ambassadeurs de marque. Laissez libre cours à votre imagination! Si cette démarche est tellement efficace, c’est qu’elle repose sur le partage authentique et l’inter-enrichissement des valeurs que vous avez en commun.

Le monde change, grâce au module Partage de contenu, chacun y gagnera non seulement la reconnaissance de son expertise mais aussi un tremplin pour se réapproprier les différents sujets qui font société.

Belle expérience à toutes et tous!


L’équipe V3 Stent


----------------



`);

      let title = emailTitle_EN;
      if (stent.tenant && stent.tenant.organization && stent.tenant.organization.state && stent.tenant.organization.state === "QC") {
        title = emailTitle_FR + emailTitle_EN;
      }

      let body = emailBody_EN;
      if (stent.tenant && stent.tenant.organization && stent.tenant.organization.state && stent.tenant.organization.state === "QC") {
        body = emailBody_FR + emailBody_EN;
      }

      $("#inviteMembers").attr("href", `mailto:?subject=${title}&body=${body}`);

    };

    const initHelp3 = async function () {
      $("#onboardMe")
        .off("click")
        .on("click", function () {
          $(".onBoardingButtonWrapper").click();
        });
    };

    const init = async function () {

      stent.loader.show(".main-content");

      bindEvents();

      if (!localStorage.getItem("showHelper")) {

        // Count members
        // If there is no members, force display the Helper process
        // If there is 1 member, let the user choose if he wants to hide the helper process (and change the (1) number by a valid icon)
        // If there is more than let the user choose if he wants to hide the helper process 1 member, change the (1) and (2) number by a valid icon
        let members = await fetchMembers();

        if (members.length === 0) {
          $("#doNotShowAnymore").remove();
          $("#widgetsWrapper").remove();

        } else if (members.length === 1) {
          $("#initHelp1 .EA_stepNumber").html("<img src=\"/assets/img/1.svg\" style=\"width:46px; height: 46px;\" />");
          $(".header").removeClass("d-none");
          $("[data-name=\"top-awareness\"]").remove();
          loadAsyncCharts();

        } else if (members.length > 1) {
          $("#initHelp1 .EA_stepNumber").html("<img src=\"/assets/img/1.svg\" style=\"width:46px; height: 46px;\" />");
          $("#initHelp2 .EA_stepNumber").html("<img src=\"/assets/img/1.svg\" style=\"width:46px; height: 46px;\" />");
          $(".header").removeClass("d-none");
          loadAsyncCharts();
        }

        $("#helperWrapper").removeClass("d-none");

        let getInvitationLink = await fetchInvitationLink();
        if (getInvitationLink) {
          invitationLink = stent.api.auth + "/invites/" + getInvitationLink;

          initHelp1();
          initHelp2();
          initHelp3();

        }

      } else {
        $(".header").removeClass("d-none");
        loadAsyncCharts();
      }

      stent.loader.hide();


    };

    init();

    return {};

  })();

});