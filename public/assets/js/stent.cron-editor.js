"use strict";

stent.cronEditor = (function() {

  // editors
  let editors = {};
  let defaultDuration = "PT3H";


  const get = function (editorId) {
    updateEditors();
    return editors[editorId];
  };


  const durationPickerSetup = function (value) {
    return {
      seconds: false,
      years: false,
      defaultValue: value ? value : defaultDuration,
      onSelect: function(element, seconds, duration, text) {
        let editorKey = element.closest(".stent-cron-editor").attr("id");
        let cronIndex = element.closest("tr").index() - 1;
        editors[editorKey].crons[cronIndex].duration = duration;
        $(element).val(text);
      }
    };
  };


  const getAll = function () {
    updateEditors();
    return editors;
  };


  const updateEditors = function () {

    for (var key in editors) {

      if ($("#" + key).length > 0) {
        // Update timezone
        editors[key].timezone = $("#" + key + " .stent-cron-timezone").val();

        // Update CRONS data
        let crons = editors[key].crons;
        for (var i = 0; i < crons.length; i++) {
          crons[i].cron = crons[i].jCron.cron("value");
        }
      }

    }

  };


  const timezonesDOM = function (id) {
    /* eslint-disable */
    return `
    <select class="form-control stent-cron-timezone" id="${id}">
      <option value="">Select a timezone</option>
      <option data-offset="-12:00" value="Etc/GMT+12">(GMT -12:00) Etc/GMT+12</option>
      <option data-offset="-11:00" value="Etc/GMT+11">(GMT -11:00) Etc/GMT+11</option>
      <option data-offset="-11:00" value="Pacific/Midway">(GMT -11:00) Pacific/Midway</option>
      <option data-offset="-11:00" value="Pacific/Niue">(GMT -11:00) Pacific/Niue</option>
      <option data-offset="-11:00" value="Pacific/Pago_Pago">(GMT -11:00) Pacific/Pago_Pago</option>
      <option data-offset="-11:00" value="Pacific/Samoa">(GMT -11:00) Pacific/Samoa</option>
      <option data-offset="-11:00" value="US/Samoa">(GMT -11:00) US/Samoa</option>
      <option data-offset="-10:00" value="Etc/GMT+10">(GMT -10:00) Etc/GMT+10</option>
      <option data-offset="-10:00" value="HST">(GMT -10:00) HST</option>
      <option data-offset="-10:00" value="Pacific/Honolulu">(GMT -10:00) Pacific/Honolulu</option>
      <option data-offset="-10:00" value="Pacific/Johnston">(GMT -10:00) Pacific/Johnston</option>
      <option data-offset="-10:00" value="Pacific/Rarotonga">(GMT -10:00) Pacific/Rarotonga</option>
      <option data-offset="-10:00" value="Pacific/Tahiti">(GMT -10:00) Pacific/Tahiti</option>
      <option data-offset="-10:00" value="US/Hawaii">(GMT -10:00) US/Hawaii</option>
      <option data-offset="-09:30" value="Pacific/Marquesas">(GMT -09:30) Pacific/Marquesas</option>
      <option data-offset="-09:00" value="America/Adak">(GMT -09:00) America/Adak</option>
      <option data-offset="-09:00" value="America/Atka">(GMT -09:00) America/Atka</option>
      <option data-offset="-09:00" value="Etc/GMT+9">(GMT -09:00) Etc/GMT+9</option>
      <option data-offset="-09:00" value="Pacific/Gambier">(GMT -09:00) Pacific/Gambier</option>
      <option data-offset="-09:00" value="US/Aleutian">(GMT -09:00) US/Aleutian</option>
      <option data-offset="-08:00" value="America/Anchorage">(GMT -08:00) America/Anchorage</option>
      <option data-offset="-08:00" value="America/Juneau">(GMT -08:00) America/Juneau</option>
      <option data-offset="-08:00" value="America/Metlakatla">(GMT -08:00) America/Metlakatla</option>
      <option data-offset="-08:00" value="America/Nome">(GMT -08:00) America/Nome</option>
      <option data-offset="-08:00" value="America/Sitka">(GMT -08:00) America/Sitka</option>
      <option data-offset="-08:00" value="America/Yakutat">(GMT -08:00) America/Yakutat</option>
      <option data-offset="-08:00" value="Etc/GMT+8">(GMT -08:00) Etc/GMT+8</option>
      <option data-offset="-08:00" value="Pacific/Pitcairn">(GMT -08:00) Pacific/Pitcairn</option>
      <option data-offset="-08:00" value="US/Alaska">(GMT -08:00) US/Alaska</option>
      <option data-offset="-07:00" value="America/Creston">(GMT -07:00) America/Creston</option>
      <option data-offset="-07:00" value="America/Dawson">(GMT -07:00) America/Dawson</option>
      <option data-offset="-07:00" value="America/Dawson_Creek">(GMT -07:00) America/Dawson_Creek</option>
      <option data-offset="-07:00" value="America/Ensenada">(GMT -07:00) America/Ensenada</option>
      <option data-offset="-07:00" value="America/Hermosillo">(GMT -07:00) America/Hermosillo</option>
      <option data-offset="-07:00" value="America/Los_Angeles">(GMT -07:00) America/Los_Angeles</option>
      <option data-offset="-07:00" value="America/Phoenix">(GMT -07:00) America/Phoenix</option>
      <option data-offset="-07:00" value="America/Santa_Isabel">(GMT -07:00) America/Santa_Isabel</option>
      <option data-offset="-07:00" value="America/Tijuana">(GMT -07:00) America/Tijuana</option>
      <option data-offset="-07:00" value="America/Vancouver">(GMT -07:00) America/Vancouver</option>
      <option data-offset="-07:00" value="America/Whitehorse">(GMT -07:00) America/Whitehorse</option>
      <option data-offset="-07:00" value="Canada/Pacific">(GMT -07:00) Canada/Pacific</option>
      <option data-offset="-07:00" value="Canada/Yukon">(GMT -07:00) Canada/Yukon</option>
      <option data-offset="-07:00" value="Etc/GMT+7">(GMT -07:00) Etc/GMT+7</option>
      <option data-offset="-07:00" value="MST">(GMT -07:00) MST</option>
      <option data-offset="-07:00" value="Mexico/BajaNorte">(GMT -07:00) Mexico/BajaNorte</option>
      <option data-offset="-07:00" value="PST8PDT">(GMT -07:00) PST8PDT</option>
      <option data-offset="-07:00" value="US/Arizona">(GMT -07:00) US/Arizona</option>
      <option data-offset="-07:00" value="US/Pacific">(GMT -07:00) US/Pacific</option>
      <option data-offset="-07:00" value="US/Pacific-New">(GMT -07:00) US/Pacific-New</option>
      <option data-offset="-06:00" value="America/Belize">(GMT -06:00) America/Belize</option>
      <option data-offset="-06:00" value="America/Boise">(GMT -06:00) America/Boise</option>
      <option data-offset="-06:00" value="America/Cambridge_Bay">(GMT -06:00) America/Cambridge_Bay</option>
      <option data-offset="-06:00" value="America/Chihuahua">(GMT -06:00) America/Chihuahua</option>
      <option data-offset="-06:00" value="America/Costa_Rica">(GMT -06:00) America/Costa_Rica</option>
      <option data-offset="-06:00" value="America/Denver">(GMT -06:00) America/Denver</option>
      <option data-offset="-06:00" value="America/Edmonton">(GMT -06:00) America/Edmonton</option>
      <option data-offset="-06:00" value="America/El_Salvador">(GMT -06:00) America/El_Salvador</option>
      <option data-offset="-06:00" value="America/Guatemala">(GMT -06:00) America/Guatemala</option>
      <option data-offset="-06:00" value="America/Inuvik">(GMT -06:00) America/Inuvik</option>
      <option data-offset="-06:00" value="America/Managua">(GMT -06:00) America/Managua</option>
      <option data-offset="-06:00" value="America/Mazatlan">(GMT -06:00) America/Mazatlan</option>
      <option data-offset="-06:00" value="America/Ojinaga">(GMT -06:00) America/Ojinaga</option>
      <option data-offset="-06:00" value="America/Regina">(GMT -06:00) America/Regina</option>
      <option data-offset="-06:00" value="America/Shiprock">(GMT -06:00) America/Shiprock</option>
      <option data-offset="-06:00" value="America/Swift_Current">(GMT -06:00) America/Swift_Current</option>
      <option data-offset="-06:00" value="America/Tegucigalpa">(GMT -06:00) America/Tegucigalpa</option>
      <option data-offset="-06:00" value="America/Yellowknife">(GMT -06:00) America/Yellowknife</option>
      <option data-offset="-06:00" value="Canada/East-Saskatchewan">(GMT -06:00) Canada/East-Saskatchewan</option>
      <option data-offset="-06:00" value="Canada/Mountain">(GMT -06:00) Canada/Mountain</option>
      <option data-offset="-06:00" value="Canada/Saskatchewan">(GMT -06:00) Canada/Saskatchewan</option>
      <option data-offset="-06:00" value="Chile/EasterIsland">(GMT -06:00) Chile/EasterIsland</option>
      <option data-offset="-06:00" value="Etc/GMT+6">(GMT -06:00) Etc/GMT+6</option>
      <option data-offset="-06:00" value="MST7MDT">(GMT -06:00) MST7MDT</option>
      <option data-offset="-06:00" value="Mexico/BajaSur">(GMT -06:00) Mexico/BajaSur</option>
      <option data-offset="-06:00" value="Navajo">(GMT -06:00) Navajo</option>
      <option data-offset="-06:00" value="Pacific/Easter">(GMT -06:00) Pacific/Easter</option>
      <option data-offset="-06:00" value="Pacific/Galapagos">(GMT -06:00) Pacific/Galapagos</option>
      <option data-offset="-06:00" value="US/Mountain">(GMT -06:00) US/Mountain</option>
      <option data-offset="-05:00" value="America/Atikokan">(GMT -05:00) America/Atikokan</option>
      <option data-offset="-05:00" value="America/Bahia_Banderas">(GMT -05:00) America/Bahia_Banderas</option>
      <option data-offset="-05:00" value="America/Bogota">(GMT -05:00) America/Bogota</option>
      <option data-offset="-05:00" value="America/Cancun">(GMT -05:00) America/Cancun</option>
      <option data-offset="-05:00" value="America/Cayman">(GMT -05:00) America/Cayman</option>
      <option data-offset="-05:00" value="America/Chicago">(GMT -05:00) America/Chicago</option>
      <option data-offset="-05:00" value="America/Coral_Harbour">(GMT -05:00) America/Coral_Harbour</option>
      <option data-offset="-05:00" value="America/Eirunepe">(GMT -05:00) America/Eirunepe</option>
      <option data-offset="-05:00" value="America/Guayaquil">(GMT -05:00) America/Guayaquil</option>
      <option data-offset="-05:00" value="America/Indiana/Knox">(GMT -05:00) America/Indiana/Knox</option>
      <option data-offset="-05:00" value="America/Indiana/Tell_City">(GMT -05:00) America/Indiana/Tell_City</option>
      <option data-offset="-05:00" value="America/Jamaica">(GMT -05:00) America/Jamaica</option>
      <option data-offset="-05:00" value="America/Knox_IN">(GMT -05:00) America/Knox_IN</option>
      <option data-offset="-05:00" value="America/Lima">(GMT -05:00) America/Lima</option>
      <option data-offset="-05:00" value="America/Matamoros">(GMT -05:00) America/Matamoros</option>
      <option data-offset="-05:00" value="America/Menominee">(GMT -05:00) America/Menominee</option>
      <option data-offset="-05:00" value="America/Merida">(GMT -05:00) America/Merida</option>
      <option data-offset="-05:00" value="America/Mexico_City">(GMT -05:00) America/Mexico_City</option>
      <option data-offset="-05:00" value="America/Monterrey">(GMT -05:00) America/Monterrey</option>
      <option data-offset="-05:00" value="America/North_Dakota/Beulah">(GMT -05:00) America/North_Dakota/Beulah</option>
      <option data-offset="-05:00" value="America/North_Dakota/Center">(GMT -05:00) America/North_Dakota/Center</option>
      <option data-offset="-05:00" value="America/North_Dakota/New_Salem">(GMT -05:00) America/North_Dakota/New_Salem</option>
      <option data-offset="-05:00" value="America/Panama">(GMT -05:00) America/Panama</option>
      <option data-offset="-05:00" value="America/Porto_Acre">(GMT -05:00) America/Porto_Acre</option>
      <option data-offset="-05:00" value="America/Rainy_River">(GMT -05:00) America/Rainy_River</option>
      <option data-offset="-05:00" value="America/Rankin_Inlet">(GMT -05:00) America/Rankin_Inlet</option>
      <option data-offset="-05:00" value="America/Resolute">(GMT -05:00) America/Resolute</option>
      <option data-offset="-05:00" value="America/Rio_Branco">(GMT -05:00) America/Rio_Branco</option>
      <option data-offset="-05:00" value="America/Winnipeg">(GMT -05:00) America/Winnipeg</option>
      <option data-offset="-05:00" value="Brazil/Acre">(GMT -05:00) Brazil/Acre</option>
      <option data-offset="-05:00" value="CST6CDT">(GMT -05:00) CST6CDT</option>
      <option data-offset="-05:00" value="Canada/Central">(GMT -05:00) Canada/Central</option>
      <option data-offset="-05:00" value="EST">(GMT -05:00) EST</option>
      <option data-offset="-05:00" value="Etc/GMT+5">(GMT -05:00) Etc/GMT+5</option>
      <option data-offset="-05:00" value="Jamaica">(GMT -05:00) Jamaica</option>
      <option data-offset="-05:00" value="Mexico/General">(GMT -05:00) Mexico/General</option>
      <option data-offset="-05:00" value="US/Central">(GMT -05:00) US/Central</option>
      <option data-offset="-05:00" value="US/Indiana-Starke">(GMT -05:00) US/Indiana-Starke</option>
      <option data-offset="-04:30" value="America/Caracas">(GMT -04:30) America/Caracas</option>
      <option data-offset="-04:00" value="America/Anguilla">(GMT -04:00) America/Anguilla</option>
      <option data-offset="-04:00" value="America/Antigua">(GMT -04:00) America/Antigua</option>
      <option data-offset="-04:00" value="America/Aruba">(GMT -04:00) America/Aruba</option>
      <option data-offset="-04:00" value="America/Asuncion">(GMT -04:00) America/Asuncion</option>
      <option data-offset="-04:00" value="America/Barbados">(GMT -04:00) America/Barbados</option>
      <option data-offset="-04:00" value="America/Blanc-Sablon">(GMT -04:00) America/Blanc-Sablon</option>
      <option data-offset="-04:00" value="America/Boa_Vista">(GMT -04:00) America/Boa_Vista</option>
      <option data-offset="-04:00" value="America/Campo_Grande">(GMT -04:00) America/Campo_Grande</option>
      <option data-offset="-04:00" value="America/Cuiaba">(GMT -04:00) America/Cuiaba</option>
      <option data-offset="-04:00" value="America/Curacao">(GMT -04:00) America/Curacao</option>
      <option data-offset="-04:00" value="America/Detroit">(GMT -04:00) America/Detroit</option>
      <option data-offset="-04:00" value="America/Dominica">(GMT -04:00) America/Dominica</option>
      <option data-offset="-04:00" value="America/Fort_Wayne">(GMT -04:00) America/Fort_Wayne</option>
      <option data-offset="-04:00" value="America/Grand_Turk">(GMT -04:00) America/Grand_Turk</option>
      <option data-offset="-04:00" value="America/Grenada">(GMT -04:00) America/Grenada</option>
      <option data-offset="-04:00" value="America/Guadeloupe">(GMT -04:00) America/Guadeloupe</option>
      <option data-offset="-04:00" value="America/Guyana">(GMT -04:00) America/Guyana</option>
      <option data-offset="-04:00" value="America/Havana">(GMT -04:00) America/Havana</option>
      <option data-offset="-04:00" value="America/Indiana/Indianapolis">(GMT -04:00) America/Indiana/Indianapolis</option>
      <option data-offset="-04:00" value="America/Indiana/Marengo">(GMT -04:00) America/Indiana/Marengo</option>
      <option data-offset="-04:00" value="America/Indiana/Petersburg">(GMT -04:00) America/Indiana/Petersburg</option>
      <option data-offset="-04:00" value="America/Indiana/Vevay">(GMT -04:00) America/Indiana/Vevay</option>
      <option data-offset="-04:00" value="America/Indiana/Vincennes">(GMT -04:00) America/Indiana/Vincennes</option>
      <option data-offset="-04:00" value="America/Indiana/Winamac">(GMT -04:00) America/Indiana/Winamac</option>
      <option data-offset="-04:00" value="America/Indianapolis">(GMT -04:00) America/Indianapolis</option>
      <option data-offset="-04:00" value="America/Iqaluit">(GMT -04:00) America/Iqaluit</option>
      <option data-offset="-04:00" value="America/Kentucky/Louisville">(GMT -04:00) America/Kentucky/Louisville</option>
      <option data-offset="-04:00" value="America/Kentucky/Monticello">(GMT -04:00) America/Kentucky/Monticello</option>
      <option data-offset="-04:00" value="America/Kralendijk">(GMT -04:00) America/Kralendijk</option>
      <option data-offset="-04:00" value="America/La_Paz">(GMT -04:00) America/La_Paz</option>
      <option data-offset="-04:00" value="America/Louisville">(GMT -04:00) America/Louisville</option>
      <option data-offset="-04:00" value="America/Lower_Princes">(GMT -04:00) America/Lower_Princes</option>
      <option data-offset="-04:00" value="America/Manaus">(GMT -04:00) America/Manaus</option>
      <option data-offset="-04:00" value="America/Marigot">(GMT -04:00) America/Marigot</option>
      <option data-offset="-04:00" value="America/Martinique">(GMT -04:00) America/Martinique</option>
      <option data-offset="-04:00" value="America/Montreal">(GMT -04:00) America/Montreal</option>
      <option data-offset="-04:00" value="America/Montserrat">(GMT -04:00) America/Montserrat</option>
      <option data-offset="-04:00" value="America/Nassau">(GMT -04:00) America/Nassau</option>
      <option data-offset="-04:00" value="America/New_York">(GMT -04:00) America/New_York</option>
      <option data-offset="-04:00" value="America/Nipigon">(GMT -04:00) America/Nipigon</option>
      <option data-offset="-04:00" value="America/Pangnirtung">(GMT -04:00) America/Pangnirtung</option>
      <option data-offset="-04:00" value="America/Port-au-Prince">(GMT -04:00) America/Port-au-Prince</option>
      <option data-offset="-04:00" value="America/Port_of_Spain">(GMT -04:00) America/Port_of_Spain</option>
      <option data-offset="-04:00" value="America/Porto_Velho">(GMT -04:00) America/Porto_Velho</option>
      <option data-offset="-04:00" value="America/Puerto_Rico">(GMT -04:00) America/Puerto_Rico</option>
      <option data-offset="-04:00" value="America/Santiago">(GMT -04:00) America/Santiago</option>
      <option data-offset="-04:00" value="America/Santo_Domingo">(GMT -04:00) America/Santo_Domingo</option>
      <option data-offset="-04:00" value="America/St_Barthelemy">(GMT -04:00) America/St_Barthelemy</option>
      <option data-offset="-04:00" value="America/St_Kitts">(GMT -04:00) America/St_Kitts</option>
      <option data-offset="-04:00" value="America/St_Lucia">(GMT -04:00) America/St_Lucia</option>
      <option data-offset="-04:00" value="America/St_Thomas">(GMT -04:00) America/St_Thomas</option>
      <option data-offset="-04:00" value="America/St_Vincent">(GMT -04:00) America/St_Vincent</option>
      <option data-offset="-04:00" value="America/Thunder_Bay">(GMT -04:00) America/Thunder_Bay</option>
      <option data-offset="-04:00" value="America/Toronto">(GMT -04:00) America/Toronto</option>
      <option data-offset="-04:00" value="America/Tortola">(GMT -04:00) America/Tortola</option>
      <option data-offset="-04:00" value="America/Virgin">(GMT -04:00) America/Virgin</option>
      <option data-offset="-04:00" value="Antarctica/Palmer">(GMT -04:00) Antarctica/Palmer</option>
      <option data-offset="-04:00" value="Brazil/West">(GMT -04:00) Brazil/West</option>
      <option data-offset="-04:00" value="Canada/Eastern">(GMT -04:00) Canada/Eastern</option>
      <option data-offset="-04:00" value="Chile/Continental">(GMT -04:00) Chile/Continental</option>
      <option data-offset="-04:00" value="Cuba">(GMT -04:00) Cuba</option>
      <option data-offset="-04:00" value="EST5EDT">(GMT -04:00) EST5EDT</option>
      <option data-offset="-04:00" value="Etc/GMT+4">(GMT -04:00) Etc/GMT+4</option>
      <option data-offset="-04:00" value="US/East-Indiana">(GMT -04:00) US/East-Indiana</option>
      <option data-offset="-04:00" value="US/Eastern">(GMT -04:00) US/Eastern</option>
      <option data-offset="-04:00" value="US/Michigan">(GMT -04:00) US/Michigan</option>
      <option data-offset="-03:00" value="America/Araguaina">(GMT -03:00) America/Araguaina</option>
      <option data-offset="-03:00" value="America/Argentina/Buenos_Aires">(GMT -03:00) America/Argentina/Buenos_Aires</option>
      <option data-offset="-03:00" value="America/Argentina/Catamarca">(GMT -03:00) America/Argentina/Catamarca</option>
      <option data-offset="-03:00" value="America/Argentina/ComodRivadavia">(GMT -03:00) America/Argentina/ComodRivadavia</option>
      <option data-offset="-03:00" value="America/Argentina/Cordoba">(GMT -03:00) America/Argentina/Cordoba</option>
      <option data-offset="-03:00" value="America/Argentina/Jujuy">(GMT -03:00) America/Argentina/Jujuy</option>
      <option data-offset="-03:00" value="America/Argentina/La_Rioja">(GMT -03:00) America/Argentina/La_Rioja</option>
      <option data-offset="-03:00" value="America/Argentina/Mendoza">(GMT -03:00) America/Argentina/Mendoza</option>
      <option data-offset="-03:00" value="America/Argentina/Rio_Gallegos">(GMT -03:00) America/Argentina/Rio_Gallegos</option>
      <option data-offset="-03:00" value="America/Argentina/Salta">(GMT -03:00) America/Argentina/Salta</option>
      <option data-offset="-03:00" value="America/Argentina/San_Juan">(GMT -03:00) America/Argentina/San_Juan</option>
      <option data-offset="-03:00" value="America/Argentina/San_Luis">(GMT -03:00) America/Argentina/San_Luis</option>
      <option data-offset="-03:00" value="America/Argentina/Tucuman">(GMT -03:00) America/Argentina/Tucuman</option>
      <option data-offset="-03:00" value="America/Argentina/Ushuaia">(GMT -03:00) America/Argentina/Ushuaia</option>
      <option data-offset="-03:00" value="America/Bahia">(GMT -03:00) America/Bahia</option>
      <option data-offset="-03:00" value="America/Belem">(GMT -03:00) America/Belem</option>
      <option data-offset="-03:00" value="America/Buenos_Aires">(GMT -03:00) America/Buenos_Aires</option>
      <option data-offset="-03:00" value="America/Catamarca">(GMT -03:00) America/Catamarca</option>
      <option data-offset="-03:00" value="America/Cayenne">(GMT -03:00) America/Cayenne</option>
      <option data-offset="-03:00" value="America/Cordoba">(GMT -03:00) America/Cordoba</option>
      <option data-offset="-03:00" value="America/Fortaleza">(GMT -03:00) America/Fortaleza</option>
      <option data-offset="-03:00" value="America/Glace_Bay">(GMT -03:00) America/Glace_Bay</option>
      <option data-offset="-03:00" value="America/Goose_Bay">(GMT -03:00) America/Goose_Bay</option>
      <option data-offset="-03:00" value="America/Halifax">(GMT -03:00) America/Halifax</option>
      <option data-offset="-03:00" value="America/Jujuy">(GMT -03:00) America/Jujuy</option>
      <option data-offset="-03:00" value="America/Maceio">(GMT -03:00) America/Maceio</option>
      <option data-offset="-03:00" value="America/Mendoza">(GMT -03:00) America/Mendoza</option>
      <option data-offset="-03:00" value="America/Moncton">(GMT -03:00) America/Moncton</option>
      <option data-offset="-03:00" value="America/Montevideo">(GMT -03:00) America/Montevideo</option>
      <option data-offset="-03:00" value="America/Paramaribo">(GMT -03:00) America/Paramaribo</option>
      <option data-offset="-03:00" value="America/Recife">(GMT -03:00) America/Recife</option>
      <option data-offset="-03:00" value="America/Rosario">(GMT -03:00) America/Rosario</option>
      <option data-offset="-03:00" value="America/Santarem">(GMT -03:00) America/Santarem</option>
      <option data-offset="-03:00" value="America/Sao_Paulo">(GMT -03:00) America/Sao_Paulo</option>
      <option data-offset="-03:00" value="America/Thule">(GMT -03:00) America/Thule</option>
      <option data-offset="-03:00" value="Antarctica/Rothera">(GMT -03:00) Antarctica/Rothera</option>
      <option data-offset="-03:00" value="Atlantic/Bermuda">(GMT -03:00) Atlantic/Bermuda</option>
      <option data-offset="-03:00" value="Atlantic/Stanley">(GMT -03:00) Atlantic/Stanley</option>
      <option data-offset="-03:00" value="Brazil/East">(GMT -03:00) Brazil/East</option>
      <option data-offset="-03:00" value="Canada/Atlantic">(GMT -03:00) Canada/Atlantic</option>
      <option data-offset="-03:00" value="Etc/GMT+3">(GMT -03:00) Etc/GMT+3</option>
      <option data-offset="-02:30" value="America/St_Johns">(GMT -02:30) America/St_Johns</option>
      <option data-offset="-02:30" value="Canada/Newfoundland">(GMT -02:30) Canada/Newfoundland</option>
      <option data-offset="-02:00" value="America/Godthab">(GMT -02:00) America/Godthab</option>
      <option data-offset="-02:00" value="America/Miquelon">(GMT -02:00) America/Miquelon</option>
      <option data-offset="-02:00" value="America/Noronha">(GMT -02:00) America/Noronha</option>
      <option data-offset="-02:00" value="Atlantic/South_Georgia">(GMT -02:00) Atlantic/South_Georgia</option>
      <option data-offset="-02:00" value="Brazil/DeNoronha">(GMT -02:00) Brazil/DeNoronha</option>
      <option data-offset="-02:00" value="Etc/GMT+2">(GMT -02:00) Etc/GMT+2</option>
      <option data-offset="-01:00" value="Atlantic/Cape_Verde">(GMT -01:00) Atlantic/Cape_Verde</option>
      <option data-offset="-01:00" value="Etc/GMT+1">(GMT -01:00) Etc/GMT+1</option>
      <option data-offset="+00:00" value="Africa/Abidjan">(GMT +00:00) Africa/Abidjan</option>
      <option data-offset="+00:00" value="Africa/Accra">(GMT +00:00) Africa/Accra</option>
      <option data-offset="+00:00" value="Africa/Bamako">(GMT +00:00) Africa/Bamako</option>
      <option data-offset="+00:00" value="Africa/Banjul">(GMT +00:00) Africa/Banjul</option>
      <option data-offset="+00:00" value="Africa/Bissau">(GMT +00:00) Africa/Bissau</option>
      <option data-offset="+00:00" value="Africa/Conakry">(GMT +00:00) Africa/Conakry</option>
      <option data-offset="+00:00" value="Africa/Dakar">(GMT +00:00) Africa/Dakar</option>
      <option data-offset="+00:00" value="Africa/Freetown">(GMT +00:00) Africa/Freetown</option>
      <option data-offset="+00:00" value="Africa/Lome">(GMT +00:00) Africa/Lome</option>
      <option data-offset="+00:00" value="Africa/Monrovia">(GMT +00:00) Africa/Monrovia</option>
      <option data-offset="+00:00" value="Africa/Nouakchott">(GMT +00:00) Africa/Nouakchott</option>
      <option data-offset="+00:00" value="Africa/Ouagadougou">(GMT +00:00) Africa/Ouagadougou</option>
      <option data-offset="+00:00" value="Africa/Sao_Tome">(GMT +00:00) Africa/Sao_Tome</option>
      <option data-offset="+00:00" value="Africa/Timbuktu">(GMT +00:00) Africa/Timbuktu</option>
      <option data-offset="+00:00" value="America/Danmarkshavn">(GMT +00:00) America/Danmarkshavn</option>
      <option data-offset="+00:00" value="America/Scoresbysund">(GMT +00:00) America/Scoresbysund</option>
      <option data-offset="+00:00" value="Atlantic/Azores">(GMT +00:00) Atlantic/Azores</option>
      <option data-offset="+00:00" value="Atlantic/Reykjavik">(GMT +00:00) Atlantic/Reykjavik</option>
      <option data-offset="+00:00" value="Atlantic/St_Helena">(GMT +00:00) Atlantic/St_Helena</option>
      <option data-offset="+00:00" value="Etc/GMT">(GMT +00:00) Etc/GMT</option>
      <option data-offset="+00:00" value="Etc/GMT+0">(GMT +00:00) Etc/GMT+0</option>
      <option data-offset="+00:00" value="Etc/GMT-0">(GMT +00:00) Etc/GMT-0</option>
      <option data-offset="+00:00" value="Etc/GMT0">(GMT +00:00) Etc/GMT0</option>
      <option data-offset="+00:00" value="Etc/Greenwich">(GMT +00:00) Etc/Greenwich</option>
      <option data-offset="+00:00" value="Etc/UCT">(GMT +00:00) Etc/UCT</option>
      <option data-offset="+00:00" value="Etc/UTC">(GMT +00:00) Etc/UTC</option>
      <option data-offset="+00:00" value="Etc/Universal">(GMT +00:00) Etc/Universal</option>
      <option data-offset="+00:00" value="Etc/Zulu">(GMT +00:00) Etc/Zulu</option>
      <option data-offset="+00:00" value="GMT">(GMT +00:00) GMT</option>
      <option data-offset="+00:00" value="GMT+0">(GMT +00:00) GMT+0</option>
      <option data-offset="+00:00" value="GMT-0">(GMT +00:00) GMT-0</option>
      <option data-offset="+00:00" value="GMT0">(GMT +00:00) GMT0</option>
      <option data-offset="+00:00" value="Greenwich">(GMT +00:00) Greenwich</option>
      <option data-offset="+00:00" value="Iceland">(GMT +00:00) Iceland</option>
      <option data-offset="+00:00" value="UCT">(GMT +00:00) UCT</option>
      <option data-offset="+00:00" value="UTC">(GMT +00:00) UTC</option>
      <option data-offset="+00:00" value="Universal">(GMT +00:00) Universal</option>
      <option data-offset="+00:00" value="Zulu">(GMT +00:00) Zulu</option>
      <option data-offset="+01:00" value="Africa/Algiers">(GMT +01:00) Africa/Algiers</option>
      <option data-offset="+01:00" value="Africa/Bangui">(GMT +01:00) Africa/Bangui</option>
      <option data-offset="+01:00" value="Africa/Brazzaville">(GMT +01:00) Africa/Brazzaville</option>
      <option data-offset="+01:00" value="Africa/Casablanca">(GMT +01:00) Africa/Casablanca</option>
      <option data-offset="+01:00" value="Africa/Douala">(GMT +01:00) Africa/Douala</option>
      <option data-offset="+01:00" value="Africa/El_Aaiun">(GMT +01:00) Africa/El_Aaiun</option>
      <option data-offset="+01:00" value="Africa/Kinshasa">(GMT +01:00) Africa/Kinshasa</option>
      <option data-offset="+01:00" value="Africa/Lagos">(GMT +01:00) Africa/Lagos</option>
      <option data-offset="+01:00" value="Africa/Libreville">(GMT +01:00) Africa/Libreville</option>
      <option data-offset="+01:00" value="Africa/Luanda">(GMT +01:00) Africa/Luanda</option>
      <option data-offset="+01:00" value="Africa/Malabo">(GMT +01:00) Africa/Malabo</option>
      <option data-offset="+01:00" value="Africa/Ndjamena">(GMT +01:00) Africa/Ndjamena</option>
      <option data-offset="+01:00" value="Africa/Niamey">(GMT +01:00) Africa/Niamey</option>
      <option data-offset="+01:00" value="Africa/Porto-Novo">(GMT +01:00) Africa/Porto-Novo</option>
      <option data-offset="+01:00" value="Africa/Tunis">(GMT +01:00) Africa/Tunis</option>
      <option data-offset="+01:00" value="Africa/Windhoek">(GMT +01:00) Africa/Windhoek</option>
      <option data-offset="+01:00" value="Atlantic/Canary">(GMT +01:00) Atlantic/Canary</option>
      <option data-offset="+01:00" value="Atlantic/Faeroe">(GMT +01:00) Atlantic/Faeroe</option>
      <option data-offset="+01:00" value="Atlantic/Faroe">(GMT +01:00) Atlantic/Faroe</option>
      <option data-offset="+01:00" value="Atlantic/Madeira">(GMT +01:00) Atlantic/Madeira</option>
      <option data-offset="+01:00" value="Eire">(GMT +01:00) Eire</option>
      <option data-offset="+01:00" value="Etc/GMT-1">(GMT +01:00) Etc/GMT-1</option>
      <option data-offset="+01:00" value="Europe/Belfast">(GMT +01:00) Europe/Belfast</option>
      <option data-offset="+01:00" value="Europe/Dublin">(GMT +01:00) Europe/Dublin</option>
      <option data-offset="+01:00" value="Europe/Guernsey">(GMT +01:00) Europe/Guernsey</option>
      <option data-offset="+01:00" value="Europe/Isle_of_Man">(GMT +01:00) Europe/Isle_of_Man</option>
      <option data-offset="+01:00" value="Europe/Jersey">(GMT +01:00) Europe/Jersey</option>
      <option data-offset="+01:00" value="Europe/Lisbon">(GMT +01:00) Europe/Lisbon</option>
      <option data-offset="+01:00" value="Europe/London">(GMT +01:00) Europe/London</option>
      <option data-offset="+01:00" value="GB">(GMT +01:00) GB</option>
      <option data-offset="+01:00" value="GB-Eire">(GMT +01:00) GB-Eire</option>
      <option data-offset="+01:00" value="Portugal">(GMT +01:00) Portugal</option>
      <option data-offset="+01:00" value="WET">(GMT +01:00) WET</option>
      <option data-offset="+02:00" value="Africa/Blantyre">(GMT +02:00) Africa/Blantyre</option>
      <option data-offset="+02:00" value="Africa/Bujumbura">(GMT +02:00) Africa/Bujumbura</option>
      <option data-offset="+02:00" value="Africa/Ceuta">(GMT +02:00) Africa/Ceuta</option>
      <option data-offset="+02:00" value="Africa/Gaborone">(GMT +02:00) Africa/Gaborone</option>
      <option data-offset="+02:00" value="Africa/Harare">(GMT +02:00) Africa/Harare</option>
      <option data-offset="+02:00" value="Africa/Johannesburg">(GMT +02:00) Africa/Johannesburg</option>
      <option data-offset="+02:00" value="Africa/Kigali">(GMT +02:00) Africa/Kigali</option>
      <option data-offset="+02:00" value="Africa/Lubumbashi">(GMT +02:00) Africa/Lubumbashi</option>
      <option data-offset="+02:00" value="Africa/Lusaka">(GMT +02:00) Africa/Lusaka</option>
      <option data-offset="+02:00" value="Africa/Maputo">(GMT +02:00) Africa/Maputo</option>
      <option data-offset="+02:00" value="Africa/Maseru">(GMT +02:00) Africa/Maseru</option>
      <option data-offset="+02:00" value="Africa/Mbabane">(GMT +02:00) Africa/Mbabane</option>
      <option data-offset="+02:00" value="Africa/Tripoli">(GMT +02:00) Africa/Tripoli</option>
      <option data-offset="+02:00" value="Antarctica/Troll">(GMT +02:00) Antarctica/Troll</option>
      <option data-offset="+02:00" value="Arctic/Longyearbyen">(GMT +02:00) Arctic/Longyearbyen</option>
      <option data-offset="+02:00" value="Atlantic/Jan_Mayen">(GMT +02:00) Atlantic/Jan_Mayen</option>
      <option data-offset="+02:00" value="CET">(GMT +02:00) CET</option>
      <option data-offset="+02:00" value="Etc/GMT-2">(GMT +02:00) Etc/GMT-2</option>
      <option data-offset="+02:00" value="Europe/Amsterdam">(GMT +02:00) Europe/Amsterdam</option>
      <option data-offset="+02:00" value="Europe/Andorra">(GMT +02:00) Europe/Andorra</option>
      <option data-offset="+02:00" value="Europe/Belgrade">(GMT +02:00) Europe/Belgrade</option>
      <option data-offset="+02:00" value="Europe/Berlin">(GMT +02:00) Europe/Berlin</option>
      <option data-offset="+02:00" value="Europe/Bratislava">(GMT +02:00) Europe/Bratislava</option>
      <option data-offset="+02:00" value="Europe/Brussels">(GMT +02:00) Europe/Brussels</option>
      <option data-offset="+02:00" value="Europe/Budapest">(GMT +02:00) Europe/Budapest</option>
      <option data-offset="+02:00" value="Europe/Busingen">(GMT +02:00) Europe/Busingen</option>
      <option data-offset="+02:00" value="Europe/Copenhagen">(GMT +02:00) Europe/Copenhagen</option>
      <option data-offset="+02:00" value="Europe/Gibraltar">(GMT +02:00) Europe/Gibraltar</option>
      <option data-offset="+02:00" value="Europe/Kaliningrad">(GMT +02:00) Europe/Kaliningrad</option>
      <option data-offset="+02:00" value="Europe/Ljubljana">(GMT +02:00) Europe/Ljubljana</option>
      <option data-offset="+02:00" value="Europe/Luxembourg">(GMT +02:00) Europe/Luxembourg</option>
      <option data-offset="+02:00" value="Europe/Madrid">(GMT +02:00) Europe/Madrid</option>
      <option data-offset="+02:00" value="Europe/Malta">(GMT +02:00) Europe/Malta</option>
      <option data-offset="+02:00" value="Europe/Monaco">(GMT +02:00) Europe/Monaco</option>
      <option data-offset="+02:00" value="Europe/Oslo">(GMT +02:00) Europe/Oslo</option>
      <option data-offset="+02:00" value="Europe/Paris">(GMT +02:00) Europe/Paris</option>
      <option data-offset="+02:00" value="Europe/Podgorica">(GMT +02:00) Europe/Podgorica</option>
      <option data-offset="+02:00" value="Europe/Prague">(GMT +02:00) Europe/Prague</option>
      <option data-offset="+02:00" value="Europe/Rome">(GMT +02:00) Europe/Rome</option>
      <option data-offset="+02:00" value="Europe/San_Marino">(GMT +02:00) Europe/San_Marino</option>
      <option data-offset="+02:00" value="Europe/Sarajevo">(GMT +02:00) Europe/Sarajevo</option>
      <option data-offset="+02:00" value="Europe/Skopje">(GMT +02:00) Europe/Skopje</option>
      <option data-offset="+02:00" value="Europe/Stockholm">(GMT +02:00) Europe/Stockholm</option>
      <option data-offset="+02:00" value="Europe/Tirane">(GMT +02:00) Europe/Tirane</option>
      <option data-offset="+02:00" value="Europe/Vaduz">(GMT +02:00) Europe/Vaduz</option>
      <option data-offset="+02:00" value="Europe/Vatican">(GMT +02:00) Europe/Vatican</option>
      <option data-offset="+02:00" value="Europe/Vienna">(GMT +02:00) Europe/Vienna</option>
      <option data-offset="+02:00" value="Europe/Warsaw">(GMT +02:00) Europe/Warsaw</option>
      <option data-offset="+02:00" value="Europe/Zagreb">(GMT +02:00) Europe/Zagreb</option>
      <option data-offset="+02:00" value="Europe/Zurich">(GMT +02:00) Europe/Zurich</option>
      <option data-offset="+02:00" value="Libya">(GMT +02:00) Libya</option>
      <option data-offset="+02:00" value="MET">(GMT +02:00) MET</option>
      <option data-offset="+02:00" value="Poland">(GMT +02:00) Poland</option>
      <option data-offset="+03:00" value="Africa/Addis_Ababa">(GMT +03:00) Africa/Addis_Ababa</option>
      <option data-offset="+03:00" value="Africa/Asmara">(GMT +03:00) Africa/Asmara</option>
      <option data-offset="+03:00" value="Africa/Asmera">(GMT +03:00) Africa/Asmera</option>
      <option data-offset="+03:00" value="Africa/Cairo">(GMT +03:00) Africa/Cairo</option>
      <option data-offset="+03:00" value="Africa/Dar_es_Salaam">(GMT +03:00) Africa/Dar_es_Salaam</option>
      <option data-offset="+03:00" value="Africa/Djibouti">(GMT +03:00) Africa/Djibouti</option>
      <option data-offset="+03:00" value="Africa/Juba">(GMT +03:00) Africa/Juba</option>
      <option data-offset="+03:00" value="Africa/Kampala">(GMT +03:00) Africa/Kampala</option>
      <option data-offset="+03:00" value="Africa/Khartoum">(GMT +03:00) Africa/Khartoum</option>
      <option data-offset="+03:00" value="Africa/Mogadishu">(GMT +03:00) Africa/Mogadishu</option>
      <option data-offset="+03:00" value="Africa/Nairobi">(GMT +03:00) Africa/Nairobi</option>
      <option data-offset="+03:00" value="Antarctica/Syowa">(GMT +03:00) Antarctica/Syowa</option>
      <option data-offset="+03:00" value="Asia/Aden">(GMT +03:00) Asia/Aden</option>
      <option data-offset="+03:00" value="Asia/Amman">(GMT +03:00) Asia/Amman</option>
      <option data-offset="+03:00" value="Asia/Baghdad">(GMT +03:00) Asia/Baghdad</option>
      <option data-offset="+03:00" value="Asia/Bahrain">(GMT +03:00) Asia/Bahrain</option>
      <option data-offset="+03:00" value="Asia/Beirut">(GMT +03:00) Asia/Beirut</option>
      <option data-offset="+03:00" value="Asia/Damascus">(GMT +03:00) Asia/Damascus</option>
      <option data-offset="+03:00" value="Asia/Gaza">(GMT +03:00) Asia/Gaza</option>
      <option data-offset="+03:00" value="Asia/Hebron">(GMT +03:00) Asia/Hebron</option>
      <option data-offset="+03:00" value="Asia/Istanbul">(GMT +03:00) Asia/Istanbul</option>
      <option data-offset="+03:00" value="Asia/Jerusalem">(GMT +03:00) Asia/Jerusalem</option>
      <option data-offset="+03:00" value="Asia/Kuwait">(GMT +03:00) Asia/Kuwait</option>
      <option data-offset="+03:00" value="Asia/Nicosia">(GMT +03:00) Asia/Nicosia</option>
      <option data-offset="+03:00" value="Asia/Qatar">(GMT +03:00) Asia/Qatar</option>
      <option data-offset="+03:00" value="Asia/Riyadh">(GMT +03:00) Asia/Riyadh</option>
      <option data-offset="+03:00" value="Asia/Tel_Aviv">(GMT +03:00) Asia/Tel_Aviv</option>
      <option data-offset="+03:00" value="EET">(GMT +03:00) EET</option>
      <option data-offset="+03:00" value="Egypt">(GMT +03:00) Egypt</option>
      <option data-offset="+03:00" value="Etc/GMT-3">(GMT +03:00) Etc/GMT-3</option>
      <option data-offset="+03:00" value="Europe/Athens">(GMT +03:00) Europe/Athens</option>
      <option data-offset="+03:00" value="Europe/Bucharest">(GMT +03:00) Europe/Bucharest</option>
      <option data-offset="+03:00" value="Europe/Chisinau">(GMT +03:00) Europe/Chisinau</option>
      <option data-offset="+03:00" value="Europe/Helsinki">(GMT +03:00) Europe/Helsinki</option>
      <option data-offset="+03:00" value="Europe/Istanbul">(GMT +03:00) Europe/Istanbul</option>
      <option data-offset="+03:00" value="Europe/Kiev">(GMT +03:00) Europe/Kiev</option>
      <option data-offset="+03:00" value="Europe/Mariehamn">(GMT +03:00) Europe/Mariehamn</option>
      <option data-offset="+03:00" value="Europe/Minsk">(GMT +03:00) Europe/Minsk</option>
      <option data-offset="+03:00" value="Europe/Moscow">(GMT +03:00) Europe/Moscow</option>
      <option data-offset="+03:00" value="Europe/Nicosia">(GMT +03:00) Europe/Nicosia</option>
      <option data-offset="+03:00" value="Europe/Riga">(GMT +03:00) Europe/Riga</option>
      <option data-offset="+03:00" value="Europe/Simferopol">(GMT +03:00) Europe/Simferopol</option>
      <option data-offset="+03:00" value="Europe/Sofia">(GMT +03:00) Europe/Sofia</option>
      <option data-offset="+03:00" value="Europe/Tallinn">(GMT +03:00) Europe/Tallinn</option>
      <option data-offset="+03:00" value="Europe/Tiraspol">(GMT +03:00) Europe/Tiraspol</option>
      <option data-offset="+03:00" value="Europe/Uzhgorod">(GMT +03:00) Europe/Uzhgorod</option>
      <option data-offset="+03:00" value="Europe/Vilnius">(GMT +03:00) Europe/Vilnius</option>
      <option data-offset="+03:00" value="Europe/Volgograd">(GMT +03:00) Europe/Volgograd</option>
      <option data-offset="+03:00" value="Europe/Zaporozhye">(GMT +03:00) Europe/Zaporozhye</option>
      <option data-offset="+03:00" value="Indian/Antananarivo">(GMT +03:00) Indian/Antananarivo</option>
      <option data-offset="+03:00" value="Indian/Comoro">(GMT +03:00) Indian/Comoro</option>
      <option data-offset="+03:00" value="Indian/Mayotte">(GMT +03:00) Indian/Mayotte</option>
      <option data-offset="+03:00" value="Israel">(GMT +03:00) Israel</option>
      <option data-offset="+03:00" value="Turkey">(GMT +03:00) Turkey</option>
      <option data-offset="+03:00" value="W-SU">(GMT +03:00) W-SU</option>
      <option data-offset="+04:00" value="Asia/Dubai">(GMT +04:00) Asia/Dubai</option>
      <option data-offset="+04:00" value="Asia/Muscat">(GMT +04:00) Asia/Muscat</option>
      <option data-offset="+04:00" value="Asia/Tbilisi">(GMT +04:00) Asia/Tbilisi</option>
      <option data-offset="+04:00" value="Asia/Yerevan">(GMT +04:00) Asia/Yerevan</option>
      <option data-offset="+04:00" value="Etc/GMT-4">(GMT +04:00) Etc/GMT-4</option>
      <option data-offset="+04:00" value="Europe/Samara">(GMT +04:00) Europe/Samara</option>
      <option data-offset="+04:00" value="Indian/Mahe">(GMT +04:00) Indian/Mahe</option>
      <option data-offset="+04:00" value="Indian/Mauritius">(GMT +04:00) Indian/Mauritius</option>
      <option data-offset="+04:00" value="Indian/Reunion">(GMT +04:00) Indian/Reunion</option>
      <option data-offset="+04:30" value="Asia/Kabul">(GMT +04:30) Asia/Kabul</option>
      <option data-offset="+04:30" value="Asia/Tehran">(GMT +04:30) Asia/Tehran</option>
      <option data-offset="+04:30" value="Iran">(GMT +04:30) Iran</option>
      <option data-offset="+05:00" value="Antarctica/Mawson">(GMT +05:00) Antarctica/Mawson</option>
      <option data-offset="+05:00" value="Asia/Aqtau">(GMT +05:00) Asia/Aqtau</option>
      <option data-offset="+05:00" value="Asia/Aqtobe">(GMT +05:00) Asia/Aqtobe</option>
      <option data-offset="+05:00" value="Asia/Ashgabat">(GMT +05:00) Asia/Ashgabat</option>
      <option data-offset="+05:00" value="Asia/Ashkhabad">(GMT +05:00) Asia/Ashkhabad</option>
      <option data-offset="+05:00" value="Asia/Baku">(GMT +05:00) Asia/Baku</option>
      <option data-offset="+05:00" value="Asia/Dushanbe">(GMT +05:00) Asia/Dushanbe</option>
      <option data-offset="+05:00" value="Asia/Karachi">(GMT +05:00) Asia/Karachi</option>
      <option data-offset="+05:00" value="Asia/Oral">(GMT +05:00) Asia/Oral</option>
      <option data-offset="+05:00" value="Asia/Samarkand">(GMT +05:00) Asia/Samarkand</option>
      <option data-offset="+05:00" value="Asia/Tashkent">(GMT +05:00) Asia/Tashkent</option>
      <option data-offset="+05:00" value="Asia/Yekaterinburg">(GMT +05:00) Asia/Yekaterinburg</option>
      <option data-offset="+05:00" value="Etc/GMT-5">(GMT +05:00) Etc/GMT-5</option>
      <option data-offset="+05:00" value="Indian/Kerguelen">(GMT +05:00) Indian/Kerguelen</option>
      <option data-offset="+05:00" value="Indian/Maldives">(GMT +05:00) Indian/Maldives</option>
      <option data-offset="+05:30" value="Asia/Calcutta">(GMT +05:30) Asia/Calcutta</option>
      <option data-offset="+05:30" value="Asia/Colombo">(GMT +05:30) Asia/Colombo</option>
      <option data-offset="+05:30" value="Asia/Kolkata">(GMT +05:30) Asia/Kolkata</option>
      <option data-offset="+05:45" value="Asia/Kathmandu">(GMT +05:45) Asia/Kathmandu</option>
      <option data-offset="+05:45" value="Asia/Katmandu">(GMT +05:45) Asia/Katmandu</option>
      <option data-offset="+06:00" value="Antarctica/Vostok">(GMT +06:00) Antarctica/Vostok</option>
      <option data-offset="+06:00" value="Asia/Almaty">(GMT +06:00) Asia/Almaty</option>
      <option data-offset="+06:00" value="Asia/Bishkek">(GMT +06:00) Asia/Bishkek</option>
      <option data-offset="+06:00" value="Asia/Dacca">(GMT +06:00) Asia/Dacca</option>
      <option data-offset="+06:00" value="Asia/Dhaka">(GMT +06:00) Asia/Dhaka</option>
      <option data-offset="+06:00" value="Asia/Kashgar">(GMT +06:00) Asia/Kashgar</option>
      <option data-offset="+06:00" value="Asia/Novosibirsk">(GMT +06:00) Asia/Novosibirsk</option>
      <option data-offset="+06:00" value="Asia/Omsk">(GMT +06:00) Asia/Omsk</option>
      <option data-offset="+06:00" value="Asia/Qyzylorda">(GMT +06:00) Asia/Qyzylorda</option>
      <option data-offset="+06:00" value="Asia/Thimbu">(GMT +06:00) Asia/Thimbu</option>
      <option data-offset="+06:00" value="Asia/Thimphu">(GMT +06:00) Asia/Thimphu</option>
      <option data-offset="+06:00" value="Asia/Urumqi">(GMT +06:00) Asia/Urumqi</option>
      <option data-offset="+06:00" value="Etc/GMT-6">(GMT +06:00) Etc/GMT-6</option>
      <option data-offset="+06:00" value="Indian/Chagos">(GMT +06:00) Indian/Chagos</option>
      <option data-offset="+06:30" value="Asia/Rangoon">(GMT +06:30) Asia/Rangoon</option>
      <option data-offset="+06:30" value="Indian/Cocos">(GMT +06:30) Indian/Cocos</option>
      <option data-offset="+07:00" value="Antarctica/Davis">(GMT +07:00) Antarctica/Davis</option>
      <option data-offset="+07:00" value="Asia/Bangkok">(GMT +07:00) Asia/Bangkok</option>
      <option data-offset="+07:00" value="Asia/Ho_Chi_Minh">(GMT +07:00) Asia/Ho_Chi_Minh</option>
      <option data-offset="+07:00" value="Asia/Hovd">(GMT +07:00) Asia/Hovd</option>
      <option data-offset="+07:00" value="Asia/Jakarta">(GMT +07:00) Asia/Jakarta</option>
      <option data-offset="+07:00" value="Asia/Krasnoyarsk">(GMT +07:00) Asia/Krasnoyarsk</option>
      <option data-offset="+07:00" value="Asia/Novokuznetsk">(GMT +07:00) Asia/Novokuznetsk</option>
      <option data-offset="+07:00" value="Asia/Phnom_Penh">(GMT +07:00) Asia/Phnom_Penh</option>
      <option data-offset="+07:00" value="Asia/Pontianak">(GMT +07:00) Asia/Pontianak</option>
      <option data-offset="+07:00" value="Asia/Saigon">(GMT +07:00) Asia/Saigon</option>
      <option data-offset="+07:00" value="Asia/Vientiane">(GMT +07:00) Asia/Vientiane</option>
      <option data-offset="+07:00" value="Etc/GMT-7">(GMT +07:00) Etc/GMT-7</option>
      <option data-offset="+07:00" value="Indian/Christmas">(GMT +07:00) Indian/Christmas</option>
      <option data-offset="+08:00" value="Antarctica/Casey">(GMT +08:00) Antarctica/Casey</option>
      <option data-offset="+08:00" value="Asia/Brunei">(GMT +08:00) Asia/Brunei</option>
      <option data-offset="+08:00" value="Asia/Chita">(GMT +08:00) Asia/Chita</option>
      <option data-offset="+08:00" value="Asia/Choibalsan">(GMT +08:00) Asia/Choibalsan</option>
      <option data-offset="+08:00" value="Asia/Chongqing">(GMT +08:00) Asia/Chongqing</option>
      <option data-offset="+08:00" value="Asia/Chungking">(GMT +08:00) Asia/Chungking</option>
      <option data-offset="+08:00" value="Asia/Harbin">(GMT +08:00) Asia/Harbin</option>
      <option data-offset="+08:00" value="Asia/Hong_Kong">(GMT +08:00) Asia/Hong_Kong</option>
      <option data-offset="+08:00" value="Asia/Irkutsk">(GMT +08:00) Asia/Irkutsk</option>
      <option data-offset="+08:00" value="Asia/Kuala_Lumpur">(GMT +08:00) Asia/Kuala_Lumpur</option>
      <option data-offset="+08:00" value="Asia/Kuching">(GMT +08:00) Asia/Kuching</option>
      <option data-offset="+08:00" value="Asia/Macao">(GMT +08:00) Asia/Macao</option>
      <option data-offset="+08:00" value="Asia/Macau">(GMT +08:00) Asia/Macau</option>
      <option data-offset="+08:00" value="Asia/Makassar">(GMT +08:00) Asia/Makassar</option>
      <option data-offset="+08:00" value="Asia/Manila">(GMT +08:00) Asia/Manila</option>
      <option data-offset="+08:00" value="Asia/Shanghai">(GMT +08:00) Asia/Shanghai</option>
      <option data-offset="+08:00" value="Asia/Singapore">(GMT +08:00) Asia/Singapore</option>
      <option data-offset="+08:00" value="Asia/Taipei">(GMT +08:00) Asia/Taipei</option>
      <option data-offset="+08:00" value="Asia/Ujung_Pandang">(GMT +08:00) Asia/Ujung_Pandang</option>
      <option data-offset="+08:00" value="Asia/Ulaanbaatar">(GMT +08:00) Asia/Ulaanbaatar</option>
      <option data-offset="+08:00" value="Asia/Ulan_Bator">(GMT +08:00) Asia/Ulan_Bator</option>
      <option data-offset="+08:00" value="Australia/Perth">(GMT +08:00) Australia/Perth</option>
      <option data-offset="+08:00" value="Australia/West">(GMT +08:00) Australia/West</option>
      <option data-offset="+08:00" value="Etc/GMT-8">(GMT +08:00) Etc/GMT-8</option>
      <option data-offset="+08:00" value="Hongkong">(GMT +08:00) Hongkong</option>
      <option data-offset="+08:00" value="PRC">(GMT +08:00) PRC</option>
      <option data-offset="+08:00" value="ROC">(GMT +08:00) ROC</option>
      <option data-offset="+08:00" value="Singapore">(GMT +08:00) Singapore</option>
      <option data-offset="+08:45" value="Australia/Eucla">(GMT +08:45) Australia/Eucla</option>
      <option data-offset="+09:00" value="Asia/Dili">(GMT +09:00) Asia/Dili</option>
      <option data-offset="+09:00" value="Asia/Jayapura">(GMT +09:00) Asia/Jayapura</option>
      <option data-offset="+09:00" value="Asia/Khandyga">(GMT +09:00) Asia/Khandyga</option>
      <option data-offset="+09:00" value="Asia/Pyongyang">(GMT +09:00) Asia/Pyongyang</option>
      <option data-offset="+09:00" value="Asia/Seoul">(GMT +09:00) Asia/Seoul</option>
      <option data-offset="+09:00" value="Asia/Tokyo">(GMT +09:00) Asia/Tokyo</option>
      <option data-offset="+09:00" value="Asia/Yakutsk">(GMT +09:00) Asia/Yakutsk</option>
      <option data-offset="+09:00" value="Etc/GMT-9">(GMT +09:00) Etc/GMT-9</option>
      <option data-offset="+09:00" value="Japan">(GMT +09:00) Japan</option>
      <option data-offset="+09:00" value="Pacific/Palau">(GMT +09:00) Pacific/Palau</option>
      <option data-offset="+09:00" value="ROK">(GMT +09:00) ROK</option>
      <option data-offset="+09:30" value="Australia/Adelaide">(GMT +09:30) Australia/Adelaide</option>
      <option data-offset="+09:30" value="Australia/Broken_Hill">(GMT +09:30) Australia/Broken_Hill</option>
      <option data-offset="+09:30" value="Australia/Darwin">(GMT +09:30) Australia/Darwin</option>
      <option data-offset="+09:30" value="Australia/North">(GMT +09:30) Australia/North</option>
      <option data-offset="+09:30" value="Australia/South">(GMT +09:30) Australia/South</option>
      <option data-offset="+09:30" value="Australia/Yancowinna">(GMT +09:30) Australia/Yancowinna</option>
      <option data-offset="+10:00" value="Antarctica/DumontDUrville">(GMT +10:00) Antarctica/DumontDUrville</option>
      <option data-offset="+10:00" value="Asia/Magadan">(GMT +10:00) Asia/Magadan</option>
      <option data-offset="+10:00" value="Asia/Sakhalin">(GMT +10:00) Asia/Sakhalin</option>
      <option data-offset="+10:00" value="Asia/Ust-Nera">(GMT +10:00) Asia/Ust-Nera</option>
      <option data-offset="+10:00" value="Asia/Vladivostok">(GMT +10:00) Asia/Vladivostok</option>
      <option data-offset="+10:00" value="Australia/ACT">(GMT +10:00) Australia/ACT</option>
      <option data-offset="+10:00" value="Australia/Brisbane">(GMT +10:00) Australia/Brisbane</option>
      <option data-offset="+10:00" value="Australia/Canberra">(GMT +10:00) Australia/Canberra</option>
      <option data-offset="+10:00" value="Australia/Currie">(GMT +10:00) Australia/Currie</option>
      <option data-offset="+10:00" value="Australia/Hobart">(GMT +10:00) Australia/Hobart</option>
      <option data-offset="+10:00" value="Australia/Lindeman">(GMT +10:00) Australia/Lindeman</option>
      <option data-offset="+10:00" value="Australia/Melbourne">(GMT +10:00) Australia/Melbourne</option>
      <option data-offset="+10:00" value="Australia/NSW">(GMT +10:00) Australia/NSW</option>
      <option data-offset="+10:00" value="Australia/Queensland">(GMT +10:00) Australia/Queensland</option>
      <option data-offset="+10:00" value="Australia/Sydney">(GMT +10:00) Australia/Sydney</option>
      <option data-offset="+10:00" value="Australia/Tasmania">(GMT +10:00) Australia/Tasmania</option>
      <option data-offset="+10:00" value="Australia/Victoria">(GMT +10:00) Australia/Victoria</option>
      <option data-offset="+10:00" value="Etc/GMT-10">(GMT +10:00) Etc/GMT-10</option>
      <option data-offset="+10:00" value="Pacific/Chuuk">(GMT +10:00) Pacific/Chuuk</option>
      <option data-offset="+10:00" value="Pacific/Guam">(GMT +10:00) Pacific/Guam</option>
      <option data-offset="+10:00" value="Pacific/Port_Moresby">(GMT +10:00) Pacific/Port_Moresby</option>
      <option data-offset="+10:00" value="Pacific/Saipan">(GMT +10:00) Pacific/Saipan</option>
      <option data-offset="+10:00" value="Pacific/Truk">(GMT +10:00) Pacific/Truk</option>
      <option data-offset="+10:00" value="Pacific/Yap">(GMT +10:00) Pacific/Yap</option>
      <option data-offset="+10:30" value="Australia/LHI">(GMT +10:30) Australia/LHI</option>
      <option data-offset="+10:30" value="Australia/Lord_Howe">(GMT +10:30) Australia/Lord_Howe</option>
      <option data-offset="+11:00" value="Antarctica/Macquarie">(GMT +11:00) Antarctica/Macquarie</option>
      <option data-offset="+11:00" value="Asia/Srednekolymsk">(GMT +11:00) Asia/Srednekolymsk</option>
      <option data-offset="+11:00" value="Etc/GMT-11">(GMT +11:00) Etc/GMT-11</option>
      <option data-offset="+11:00" value="Pacific/Bougainville">(GMT +11:00) Pacific/Bougainville</option>
      <option data-offset="+11:00" value="Pacific/Efate">(GMT +11:00) Pacific/Efate</option>
      <option data-offset="+11:00" value="Pacific/Guadalcanal">(GMT +11:00) Pacific/Guadalcanal</option>
      <option data-offset="+11:00" value="Pacific/Kosrae">(GMT +11:00) Pacific/Kosrae</option>
      <option data-offset="+11:00" value="Pacific/Noumea">(GMT +11:00) Pacific/Noumea</option>
      <option data-offset="+11:00" value="Pacific/Pohnpei">(GMT +11:00) Pacific/Pohnpei</option>
      <option data-offset="+11:00" value="Pacific/Ponape">(GMT +11:00) Pacific/Ponape</option>
      <option data-offset="+11:30" value="Pacific/Norfolk">(GMT +11:30) Pacific/Norfolk</option>
      <option data-offset="+12:00" value="Antarctica/McMurdo">(GMT +12:00) Antarctica/McMurdo</option>
      <option data-offset="+12:00" value="Antarctica/South_Pole">(GMT +12:00) Antarctica/South_Pole</option>
      <option data-offset="+12:00" value="Asia/Anadyr">(GMT +12:00) Asia/Anadyr</option>
      <option data-offset="+12:00" value="Asia/Kamchatka">(GMT +12:00) Asia/Kamchatka</option>
      <option data-offset="+12:00" value="Etc/GMT-12">(GMT +12:00) Etc/GMT-12</option>
      <option data-offset="+12:00" value="Kwajalein">(GMT +12:00) Kwajalein</option>
      <option data-offset="+12:00" value="NZ">(GMT +12:00) NZ</option>
      <option data-offset="+12:00" value="Pacific/Auckland">(GMT +12:00) Pacific/Auckland</option>
      <option data-offset="+12:00" value="Pacific/Fiji">(GMT +12:00) Pacific/Fiji</option>
      <option data-offset="+12:00" value="Pacific/Funafuti">(GMT +12:00) Pacific/Funafuti</option>
      <option data-offset="+12:00" value="Pacific/Kwajalein">(GMT +12:00) Pacific/Kwajalein</option>
      <option data-offset="+12:00" value="Pacific/Majuro">(GMT +12:00) Pacific/Majuro</option>
      <option data-offset="+12:00" value="Pacific/Nauru">(GMT +12:00) Pacific/Nauru</option>
      <option data-offset="+12:00" value="Pacific/Tarawa">(GMT +12:00) Pacific/Tarawa</option>
      <option data-offset="+12:00" value="Pacific/Wake">(GMT +12:00) Pacific/Wake</option>
      <option data-offset="+12:00" value="Pacific/Wallis">(GMT +12:00) Pacific/Wallis</option>
      <option data-offset="+12:45" value="NZ-CHAT">(GMT +12:45) NZ-CHAT</option>
      <option data-offset="+12:45" value="Pacific/Chatham">(GMT +12:45) Pacific/Chatham</option>
      <option data-offset="+13:00" value="Etc/GMT-13">(GMT +13:00) Etc/GMT-13</option>
      <option data-offset="+13:00" value="Pacific/Apia">(GMT +13:00) Pacific/Apia</option>
      <option data-offset="+13:00" value="Pacific/Enderbury">(GMT +13:00) Pacific/Enderbury</option>
      <option data-offset="+13:00" value="Pacific/Fakaofo">(GMT +13:00) Pacific/Fakaofo</option>
      <option data-offset="+13:00" value="Pacific/Tongatapu">(GMT +13:00) Pacific/Tongatapu</option>
      <option data-offset="+14:00" value="Etc/GMT-14">(GMT +14:00) Etc/GMT-14</option>
      <option data-offset="+14:00" value="Pacific/Kiritimati">(GMT +14:00) Pacific/Kiritimati</option>
    </select>
    `;
    /*eslint-enable*/
  };


  const editorDOM = function (id) {
    return `
      <div class="stent-cron-editor" id="${id}">
        <div class="mb-3">
          ${timezonesDOM( id + "-timezone")}
        </div>
        <div class="card">
          <div class="card-body" style="padding:0px;">
            <table class="table table-sm" style="margin-bottom:0px">
              <thead>
                <tr>
                  <th scope="col" style="border-top:none; border-top-left-radius: 10px">Actions</th>
                  <th scope="col" style="border-top:none; ">Slot</th>
                  <th scope="col" style="border-top:none; border-top-right-radius: 10px">Duration</th>
                </tr>
              </thead>
              <tbody>
               <tr id="week-days-wrapper-tr">
                  <td>
                    <span class="mr-5">Days</span>
                  </td>
                  <td colspan="2" id="week-days-wrapper">
                    <span class="mr-3" style="cursor: pointer;">
                      <input type="checkbox" name="weekDays" id="MON" value="MON" style="vertical-align: -2px;" class="pr-1" checked="checked" />
                      <label for="MON" style="margin-bottom: 0;">Mon.</label>
                    </span>
                    <span class="mr-3" style="cursor: pointer;">
                      <input type="checkbox" name="weekDays" id="TUE" value="TUE" style="vertical-align: -2px;" class="pr-1" checked="checked" />
                      <label for="TUE" style="margin-bottom: 0;">Tue.</label>
                    </span>
                    <span class="mr-3" style="cursor: pointer;">
                      <input type="checkbox" name="weekDays" id="WED" value="WED" style="vertical-align: -2px;" class="pr-1" checked="checked" />
                      <label for="WED" style="margin-bottom: 0;">Wed.</label>
                    </span>
                    <span class="mr-3" style="cursor: pointer;">
                      <input type="checkbox" name="weekDays" id="THU" value="THU" style="vertical-align: -2px;" class="pr-1" checked="checked" />
                      <label for="THU" style="margin-bottom: 0;">Thu.</label>
                    </span>
                    <span class="mr-3" style="cursor: pointer;">
                      <input type="checkbox" name="weekDays" id="FRI" value="FRI" style="vertical-align: -2px;" class="pr-1" checked="checked" />
                      <label for="FRI" style="margin-bottom: 0;">Fri.</label>
                    </span>
                    <span class="mr-3" style="cursor: pointer;">
                      <input type="checkbox" name="weekDays" id="SAT" value="SAT" style="vertical-align: -2px;" class="pr-1" checked="checked" />
                      <label for="SAT" style="margin-bottom: 0;">Sat.</label>
                    </span>
                    <span class="mr-3" style="cursor: pointer;">
                      <input type="checkbox" name="weekDays" id="SUN" value="SUN" style="vertical-align: -2px;" class="pr-1" checked="checked" />
                      <label for="SUN" style="margin-bottom: 0;">Sun.</label>
                    </span>
                  </td>
                </tr>
                <tr class="add-new">
                  <td>
                    <span class="btn btn-white fe fe-plus campaign-add-schedule"></span>
                  </td>
                  <td style="vertical-align: middle">Add new slot</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  };


  const cronLineDOM = function(cronObject) {
    /*eslint-disable*/
    return `
      <tr id="${cronObject.id}">
        <td>
          <span class="btn btn-white fe fe-minus campaign-slot-delete"></span>
        </td>
        <td style="vertical-align: middle;">
          <div class="campaign-slot-cron-picker"></div>
        </td>
        <td>
          <input 
            type="text" 
            readonly="readonly" 
            style="background-color: white !important;" 
            class="form-control campaign-slot-duration" value="${cronObject.duration ? cronObject.duration : defaultDuration}" />
        </td>
      </tr>
    `;
    /*eslint-enable*/
  };


  const bindEvents = function () {

    $("body")
      .off("click", ".campaign-add-schedule")
      .on("click", ".campaign-add-schedule", function() {

        let editorId = $(this).closest(".stent-cron-editor").attr("id");

        let newCronObject = {
          id: stent.utils.guid(),
          duration: defaultDuration
        };

        // Remove invalid form data
        if ($(this).hasClass("is-invalid")) {
          $(this).removeClass("is-invalid").next().remove();
        }

        $(this)
          .closest("tr")
          .before(cronLineDOM(newCronObject));

        newCronObject.jCron = $("#" + newCronObject.id + " .campaign-slot-cron-picker").cron({
          initial: "0 0 * * *"
        });
        newCronObject.duration = defaultDuration;

        editors[editorId].crons.push(newCronObject);

        $("#" + newCronObject.id + " .campaign-slot-duration").timeDurationPicker(durationPickerSetup());

      });

    $("body")
      .off("click", ".campaign-slot-delete")
      .on("click", ".campaign-slot-delete", function() {
        if (confirm("Please confirm you want to remove this slot.")) {

          let editorId = $(this).closest(".stent-cron-editor").attr("id");

          let removeCronId = $(this)
            .closest("tr")
            .attr("id");

          $(this)
            .closest("tr")
            .remove();

          // remove from crons Object
          for (var i = 0; i < editors[editorId].crons.length; i++) {
            if (editors[editorId].crons[i].id === removeCronId) {
              editors[editorId].crons.splice(i, 1);
            }
          }
        }
      });

    $("body")
      .off("click", ".stent-cron-timezone")
      .on("click", ".stent-cron-timezone", function() {
        updateEditors();
      });


  };

  /*
  {
    id: unique ID (string)
    jElem: jquery object, where to push the editor in the DOM (object)
    crons: fill CRON lines (array)
  }

  Example:

  // Initialiyze CRONs editors
  stent.cronEditor.init(
    {
      id: "campaign-schedule",
      jElem: $("#campaign-schedule-wrapper"),
      data: (item.schedule && item.schedule.slots && item.schedule.slots.length > 0) ? item.schedule.slots : [],
      timezone: "Etc/GMT+12"
    }
  );

  */
  const readOnly = function (editorId) {

    if (editors[editorId]) {
      editors[editorId].readOnly = true;
      $("#" + editorId + "-timezone").prop("disabled", true);
      $("#" + editorId + " .add-new").remove();
      $("#" + editorId + " .campaign-slot-delete").css("opacity", 0.5);
      $("#" + editorId + " .campaign-slot-delete").css("pointer-events", "none");
      $("#" + editorId + " select").prop("disabled", true);
      $("#" + editorId + " .campaign-slot-duration").prop("disabled", true);
      $("#" + editorId + " .campaign-slot-duration").removeAttr("style");
    }

  };

  const init = function (config) {

    if (!config) {
      console.log("Error when trying to create a new CRON editor");
      return;
    } else {

      editors[config.id] = config;
      editors[config.id].crons = [];
      editors[config.id].jElem.append(editorDOM(config.id));

      if (config.defaultDuration) {
        defaultDuration = config.defaultDuration;
      }

      let editor = editors[config.id];

      // Set the timezone if necessary
      if (editor.timezone && editor.timezone !== "") {
        $("#" + editor.id + "-timezone option[value='" + editor.timezone + "']").prop("selected", true);
      }

      // Create the lines CRON if asked
      if (editor.data && editor.data.length > 0) {

        let slotDom;

        editor.data.forEach(function(slot) {
          if (slot) {
            let cronObject = {
              id: stent.utils.guid(),
              cron: slot.cron,
              duration: slot.duration
            };
            editor.crons.push(cronObject);
            slotDom += cronLineDOM(cronObject);
          }
        });

        delete editor.data;

        $("#" + editor.id + " .campaign-add-schedule")
          .closest("tr")
          .before(slotDom);

        try {
          for (let i = 0; i < editor.crons.length; i++) {
            editor.crons[i].jCron = $("#" + editor.crons[i].id + " .campaign-slot-cron-picker").cron({
              initial: editor.crons[i].cron
            });
            $("#" + editor.crons[i].id + " .campaign-slot-duration").timeDurationPicker(durationPickerSetup(editor.crons[i].duration));
          }

        } catch (err) {
          console.log(err);
        }

      }

      stent.utils.log(editor);

    }

    bindEvents();
  };


  return {
    init,
    getAll,
    get,
    editors,
    readOnly
  };

})();