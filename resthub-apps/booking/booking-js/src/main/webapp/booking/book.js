define([ 'jquery', 'dao/hotel.dao', 'booking/view', 'booking/edit' ], function($, Hotel) {
	$.widget("booking.bookBooking", $.ui.controller, {
		options : {
			hotelId : null,
			booking : {},
			template : 'booking/book.html',
			mode : 'edit'
		},
		_init : function() {
			this._render({
				hotelId : this.options.hotelId
			});
			this.options.booking = this.cx().session('booking');

			if (this.options.booking == undefined) {
				HotelDao.read($.proxy(this, '_initBookingData'), this.options.hotelId);
			} else {
				this._displayBookingView(this.options.booking);
			}
		},
		/**
		 * If there is no booking in session when this widget starts, this
		 * function creates a booking with user and hotel...
		 */
		_initBookingData : function(hotel) {
			this.options.booking = {
				user : this.cx().session('user'),
				hotel : hotel
			};
			this.cx().session('booking', this.options.booking);
			this._displayBookingView(this.options.booking);
		},
		_displayBookingView : function() {

			var self = this;

			$('#hotel-data').viewHotel({
				id : self.options.booking.hotel.id,
				only_data : true
			});

			if (this.options.mode == 'edit') {
				this._switchToEdit();
			} else {
				this._switchToView();
			}
		},
		_switchToEdit : function() {
			var self = this;
			Sammy.log('Booking workflow : edit mode.');

			$('#booking-data').editBooking({
				booking : self.options.booking,
				cx : self.cx()
			});

		},
		_switchToView : function() {
			var self = this;
			Sammy.log('Booking workflow : confirmation mode.');
			$('#booking-data').viewBooking({
				booking : self.options.booking,
				cx : self.cx(),
				mode : 'confirm'
			});
		}
	});
});
