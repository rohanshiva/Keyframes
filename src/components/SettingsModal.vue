<!-- 
// SettingsModal.vue
// _________________________
// 
// 	Shows modal containing settings
//		- Dark mode toggle
//		- UI Animations toggle
//		- Start page selector
//		- Local Storage information
//
//		Props:
//			showSettings - true/false to show modal
//
//		Functions:
//			viewLocalStorage() Shows local storage help and tracks action
//			clearLocalStorage() Clears all local storage for this site 
//			getAllLocalStorage() Called on mount, gets all localstorage content 
// 
-->

<template>
	<div>

		<Modal
			v-bind:show="showSettings"
			color="invert"
			dismissText="Close Settings"
			@confirmed="$emit('settingsModalClosed');"
			@dismissed="$emit('settingsModalClosed');">


			<!-- Modal Heder -->
			<template v-slot:header>
				<span>Settings</span>
				<i class="far fa-toggle-on"></i>
			</template>


			<!-- Body -->
			<template v-slot:body>

				<!-- General Preferences -->
				<div class="settings-group">

					<!-- Dark Mode -->
					<div class="setting-toggle">
						<div class="setting-toggle-input">
							<input id="darkmodeToggle" type="checkbox" class="toggle" v-model="$store.getters.userPreferences.darkMode" @change="toggleDarkMode()"/>
						</div>
						<label class="setting-label-large" for="darkmodeToggle">
							Dark Mode
						</label>
					</div>

					<!-- UI Animations -->
					<div class="setting-toggle">
						<div class="setting-toggle-input">
							<input id="animationToggle" type="checkbox" class="toggle" v-model="$store.getters.userPreferences.animations" @change="toggleAnimations()"/>
						</div>
						<label class="setting-label-large" for="animationToggle">
							UI Animations
							<small>You can turn off the UI animations like the ones that transition between pages.</small>
						</label>
					</div>

					<!-- Confirm Leave -->
					<div class="setting-toggle">
						<div class="setting-toggle-input">
							<input id="confirmLeaveToggle" type="checkbox" class="toggle" v-model="$store.getters.userPreferences.confirmLeave"/>
						</div>
						<label class="setting-label-large" for="confirmLeaveToggle">
							Confirm Leave
							<small>Disable or enable the confirmation popup when leaving an app page.</small>
						</label>
					</div>

					<!-- Show Tooltips -->
					<div class="setting-toggle">
						<div class="setting-toggle-input">
							<input id="showTooltipToggle" type="checkbox" class="toggle" v-model="$store.getters.userPreferences.tooltips"/>
						</div>
						<label class="setting-label-large" for="showTooltipToggle">
							Help Tooltips
							<small>Show or hide the little <i :class="[$store.getters.global.tooltipIcon]"></i> tooltip help icons.</small>
						</label>
					</div>




					<div>&nbsp;</div>

				</div>

			</template>

		</Modal>

	</div>
</template>

<script>
// Components
import Modal from "@/components/ui/Modal.vue";
// Mixins
import metaMixin from "@/components/mixins/metaMixin.js";
import preferencesMixin from "@/components/mixins/preferencesMixin.js";
import scrollLockMixin from "@/components/mixins/ui/scrollLockMixin.js";

export default {
	name: "SettinigsModal",
	mixins: [
		metaMixin,
		preferencesMixin,
		scrollLockMixin,
	],
	components: {
		Modal,
	},
	props: [
		'showSettings'
	],
	data() {
		return {
			// Toggle help
			showLocalStorageHelp: false,
			// Variable to hold entire *string* of local storage for displaying to user
			localStorageString: null,
			// Define potential start pages users can choose
			test: null,
		};
	},
	mounted() {
		// Show modal, lock scroll
		this.getAllLocalStorage();
		// Track settings open
	},
	methods: {
		// Open local storage help and track action
	}
};
</script>

<style lang="less">

	@import '~@/styles/variables.less';

	// Spacing for Individual groups of settings
	.settings-group{
		margin: 0 auto 0 auto;
		padding-bottom: 0;
	}
	
	// Horizontal row layout for toggles
	.setting-toggle{
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		padding: 10px 0;
		width: 100%;
		position: relative;

		.setting-toggle-input{
			display: block;
			padding-right: 15px;
		}		
	}

	// Large setting label with small text below
	// Used for toggles on settings
	.setting-label-large{
		font-weight: 500;
		font-size: 14px;
		letter-spacing: 0.3px;
		display: block;
		display: flex;
		flex-direction: column;
		justify-content: center;
		font-size: 16px;
		letter-spacing: 0.4px;
		font-weight: 600;

		small{
			font-size: 12px;
			font-weight: 400;
			line-height: 16px;
			padding-top: 2px;
			font-family: var(--systemFont);
		}
	}

	

	// Field to clear local storage, everything inside
	#clearLocalStorage{
		margin-top: 10px;

		// Center content inside
		.field-body{
			text-align: left;
		}

		// More info button
		#localStorageHelpButton{
			display: inline-block;
			width: fit-content;
			color: var(--text);
			font-size: 13px;
			font-weight: 500;
			padding: 10px 0 10px 0;
			margin-left: 15px;

			i{
				margin-left: 5px;
			}
		}
	}

	// Local storage help
	#localStorageHelp{
		background-color: var(--background);
		box-sizing: border-box;
		padding: 10px;
		border-radius: var(--borderRadius);
		border: var(--borderWidth) solid var(--border);
		margin: 10px 0 0 0;
		color: var(--text);
		font-size: 12px;
		letter-spacing: 0.5px;
		font-weight: 400;
		line-height: 22px;
		letter-spacing: 0.2px;
		font-family: var(--systemFont);

		b{
			font-weight: bold;
		}

		// List of info
		ul{
			margin: 10px 0;
		}
	}

	// Code display to show all local storage data
	.local-storage-code-display{
		box-sizing: border-box;
		padding: 0 5px 5px 5px;
		margin: 0 auto;
		max-height: 300px;
		overflow: auto;

		code{
			font-family: var(--mono);
			display: block;
			white-space: normal;
			box-sizing: border-box;
			padding: 5px 0;
			font-size: 12px;
			line-height: 14px;
			word-break:break-all;
			white-space: pre-line;
		}
	}





</style>