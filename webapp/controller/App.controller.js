sap.ui.define([
	"./BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("template.controller.App", {

		/**
		 * Lifecycle hooks
		 */

		onInit: function () {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		}

		/**
		 * Event handler
		 */


		/**
		 * Private methods
		 */
	});
});