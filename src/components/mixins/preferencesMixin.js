// Preferences mixin
// Methods for managing user preferences
// _________________________
// 
// 	toggleDarkMode(mode): sets browser theme
// 			mode true/false can be passed, but is optional. Default is toggle
// 			If user is signed in, it'll call savePreferences() to save their change to firebase
// 
// 	toggleAnimations(mode): toggles UI animations
// 			If user is signed in, it'll call savePreferences() to save their change to firebase
// 
// 	getPrefs(): Gets preferences from local storage
// 
// 	savePrefs(): Saves preferences to local storage
// 			- sets any missing prefs as default value
// 

import {Deta} from 'deta';

function getCookieValue(a) {
    var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
}

export default {
	methods: {
		/////////////////////////////
		//    Dark Mode Toggle    //
		///////////////////////////
		toggleDarkMode: function(mode){

			// If true/false argument passed
			if(mode != null){
				// If true, turn on
				if(mode){
					document.documentElement.setAttribute('data-theme', 'dark');
				}else{
					document.documentElement.setAttribute('data-theme', 'light');
				}

			}else{
				// Else simply toggle it
				if(this.$store.getters.userPreferences.darkMode){
					document.documentElement.setAttribute('data-theme', 'dark');
				}else{
					document.documentElement.setAttribute('data-theme', 'light');
				}
			}
		},
		////////////////////////
		// Toggle animations //
		//////////////////////
		toggleAnimations: function(mode){

			// If true/false argument passed
			if(mode != null){
				// If true, turn on
				if(mode){
					document.getElementsByTagName("body")[0].classList.remove("no-animations");
				}else{
					document.getElementsByTagName("body")[0].classList.add("no-animations");
				}

			}else{
				// Else simply toggle it
				if(this.$store.getters.userPreferences.animations){
					// Turn animations back on
					document.getElementsByTagName("body")[0].classList.remove("no-animations");
				}else{
					// Turn animations off with no-animations class on body
					document.getElementsByTagName("body")[0].classList.add("no-animations");
				}
			}
			
			
		},

		//////////////////////
		// Get Preferences //
		////////////////////
		// Get preferences from local storage if they exist
		getPrefs: async function(){

			const deta = Deta(getCookieValue("pk"));
			const db = deta.Base('keyframes');
			let _this = this;
			const prefs = await db.get('user_preferences');

			
			if (prefs) {
				_this.$store.commit('userPreferences', prefs.value);
			} else {
				var currentPrefs = _this.$store.getters.userPreferences;

				// If dark system settings
				if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
					_this.toggleDarkMode(true);
					currentPrefs["darkMode"] = true;
					_this.$store.commit('userPreferences', currentPrefs);
				}else{
					// Else set to false, which makes default theme light
					_this.toggleDarkMode(false);
					currentPrefs["darkMode"] = false;
					_this.$store.commit('userPreferences', currentPrefs);
				}
			}

			// Make changes based on gotten prefs
			_this.setPrefs();

			// Save visit to local storage - use count for prompt for donation? Maybe?
			var totalVisits = _this.$store.getters.userPreferences.totalVisits;
			if(totalVisits){
				totalVisits = parseInt(totalVisits) + 1;

				// Do something if visits equals X
				if(totalVisits == 15){
					_paq.push(['trackEvent', 'Action', 'Returns', "15"]);	
				}else if(totalVisits == 25){
					_paq.push(['trackEvent', 'Action', 'Returns', "25"]);	
				}else if(totalVisits == 50){
					_paq.push(['trackEvent', 'Action', 'Returns', "50"]);	
				}else if(totalVisits == 100){
					_paq.push(['trackEvent', 'Action', 'Returns', "100"]);	
				}
			}else{
				// Else this is their first visit
				totalVisits = 1;
			}
			
			// Save to localstorage
			_this.$store.getters.userPreferences.totalVisits = totalVisits;

		},
		//////////////////////
		// Set Preferences //
		////////////////////
		// Call this function to set preferences on UI based on value
		setPrefs: function(){
			// Start Page
			// Only load if user visits home
			// That way if they purposefully visit another URL directly, it won't switch it.
			if(this.$route.path == "/"){
				// Only reroute if it's NOT to '/' since it's already there.
				if(this.$store.getters.userPreferences.startPage && this.$store.getters.userPreferences.startPage != '/'){
					this.$router.push(this.$store.getters.userPreferences.startPage);
					document.documentElement.scrollTop = 0;
				}
			}


			// Save device info
			var deviceProps = this.$store.getters.device;

			// Touch Screen
			if(('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) {
				deviceProps.hasTouch = true;
			}
			// Standalone mode
			if (window.matchMedia('(display-mode: standalone)').matches) {
				deviceProps.standalone = true;

				// If 'installed' is not already true in prefs, 
				// user is opening for first time after install - track it, then update pref so it doesn't track again
				if(!this.$store.getters.userPreferences.installed){
					_paq.push(['trackEvent', 'Action', 'Install', "PWA"]);
					this.$store.getters.userPreferences.installed = true;
				}
				
			}

			// Orientation Sensors
			if (window.DeviceOrientationEvent || window.MozOrientation) {
				deviceProps.orientationSensor = true;
			}


			// Save back to store
			this.$store.commit('device', deviceProps);

			

			// Dark mode
			if(this.$store.getters.userPreferences.darkMode){
				document.documentElement.setAttribute('data-theme', 'dark');
			}else{ // Else set light
				document.documentElement.setAttribute('data-theme', 'light');
			}
	
			// Animations
			if(this.$store.getters.userPreferences.animations != null && !this.$store.getters.userPreferences.animations){
				document.getElementsByTagName("body")[0].classList.add("no-animations");
			}else{
				document.getElementsByTagName("body")[0].classList.remove("no-animations");
			}
	
			// Set defaults
			if(this.$store.getters.userPreferences.tooltips == null){
				this.$store.getters.userPreferences.tooltips = true;
			}
			if(this.$store.getters.userPreferences.confirmLeave == null){
				this.$store.getters.userPreferences.confirmLeave = true;
			}
			if(!this.$store.getters.userPreferences.viewed){
				this.$store.getters.userPreferences.viewed = {};
			}
			if(!this.$store.getters.userPreferences.installed){
				this.$store.getters.userPreferences.installed = false;
			}
			if(!this.$store.getters.userPreferences.version){
				this.$store.getters.userPreferences.version = "0.0.0";
			}



			// App Version
			// Get last loaded version number (saved in local storage)
			// If lower than latest, alert about update, then store new version
			var userAppVersion = this.$store.getters.userPreferences.version;
			var latestAppVersion = this.$store.getters.appVersion;

			// Strip periods and parse into to compare numbers
			userAppVersion = parseInt(userAppVersion.replace(/\D/g,''));
			// Create new var for latest int so regular x.x.x format can be stored.
			var latestVersionInt = parseInt(latestAppVersion.replace(/\D/g,''));

			// If user's version is lower than latest
			// If userAppVersion is 0 - they just visited for the first time
			if(userAppVersion < latestVersionInt){
				// Update version in local storage
				this.$store.getters.userPreferences.version = latestAppVersion;

				// Tell them about the update if it's not their first visit - default v for new users is 0
				if(userAppVersion > 0){
					var _this = this;
					setTimeout(function(){
						_this.hello("Keyframes updated to v" + latestAppVersion + "", "fas fa-sparkles")
					}, 500)
				}
				
			}

		},

	}
};
