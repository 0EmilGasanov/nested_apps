sap.ui.define([
	"./BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/m/Dialog",
	"sap/m/Button"
], function (BaseController,Filter, FilterOperator, MessageToast, JSONModel, Dialog, Button) {
	"use strict";

	return BaseController.extend("template.controller.Main", {

		/**
		 * Lifecycle hooks
		 */

		onInit: function () { 
			var oView = this.getView();
			var oComponentModel;
			if (oView.getModel("UICustomizing")) {
				oComponentModel = oView.getModel("UICustomizing");
			} else {
				oComponentModel = new JSONModel();
				oView.setModel(oComponentModel, "UICustomizing");
			}
			oComponentModel.oData = {};

		//	oPage.setCustomHeader();
			oComponentModel.loadData("model/UI_Struktur.json");
		},

		/**
		 * Event handler
		 */

		onPressButton: function (oEvent) {
			MessageToast.show("Test");
		}

		/**
		 * Private methods
		 */
	});
});