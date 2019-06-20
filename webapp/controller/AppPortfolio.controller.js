/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0, no-undef: 0*/
//To use a javascript controller its name must end with .controller.js
sap.ui.define([
	"zcust/zcust/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"../model/formatter",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (BaseController, JSONModel, Fragment, Filter, FilterOperator, FilterType, formatter, MessageToast, MessageBox) {
	"use strict";
	const batchGroupId = "AppPortfolioGroupId";

	return BaseController.extend("zcust.zcust.controller.AppPortfolio", {

		// set the formatter
		formatter: formatter,

		/**
		 *  Hook for initializing the controller
		 */
		onInit: function () {
			this.oItemTemplate = this.getView().byId("columnListItem").clone();

			var oViewModel = new JSONModel({
				busy: false,
				hasUIChanges: false,
				usernameEmpty: true,
				order: 0
			});
			this.getView().setModel(oViewModel, "appView");
			
			const router = this.getOwnerComponent().getRouter();
			const route = router.getRoute("app_portfolio");
			route.attachPatternMatched(this.onPatternMatched, this);
			route.attachBeforeMatched(this.reset, this);
		},

		/* =========================================================== */
		/*           begin: event handlers                             */
		/* =========================================================== */

		onPatternMatched: function (event) {
			BaseController.technicalerror = false;
			
			var oModel = new JSONModel();
			oModel = sap.ui.getCore().getModel("searchq");
			var company_code = oModel.getData().company_code;
			
			var bpModel = this.getOwnerComponent().getModel("bpModel");
			console.log(bpModel);
			
			
			var oTable = this.getView().byId("table");
			oTable.setModel(bpModel);
			var filters = [];
			filters.push(new Filter("COMPANY_CODE", FilterOperator.Contains, company_code));
			filters.push(new Filter("INSTRUMENT_TYPE", FilterOperator.Contains, 'IT'));
			
			oTable.bindItems({
				path: '/CUSTPAY',
				filters:  filters,
				template: this.oItemTemplate
			});
			
			
		},

		reset: function (event) {
		
		},


		doNavBack: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("home", true);
		},

		onNavDetail: function (evt) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("app_overview", true);
		},


		/* =========================================================== */
		/*           end: event handlers                               */
		/* =========================================================== */

		/**
		 * Convenience method for retrieving a translatable text.
		 * @param {string} sTextId - the ID of the text to be retrieved.
		 * @param {Array} [aArgs] - optional array of texts for placeholders.
		 * @returns {string} the text belonging to the given ID.
		 */
		_getText: function (sTextId, aArgs) {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sTextId, aArgs);
		},

		/**
		 * Set busy flag in View Model
		 * @param {boolean} bIsBusy - set or clear busy
		 */
		_setBusy: function (bIsBusy) {
			var oModel = this.getView().getModel("appView");
			oModel.setProperty("/busy", bIsBusy);
		},
		
		/**
		 * Set visible flag in View Model
		 * @param {boolean} bIsVisible - set or clear visibility
		 */
		_setVisible: function (bIsVisible) {
			var oModel = this.getView().getModel("appVisible");
			oModel.setProperty("/visible", bIsVisible);
		}
	});
});